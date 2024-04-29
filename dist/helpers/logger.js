"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslog_1 = require("tslog");
const rotating_file_stream_1 = require("rotating-file-stream");
const stream = (0, rotating_file_stream_1.createStream)("backend-server.log", {
    size: "10M",
    interval: "1d",
    compress: "gzip",
});
const logger = new tslog_1.Logger({
    name: "Backend-Server",
    type: "pretty",
    prettyLogTimeZone: "local",
    minLevel: 0,
    attachedTransports: [
        (logObj) => {
            stream.write(JSON.stringify(logObj) + "\n");
        },
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map