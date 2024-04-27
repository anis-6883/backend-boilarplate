"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
class RedisUtils {
    constructor() {
        this.client = new ioredis_1.default();
    }
    static getInstance() {
        if (!RedisUtils.instance) {
            RedisUtils.instance = new RedisUtils();
        }
        return RedisUtils.instance;
    }
    async setValue(key, value, ttl) {
        await this.client.set(key, value);
        ttl && (await this.client.expire(key, ttl));
    }
    async existsValue(key) {
        return await this.client.exists(key);
    }
    async getExpirationTime(key) {
        return await this.client.ttl(key);
    }
    async storeHash(key, value, ttl) {
        await this.client.hset(key, value);
        ttl && (await this.client.expire(key, ttl));
    }
    async getHash(key) {
        return await this.client.hgetall(key);
    }
    async increaseBy(key, subKey, value) {
        return await this.client.hincrby(key, subKey, value);
    }
}
exports.default = RedisUtils;
//# sourceMappingURL=redis.js.map