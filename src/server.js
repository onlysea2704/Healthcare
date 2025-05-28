import dotenv from 'dotenv';//đọc biến môi trường từ .env
import express from "express"; //framework web chính
import configViewEngine from "./config/viewEngine.js"; //cấu hình hệ thống giao diện
import initRoutes from "./routes/web.js";//route cho hệ thống
import bodyParser from "body-parser";//hỗ trợ xử lý dữ liệu form và JSON từ client gửi lên
import cookieParser from 'cookie-parser';//đọc và ghi cookie
import flash from 'connect-flash';//để hiển thị thông báo flash
import methodOverride from 'method-override';//hỗ trợ phương thức http
import passPort from "passport";//xác thực người dùng
import sessionConfig from "./config/session.js";//cấu hình session thường dùng

dotenv.config();
let app = express();
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//config session
sessionConfig.configSession(app);


/*import * as vi from './lang/vi.js';
import * as en from './lang/en.js';

app.use((req, res, next) => {
    let langQuery = req.query.lang;
    let langCode = langQuery || 'en';

    // Bạn có thể dùng cookie để lưu lại nếu muốn nhớ
    if (!langQuery && req.cookies.lang) {
        langCode = req.cookies.lang;
    }

    // Gửi ngôn ngữ xuống client (view)
    res.locals.lang = langCode === 'vi' ? vi : en;
    res.locals.langCode = langCode;

    // Lưu cookie nếu có query
    if (langQuery) {
        res.cookie('lang', langCode, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // lưu 30 ngày
    }

    next();
});
import { languageMiddleware } from './middleware/languageMiddleware.js';*/

configViewEngine(app);//cho phép express hiển thị trang html thông qua view engine

// config Passportjs
app.use(passPort.initialize());
app.use(passPort.session());

initRoutes(app);

let port = process.env.PORT;
app.listen(port || 8080, () => console.log(`Doctors care app is running on port ${port}!`));
