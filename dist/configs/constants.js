"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BAD_REQUEST = exports.APP_SECRET = exports.EXPIRE_TIME = void 0;
exports.EXPIRE_TIME = 60 * 60 * 24 * 29 * 1000; // 29 Days
exports.APP_SECRET = process.env.APP_SECRET;
exports.BAD_REQUEST = { message: "Bad Request" };
//# sourceMappingURL=constants.js.map