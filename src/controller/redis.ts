import Redis from "ioredis";

export default class RedisUtils {
  private static instance: RedisUtils;
  private client!: Redis;

  constructor() {
    this.client = new Redis(
      "redis://default:ywzlMxu7APnImHZS62YOTiTRCSn4saFo@redis-14739.c273.us-east-1-2.ec2.redns.redis-cloud.com:14739"
    );
  }

  static getInstance() {
    if (!RedisUtils.instance) {
      RedisUtils.instance = new RedisUtils();
    }
    return RedisUtils.instance;
  }

  async setValue(key: string, value: string, ttl?: number) {
    await this.client.set(key, value);
    ttl && (await this.client.expire(key, ttl));
  }

  async existsValue(key: string) {
    return await this.client.exists(key);
  }

  async getExpirationTime(key: string) {
    return await this.client.ttl(key);
  }

  async storeHash(key: string, value: string, ttl?: number) {
    await this.client.hset(key, value);
    ttl && (await this.client.expire(key, ttl));
  }

  async getHash(key: string) {
    return await this.client.hgetall(key);
  }

  async increaseBy(key: string, subKey: string, value: number) {
    return await this.client.hincrby(key, subKey, value);
  }
}
