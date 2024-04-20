"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("../modules/admin/route"));
const router = express_1.default.Router();
router.use("/", route_1.default);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map