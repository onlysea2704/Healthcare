//xử lý logic xác thực người dùng 
//như đăng nhập, đăng ký, xác minh tài khoản, đăng xuất và kiểm tra trạng thái đăng nhập. 

import { validationResult } from "express-validator";
import authService from "../services/authService.js";


//Hiển thị giao diện đăng nhập cho người dùng.
let getLogin = (req, res) => {
    return res.render("auth/login.ejs", {
        error: req.flash("error"),
    }); //Trả về trang đăng nhập (login.ejs). Hiển thị lỗi nếu có (req.flash("error")).
};


//Hiểu thị giao diện đăng kí cho người dùng
let getRegister = (req, res) => {
    return res.render("auth/register.ejs");
}; // chỉ render mỗi giao diện mà chưa truyền vào dữ liệu => form trống


//Xử lý dữ liệu khi người dùng gửi form đăng ký.
let postRegister = async (req, res) => {
    let hasErrors = validationResult(req).array({
        onlyFirstError: true
    });
    if (!hasErrors.length) {
        try {

            // await authService.register(req.body.name, req.body.rg_email, req.body.rg_password, req.protocol, req.get("host")).then(async (user) => {
            console.log(user);
            // res.redirect('login');
            // let linkVerify = `${req.protocol}://${req.get("host")}/verify/${user.local.verifyToken}`;
            // await authService.register({user}, linkVerify)
            // .then((message) => {
            //     req.flash("success", message);
            //     res.redirect('/login');
            // })
            // .catch((err) => {
            //     console.log(err);
            // });
            // }).catch((err) => {
            //     console.log(err);
            // });
        } catch (err) {
            req.flash("errors", err);
            res.render('/register', {
                oldData: req.body
            });
        }
    } else {
        let errEmail = '', errPassword = '', errPasswordConfirm = '';
        hasErrors.forEach((err) => {
            if (err.param === 'rg_email') errEmail = err.msg;
            if (err.param === 'rg_password') errPassword = err.msg;
            if (err.param === 'rg_password_again') errPasswordConfirm = err.msg;
        });
        res.render("auth/register", {
            errEmail: errEmail,
            errPassword: errPassword,
            errPasswordConfirm: errPasswordConfirm,
            hasErrors: hasErrors,
            oldData: req.body
        })
    }
};


//Xác thực tài khoản người dùng qua link chứa verifyToken.
let verifyAccount = async (req, res) => {
    let errorArr = [];
    let successArr = [];
    try {
        let verifySuccess = await auth.verifyAccount(req.params.token); //Lấy token 
        successArr.push(verifySuccess);  //xác minh token còn hiệu lực => xác thực thành công
        req.flash("success", successArr);
        return res.redirect("/login");

    } catch (error) {
        console.log(error);
    }
};

let getLogout = (req, res) => {
    req.session.destroy(function(err) {
        console.log(err);
        return res.redirect("/login");
    }); //Gọi req.session.destroy() để xoá session đăng nhập.

};


//Middleware kiểm tra người dùng đã đăng nhập hay chưa.
let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
}; //Nếu chưa đăng nhập (qua Passport.js): chuyển hướng đến /login.
//Nếu đã đăng nhập: gọi next() để tiếp tục đi đến route tiếp theo.


//Middleware kiểm tra nếu đã đăng nhập thì chuyển hướng đến trang dành cho user.
let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/users");
    }
    next();
};
const auth = {
    getLogin: getLogin,
    getRegister: getRegister,
    postRegister: postRegister,
    verifyAccount: verifyAccount,
    getLogout: getLogout,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut
};
export default auth;
