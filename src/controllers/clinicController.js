//định nghĩa controller để xử lý việc lấy thông tin phòng khám theo ID.
//Nhận id từ request body.
//Gọi service để lấy dữ liệu.
//Trả lại kết quả hoặc lỗi.

import clinicService from "./../services/clinicService.js"; //để truy vấn dữ liệu phòng khám theo ID.

let getInfoClinicById = async (req, res) => { // hàm async giúp code dễ đọc và debug hơn
    try {
        let clinic = await clinicService.getClinicById(req.body.id);
        return res.status(200).json({
            message: 'get info clinic successful',
            clinic: clinic
        })
    } catch (e) {
        return res.status(500).json(e);
    }
};
const clinic = {
    getInfoClinicById: getInfoClinicById
};
export default clinic;
