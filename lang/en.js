export const transValidation = {
    email_incorrect: "Invalid email",
    gender_incorrect: "Invalid gender",
    password_incorrect: "Password must have at least 6 characters",
    password_confirmation_incorrect: "The confirm password is not correct",
};

export const transMailBookingNew = {
    subject: "Email notification of booking progress at Doctors Care",
    template: (data) => {
        return `<h3>Thank you for booking an appointment at Doctors Care's system </h3>
        <h4>Information for booked appointment:</h4>
        <div>Doctor's name: ${data.doctor} </div>
        <div>Time: ${data.time}</div>
        <div>Date: ${data.date}</div>
        <div>Status: <b> Pending - A new appointment is waiting for confirmation</b></div>
        <h4>Doctors Care system will automatically send email notification when confirmed appointment is complete. Thank you !</h4>`;
    },
};

export const transMailBookingFailed = {
    subject: "Email notification of booking progress at Doctors Care",
    template: (data) => {
        return `<h3>Thank you for booking an appointment at Doctors Care's system  </h3>
        <h4>Information for booked appointment:</h4>
        <div>Doctor's name: ${data.doctor} </div>
        <div>Time: ${data.time}</div>
        <div>Date: ${data.date}</div>
        <div>Status: <b>Cancel - ${data.reason}</b></div>
        <h4>If you notice errors from this email, please contact the support operator: <b> 911 911 </b>. Thank you !</h4>`;
    },
};

export const transMailBookingSuccess = {
    subject: "Email notification of booking progress at Doctors Care",
    template: (data) => {
        return `<h3>Thank you for booking an appointment at Doctors Care's system </h3>
        <h4>Information for booked appointment:</h4>
        <div>Doctor's name: ${data.doctor} </div>
        <div>Time: ${data.time}</div>
        <div>Date: ${data.date}</div>
        <div>Status: <b>Succeed</b></div>
        <h4>Thank you very much !</h4>`;
    },
};

export const transMailRemedy= {
    subject: "Email sending the medical invoice from the doctor",
    template: (data) => {
        return `<h3>Thank you for your trust in booking a medical examination in DoctorCare's system.</h3>
        After you have seen the doctor's office <b> ${data.doctor} </b>, you can review the billing details from this email attachment. </h4>
        <div>The password for extracting attachments has the following form: <i>Full name without accent - 3 digits first phone number - last 2 digits of your birth year</div>
        <br>
        <div>For example: Full name: Hary Pham, with the registered phone number: 0123456789 and born: 1910, the extracted password is: <b> harypham-012-10 </b> </div>
        <br>
        <div>In the event of neither receiving attachments nor decompressing, please contact the support operator<b>911 911</b></div>
        <h4>Thank you !</h4>`;
    },
};
export const transForgotPassword = {
    subject: "Password Recovery at Doctors Care",
    template: (data) => {
        return `<h3>We received a request to reset your password for your Doctors Care account</h3>
        <h4>Here are the details of your password recovery request:</h4>
        <div>Email: ${data.email}</div>
        <div>Time of request: ${data.requestTime}</div>
        <div>To reset your password, please click the link below:</div>
        <div><a href="${data.resetLink}">Reset Password</a></div>
        <h4>If you did not request this change, please ignore this email or contact support at <b>911 911</b> for assistance.</h4>
        <h4>Thank you for choosing Doctors Care!</h4>`;
    },
};

