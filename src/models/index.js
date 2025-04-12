// 'use strict';
// import dotenv from 'dotenv';
// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// dotenv.config();

// let sequelize;
// if (config.use_env_variable) {
//     sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//         host: process.env.DB_HOST,
//         dialect: 'mysql',
//         operatorsAliases: 0,
//         dialectOptions: {
//             dateStrings: true,
//             typeCast: true,
//             timezone: "+07:00"
//         },
//         timezone: "+07:00",
//         logging: false,
//     });

// } else {
//     sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//         host: process.env.DB_HOST,
//         dialect: 'mysql',
//         operatorsAliases: 0,
//         dialectOptions: {
//             dateStrings: true,
//             typeCast: true,
//             timezone: "+07:00",
//         },
//         timezone: "+07:00",
//         logging: false,
//     });

//     sequelize.authenticate().then(() => {
//         console.log('Connection to your databse has been established successfully.');
//     }).catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });
// }

// fs.readdirSync(__dirname).filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
// }).forEach(file => {
//     const model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
// });

// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//         db[modelName].associate(db);
//     }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// export default db;


'use strict';

import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url'; // Import pathToFileURL từ url module
import { dirname } from 'path';
import Sequelize from 'sequelize';

dotenv.config();

// Setup __dirname tương đương trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Đọc file config.json một cách an toàn
const configRaw = await readFile(path.join(__dirname, '../config/config.json'), 'utf-8');
const configJson = JSON.parse(configRaw);
const config = configJson[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        operatorsAliases: 0,
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
            timezone: "+07:00"
        },
        timezone: "+07:00",
        logging: false,
    });
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        operatorsAliases: 0,
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
            timezone: "+07:00"
        },
        timezone: "+07:00",
        logging: false,
    });

    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database successfully.');
    } catch (err) {
        console.error('❌ Unable to connect to the database:', err);
    }
}

// Load tất cả các model trong thư mục hiện tại
const modelFiles = fs.readdirSync(__dirname).filter(file =>
    file.indexOf('.') !== 0 && file !== basename && file.endsWith('.js')
);

for (const file of modelFiles) {
    const modulePath = pathToFileURL(path.join(__dirname, file)).href;  // Sử dụng pathToFileURL
    const module = await import(modulePath);  // Import mô-đun
    const model = module.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
}

// Gọi associate nếu có
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;