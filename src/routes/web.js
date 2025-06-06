import express from "express";
import home from "./../controllers/homeController.js";
import auth from "./../controllers/authController.js";
import admin from "./../controllers/adminController.js";
import doctor from "./../controllers/doctorController.js";
import supporter from "./../controllers/supporterController.js";
import clinic from "./../controllers/clinicController.js";
import bot from "./../controllers/botFBController.js";
import passport from "passport";
import passportLocal from 'passport-local';
import userService from "./../services/userService.js";
import multer from 'multer';
const upload = multer();

let router = express.Router();

let LocalStrategy = passportLocal.Strategy;

//Sử dụng Local Strategy để xác thực bằng email và mật khẩu.
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            await userService.findUserByEmail(email).then(async (user) => {
                if (!user) {
                    return done(null, false, req.flash("error", "Email không tồn tại"));
                }
                if (user && user.isActive === 1) {
                    let match = await userService.comparePassword(password, user);
                    if (match) {
                        return done(null, user, null)
                    } else {
                        return done(null, false, req.flash("error", "Mật khẩu không chính xác")
                        )
                    }
                }
                if (user && user.isActive === 0) {
                    return done(null, false, req.flash("error", "Tài khoản chưa được kích hoạt"));
                }
            });
        } catch (err) {
            console.log(err);
            return done(null, false, { message: err });
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
}); //lưu ID người dùng vào session

passport.deserializeUser((id, done) => {
    userService.findUserById(id).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });// dùng id để lấy thông tin người dùng mỗi lần truy cập
});

//định nghĩa các route 
let initRoutes = (app) => {
    router.get("/all-clinics", home.getPageAllClinics);
    router.get("/all-doctors", home.getPageAllDoctors);
    router.get("/all-specializations", home.getPageAllSpecializations);

    router.get('/webhook', bot.getWebhookFB);
    router.post('/webhook', bot.postWebhookFB);

    router.get("/set-up-bot-facebook", bot.getSetupBotFBPage);
    router.post("/set-up-bot-facebook", bot.handleSetupBotFBPage);
    router.get("/booking-online-messenger", bot.getBookingOnlineMessengerPage);
    router.post("/set-info-booking-online-messenger", bot.setInfoBookingMessenger);

    router.get('/feedback/:id', home.getFeedbackPage);
    router.post('/feedback/create', home.postCreateFeedback);

    router.get('/for-patients', home.getPageForPatients);
    router.get('/for-doctors', home.getPageForDoctors);

    router.post('/search-homepage', home.postSearchHomePage);
    router.get('/get-geocode', home.getGeocode);

    router.get('/', home.getHomePage);
    router.get('/contact', home.getContactPage);
    router.get('/detail/specialization/:id', home.getDetailSpecializationPage);
    router.get('/detail/doctor/:id', home.getDetailDoctorPage);

    router.post('/booking-doctor-without-files/create', home.postBookingDoctorPageWithoutFiles);
    router.post('/booking-doctor-normal/create', home.postBookingDoctorPageNormal);

    router.get('/detail/post/:id', home.getDetailPostPage);
    router.get('/detail/clinic/:id', home.getDetailClinicPage);
    router.get('/booking-info/:id', home.getInfoBookingPage);

    router.get('/all-posts', home.getPostsWithPagination);
    router.get('/posts/search/', home.getPostSearch);

    router.get('/users/manage/specialization', auth.checkLoggedIn, admin.getSpecializationPage);
    router.get('/users/manage/supporter', auth.checkLoggedIn, admin.getSupporterPage);
    router.get('/users', auth.checkLoggedIn, home.getUserPage);

    router.get('/users/manage/bot', auth.checkLoggedIn, admin.getManageBotPage);
    router.get('/users/manage/schedule-for-doctors', auth.checkLoggedIn, admin.getManageCreateScheduleForDoctorsPage);

    router.get('/users/manage/doctor', auth.checkLoggedIn, admin.getManageDoctor);
    router.get('/users/manage/doctor/create', auth.checkLoggedIn, admin.getCreateDoctor);
    router.get('/users/manage/supporter/create', auth.checkLoggedIn, admin.getCreateSupporter);
    router.post('/admin/doctor/create', auth.checkLoggedIn, admin.postCreateDoctor);
    router.post('/admin/supporter/create', auth.checkLoggedIn, admin.postCreateSupporter);
    router.get('/users/doctor/edit/:id', auth.checkLoggedIn, admin.getEditDoctor);
    router.get('/users/supporter/edit/:id', auth.checkLoggedIn, admin.getEditSupporter);
    router.put('/admin/doctor/update-without-file', auth.checkLoggedIn, admin.putUpdateDoctorWithoutFile);
    router.put('/admin/doctor/update', auth.checkLoggedIn, admin.putUpdateDoctor);
    router.put('/admin/supporter/update-without-file', auth.checkLoggedIn, admin.putUpdateSupporterWithoutFile);
    router.put('/admin/supporter/update', auth.checkLoggedIn, admin.putUpdateSupporter);
    router.put('/admin/user/update-without-file', auth.checkLoggedIn, admin.putUpdateUserWithoutFile);
    router.put('/admin/user/update', auth.checkLoggedIn, admin.putUpdateUser);
    router.put('/admin/user/update-password', auth.checkLoggedIn, admin.putUpdatePassword);

    router.get('/users/manage/clinic', auth.checkLoggedIn, admin.getManageClinic);
    router.get('/users/manage/clinic/create', auth.checkLoggedIn, admin.getCreateClinic);
    router.get('/users/manage/specialization/create', auth.checkLoggedIn, admin.getCreateSpecialization);
    router.post('/admin/clinic/create', auth.checkLoggedIn, admin.postCreateClinic);
    router.post('/admin/specialization/create', auth.checkLoggedIn, admin.postCreateSpecialization);
    router.post('/admin/clinic/create-without-file', auth.checkLoggedIn, admin.postCreateClinicWithoutFile);

    router.put('/admin/clinic/update-without-file', auth.checkLoggedIn, admin.putUpdateClinicWithoutFile);
    router.put('/admin/clinic/update', auth.checkLoggedIn, admin.putUpdateClinic);
    router.put('/admin/specialization/update-without-file', auth.checkLoggedIn, admin.putUpdateSpecializationWithoutFile);
    router.put('/admin/specialization/update', auth.checkLoggedIn, admin.putUpdateSpecialization);
    router.get('/users/clinic/edit/:id', auth.checkLoggedIn, admin.getEditClinic);
    router.get('/users/specialization/edit/:id', auth.checkLoggedIn, admin.getEditSpecialization);

    router.get('/doctor/manage/schedule', doctor.getSchedule);
    router.get('/doctor/manage/schedule/create', auth.checkLoggedIn, doctor.getCreateSchedule);
    router.post('/doctor/manage/schedule/delete', auth.checkLoggedIn, doctor.deleteSchedule);
    router.post('/doctor/manage/schedule/create', auth.checkLoggedIn, doctor.postCreateSchedule);
    router.post('/doctor/get-schedule-doctor-by-date', doctor.getScheduleDoctorByDate);
    router.get('/doctor/manage/appointment', auth.checkLoggedIn, doctor.getManageAppointment);
    router.get('/doctor/manage/chart', auth.checkLoggedIn, doctor.getManageChart);
    router.post('/doctor/manage/create-chart', auth.checkLoggedIn, doctor.postCreateChart);
    router.post('/doctor/send-forms-to-patient', auth.checkLoggedIn, doctor.postSendFormsToPatient);
    router.post('/doctor/auto-create-all-doctors-schedule', auth.checkLoggedIn, doctor.postAutoCreateAllDoctorsSchedule)

    router.get('/supporter/manage/customers', auth.checkLoggedIn, supporter.getManageCustomersPage);
    router.get('/supporter/get-new-patients', auth.checkLoggedIn, supporter.getNewPatients);
    router.get('/supporter/manage/posts', auth.checkLoggedIn, supporter.getManagePosts);
    router.get('/supporter/pagination/posts', supporter.getPostsPagination);
    router.get('/supporter/post/edit/:id', auth.checkLoggedIn, admin.getEditPost);
    router.put('/supporter/post/update', auth.checkLoggedIn, admin.putUpdatePost);
    router.get('/supporter/manage/post/create', auth.checkLoggedIn, supporter.getCreatePost);
    router.post('/supporter/manage/post/create', auth.checkLoggedIn, supporter.postCreatePost);
    router.get('/supporter/get-list-posts', auth.checkLoggedIn, supporter.getAllPosts);
    router.post('/supporter/get-patients-for-tabs', auth.checkLoggedIn, supporter.getForPatientsTabs);
    router.post('/supporter/change-status-patient', auth.checkLoggedIn, supporter.postChangeStatusPatient);
    router.post('/supporter/get-logs-patient', auth.checkLoggedIn, supporter.getLogsPatient);
    router.post('/supporter/done-comment', auth.checkLoggedIn, supporter.postDoneComment);

    router.post('/api/get-info-doctor-by-id', doctor.getInfoDoctorById);
    router.post('/api/get-info-supporter-by-id', doctor.getInfoSupporterById);
    router.post('/api/get-info-clinic-by-id', clinic.getInfoClinicById);
    router.post('/api/get-info-specialization-by-id', clinic.getInfoSpecializationById);
    router.post('/api/get-detail-patient-by-id', home.getDetailPatientBooking);
    router.post('/api/create-contact-colab', home.createContactColab);

    router.delete('/admin/delete/clinic', auth.checkLoggedIn, admin.deleteClinicById);
    router.delete('/admin/delete/doctor', auth.checkLoggedIn, admin.deleteDoctorById);
    router.delete('/admin/delete/supporter', auth.checkLoggedIn, admin.deleteSupporterById);
    router.delete('/admin/delete/specialization', auth.checkLoggedIn, admin.deleteSpecializationById);
    router.delete('/admin/delete/post', auth.checkLoggedIn, admin.deletePostById);

    router.get("/login", auth.checkLoggedOut, auth.getLogin);

    router.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            // Redirect if it fails
            if (!user) {
                return res.redirect('/login');
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }

                req.session.save(() => {
                    // Redirect if it succeeds
                    return res.redirect('/users');
                });

            });
        })(req, res, next);
    });

    router.get('/register', auth.getRegister);
    router.post("/register",  auth.postRegister);
    // router.get("/verify/:token", auth.verifyAccount);

    router.get("/logout", auth.checkLoggedIn, auth.getLogout);

    router.post("/admin/statistical", auth.checkLoggedIn, admin.getInfoStatistical);

    return app.use("/", router);
};
export default initRoutes;


