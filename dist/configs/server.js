"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_2 = __importDefault(require("morgan"));
const express_form_data_1 = require("express-form-data");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_actuator_1 = __importDefault(require("express-actuator"));
const errorMiddleware_1 = __importDefault(require("../middlewares/errorMiddleware"));
const verifyApiKeyHeader_1 = __importDefault(require("../middlewares/verifyApiKeyHeader"));
const admin_routes_1 = __importDefault(require("../routes/admin.routes"));
const web_routes_1 = __importDefault(require("../routes/web.routes"));
const config_1 = __importDefault(require("./config"));
const database_1 = __importDefault(require("./database"));
const env = process.env.NODE_ENV || "development";
(0, database_1.default)(config_1.default[env].databaseURI);
const app = (0, express_1.default)();
// Batteries Include
app.use((0, helmet_1.default)());
app.use((0, morgan_2.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static("public"));
app.use((0, morgan_1.default)("common"));
app.use((0, express_form_data_1.parse)());
app.use((0, cors_1.default)(config_1.default[env].corsOptions));
app.use(express_1.default.json({ limit: "100kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "100kb" }));
app.use((0, express_actuator_1.default)({ infoGitMode: "full" }));
app.use((0, express_rate_limit_1.default)({
    windowMs: 14 * 16 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "You have bombered the api!",
}));
// Connect to MongoDB with Mongoose
// Home Route
app.get("/", (_, res) => {
    return res.status(200).json({ message: "Assalamu Alaikum World!" });
});
// Main Routes
app.use("/api/v1", verifyApiKeyHeader_1.default, web_routes_1.default); // web
app.use("/api/v1/admin", verifyApiKeyHeader_1.default, admin_routes_1.default); // admin
// 404 Route
app.use((_, res, _next) => {
    return res.status(404).json({ status: false, message: "Route not found" });
});
// Error Handling Middleware
app.use(errorMiddleware_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map