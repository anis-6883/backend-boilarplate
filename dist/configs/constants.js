"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIME_TYPE = exports.REFRESH_TOKEN_KEY = exports.COOKIE_KEY = exports.SUCCESS = exports.NOT_FOUND = exports.UNAUTHORIZED = exports.SERVER_ERROR = exports.BAD_REQUEST = exports.APP_SECRET = exports.EXPIRE_TIME = void 0;
exports.EXPIRE_TIME = 60 * 60 * 24 * 29 * 1000; // 29 Days
exports.APP_SECRET = process.env.APP_SECRET;
exports.BAD_REQUEST = { message: "Bad Request" };
exports.SERVER_ERROR = { message: "Internal Server Error" };
exports.UNAUTHORIZED = { message: "Unauthorized" };
exports.NOT_FOUND = { message: "Not found" };
exports.SUCCESS = { message: "Action successful" };
exports.COOKIE_KEY = "boiler_plate";
exports.REFRESH_TOKEN_KEY = "boiler_plate_refresh";
exports.MIME_TYPE = [""];
//# sourceMappingURL=constants.js.map