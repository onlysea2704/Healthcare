// dùng để tạo sẵn dữ liệu vai trò người dùng trong hệ thống, phân quyền

'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Roles', [ {
            name: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'DOCTOR',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'SUPPORTER',
            createdAt: new Date(),
            updatedAt: new Date()
        } ], {});

    },// dùng để thêm dữ liệu khi chạy

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Roles', null, {});
    }//xóa dữ liệu đã thêm 
};
