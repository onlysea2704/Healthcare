import db from "./../models/index.js";
import removeMd from "remove-markdown";
import syncElastic from "./syncsElaticService.js";
import helper from "../helper/client.js";

//lấy tất cả  bài viết với các thông tin 
let getAllPosts = () => {
    return new Promise((async (resolve, reject) => {
        try {
            let posts = await db.Post.findAll({
                attributes: [ 'id', 'title', 'writerId', 'createdAt' ],
            });
            await Promise.all(posts.map(async (post) => {
                let supporter = await helper.getSupporterById(post.writerId);
                let dateClient = helper.convertDateClient(post.createdAt);
                post.setDataValue('writerName', supporter.name);
                post.setDataValue('dateClient', dateClient);
                return post;
            }));

            resolve(posts);
        } catch (e) {
            reject(e);
        }
    }));
};

//tạo bài viết mới
let postCreatePost = (item) => {
    return new Promise((async (resolve, reject) => {
        try {
            let post = await db.Post.create(item);

            // ko đồng bộ các bài đăng dành giới thiệu bác sĩ or chuyên khoa or phòng khám
            //syncs to elastic
            if (item.forDoctorId === '-1' && item.forClinicId === '-1' && item.forClinicId === '-1') {
                let plainText = removeMd(item.contentMarkdown);
                plainText.replace(/(?:\r\n|\r|\\n)/g, ' ');
                let data = {
                    'postId': post.id,
                    'writerId': post.writerId,
                    'title': item.title,
                    'content': plainText,
                };
                await syncElastic.createPost(data);
            }
            resolve(post);
        } catch (e) {
            reject(e);
        }
    }));
};

//lấy chi tiết nội dung bài viết 
let getDetailPostPage = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            let post = await db.Post.findOne({
                where: { id: id },
                attributes: [ 'id', 'title', 'contentHTML', 'contentMarkdown', 'forDoctorId', 'forSpecializationId', 'forClinicId' ]
            });
            if (!post) {
                reject(`Can't get post with id=${id}`);
            }
            resolve(post);
        } catch (e) {
            reject(e);
        }
    }));
};

//lấy ds tất cả các supporter từ bảng users
let getAllSupporters = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let supporters = await db.User.findAll({
                where: { roleId: 3 }
            });

            resolve(supporters);

        } catch (e) {
            reject(e);
        }
    });
};

//phân trang bài viết
let getPostsPagination = (page, limit, role) => {
    return new Promise(async (resolve, reject) => {
        try {
            let posts = "";
            //only get bài đăng y khoa
            if (role === "admin") {
                posts = await db.Post.findAndCountAll({
                    offset: (page - 1) * limit,
                    limit: limit,
                    attributes: [ 'id', 'title', 'contentMarkdown', 'contentHTML', 'createdAt', 'writerId' ],
                    order: [
                        [ 'createdAt', 'DESC' ]
                    ],
                });//nếu admin lấy toàn bộ bài viết
            } else {
                posts = await db.Post.findAndCountAll({
                    where: {
                        forDoctorId: -1,
                        forSpecializationId: -1,
                        forClinicId: -1
                    },
                    offset: (page - 1) * limit,
                    limit: limit,
                    attributes: [ 'id', 'title', 'contentMarkdown', 'contentHTML', 'createdAt', 'writerId' ],
                    order: [
                        [ 'createdAt', 'DESC' ]
                    ],
                });//chỉ lấy bài viết y khoa
            }

            let total = Math.ceil(posts.count / limit);

            await Promise.all(posts.rows.map(async (post) => {
                let supporter = await helper.getSupporterById(post.writerId);
                let dateClient = helper.convertDateClient(post.createdAt);
                post.setDataValue('writerName', supporter.name);
                post.setDataValue('dateClient', dateClient);
                return post;
            }));

            resolve({
                posts: posts,
                total: total
            });
        } catch (e) {
            reject(e);
        }
    });
};

//xóa bài viết theo id
let deletePostById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let post = await db.Post.findOne({
                where: { id: id },
                attributes: [ 'id', 'forDoctorId', 'forSpecializationId', 'forClinicId' ]
            });

            // chỉ delete bài đăng y khoa
            //sync to elasticsearch
            if (post.forDoctorId === -1 && post.forClinicId === -1 && post.forClinicId === -1) {
                await syncElastic.deletePost(post.id);
            }

            await post.destroy();
            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
};

//cập nhật bài viết
let putUpdatePost = (item) => {
    return new Promise(async (resolve, reject) => {
        try {
            let post = await db.Post.findOne({
                where: { id: item.id },
                attributes: [ 'id', 'forDoctorId', 'forSpecializationId', 'forClinicId' ]
            });
            await post.update(item);

            //chỉ update bài đăng y khoa
            //sync to elasticsearch
            if (item.forDoctorId === '-1' && item.forClinicId === '-1' && item.forClinicId === '-1') {
                let plainText = removeMd(item.contentMarkdown);
                plainText.replace(/(?:\r\n|\r|\\n)/g, ' ');
                let data = {
                    'postId': post.id,
                    'writerId': post.writerId,
                    'title': item.title,
                    'content': plainText,
                };
                await syncElastic.updatePost(data);
            }

            resolve(true);
        } catch (e) {
            reject(e);
        }
    });
};

//đanh dấu bình luận đã xử lý
let doneComment = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let comment = await db.Comment.findOne({
                where: { id: id }
            });
            await comment.update({ status: true });
            resolve(comment);
        } catch (e) {
            reject(e)
        }
    });
};

let deleteSupporterById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.destroy({
                where: { id: id }
            });

            resolve('delete successful')
        } catch (e) {
            reject(e);
        }
    });
};

let getInfoSupporterById = (id) => {
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
            resolve(doctor);
        } catch (e) {
            reject(e);
        }
    });
};

let updateSupporterInfo = (data) => {
    console.log(1234567)
    console.log(data)
    return new Promise(async (resolve, reject) => {
        try {
            let supporter = await db.User.findOne({
                where: { id: data.id },
            });
            await supporter.update(data);
            resolve(true)
        } catch (e) {
            reject(e);
        }
    });
};

const supporterService = {
    postCreatePost: postCreatePost,
    getAllPosts: getAllPosts,
    getDetailPostPage: getDetailPostPage,
    getAllSupporters: getAllSupporters,
    getPostsPagination: getPostsPagination,
    deletePostById: deletePostById,
    updateSupporterInfo: updateSupporterInfo,
    putUpdatePost: putUpdatePost,
    doneComment: doneComment,
    deleteSupporterById: deleteSupporterById,
    getInfoSupporterById: getInfoSupporterById,
};
export default supporterService;