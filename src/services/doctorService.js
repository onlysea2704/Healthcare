import db from "./../models/index.js";

import { Sequelize } from 'sequelize';
const Op = Sequelize.Op;
import moment from "moment";
import patientService from "./patientService.js";
import mailer from "../config/mailer.js";
import { transMailRemedy } from "../../lang/en.js";

import Minizip from 'minizip-asm.js';
import fs from 'fs';

const PATH_ZIP = "src/public/images/patients/remedy/zip";
let maxBooking = 2;
const statusPendingId = 3;
const statusFailedId = 2;
const statusSuccessId = 1;
const statusNewId = 4;
const statusDone = 5;

let getDoctorWithSchedule = (id, currentDate) => {
    return new Promise((async (resolve, reject) => {
        //select with condition: chọn ngày hiện tại mà tổng đặt đang nhỏ hơn max
        try {
            let doctor = await db.User.findOne({
                where: { id: id },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.Schedule, required: false,
                        where: {
                            date: currentDate,
                            sumBooking: { [Op.lt]: maxBooking }
                        }
                    }, {
                        model: db.Doctor_User, attributes: ['specializationId', 'clinicId']
                    },
                    {
                        model: db.Comment,
                        where: { status: true },
                        attributes: ['id', 'timeBooking', 'dateBooking', 'name', 'content', 'createdAt', 'status'],
                        required: false
                    }
                ]
            });

            if (!doctor) {
                reject(`Can't get doctor with id = ${id}`);
            }

            let specializationId = doctor.Doctor_User.specializationId;
            let specialization = await getSpecializationById(specializationId);

            let clinicId = doctor.Doctor_User.clinicId;
            let clinic = await db.Clinic.findOne({
                where: { id: clinicId },
                attributes: ['address']
            });

            let date = new Date();
            let currentHour = `${date.getHours()}:${date.getMinutes()}`;
            let timeNow = moment(`${currentDate} ${currentHour}`, "DD/MM/YYYY hh:mm").toDate();

            doctor.Schedules.forEach((schedule, index) => {
                let startTime = schedule.time.split('-')[0];
                let timeSchedule = moment(`${schedule.date} ${startTime}`, "DD/MM/YYYY hh:mm").toDate();
                //isDisable nếu time hiện tại > time kế hoạch
                schedule.setDataValue('isDisable', timeNow > timeSchedule);

            });


            resolve({
                doctor: doctor,
                specialization: specialization,
                clinic: clinic
            });
        } catch (e) {
            reject(e);
        }
    }));
};

//Trả bài viết (dạng HTML) mới nhất của bác sĩ để hiển thị lên hồ sơ 
let getPostForDoctor = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            let post = await db.Post.findOne({
                where: { forDoctorId: id },
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'title', 'contentHTML']
            });
            resolve(post);
        } catch (e) {
            reject(e);
        }
    }));
};

//Bác sĩ tạo lịch khám mới nếu chưa có lịch trùng date và time.
let postCreateSchedule = (user, arrSchedule, maxBooking) => {
    return new Promise((async (resolve, reject) => {
        try {
            let schedule = await Promise.all(arrSchedule.map(async (schedule) => {
                // Kiểm tra trước khi tạo
                const existedSchedule = await db.Schedule.findOne({
                    where: {
                        doctorId: user.id,
                        date: schedule.date,
                        time: schedule.time
                    }
                });

                if (!existedSchedule) {
                    await db.Schedule.create({
                        doctorId: user.id,
                        date: schedule.date,
                        time: schedule.time,
                        maxBooking: maxBooking,
                        sumBooking: 0,
                        createdAt: new Date() // dùng new Date() thay cho Date.now()
                    });
                }
            }));
            resolve(schedule);
        } catch (err) {
            reject(err);
        }
    }));
};

//Tạo bản ghi bệnh nhân mới khi họ đặt lịch khám.
let createPatient = (item) => {
    return new Promise((async (resolve, reject) => {
        try {
            let patient = await db.Patient.create(item);

            resolve(patient);
        } catch (e) {
            reject(e);
        }
    }));
};

//Lấy toàn bộ lịch khám của bác sĩ trong ngày đó.
let getScheduleDoctorByDate = (id, date) => {
    return new Promise((async (resolve, reject) => {
        const [day, month, year] = date.split("/");
        const dateString1 = `${year}/${month}/${day}`
        const dateString2 = `${day}/${month}/${year}`
        try {
            let schedule = await db.Schedule.findAll({
                where: {
                    doctorId: id,
                    date: {
                        [Op.or]: [dateString1, dateString2]
                    }, sumBooking: { [Op.lt]: maxBooking }
                },
                distinct: true
            });
            console.log('******************')
            console.log(schedule)
            let doctor = await getDoctorById(id);

            let dateNow = new Date();
            let currentDate = moment().format('DD/MM/YYYY');
            let currentHour = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
            let timeNow = moment(`${currentDate} ${currentHour}`, "DD/MM/YYYY hh:mm").toDate();

            schedule.forEach((sch, index) => {
                let startTime = sch.time.split('-')[0];
                let timeSchedule = moment(`${sch.date} ${startTime}`, "DD/MM/YYYY hh:mm").toDate();
                //isDisable nếu time hiện tại > time kế hoạch
                sch.setDataValue('isDisable', timeNow > timeSchedule);

            });

            resolve({
                schedule: schedule,
                doctor: doctor
            });
        } catch (e) {
            reject(e);
        }
    }));
};

let getDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: id, roleId: 2 }
            });
            resolve(doctor);
        } catch (e) {
            reject(e);
        }
    });
};

//Lấy thông tin chuyên khoa theo id.
let getSpecializationById = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            let specialization = await db.Specialization.findOne({ where: { id: id } });
            resolve(specialization);
        } catch (e) {
            reject(e);
        }
    }));
};

//Trả danh sách bác sĩ thuộc chuyên khoa cụ thể và lịch trống trong ngày.
let getDoctorsForSpecialization = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.Doctor_User.findAll({
                where: { specializationId: id },
                attributes: ['specializationId'],
                include: {
                    model: db.User,
                    attributes: ['id', 'name', 'avatar', 'address', 'description']
                }
            });

            //get schedule each doctor
            await Promise.all(doctors.map(async (doctor) => {
                let schedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctor.User.id, date: date, sumBooking: { [Op.lt]: maxBooking }
                    },
                    attributes: ['id', 'date', 'time']
                });


                let dateNow = new Date();
                let currentDate = moment().format('DD/MM/YYYY');
                let currentHour = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
                let timeNow = moment(`${currentDate} ${currentHour}`, "DD/MM/YYYY hh:mm").toDate();

                schedule.forEach((sch, index) => {
                    let startTime = sch.time.split('-')[0];
                    let timeSchedule = moment(`${sch.date} ${startTime}`, "DD/MM/YYYY hh:mm").toDate();
                    //isDisable nếu time hiện tại > time kế hoạch
                    sch.setDataValue('isDisable', timeNow > timeSchedule);

                });


                doctor.setDataValue('schedule', schedule);
            }));
            resolve(doctors)
        } catch (e) {
            reject(e);
        }
    });
};

//Trả thêm cả tên chuyên khoa và phòng khám (để hiển thị đầy đủ trên UI).
let getInfoDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: id },
                attributes: ['id', 'name', 'avatar', 'address', 'phone', 'description'],
                include: {
                    model: db.Doctor_User,
                    attributes: ['clinicId', 'specializationId']
                }
            });

            let specialization = await db.Specialization.findOne({
                where: { id: doctor.Doctor_User.specializationId }, attributes: ['name']
            });
            let clinic = await db.Clinic.findOne({
                where: { id: doctor.Doctor_User.clinicId }, attributes: ['name']
            });

            doctor.setDataValue('specializationName', specialization.name);
            doctor.setDataValue('clinicName', clinic.name);
            resolve(doctor);
        } catch (e) {
            reject(e);
        }
    });
};

//Xóa cả thông tin từ bảng User và Doctor_User.
let deleteDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.destroy({
                where: { id: id }
            });

            let doctor = await db.Doctor_User.findOne({
                where: { doctorId: id }
            });
            if (doctor) {
                await db.Doctor_User.destroy({ where: { id: doctor.id } });
            }

            resolve('delete successful')
        } catch (e) {
            reject(e);
        }
    });
};

//Dùng để lấy thông tin phục vụ trang chỉnh sửa hồ sơ bác sĩ.
let getDoctorForEditPage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: id },
                include: {
                    model: db.Doctor_User,

                }
            });
            resolve(doctor)
        } catch (e) {
            reject(e);
        }
    });
};

//Cập nhật bảng User và Doctor_User (nếu chưa có thì tạo mới).
let updateDoctorInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: data.id },
                include: { model: db.Doctor_User, required: false }
            });
            await doctor.update(data);
            if (doctor.Doctor_User) {
                await doctor.Doctor_User.update(data);
            } else {
                await db.Doctor_User.create({
                    doctorId: data.id,
                    specializationId: data.specializationId,
                    clinicId: data.clinicId
                })
            }

            resolve(true)
        } catch (e) {
            reject(e);
        }
    });
};

//Lấy danh sách bệnh nhân đã đặt khám thành công theo ngày và bác sĩ.
let getPatientsBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patients = await db.Patient.findAll({
                where: {
                    doctorId: data.doctorId,
                    dateBooking: data.date,
                    statusId: statusSuccessId
                },
                order: [['updatedAt', 'ASC']],
                attributes: ['id', 'name', 'gender', 'timeBooking', 'description', 'isSentForms']
            });
            resolve(patients);
        } catch (e) {
            reject(e);
        }
    });
};

//Trả về lịch khám của bác sĩ trong một khoảng 3 ngày.
let getDoctorSchedules = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedules = await db.Schedule.findAll({
                where: {
                    doctorId: data.doctorId,
                    date: { [Op.in]: data.threeDaySchedules },
                },
            });
            resolve(schedules)
        } catch (e) {
            reject(e);
        }
    });
};

//Trả danh sách địa điểm (phòng khám) có thể dùng trong giao diện bác sĩ.
let getPlacesForDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let places = await db.Place.findAll({
                attributes: ['id', 'name']
            });
            resolve(places);
        } catch (e) {
            reject(e);
        }
    })
};

//Loại bỏ dấu tiếng Việt, phục vụ cho việc tạo password hoặc tên file không dấu.
let removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

//Tạo file ZIP có password bảo vệ theo tên, số điện thoại và năm sinh của bệnh nhân.
//Gửi email kèm file zip đến bệnh nhân.
//Ghi nhận trạng thái isSentForms = true.
let sendFormsForPatient = (id, files) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patient = await patientService.getDetailPatient(id);
            let doctor = await db.User.findOne({
                where: { id: patient.doctorId },
                attributes: ['name', 'avatar']
            });
            let name = removeAccents(patient.name).split(' ').join('').toLowerCase();
            let phone = patient.phone.substring(0, 3);
            let year = patient.year.substring(2, 4);
            let password = `${name}-${phone}-${year}`;
            let mz = new Minizip();
            files.forEach((file) => {
                let fileSendToPatient = fs.readFileSync(file.path);
                mz.append(file.originalname, fileSendToPatient, { password: password });
            });
            let nameZip = `${Date.now()}-patientId-${id}.zip`;
            let pathZip = `${PATH_ZIP}/${nameZip}`;
            fs.writeFileSync(pathZip, new Buffer(mz.zip()));
            let filename = `Information-invoice-${patient.dateBooking}.zip`;
            let data = { doctor: doctor.name };
            await mailer.sendEmailWithAttachment(patient.email, transMailRemedy.subject, transMailRemedy.template(data), filename, pathZip);
            await patient.update({
                isSentForms: true
            });

            if (patient.ExtraInfo) {
                let image = JSON.parse(patient.ExtraInfo.sendForms);
                let count = 0;
                if (image) {
                    count = Object.keys(image).length;
                } else {
                    image = {};
                }

                files.forEach((x, index) => {
                    image[count + index] = x.filename;
                });
                await patient.ExtraInfo.update({
                    sendForms: JSON.stringify(image)
                });
            }

            resolve(patient);
        } catch (e) {
            reject(e);
        }
    });
};

//Trả về thông tin tên và avatar bác sĩ để hiển thị trang phản hồi.
let getDoctorForFeedbackPage = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findOne({
                where: { id: id },
                attributes: ['id', 'name', 'avatar']
            });
            if (!doctor) {
                reject(`Can't get feedback with doctorId=${id}`);
            }
            resolve(doctor);
        } catch (e) {
            reject(e);
        }
    });
};

//Kiểm tra bệnh nhân có từng đặt khám bác sĩ chưa → nếu có thì tạo phản hồi (Comment).
let createFeedback = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctorId = data.doctorId;
            let phone = data.feedbackPhone;
            //check patient

            let patient = await db.Patient.findOne({
                where: {
                    doctorId: doctorId,
                    phone: phone,
                    statusId: statusSuccessId
                },
                attributes: ['name', 'timeBooking', 'dateBooking']
            });

            if (patient) {
                let feedback = {
                    doctorId: doctorId,
                    name: patient.name,
                    timeBooking: patient.timeBooking,
                    dateBooking: patient.dateBooking,
                    phone: phone,
                    content: data.feedbackContent,
                    createdAt: Date.now()
                };
                let cm = await db.Comment.create(feedback);
                resolve(cm);
            } else {
                resolve('patient not exist')
            }

        } catch (e) {
            reject(e);
        }
    });
};

const doctorService = {
    getDoctorForFeedbackPage: getDoctorForFeedbackPage,
    getDoctorWithSchedule: getDoctorWithSchedule,
    postCreateSchedule: postCreateSchedule,
    createPatient: createPatient,
    getPostForDoctor: getPostForDoctor,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getDoctorsForSpecialization: getDoctorsForSpecialization,
    getInfoDoctorById: getInfoDoctorById,
    deleteDoctorById: deleteDoctorById,
    getDoctorForEditPage: getDoctorForEditPage,
    updateDoctorInfo: updateDoctorInfo,
    getPatientsBookAppointment: getPatientsBookAppointment,
    getDoctorSchedules: getDoctorSchedules,
    getPlacesForDoctor: getPlacesForDoctor,
    sendFormsForPatient: sendFormsForPatient,
    createFeedback: createFeedback,
};
export default doctorService;