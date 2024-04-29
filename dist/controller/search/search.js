"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orama_1 = require("@orama/orama");
const plugin_data_persistence_1 = require("@orama/plugin-data-persistence");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const schemas_1 = require("./schemas");
const logger_1 = __importDefault(require("../../helpers/logger"));
class SearchCtrl {
    constructor() {
        this.instances = {};
        this.cachePath = path_1.default.join(process.cwd(), ".cache");
        this.schemas = schemas_1.schemas;
    }
    async restore(path) {
        try {
            return await (0, plugin_data_persistence_1.restoreFromFile)("binary", path);
        }
        catch (_err) {
            return false;
        }
    }
    async saveData(keys = Object.keys(this.schemas)) {
        return Promise.all(keys.map(async (key, i) => {
            await (0, plugin_data_persistence_1.persistToFile)(this.instances[key], "binary", path_1.default.join(this.cachePath, keys[i] + ".msp"));
        }));
    }
    async start() {
        if (!(0, fs_1.existsSync)(this.cachePath))
            (0, fs_1.mkdirSync)(this.cachePath);
        const keys = Object.keys(this.schemas);
        await Promise.all(keys.map(async (k) => {
            this.instances[k] =
                (await this.restore(path_1.default.join(this.cachePath, k + ".msp"))) || (await (0, orama_1.create)({ schema: this.schemas[k] }));
        }));
        await this.saveData(keys);
        logger_1.default.info("=> Search controller started");
    }
    async insert(key, value) {
        await (0, orama_1.insert)(this.instances[key], value);
    }
    async delete(key, id) {
        await (0, orama_1.remove)(this.instances[key], id);
    }
    async search(key, query) {
        const properties = Array.isArray(query.properties) ? query.properties : [query.properties || "*"];
        return await (0, orama_1.search)(this.instances[key], {
            ...query,
            term: query.term || "",
            properties: properties,
        });
    }
}
exports.default = SearchCtrl;
//# sourceMappingURL=search.js.map