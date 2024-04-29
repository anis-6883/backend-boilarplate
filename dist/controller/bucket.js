"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const logger_1 = __importDefault(require("../helpers/logger"));
class S3Utils {
    constructor(options) {
        this.s3Options = options;
        this.s3 = new client_s3_1.S3Client({
            region: options.region,
            credentials: {
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey,
            },
        });
    }
    static getInstance(options) {
        if (!S3Utils.instance) {
            S3Utils.instance = new S3Utils(options);
        }
        return S3Utils.instance;
    }
    isAllowedMimeType(mime) {
        return this.s3Options.mimeTypes.includes(mime.toString());
    }
    isLargeFile(size) {
        return size > this.s3Options.maxSize;
    }
    getFileName(file, dir) {
        const extIndex = file.name.lastIndexOf(".");
        if (extIndex === -1)
            return undefined;
        const ext = file.name.substring(extIndex + 1);
        return dir + "/" + (0, crypto_1.randomBytes)(16).toString("hex") + "." + ext;
    }
    async uploadFile(file, dir) {
        try {
            const Key = this.getFileName(file, dir);
            const Body = (0, fs_1.readFileSync)(file.path);
            const params = {
                Bucket: this.s3Options.directory,
                Key,
                Body,
                ContentType: file.type,
            };
            const command = new client_s3_1.PutObjectCommand(params);
            await this.s3.send(command);
            return {
                url: `https://${this.s3Options.directory}.s3.amazonaws.com/${Key}`,
                key: Key,
            };
        }
        catch (err) {
            logger_1.default.error(err.stack);
            return null;
        }
    }
    async deleteFile(url, dir) {
        try {
            const keyIndex = url.lastIndexOf("/");
            const key = `${dir}/${url.substring(keyIndex + 1)}`;
            const params = {
                Bucket: this.s3Options.directory,
                Key: key,
            };
            const command = new client_s3_1.DeleteObjectCommand(params);
            await this.s3.send(command);
            return true;
        }
        catch (err) {
            logger_1.default.error(err);
            return false;
        }
    }
}
exports.default = S3Utils;
//# sourceMappingURL=bucket.js.map