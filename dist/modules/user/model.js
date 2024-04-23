"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
    refreshToken: {
        type: String,
        default: null,
    },
    status: {
        type: Boolean,
        default: true,
    },
    userType: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    userRole: {
        type: String,
        enum: ["user", "super-admin", "admin", "manager"],
        default: "user",
    },
}, {
    timestamps: true,
    versionKey: false,
});
schema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.__v;
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    return JSON.parse(JSON.stringify(user).replace(/_id/g, "id"));
};
const User = mongoose_1.default.model("User", schema);
exports.default = User;
//# sourceMappingURL=model.js.map