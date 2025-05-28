import db from "./../models/index.js";
// trả về thông tin chuyên khoa cụ thể 
let getSpecializationById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialization = await db.Specialization.findOne({
                where: { id: id },
                attributes: [ 'id', 'name', 'image', 'description' ],
            });
            if(!specialization) {
                reject("Can't get specialization-id: "+id);
            }
            let post = await db.Post.findOne({
                where: { forSpecializationId: id },
                attributes: [ 'id', 'title', 'contentHTML' ]
            });

            let places = await db.Place.findAll({
                attributes: ['id', 'name']
            });

            resolve({
                specialization: specialization,
                post: post,
                places: places
            });
        } catch (err) {
            reject(err);
        }
    })
};

//lấy danh sách chuyên khoa, gồm id và name và sắp xếp theo tên
let getAllSpecializations = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listSpecializations = await db.Specialization.findAll({
                attributes: [ 'id', 'name' ],
                order: [
                    [ 'name', 'ASC' ]
                ],
            });
            resolve(listSpecializations);
        } catch (e) {
            reject(e);
        }
    });
};

//xóa chuyên khoa theo ID và xóa thêm các bác sĩ thuộc chuyên khoa đó
let deleteSpecializationById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Specialization.destroy({
                where: { id: id }
            });
            let infos = await db.Doctor_User.findAll({
                where: {
                    specializationId: id
                }
            });
            let arrId = [];
            infos.forEach((x) => {
                arrId.push(x.id);
            });
            await db.Doctor_User.destroy({ where: { id: arrId } });
            resolve(true);

        } catch (e) {
            reject(e);
        }
    });
};

const specializationService = {
    getSpecializationById: getSpecializationById,
    getAllSpecializations: getAllSpecializations,
    deleteSpecializationById: deleteSpecializationById
};
export default specializationService;