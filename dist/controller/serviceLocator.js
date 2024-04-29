"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../helpers/logger"));
class ServiceLocator {
    static registerService(name, service) {
        logger_1.default.info(`=> ${name.charAt(0).toUpperCase() + name.slice(1)} registered`);
        this.services.set(name, service);
    }
    static getService(name) {
        if (!this.services.has(name))
            throw new Error(`Service not registered: ${name}`);
        return this.services.get(name);
    }
}
ServiceLocator.services = new Map();
exports.default = ServiceLocator;
//# sourceMappingURL=serviceLocator.js.map