//định nghĩa bảng appointment trong csdl
//Sequelize sẽ ánh xạ model này tới bảng Appointments trong cơ sở dữ liệu 
//(theo chuẩn Sequelize: tên model số ít → tên bảng số nhiều).
'use strict';//viết mã an toàn hơn và tránh các lỗi ngầm.
export default (sequelize, DataTypes) => {
    const Appointment = sequelize.define('Appointment', {
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        date: DataTypes.STRING,
        time: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {});
    Appointment.associate = function(models) {

    };
    return Appointment;
};