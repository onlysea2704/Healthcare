//dùng để đổ dữ liệu gốc vào bảng users, hỗ trợ kiểm thử, tránh tạo bản ghi tay

'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                name: 'Nguyễn Mai',
                email: 'admin@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'New York',
                phone: '088456732',
                avatar: 'admin.png',
                roleId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Evan',
                email: 'doctor@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor3.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Ben',
                email: 'doctor5@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor4.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Hary Pham',
                email: 'doctor10@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor1.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Clever',
                email: 'doctor1@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor2.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Sam',
                email: 'doctor2@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor6.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Doctor - Eric Pham',
                email: 'doctor3@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'LA',
                phone: '088456735',
                avatar: 'doctor7.jpg',
                roleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Supporter - Eric Pham',
                email: 'supporter@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'Arizona',
                phone: '088456736',
                avatar: 'supporter.png',
                roleId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Supporter - Eric Pham 1',
                email: 'supporter1@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'Arizona',
                phone: '088456736',
                avatar: 'supporter9.png',
                roleId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Supporter - Eric Pham 2',
                email: 'supporter2@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'Arizona',
                phone: '088456736',
                avatar: 'supporter10.png',
                roleId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Supporter - Eric Pham 3',
                email: 'supporter3@gmail.com',
                password: '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', //123456
                address: 'Arizona',
                phone: '088456736',
                avatar: 'supporter.png',
                roleId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },

        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
