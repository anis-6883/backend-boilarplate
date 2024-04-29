"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogout = exports.adminLogin = exports.adminRegistration = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../../configs/constants");
const operations_1 = __importDefault(require("../../controller/operations"));
const helpers_1 = require("../../helpers");
const model_1 = __importDefault(require("../user/model"));
const validation_1 = require("./validation");
// Admin Registration
exports.adminRegistration = (0, helpers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, helpers_1.validateBody)(validation_1.registerSchema, req.body);
    if (!result)
        return (0, helpers_1.apiResponse)(res, 400, false, "Invalid Request!");
    const existingAdmin = yield operations_1.default.findOne({ email: req.body.email });
    if (existingAdmin)
        return (0, helpers_1.apiResponse)(res, 400, false, "User already exists!");
    req.body.password = yield bcrypt_1.default.hash(req.body.password, 10);
    const admin = yield operations_1.default.create({ table: model_1.default, key: Object.assign(Object.assign({}, req.body), { role: "admin" }) });
    const accessToken = (0, helpers_1.generateSignature)({ email: admin.email, role: admin.role }, "1d");
    const refreshToken = (0, helpers_1.generateSignature)({ email: admin.email, role: admin.role }, "7d");
    res.cookie(constants_1.COOKIE_KEY, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.cookie(constants_1.REFRESH_TOKEN_KEY, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return (0, helpers_1.apiResponse)(res, 200, true, "Admin Registration Successfully!", admin);
}));
// Admin Login
exports.adminLogin = (0, helpers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, helpers_1.validateBody)(validation_1.loginSchema, req.body);
    if (!result)
        return (0, helpers_1.apiResponse)(res, 400, false, "Invalid Request!");
    const admin = yield operations_1.default.findOne({ table: model_1.default, key: { email: req.body.email } });
    if (!admin)
        return (0, helpers_1.apiResponse)(res, 401, false, "User does not exist!");
    const isPasswordValid = yield bcrypt_1.default.compare(req.body.password, admin.password);
    if (!isPasswordValid)
        return (0, helpers_1.apiResponse)(res, 401, false, "Invalid Credentials!");
    const accessToken = (0, helpers_1.generateSignature)({ email: admin.email, role: admin.role }, "1d");
    const refreshToken = (0, helpers_1.generateSignature)({ email: admin.email, role: admin.role }, "7d");
    res.cookie(constants_1.COOKIE_KEY, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.cookie(constants_1.REFRESH_TOKEN_KEY, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return (0, helpers_1.apiResponse)(res, 200, true, "Admin Login Successfully!", admin);
}));
// Admin Logout
exports.adminLogout = (0, helpers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie(constants_1.COOKIE_KEY, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        expires: new Date(Date.now()),
    });
    res.clearCookie(constants_1.REFRESH_TOKEN_KEY, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        expires: new Date(Date.now()),
    });
    return (0, helpers_1.apiResponse)(res, 200, true, "Admin Logout Successfully!");
}));
//# sourceMappingURL=controller.js.map