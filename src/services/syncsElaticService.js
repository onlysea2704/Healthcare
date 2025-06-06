//là một module tích hợp Elasticsearch dùng để đồng bộ dữ liệu bài viết y khoa giữa hệ thống backend 
//và Elasticsearch index (doctorcare_haryphamdev/posts).
import request from "request";
import dotenv from "dotenv";
dotenv.config();

//tạo mới post trong elastic
let createPost = (data) => {
    request.post({
        url: `${process.env.ELASTIC_HOST}/doctorcare_haryphamdev/posts/${data.postId}`,
        headers: {
            'Content-Type': 'application/json',
        },
        json: data
    }, (error, response, body) => {
        if (error) {
            console.log('error sync create elastic posts');
            console.log(error)
        }
    });
};

//cập nhật bài viết trong elasticsearch 
let updatePost = (data) => {
    request.put({
        url: `${process.env.ELASTIC_HOST}/doctorcare_haryphamdev/posts/${data.postId}`,
        headers: {
            'Content-Type': 'application/json',
        },
        json: data
    }, (error, response, body) => {
        if (error) {
            console.log('error sync update elastic posts');
            console.log(error)
        }
    });
};

//xóa bài viết khỏi elasticsearch
let deletePost = (id) => {
    request.delete({
        url: `${process.env.ELASTIC_HOST}/doctorcare_haryphamdev/posts/${id}`,
        headers: {
            'Content-Type': 'application/json',
        },
    }, (error, response, body) => {
        if (error) {
            console.log('error sync delete elastic posts');
            console.log(error)
        }
    });
};

//tìm kiếm bác sĩ y khoa trên elasticsearch
let findPostsByTerm = (keyword) => {
    return new Promise((resolve, reject) => {
        let query =
            {
                "query": {
                    "multi_match": {
                        "query": `${keyword}`,
                        "type": "most_fields",
                        "fields": [ "title", "content" ]
                    }
                },
                "highlight": {
                    "pre_tags": [ "<strong>" ],
                    "post_tags": [ "</strong>" ],
                    "fields": {
                        "title": {
                            "fragment_size": 200,
                            "number_of_fragments": 1
                        },
                        "content": {
                            "fragment_size": 200,
                            "number_of_fragments": 1
                        }
                    }
                }
            };

        request.get({
            url: `${process.env.ELASTIC_HOST}/doctorcare_haryphamdev/posts/_search`,
            headers: {
                'Content-Type': 'application/json',
            },
            json: query
        }, (error, response, body) => {
            if (error) {
                console.log('error search elastic posts');
                console.log(error);
                reject(error)
            }
            resolve(body);
        });
    });
};

const syncElastic = {
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost,
    findPostsByTerm: findPostsByTerm
};

export default syncElastic;