//thư mục migrations chứa các tập lệnh thay đổi cấu trúc csdl (thêm sửa xóa cột,..)
//có 2 hàm up: tạo/sửa bảng, hàm down: hoàn tác thay đổi ở up
//Sequelize là ORM (Object-Relational Mapping): 
//cho phép tương tác với csdl bằng cú pháp JavaScript.

/*"Đây là một tập lệnh JavaScript được Sequelize sử dụng để định nghĩa và thực hiện việc tạo bảng Users trong cơ sở dữ liệu, 
được đặt trong thư mục migrations và dùng để quản lý phiên bản schema trong hệ thống một cách rõ ràng và có thể rollback được."*/
'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING
            },
            avatar: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.STRING,
                defaultValue: 'male'
            },
            description: {
                type: Sequelize.TEXT
            },
            roleId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            isActive: {
                type: Sequelize.TINYINT(1),
                defaultValue: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users');
    }
};
