"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("../modules/user/route"));
const router = express_1.default.Router();
router.use("/users", route_1.default);
exports.default = router;
//# sourceMappingURL=web.routes.js.map