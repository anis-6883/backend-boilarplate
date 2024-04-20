"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map