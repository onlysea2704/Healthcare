import doctorService from "./../services/doctorService.js"; //xử lý logic nghiệp vụ vủa bác sĩ
import userService from "./../services/userService.js";
import _ from "lodash"; // xử lý mảng
import moment from "moment"; // thư viện ngày giờ
import multer from "multer"; //upload file
import supporterService from "../services/supporterService.js";

const MAX_BOOKING = 10;


//Chuyển đổi chuỗi ngày dạng dd/MM/yyyy thành một object Date.
function stringToDate(_date, _format, _delimiter) {
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let dateItems = _date.split(_delimiter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");
    let month = parseInt(dateItems[monthIndex]);
    month -= 1;
    return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);

}
//lấy lịch làm việc của bác sĩ cho 3 ngày liên tiếp
let getSchedule = async (req, res) => {
    try {
        let threeDaySchedules = [];
        for (let i = 0; i < 3; i++) {
            let date = moment(new Date()).add(i, 'days').locale('en').format('DD/MM/YYYY');
            threeDaySchedules.push(date);
        }
        let data = {
            threeDaySchedules: threeDaySchedules,
            doctorId: req.user.id
        };
        let schedules = await doctorService.getDoctorSchedules(data);

        schedules.forEach((x) => {
            x.date = Date.parse(stringToDate(x.date, "dd/MM/yyyy", "/"))
        });

        schedules = _.sortBy(schedules, x => x.date);

        const groupedSchedules = [];
        schedules.forEach(schedule => {
            // Tìm xem đã có nhóm nào trùng doctorId và date chưa
            const existingGroup = groupedSchedules.find(group =>
                group.doctorId === schedule.doctorId && group.date === schedule.date
            );

            if (existingGroup) {
                existingGroup.times.push(schedule.time);
            } else {
                groupedSchedules.push({
                    doctorId: schedule.doctorId,
                    date: schedule.date,
                    times: [schedule.time],
                    doctorName: schedule?.User?.name || ''
                });
            }
        });
        schedules.forEach((x) => {
            x.date = moment(x.date).format("DD/MM/YYYY")
        });
        //Chuyển đổi, sắp xếp ngày, sau đó render trang schedule.ejs.
        return res.render("main/users/admins/manageSchedule.ejs", {
            user: req.user,
            schedules: schedules,
            groupedSchedules: groupedSchedules,
            threeDaySchedules: threeDaySchedules
        })
    } catch (e) {
        console.log(e)
    }
};

//Render giao diện để bác sĩ tạo lịch khám
let getCreateSchedule = async (req, res) => {
    const doctors = await doctorService.getAllDoctor()
    return res.render("main/users/admins/createSchedule.ejs", {
        user: req.user,
        doctors: doctors
    })
};


// nhận dữ liệu lịch từ FE schedule_arr và gọi service lưu lại
//trả về kết quả JSON khi thành công 
let postCreateSchedule = async (req, res) => {
    await doctorService.postCreateSchedule(req.body.doctorId, req.body.schedule_arr, MAX_BOOKING);
    return res.status(200).json({
        "status": 1,
        "message": 'success'
    })
};

let deleteSchedule = async (req, res) => {
    await doctorService.deleteSchedule(req.body.date, req.body.doctorId);
    return res.status(200).json({
        "status": 1,
        "message": 'success'
    })
};

//Lấy lịch làm việc của một bác sĩ cụ thể theo ngày (qua req.body.doctorId, req.body.date).
//Trả về JSON gồm lịch và thông tin bác sĩ.
let getScheduleDoctorByDate = async (req, res) => {

    try {
        let object = await doctorService.getScheduleDoctorByDate(req.body.doctorId, req.body.date);
        let data = object.schedule;
        let doctor = object.doctor;
        return res.status(200).json({
            status: 1,
            message: data,
            doctor: doctor
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json(e);
    }
};

//Trả về thông tin chi tiết của bác sĩ theo ID
let getInfoDoctorById = async (req, res) => {
    try {
        let doctor = await doctorService.getInfoDoctorById(req.body.id);
        return res.status(200).json({
            'message': 'success',
            'doctor': doctor
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
let getInfoSupporterById = async (req, res) => {
    try {
        let supporter = await supporterService.getInfoSupporterById(req.body.id);
        return res.status(200).json({
            'message': 'success',
            'doctor': supporter
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

//Quản lý danh sách cuộc hẹn bệnh nhân theo ngày
let getManageAppointment = async (req, res) => {
    // let date = "30/03/2020";
    let currentDate = moment().format('DD/MM/YYYY');
    let canActive = false;
    let date = '';
    if (req.query.dateDoctorAppointment) {
        date = req.query.dateDoctorAppointment;
        if (date === currentDate) canActive = true;
    } else {
        //get currentDate
        date = currentDate;
        canActive = true;
    }

    let data = {
        date: date,
        doctorId: req.user.id
    };
    //Lấy danh sách lịch hẹn từ doctorService.getPatientsBookAppointment.
    let appointments = await doctorService.getPatientsBookAppointment(data);
    // sort by range time
    let sort = _.sortBy(appointments, x => x.timeBooking); //Sắp xếp và group theo giờ (dùng lodash).
    //group by range time
    let final = _.groupBy(sort, function (x) {
        return x.timeBooking;
    });

    return res.render("main/users/admins/manageAppointment.ejs", {
        user: req.user,
        appointments: final,
        date: date,
        active: canActive
    })
};


//Render giao diện quản lý biểu đồ thống kê của bác sĩ (manageChartDoctor.ejs).
let getManageChart = (req, res) => {
    return res.render("main/users/admins/manageChartDoctor.ejs", {
        user: req.user
    })
};

//Gửi file (phiếu chỉ định, kết quả khám) từ bác sĩ đến bệnh nhân.
let postSendFormsToPatient = (req, res) => {
    FileSendPatient(req, res, async (err) => {
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

            let patient = await doctorService.sendFormsForPatient(req.body.patientId, req.files);
            return res.status(200).json({
                status: 1,
                message: 'sent files success',
                patient: patient
            })
        } catch (e) {
            console.log(e);
            return res.status(500).send(e);
        }
    });
};

let storageFormsSendPatient = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/public/images/patients/remedy");//
    },//Dùng multer để upload file vào thư mục src/public/images/patients/remedy.
    filename: (req, file, callback) => {
        let imageName = `${Date.now()}-${file.originalname}`;
        callback(null, imageName);
    }
});

let FileSendPatient = multer({
    storage: storageFormsSendPatient,
    limits: { fileSize: 1048576 * 20 }
}).array("filesSend");


//Truy vấn và trả về dữ liệu biểu đồ cho bác sĩ trong tháng được chọn.
let postCreateChart = async (req, res) => {
    try {
        let object = await userService.getInfoDoctorChart(req.body.month, req.body.userId);
        return res.status(200).json(object);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

//Tự động tạo lịch khám cho tất cả bác sĩ.
let postAutoCreateAllDoctorsSchedule = async (req, res) => {
    try {
        let data = await userService.createAllDoctorsSchedule();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}


const doctor = {
    getSchedule: getSchedule,
    getCreateSchedule: getCreateSchedule,
    postCreateSchedule: postCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getInfoDoctorById: getInfoDoctorById,
    getInfoSupporterById:getInfoSupporterById,
    getManageAppointment: getManageAppointment,
    getManageChart: getManageChart,
    postSendFormsToPatient: postSendFormsToPatient,
    postCreateChart: postCreateChart,
    postAutoCreateAllDoctorsSchedule: postAutoCreateAllDoctorsSchedule,
    deleteSchedule: deleteSchedule
};
export default doctor;
