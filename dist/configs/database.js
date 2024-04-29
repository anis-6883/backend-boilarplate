"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../helpers/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDatabase = async (databaseURL) => {
    try {
        await mongoose_1.default.connect(databaseURL);
        logger_1.default.info("=> Connected to MongoDB Database!");
    }
    catch (error) {
        logger_1.default.error("Error connecting to MongoDB:", error.stack);
        throw error;
    }
};
exports.default = connectToDatabase;
//# sourceMappingURL=database.js.map