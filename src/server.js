import dotenv from 'dotenv';
import express from "express";
import configViewEngine from "./config/viewEngine.js";
import initRoutes from "./routes/web.js";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import passPort from "passport";
import sessionConfig from "./config/session.js";

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

configViewEngine(app);

// config Passportjs
app.use(passPort.initialize());
app.use(passPort.session());

initRoutes(app);

let port = process.env.PORT;
app.listen(port || 8080, () => console.log(`Doctors care app is running on port ${port}!`));
