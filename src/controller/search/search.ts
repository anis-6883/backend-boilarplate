import { create, insert, remove, search as oSearch } from "@orama/orama";
import { persistToFile, restoreFromFile } from "@orama/plugin-data-persistence";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { schemas } from "./schemas";
import logger from "../../helpers/logger";

type Schema = Record<string, Record<string, string>>;

interface SearchQuery {
  term?: string;
  properties?: string | string[];
}

export default class SearchCtrl {
  private readonly instances: Record<string, any>;
  private readonly cachePath: string;
  private readonly schemas: Schema;

  constructor() {
    this.instances = {};
    this.cachePath = path.join(process.cwd(), ".cache");
    this.schemas = schemas;
  }

  async restore(path: string): Promise<boolean | any> {
    try {
      console.log(restoreFromFile);
      return await restoreFromFile("binary", path);
    } catch (_err) {
      return false;
    }
  }

  async saveData(keys = Object.keys(this.schemas)): Promise<void[]> {
    return Promise.all(
      keys.map(async (key, i) => {
        await persistToFile(this.instances[key], "binary", path.join(this.cachePath, keys[i] + ".msp"));
      })
    );
  }

  async start(): Promise<void> {
    if (!existsSync(this.cachePath)) mkdirSync(this.cachePath);
    const keys = Object.keys(this.schemas);
    await Promise.all(
      keys.map(async (k) => {
        this.instances[k] =
          (await this.restore(path.join(this.cachePath, k + ".msp"))) || (await create({ schema: this.schemas[k] }));
      })
    );
    await this.saveData(keys);
    logger.info("=> Search controller started");
  }

  async insert(key: string, value: any): Promise<void> {
    await insert(this.instances[key], value);
  }

  async delete(key: string, id: string): Promise<void> {
    await remove(this.instances[key], id);
  }

  async search(key: string, query: SearchQuery): Promise<any> {
    const properties = Array.isArray(query.properties) ? query.properties : [query.properties || "*"];
    return await oSearch(this.instances[key], {
      ...query,
      term: query.term || "",
      properties: properties,
    });
  }
}
