import db from "./../models/index.js";
import bcrypt from 'bcryptjs';
import removeMd from "remove-markdown";
// import helper from "../helper/client.js";
import { Sequelize } from 'sequelize';
const Op = Sequelize.Op;
import dotenv from 'dotenv';
dotenv.config();

let getSpecializations = () => {
    return new Promise((async (resolve, reject) => {
        try {
            let specializations = await db.Specialization.findAll();
            resolve(specializations);
        } catch (e) {
            reject(e);
        }
    }));
};

let getClinics = () => {
    return new Promise((async (resolve, reject) => {
        try {
            let clinics = await db.Clinic.findAll();
            resolve(clinics);
        } catch (e) {
            reject(e);
        }
    }));
};

let getDoctors = () => {
    return new Promise((async (resolve, reject) => {
        resolve(true)

    }));
};

let getPosts = (LIMIT_POST) => {
    return new Promise(async (resolve, reject) => {
        try {
            //chỉ get bài đăng y khoa
            let posts = await db.Post.findAll({
                where:{
                    forDoctorId: -1,
                    forSpecializationId: -1,
                    forClinicId: -1
                },
                order: [ [ 'createdAt', 'DESC' ] ],
                limit: LIMIT_POST,
                attributes: [ 'id', 'title', 'contentHTML', 'contentMarkdown' ]
            });

            await Promise.all(posts.map(async (post) => {
                let content = removeMd(post.contentMarkdown);
                post.setDataValue('content', content);
                return post;
            }));

            resolve(posts);
        } catch (e) {
            reject(e);
        }
    });
};

let postSearchHomePage = (keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await  db.User.findAll({
                where:{
                    roleId: 2,
                    name: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                attributes:['id','name']
            });

            let specializations = await db.Specialization.findAll({
                where:{
                    name: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                attributes:['id','name']
                });

            let clinics = await db.Clinic.findAll({
                where:{
                    name: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                attributes:['id','name']
            });

        resolve({
            doctors: doctors,
            specializations: specializations,
            clinics: clinics
        })
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
};

let getDataPageAllClinics = ()=>{
    return new Promise(async (resolve, reject) => {
        try{
            let clinics = db.Clinic.findAll({
                attributes: ['id', 'name', "image"]
            });

            resolve(clinics);
        }catch (e) {
            reject(e);
        }
    });
};

let getDataPageAllDoctors = ()=>{
    return new Promise(async (resolve, reject) => {
        try{
            let doctors = await db.User.findAll({
                where:{
                    roleId: 2
                },
                attributes:['id','name','avatar']
            });

            resolve(doctors);
        }catch (e) {
            reject(e);
        }
    });
};

let getDataPageAllSpecializations = ()=>{
    return new Promise(async (resolve, reject) => {
        try{
            let specializations = await db.Specialization.findAll({
                attributes: ['id', 'name', "image"]
            });
        resolve(specializations);
        }catch (e) {
            reject(e);
        }
    });
};

let updatePassword = async (userId, oldPassword, newPassword, confirmPassword) => {
    // if (!oldPassword || !newPassword || !confirmPassword) {
    //     return { success: false, message: 'Vui lòng điền đầy đủ thông tin.' };
    // }

    // if (newPassword !== confirmPassword) {
    //     return { success: false, message: 'Mật khẩu mới và xác nhận không khớp.' };
    // }

    const user = await db.User.findByPk(userId);
    // if (!user) {
    //     return { success: false, message: 'Người dùng không tồn tại.' };
    // }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return { success: false, message: 'Mật khẩu hiện tại không chính xác.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return { success: true, message: 'Đổi mật khẩu thành công.' };
};

const homeService = {
    getSpecializations: getSpecializations,
    getClinics: getClinics,
    getDoctors: getDoctors,
    getPosts: getPosts,
    postSearchHomePage: postSearchHomePage,
    getDataPageAllClinics: getDataPageAllClinics,
    getDataPageAllDoctors: getDataPageAllDoctors,
    getDataPageAllSpecializations: getDataPageAllSpecializations,
    updatePassword: updatePassword
};
export default homeService;