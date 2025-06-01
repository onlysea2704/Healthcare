export const transValidation = {
    email_incorrect: "Invalid email",
    gender_incorrect: "Invalid gender",
    password_incorrect: "Password must have at least 6 characters",
    password_confirmation_incorrect: "The confirm password is not correct",
};

export const transMailBookingNew = {
    subject: "[Doctors Care] Thông báo lịch hẹn",
    template: (data) => {
        return `<h3>Cảm ơn bạn đã đặt lịch hẹn tại hệ thống của Doctors Care. </h3>
        <h4>Thông tin chi tiết về lịch hẹn của bạn:</h4>
        <div>Tên bác sĩ: ${data.doctor} </div>
        <div>Thời gian: ${data.time}</div>
        <div>Ngày khám: ${data.date}</div>
        <div>Trạng thái: <b> Đang chờ xác nhận</b></div>
        <h4>Hệ thống của chúng tôi sẽ tự động gửi thông báo qua email khi lịch hẹn được xác nhận hoàn tất. Cảm ơn bạn!</h4>`;
    },
};

export const transMailBookingFailed = {
    subject: "[Doctors Care] Thông báo lịch hẹn",
    template: (data) => {
        return `<h3>Cảm ơn bạn đã đặt lịch hẹn tại hệ thống của Doctors Care.  </h3>
        <h4>Thông tin chi tiết về lịch hẹn của bạn:</h4>
        <div>Tên bác sĩ: ${data.doctor} </div>
        <div>Thời gian: ${data.time}</div>
        <div>Ngày khám: ${data.date}</div>
        <div>Trạng thái: <b>Đã hủy - ${data.reason}</b></div>
        <h4>Nếu bạn nhận thấy có bất kỳ lỗi nào trong thông báo này, xin vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi: <b> 833 866 </b>. Cảm ơn bạn !</h4>`;
    },
};

export const transMailBookingSuccess = {
    subject: "[Doctors Care] Thông báo lịch hẹn",
    template: (data) => {
        return `<h3>Cảm ơn bạn đã đặt lịch hẹn tại hệ thống của Doctors Care. </h3>
        <h4>Thông tin chi tiết về lịch hẹn của bạn:</h4>
        <div>Tên bác sĩ: ${data.doctor} </div>
        <div>Thời gian: ${data.time}</div>
        <div>Ngày khám: ${data.date}</div>
        <div>Trạng thái: <b>Thành công!</b></div>
        <h4>Cảm ơn bạn rất nhiều !</h4>`;
    },
};

export const transMailRemedy = {
    subject: "[Doctorscare] Hóa đơn khám bệnh từ bác sĩ",
    template: (data) => {
        return `<h3>Cảm ơn bạn đã tin tưởng và đặt lịch khám bệnh trong hệ thống của DoctorCare.</h3>
        Sau khi bạn đã đến khám tại phòng khám của bác sĩ <b> ${data.doctor} </b>, bạn có thể xem chi tiết hóa đơn trong tệp đính kèm của email này. </h4>
        <div>Mật khẩu để giải nén tệp đính kèm có định dạng như sau: <i>Họ và tên không dấu - 3 số đầu của số điện thoại - 2 số cuối của năm sinh của bạn</div>
        <br>
        <div>Ví dụ: Họ và tên Nguyễn Thị Mai, số điện thoại đã đăng ký: 0123456789, năm sinh: 2003 thì mật khẩu giải nén là: <b> nguyenthimai-012-03 </b> </div>
        <br>
        <div>Trong trường hợp bạn không nhận được tệp đính kèm hoặc không thể giải nén, vui lòng liên hệ với bộ phận hỗ trợ.<b>833 866</b></div>
        <h4>Cảm ơn bạn !</h4>`;
    },
};
export const transForgotPassword = {
    subject: "[DoctorsCare] Khôi phục mật khẩu",
    template: (data) => {
        return `<h3>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản Doctors Care của bạn.</h3>
        <h4>Dưới đây là chi tiết yêu cầu khôi phục mật khẩu của bạn:</h4>
        <div>Email: ${data.email}</div>
        <div>Thời gian gửi yêu cầu: ${data.requestTime}</div>
        <div>Để đặt lại mật khẩu của bạn, vui lòng nhấp vào liên kết dưới đây:</div>
        <div><a href="${data.resetLink}">Đặt lại mật khẩu</a></div>
        <h4>Nếu bạn không yêu cầu thay đổi này, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ qua hotline <b>833 866</b>.</h4>
        <h4>Cảm ơn bạn đã lựa chọn Doctors Care!</h4>`;
    },
};

export const transcreateContactColab = {
    subject: '📥 [DOCTORCARE] Đã có người đăng ký hợp tác từ form',
    htmlContent: (contactInfo) => {
        return `<body style="font-family: Arial, sans-serif; line-height: 1.6;">
  <p>Xin chào đội ngũ <strong>DoctorsCare</strong>,</p>

  <p>Hệ thống vừa ghi nhận một đăng ký mới từ form <strong>"Hợp tác cùng DoctorsCare"</strong>. Dưới đây là thông tin chi tiết:</p>

  <ul>
    <li><strong>Tên liên hệ:</strong> ${contactInfo?.contactName}</li>
    <li><strong>Email:</strong> ${contactInfo?.contactEmail}</li>
    <li><strong>Số điện thoại:</strong> ${contactInfo?.contactPhone}</li>
    <li><strong>Tên cơ sở y tế:</strong> ${contactInfo?.contactCompany}</li>
    <li><strong>Địa chỉ:</strong> ${contactInfo?.contactAddress}</li>
  </ul>

  <p><strong>Nội dung:</strong></p>
  <p>${contactInfo?.contactContent}</p>

  <p>Vui lòng kiểm tra và phản hồi trong thời gian sớm nhất để duy trì trải nghiệm chuyên nghiệp và kịp thời với đối tác tiềm năng.</p>

  <p>Trân trọng,<br>
  <strong>Hệ thống DoctorsCare</strong></p>
</body>`
    }
};