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
const logger_1 = __importDefault(require("helpers/logger"));
const startServer = async () => {
    try {
        const PORT = process.env.PORT || 8080;
        let server;
        if (process.env.NODE_ENV === "development")
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
        server.listen(PORT, () => {
            logger_1.default.info(`=> Server listening on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error.message);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map