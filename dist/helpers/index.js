"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeOtpToken = exports.encodOtpToken = exports.decodeAuthToken = exports.generateOtp = exports.validateBody = exports.exclude = exports.excludeMany = exports.validatePassword = exports.generateSignature = exports.generatePassword = exports.generateSalt = exports.transformErrorsToMap = exports.apiResponse = exports.asyncHandler = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../configs/constants");
const logger_1 = __importDefault(require("./logger"));
const model_1 = __importDefault(require("modules/user/model"));
const asyncHandler = (func) => async (req, res) => {
    try {
        await func(req, res);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json(constants_1.SERVER_ERROR);
    }
};
exports.asyncHandler = asyncHandler;
const apiResponse = (res, statusCode, status, message, data) => {
    return res.status(statusCode).json({ status, message, data });
};
exports.apiResponse = apiResponse;
const transformErrorsToMap = (errors) => {
    const errorMap = {};
    errors.forEach((error) => {
        const { path, msg } = error;
        errorMap[path] = msg;
    });
    return errorMap;
};
exports.transformErrorsToMap = transformErrorsToMap;
const generateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.generateSalt = generateSalt;
const generatePassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.generatePassword = generatePassword;
const generateSignature = (payload, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, constants_1.APP_SECRET, { expiresIn });
};
exports.generateSignature = generateSignature;
const validatePassword = async (enteredPassword, savedPassword, salt) => {
    return (await (0, exports.generatePassword)(enteredPassword, salt)) === savedPassword;
};
exports.validatePassword = validatePassword;
const excludeMany = async (array, keys) => {
    let newArray = [];
    array?.map((item) => {
        const temp = { ...item._doc };
        for (let key of keys) {
            delete temp[key];
        }
        newArray.push(temp);
    });
    return newArray;
};
exports.excludeMany = excludeMany;
const exclude = (existingApp, keys) => {
    for (let key of keys) {
        delete existingApp[key];
    }
    return existingApp;
};
exports.exclude = exclude;
const validateBody = (schema, body) => {
    const result = schema.validate(body, {
        allowUnknown: true,
        abortEarly: false,
    });
    if (result.error)
        return false;
    return true;
    // if (result.error) {
    //   const format: any = {};
    //   result.error.details.forEach((detail: any) => {
    //     format[detail.context.label] = detail.message;
    //   });
    // }
};
exports.validateBody = validateBody;
const generateOtp = function (len) {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < len; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
exports.generateOtp = generateOtp;
const decodeAuthToken = async (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        const user = await model_1.default.findOne({ id: decoded?.id });
        if (!user)
            throw new Error("User not found");
        return user;
    }
    catch (err) {
        logger_1.default.error(err);
    }
};
exports.decodeAuthToken = decodeAuthToken;
const encodOtpToken = (email) => {
    const otp = (0, exports.generateOtp)(6);
    const validity = Date.now() + parseInt(process.env.OTP_VERIFICATION_DURATION);
    let token = jsonwebtoken_1.default.sign({ email, validity, otp }, process.env.SECRET);
    token = crypto_js_1.default.AES.encrypt(token, process.env.SECRET).toString();
    token = btoa(token);
    return token;
};
exports.encodOtpToken = encodOtpToken;
const decodeOtpToken = (encryptedToken, otp) => {
    try {
        let token = atob(encryptedToken);
        token = crypto_js_1.default.AES.decrypt(token, process.env.SECRET).toString(crypto_js_1.default.enc.Utf8);
        if (Date.now() - token.validity)
            return { valid: false, message: "OTP expired", email: token.email };
        if (token.otp.toString().trim() !== otp.trim())
            return { valid: false, message: "Invalid otp", email: undefined };
        return { valid: true, message: "OTP verified", email: token.email };
    }
    catch (err) {
        logger_1.default.error(err);
        return null;
    }
};
exports.decodeOtpToken = decodeOtpToken;
//# sourceMappingURL=index.js.map