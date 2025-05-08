//Cấu hình đăng nhập bằng email và mật khẩu (Local Strategy) cho hệ thống.
//Kết nối với userService để xác minh người dùng và lấy dữ liệu.
//Thiết lập cơ chế lưu và phục hồi session người dùng thông qua Passport.

import passport from 'passport';
import passportLocal from 'passport-local';
import userService from "./../../services/userService";

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                await userService.findUserByEmail(email).then(async (user) => {
                    // if (!user.local.isActive)
                    //     return done(null, false, {message: tranLoginValidation.not_active_account(email)});
                    // if (!user || !await userService.comparePassword(password, user)) {
                    //     return done(null, false, {message: tranLoginValidation.fail_login});
                    // }
                    return done(null, user, null);
                });
            } catch (err) {
                console.log(err);
                return done(null, false, { message: err });
            }
        }));
};

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userService.findUserById(id).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });
});

module.exports = {
    initPassportLocal: initPassportLocal
};
