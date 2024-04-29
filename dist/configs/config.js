"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const config = {
    development: {
        corsOptions: {
            origin: process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
            credentials: true,
        },
        databaseURI: process.env.DEV_DATABASE_URL,
        port: process.env.PORT || 8000,
        apiKey: process.env.API_KEY,
        appSecret: process.env.APP_SECRET,
        cookieName: "secret",
        useHTTP2: false,
        s3Options: {
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            region: process.env.AWS_REGIION,
            directory: process.env.AWS_BUCKET_DIRECTORY_NAME,
            mimeTypes: constants_1.MIME_TYPE,
            maxSize: 10240000,
        },
    },
    production: {
        corsOptions: {
            origin: process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
            credentials: true,
        },
        databaseURI: process.env.PROD_DATABASE_URL,
        port: process.env.PORT || 8000,
        apiKey: process.env.API_KEY,
        appSecret: process.env.APP_SECRET,
        cookieName: "secret",
        useHTTP2: true,
        s3Options: {
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            region: process.env.AWS_REGIION,
            directory: process.env.AWS_BUCKET_DIRECTORY_NAME,
            mimeTypes: constants_1.MIME_TYPE,
            maxSize: 10240000,
        },
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map