import db from "./../models/index.js"; //Truy cập các model Sequelize (các bảng trong CSDL).
import moment from "moment"; //xử lý ngày giờ

//tìm chuyên khoa theo Id
let getSpecializationById = (id) => {
    return new Promise(async (resolve, reject) => {
            try {
                let specialization = await db.Specialization.findOne({ where: { id: id } });
                resolve(specialization);
            } catch (e) {
                reject(e);
            }
        }
    );
};

//tìm phòng khám theo id
let getClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
            try {
                let clinic = await db.Clinic.findOne({ where: { id: id } });
                resolve(clinic);
            } catch (e) {
                reject(e);
            }
        }
    );
};

//Tìm thông tin của supporter theo id, chỉ lấy các trường: id, name, avatar.
let getSupporterById = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
                attributes: [ 'id', 'name', 'avatar' ]
            });
            resolve(user);
        } catch (e) {
            reject(e);
        }
    }));
};

//Chuyển định dạng ngày từ kiểu gốc (ISO hoặc timestamp) sang "DD-MM-YYYY" 
let convertDateClient = (date) => {
    return moment(date).format('DD-MM-YYYY');
};

const helper = {
    getSpecializationById: getSpecializationById,
    getClinicById: getClinicById,
    getSupporterById: getSupporterById,
    convertDateClient: convertDateClient
};
export default helper;