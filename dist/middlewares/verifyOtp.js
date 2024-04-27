"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const logger_1 = __importDefault(require("helpers/logger"));
const model_1 = __importDefault(require("modules/user/model"));
async function verifyOtp(req, res, next) {
    try {
        const otp = req.body || undefined;
        if (!otp)
            return res.status(400).send("OTP is required.");
        const token = req?.cookies?.[process.env.OTP_COOKIE_KEY] || req?.headers?.["token"];
        if (!token)
            return res.status(401).send("Unauthorized");
        const { valid, message, email } = (0, helpers_1.decodeOtpToken)(token, otp);
        if (!valid)
            return res.status(401).send(message);
        const user = await model_1.default.findOne({ email });
        if (!user)
            return res.status(404).send("User not found");
        req.user = user;
        req.otp = otp;
        req.token = token;
        return next();
    }
    catch (err) {
        logger_1.default.error(err);
        return res.status(401).send("Unauthorized");
    }
}
exports.default = verifyOtp;
//# sourceMappingURL=verifyOtp.js.map