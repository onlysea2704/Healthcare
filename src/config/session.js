import dotenv from 'dotenv';
import express from 'express';
import Sequelize from 'sequelize';
import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';

// Khởi tạo Sequelize với session store
const SequelizeStore = connectSessionSequelize(session.Store);

let sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        storage: "./session.mysql",
        logging: false,

        dialectOptions: {
            "dateStrings": true,
            "typeCast": true,
            "timezone": "+07:00"
        },
        timezone: "+07:00"
    }
    );

let sessionStore = new SequelizeStore({
    db: sequelize
});

let configSession = (app) => {
    app.use(session({
        key: "express.sid",
        secret: "secret",
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie : { httpOnly: false, secure : false, maxAge : (24 * 60 * 60 * 1000)} // 1day
    }))
};

sessionStore.sync();

const sessionConfig = {
    configSession: configSession
};
export default sessionConfig;