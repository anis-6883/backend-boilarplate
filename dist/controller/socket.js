"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../helpers/logger"));
const socket_io_1 = require("socket.io");
class SocketManager {
    constructor(server, options) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: options.origin,
                credentials: true,
                methods: ["GET", "POST"],
            },
        });
        logger_1.default.info("=> Socket.io initialized");
    }
    get getSocket() {
        return this.io;
    }
    // listen(...middlewares: ((socket: Socket, next: (err?: Error) => void) => void)[]) {
    listen(middlewares) {
        return new Promise((resolve, reject) => {
            try {
                for (let middleware of middlewares) {
                    this.io.use(middleware);
                }
                resolve(true);
                this.io.on("connection", async (ws) => {
                    logger_1.default.info("Connected =>", ws.id);
                    ws.on("disconnect", () => logger_1.default.info("Disconnected =>", ws.id));
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.default = SocketManager;
//# sourceMappingURL=socket.js.map