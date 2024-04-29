"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const logger_1 = __importDefault(require("helpers/logger"));
async function auth(req, res, next) {
    try {
        const token = req?.cookies?.[process.env.COOKIE_KEY] || req.headers?.authorization?.replace("Bearer ", "");
        if (!token)
            return res.status(401).send("Unauthorized");
        const user = await (0, helpers_1.decodeAuthToken)(token);
        if (!user)
            return res.status(401).send("Unauthorized");
        req.token = token;
        req.user = user;
        return next();
    }
    catch (err) {
        logger_1.default.error(err);
        return res.status(401).send("Unauthorized");
    }
}
exports.default = auth;
//# sourceMappingURL=authMiddleware.js.map