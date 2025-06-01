import nodeMailer from "nodemailer";

import dotenv from 'dotenv';
dotenv.config();

let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

let sendEmailNormal = (to, subject, htmlContent) => {
    console.log("Đã Gửi Mail")
    let options = {
        from: process.env.MAIL_USERNAME,
        to: to,
        subject: subject,
        html: htmlContent
    };
    return transporter.sendMail(options);
};

let sendEmailWithAttachment = (to, subject, htmlContent, filename, path) => {
        let options = {
            from: process.env.MAIL_USERNAME,
            to: to,
            subject: subject,
            html: htmlContent,
            attachments: [
                {
                    filename: filename,
                    path: path
                }
            ]
        };
        return transporter.sendMail(options);
    }
;
const mailer = {
    sendEmailNormal,
    sendEmailWithAttachment
};
export default mailer;