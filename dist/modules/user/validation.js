"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim().required().messages({
        "any.required": "firstName is required!",
        "string.base": "firstName must be string!",
    }),
    lastName: joi_1.default.string().trim().required().messages({
        "any.required": "lastName is required!",
        "string.base": "lastName must be string!",
    }),
    email: joi_1.default.string().email().trim().required().messages({
        "any.required": "email is required!",
        "string.base": "email must be string!",
        "string.email": "email must be valid format!",
    }),
    password: joi_1.default.string()
        .required()
        .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+{}|:\"<>?`~\\-=[\\]\\\\';,/])(?!.*\\s).{8,}$"))
        .messages({
        "any.required": "password is required!",
        "string.base": "password must be string!",
        "string.pattern.base": "At least 8 characters long with 1 uppercase, 1 lowercase, 1 digit & 1 symbol!",
    }),
});
//# sourceMappingURL=validation.js.map