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
        return res.status(400).json(constants_1.BAD_REQUEST);
    const existingAdmin = yield operations_1.default.findOne({ email: req.body.email });
    if (existingAdmin)
        return res.status(400).json({ message: "This email already exist!" });
    req.body.password = yield bcrypt_1.default.hash(req.body.password, 10);
    const admin = yield operations_1.default.create({ table: model_1.default, key: req.body });
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
    return res.status(200).json(admin);
}));
// Admin Login
exports.adminLogin = (0, helpers_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, helpers_1.validateBody)(validation_1.loginSchema, req.body);
    if (!result)
        return res.status(400).json(constants_1.BAD_REQUEST);
    const admin = yield operations_1.default.findOne({ table: model_1.default, key: { email: req.body.email } });
    if (!admin)
        return res.status(401).json(constants_1.NOT_FOUND);
    const isPasswordValid = yield bcrypt_1.default.compare(req.body.password, admin.password);
    if (!isPasswordValid)
        return res.status(400).json({ message: "Password is invalid" });
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
    return res.status(200).json(admin);
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
    return res.status(200).json({ message: "Logged out successfully" });
}));
//# sourceMappingURL=controller.js.map