"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUp = exports.ALLOWED_FILES_EXTENSIONS = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
// include all the files extensions that are allowed to upload.
exports.ALLOWED_FILES_EXTENSIONS = [];
const fileDir = path_1.default.join(process.cwd(), "files");
if (!fs_1.existsSync)
    (0, fs_1.mkdirSync)(fileDir);
// Use the function to upload files locally
async function fileUp(link) {
    if (!link)
        return null;
    const extIndex = link.lastIndexOf(".");
    if (extIndex === -1)
        throw new Error("Link does not contain a file extension.");
    const ext = link.substring(extIndex + 1);
    if (!exports.ALLOWED_FILES_EXTENSIONS.includes(ext.toLowerCase()))
        throw new Error("Invalid file extension.");
    const fileName = (0, crypto_1.randomBytes)(16).toString("hex") + "." + ext;
    const buffer = (0, fs_1.readFileSync)(link);
    const filePath = path_1.default.join(fileDir, fileName);
    (0, fs_1.writeFileSync)(filePath, buffer);
    return fileName;
}
exports.fileUp = fileUp;
//# sourceMappingURL=fileUp.js.map