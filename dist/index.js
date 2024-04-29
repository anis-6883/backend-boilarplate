"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const server_1 = __importDefault(require("./configs/server"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./helpers/logger"));
const socket_1 = __importDefault(require("./controller/socket"));
const config_1 = __importDefault(require("./configs/config"));
const socketAuth_1 = require("./middlewares/socketAuth");
const mail_1 = __importDefault(require("./controller/mail"));
const bucket_1 = __importDefault(require("./controller/bucket"));
const redis_1 = __importDefault(require("./controller/redis"));
const serviceLocator_1 = __importDefault(require("./controller/serviceLocator"));
(async () => {
    try {
        const PORT = process.env.PORT || 8080;
        const env = process.env.NODE_ENV || "development";
        const wsMiddlewares = [socketAuth_1.socketAuth];
        let server;
        if (env === "development")
            server = http_1.default.createServer(server_1.default);
        else {
            const options = {
                key: (0, fs_1.readFileSync)(path_1.default.join(process.cwd(), "ssl", "privatekey.pem")), // paths can varry depending on environment
                cert: (0, fs_1.readFileSync)(path_1.default.join(process.cwd(), "ssl", "certificate.pem")), // paths can varry depending on environment
                allowHTTP1: true,
                protocols: ["h2", "http/1.1"],
            };
            server = https_1.default.createServer(options, server_1.default);
        }
        const socket = new socket_1.default(server, config_1.default[env].corsOptions);
        await socket.listen(wsMiddlewares);
        const mailer = new mail_1.default();
        mailer.createConnection();
        const aws = new bucket_1.default(config_1.default[env].s3Options);
        // const search = new SearchCtrl();
        // await search.start();
        const redis = new redis_1.default();
        // services push
        serviceLocator_1.default.registerService("mailer", mailer);
        serviceLocator_1.default.registerService("aws", aws);
        serviceLocator_1.default.registerService("redis", redis);
        serviceLocator_1.default.registerService("socket", socket.getSocket);
        // services.forEach((service) => ServiceLocator.registerService(service));
        server.listen(PORT, () => {
            logger_1.default.info(`=> Server listening on port ${PORT}`);
        });
    }
    catch (error) {
        logger_1.default.error("Error starting the server:", error.message);
    }
})();
//# sourceMappingURL=index.js.map