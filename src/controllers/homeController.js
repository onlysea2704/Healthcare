
//điều phối logic giữa các service (xử lý dữ liệu), view (EJS), và các route của người dùng.
// Mỗi hàm trong file này thường:
//Nhận yêu cầu từ client
//Gọi đến các service tương ứng (giao tiếp với DB hoặc các API backend)
//Xử lý logic và trả lại kết quả (dạng render trang hoặc JSON cho API).import dotenv from 'dotenv';
import dotenv from 'dotenv';
import homeService from "./../services/homeService.js";
import specializationService from "./../services/specializationService.js";
import doctorService from "./../services/doctorService.js";
import userService from "./../services/userService.js";
import supporterService from "./../services/supporterService.js";
import clinicService from "./../services/clinicService.js";
import elasticService from "./../services/syncsElaticService.js";
import patientService from "./../services/patientService.js";
import moment from "moment";

dotenv.config();

// striptags to remove HTML
import striptags from "striptags";

import multer from "multer";
import mailer from '../config/mailer.js';
import { transcreateContactColab } from '../../lang/en.js';

let LIMIT_POST = 5;

const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;
const statusNewId = 4;

//Lấy dữ liệu chuyên khoa, phòng khám, bác sĩ, bài viết từ các service và render ra trang chủ (homepage.ejs).
let getHomePage = async (req, res) => {
    try {
        let specializations = await homeService.getSpecializations();
        let clinics = await homeService.getClinics();
        let doctors = await userService.getInfoDoctors();
        let posts = await homeService.getPosts(LIMIT_POST);
        return res.render("main/homepage/homepage.ejs", {
            user: req.user,
            specializations: specializations,
            clinics: clinics,
            doctors: doctors,
            posts: posts,
            pageId: process.env.PAGE_ID
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

//Render trang home của người dùng, truyền thêm currentMonth để hiển thị 
let getUserPage = (req, res) => {
    let currentMonth = new Date().getMonth() + 1;
    res.render("main/users/home.ejs", {
        user: req.user,
        currentMonth: currentMonth
    });
};

//Lấy thông tin một chuyên khoa, danh sách bác sĩ theo ngày, render trang chuyên khoa.
let getDetailSpecializationPage = async (req, res) => {
    try {
        let object = await specializationService.getSpecializationById(req.params.id);
        // using date to get schedule of doctors
        let currentDate = moment().format('DD/MM/YYYY');
        let doctors = await doctorService.getDoctorsForSpecialization(req.params.id, currentDate);
        let sevenDaySchedule = [];
        for (let i = 0; i < 5; i++) {
            let date = moment(new Date()).add(i, 'days').locale('en').format('dddd - DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }

        let listSpecializations = await specializationService.getAllSpecializations();
        return res.render("main/homepage/specialization.ejs", {
            specialization: object.specialization,
            post: object.post,
            doctors: doctors,
            places: object.places,
            sevenDaySchedule: sevenDaySchedule,
            listSpecializations: listSpecializations
        });

    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

//Lấy thông tin bác sĩ, lịch làm việc và phòng khám để render ra trang chi tiết bác sĩ.
let getDetailDoctorPage = async (req, res) => {
    try {
        let currentDate = moment().format('DD/MM/YYYY');
        let sevenDaySchedule = [];
        for (let i = 0; i < 5; i++) {
            let date = moment(new Date()).add(i, 'days').locale('en').format('dddd - DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }

        let object = await doctorService.getDoctorWithSchedule(req.params.id, currentDate);

        let places = await doctorService.getPlacesForDoctor();
        let postDoctor = await doctorService.getPostForDoctor(req.params.id);


        return res.render("main/homepage/doctor.ejs", {
            doctor: object.doctor,
            sevenDaySchedule: sevenDaySchedule,
            postDoctor: postDoctor,
            specialization: object.specialization,
            places: places,
            clinic: object.clinic
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

//Render trang đặt lịch trống.
let getBookingPage = (req, res) => {
    res.render("main/homepage/bookingPage.ejs")
};

//Lấy chi tiết một bài viết.
let getDetailPostPage = async (req, res) => {
    try {
        let post = await supporterService.getDetailPostPage(req.params.id);
        res.render("main/homepage/post.ejs", {
            post: post
        })
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

//Hiển thị thông tin phòng khám cụ thể và bác sĩ có tại đó.
let getDetailClinicPage = async (req, res) => {
    try {
        let currentDate = moment().format('DD/MM/YYYY');
        let sevenDaySchedule = [];
        for (let i = 0; i < 5; i++) {
            let date = moment(new Date()).add(i, 'days').locale('en').format('dddd - DD/MM/YYYY');
            sevenDaySchedule.push(date);
        }
        let object = await clinicService.getDetailClinicPage(req.params.id, currentDate);

        res.render("main/homepage/clinic.ejs", {
            clinic: object.clinic,
            doctors: object.doctors,
            sevenDaySchedule: sevenDaySchedule,
            places: object.places
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

let getContactPage = (req, res) => {
    return res.render('main/homepage/contact.ejs');
};


//Lấy và tìm kiếm bài viết với ElasticSearch hoặc theo từ khóa gửi từ client.
let getPostsWithPagination = async (req, res) => {
    let role = 'nope';
    let object = await supporterService.getPostsPagination(1, +process.env.LIMIT_GET_POST, role);
    return res.render("main/homepage/allPostsPagination.ejs", {
        posts: object.posts,
        total: object.total,
        striptags: striptags
    })
};
//tìm kiếm bài viết với ElasticSearch hoặc theo từ khóa gửi từ client.
let getPostSearch = async (req, res) => {
    let search = req.query.keyword;
    let results = await elasticService.findPostsByTerm(search);
    return res.render('main/homepage/searchPost.ejs', {
        search: search,
        posts: results.hits.hits
    });
};

let getInfoBookingPage = async (req, res) => {
    try {
        let patientId = req.params.id;
        let patient = await patientService.getInfoBooking(patientId);
        return res.render('main/homepage/infoBooking.ejs', {
            patient: patient
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

//Nhận dữ liệu đặt lịch không có file (giấy tờ khám cũ), gọi service tạo mới bệnh nhân, trả về JSON kết quả.
let postBookingDoctorPageWithoutFiles = async (req, res) => {
    try {
        let item = req.body;
        item.statusId = statusNewId;
        item.historyBreath = req.body.breath;
        item.moreInfo = req.body.extraOldForms;
        if (item.places === 'none') item.placeId = 0;
        else item.placeId = item.places;
        item.createdAt = Date.now();

        let patient = await patientService.createNewPatient(item);
        return res.status(200).json({
            status: 1,
            message: 'success',
            patient: patient
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

// Nhận dữ liệu có kèm file upload (sử dụng multer), lưu file ảnh rồi tạo bệnh nhân.
let postBookingDoctorPageNormal = (req, res) => {
    imageImageOldForms(req, res, async (err) => {
        if (err) {
            console.log(err);
            if (err.message) {
                console.log(err.message);
                return res.status(500).send(err.message);
            } else {
                console.log(err);
                return res.status(500).send(err);
            }
        }

        try {

            let item = req.body;
            let imageOldForm = req.files;
            let image = {};
            imageOldForm.forEach((x, index) => {
                image[index] = x.filename;
            });

            item.statusId = statusNewId;
            item.historyBreath = req.body.breath;
            item.moreInfo = req.body.extraOldForms;
            if (item.places === 'none') item.placeId = 0;
            item.placeId = item.places;
            item.oldForms = JSON.stringify(image);
            item.createdAt = Date.now();

            let patient = await patientService.createNewPatient(item);
            return res.status(200).json({
                status: 1,
                message: 'success',
                patient: patient
            })

        } catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    });
};

let storageImageOldForms = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/public/images/patients");
    },
    filename: (req, file, callback) => {
        let imageName = `${Date.now()}-${file.originalname}`;
        callback(null, imageName);
    }
});

let imageImageOldForms = multer({
    storage: storageImageOldForms,
    limits: { fileSize: 1048576 * 20 }
}).array("oldForms");

let getDetailPatientBooking = async (req, res) => {
    try {
        let patient = await patientService.getDetailPatient(req.body.patientId);
        return res.status(200).json(patient);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let createContactColab = async (req, res) => {
    const contactInfo = req.body
    const to = "lesamy1319@gmail.com"
    await mailer.sendEmailNormal(to, transcreateContactColab.subject, transcreateContactColab.htmlContent(contactInfo));
    return res.status(200).json({ status: true });
};

//Lấy thông tin bác sĩ để gửi feedback.
let getFeedbackPage = async (req, res) => {
    try {
        let doctor = await doctorService.getDoctorForFeedbackPage(req.params.id);
        return res.render("main/homepage/feedback.ejs", {
            doctor: doctor
        });
    } catch (e) {
        console.log(e);
        return res.render('main/homepage/pageNotFound.ejs');
    }
};

//Gửi phản hồi từ người dùng lên backend.
let postCreateFeedback = async (req, res) => {
    try {
        let feedback = await doctorService.createFeedback(req.body.data);
        return res.status(200).json({
            message: "send feedback success",
            feedback: feedback
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};


//Hiển thị các trang tĩnh tương ứng.
let getPageForPatients = (req, res) => {
    return res.render("main/homepage/forPatients.ejs");
};

let getPageForDoctors = (req, res) => {
    return res.render("main/homepage/forDoctors.ejs");
};

//Lấy và tìm kiếm bài viết theo từ khóa gửi từ client.
let postSearchHomePage = async (req, res) => {
    try {
        let result = await homeService.postSearchHomePage(req.body.keyword);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getGeocode = async (req, res) => {
    const query = req.query.q;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'YourAppNameHere/1.0' } // Nominatim yêu cầu có header này
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi gọi Nominatim' });
    }
};


let getPageAllClinics = async (req, res) => {
    try {
        let clinics = await homeService.getDataPageAllClinics();

        return res.render("main/homepage/allClinics.ejs", {
            clinics: clinics
        })
    } catch (e) {
        console.log(e);
    }
};

let getPageAllDoctors = async (req, res) => {
    try {
        let doctors = await homeService.getDataPageAllDoctors();
        return res.render("main/homepage/allDoctors.ejs", {
            doctors: doctors
        })
    } catch (e) {
        console.log(e);
    }
};

let getPageAllSpecializations = async (req, res) => {
    try {
        let specializations = await homeService.getDataPageAllSpecializations();
        return res.render("main/homepage/allSpecializations.ejs", {
            specializations: specializations
        })
    } catch (e) {
        console.log(e);
    }
};


const home = {
    getHomePage: getHomePage,
    getUserPage: getUserPage,
    getDetailSpecializationPage: getDetailSpecializationPage,
    getDetailDoctorPage: getDetailDoctorPage,
    getBookingPage: getBookingPage,
    getDetailPostPage: getDetailPostPage,
    getDetailClinicPage: getDetailClinicPage,
    getContactPage: getContactPage,
    getPostsWithPagination: getPostsWithPagination,
    getPostSearch: getPostSearch,
    getInfoBookingPage: getInfoBookingPage,
    postBookingDoctorPageWithoutFiles: postBookingDoctorPageWithoutFiles,
    postBookingDoctorPageNormal: postBookingDoctorPageNormal,
    getDetailPatientBooking: getDetailPatientBooking,
    getFeedbackPage: getFeedbackPage,
    postCreateFeedback: postCreateFeedback,
    createContactColab: createContactColab,
    getPageForPatients: getPageForPatients,
    getPageForDoctors: getPageForDoctors,
    postSearchHomePage: postSearchHomePage,
    getPageAllClinics: getPageAllClinics,
    getPageAllDoctors: getPageAllDoctors,
    getPageAllSpecializations: getPageAllSpecializations,
    getGeocode: getGeocode,
};
export default home;