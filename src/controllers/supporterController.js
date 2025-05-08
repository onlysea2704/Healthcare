import dotenv from 'dotenv'; //Sử dụng dotenv để tải các biến môi trường từ file .env 
import homeService from "../services/homeService.js";
import userService from "../services/userService.js";
import supporterService from "../services/supporterService.js";
import patientService from "../services/patientService.js";

const statusNewId = 4;
const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;
dotenv.config();

//Render giao diện quản lý bệnh nhân (managePatient.ejs)
let getNewPatients = (req, res) => {
    //render data = js/ getForPatientsTabs
    return res.render('main/users/admins/managePatient.ejs', {
        user: req.user
    })
};

//Trả về tất cả bài viết (JSON), dùng cho mục đích hiển thị hoặc API.
let getAllPosts = async (req, res) => {
    try {
        let posts = await supporterService.getAllPosts();
        return res.status(200).json({ "data": posts })
    } catch (e) {
        return res.status(500).json(e);
    }
};

//Lấy danh sách phòng khám, bác sĩ, chuyên khoa → render giao diện tạo bài viết.
let getCreatePost = async (req, res) => {
    let clinics = await homeService.getClinics();
    let doctors = await userService.getInfoDoctors();
    let specializations = await homeService.getSpecializations();
    return res.render('main/users/admins/createPost.ejs', {
        user: req.user,
        clinics: clinics,
        doctors: doctors,
        specializations: specializations
    });
};

//Nhận dữ liệu tạo bài viết từ frontend, gán thêm ID của người viết, thời điểm tạo 
//Sau đó gọi supporterService.postCreatePost(item) để lưu.
let postCreatePost = async (req, res) => {
    try {
        let item = req.body;
        item.writerId = req.user.id;
        item.createdAt = Date.now();
        let post = await supporterService.postCreatePost(item);
        return res.status(200).json({
            status: 1,
            message: post
        })
    } catch (e) {
        return res.status(500).json(e);
    }
};

//Lấy danh sách bài viết phân trang cho admin để render trang managePost.ejs. 
// Xác định vai trò người dùng trước khi gọi service.
let getManagePosts = async (req, res) => {
    try {
        let role = "";
        if(req.user){
            if(req.user.roleId === 1) role = "admin";
        }
        let object = await supporterService.getPostsPagination(1, +process.env.LIMIT_GET_POST, role);
        return res.render('main/users/admins/managePost.ejs', {
            user: req.user,
            posts: object.posts,
            total: object.total
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

//API lấy danh sách bài viết theo trang (dùng limit từ biến môi trường .env).
let getPostsPagination = async (req, res) => {
    try {
        let page = +req.query.page;
        let limit = +process.env.LIMIT_GET_POST;
        if (!page) {
            page = 1;
        }
        let object = await supporterService.getPostsPagination(page, limit);
        return res.status(200).json(object);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

//lấy thông tin hiển thị các tab dữ liệu về bệnh nhân
let getForPatientsTabs = async (req, res) => {
    try {
        let object = await patientService.getForPatientsTabs();
        return res.status(200).json({
            'message': 'success',
            'object': object
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

//Thay đổi trạng thái của bệnh nhân và ghi log:
let postChangeStatusPatient = async (req, res) => {
    try {
        let id = req.body.patientId;
        let status = req.body.status;
        let statusId = '';
        let content = '';
        if (status === 'pending') {
            statusId = statusPendingId;
            content = "Các lịch hẹn mới đã được tiếp nhận.";
        } else if (status === 'failed') {
            statusId = statusFailedId;
            if (req.body.reason) {
                content = `Lý do hủy - ${req.body.reason}`;
            }

        } else if (status === 'confirmed') {
            statusId = statusSuccessId;
            content = "Lịch hẹn của bạn đã được đặt thành công.";
        }


        let data = {
            id: id,
            statusId: statusId,
            updatedAt: Date.now()
        };

        let logs = {
            supporterId: req.user.id,
            patientId: id,
            content: content
        };

        let patient = await patientService.changeStatusPatient(data, logs); //
        return res.status(200).json({
            'message': 'success',
            'patient': patient
        }) //cập nhật và ghi nhận log hỗ trợ viên.

    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

//Lấy tất cả comment/feedback của khách hàng và render trang manageCustomer.ejs.
let getManageCustomersPage = async (req, res) => {
    try {
        let comments = await patientService.getComments();
        return res.render("main/users/admins/manageCustomer.ejs", {
            user: req.user,
            comments: comments
        });
    } catch (e) {
        console.log(e)
    }
};

//API lấy log thay đổi trạng thái/hoạt động của một bệnh nhân cụ thể.
let getLogsPatient = async (req, res) => {
    try {
        let logs = await patientService.getLogsPatient(req.body.patientId);
        return res.status(200).json(logs);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

//Đánh dấu comment là đã xử lý (đã phản hồi hoặc giải quyết).
let postDoneComment = async (req, res) => {
    try {
        let comment = await supporterService.doneComment(req.body.commentId);
        return res.status(200).json(comment);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
const supporter = {
    getNewPatients: getNewPatients,
    getManagePosts: getManagePosts,
    getCreatePost: getCreatePost,
    postCreatePost: postCreatePost,
    getAllPosts: getAllPosts,
    getPostsPagination: getPostsPagination,
    getForPatientsTabs: getForPatientsTabs,
    postChangeStatusPatient: postChangeStatusPatient,
    getManageCustomersPage: getManageCustomersPage,
    getLogsPatient: getLogsPatient,
    postDoneComment: postDoneComment
};
export default supporter;