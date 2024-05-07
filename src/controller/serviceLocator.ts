import logger from "../helpers/logger";

export default class ServiceLocator {
  private static services = new Map<string, any>();

  static registerService(name: string, service: any) {
    logger.info(`=> ${name.charAt(0).toUpperCase() + name.slice(1)} Registered`);
    this.services.set(name, service);
  }

  static getService(name: string) {
    if (!this.services.has(name)) throw new Error(`Service not registered: ${name}`);
    return this.services.get(name);
  }
}
