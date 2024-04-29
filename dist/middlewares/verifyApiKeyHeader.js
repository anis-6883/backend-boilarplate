"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyApiKeyHeader = (req, res, next) => {
    const API_KEY = req.headers["x-api-key"];
    if (API_KEY !== process.env.API_KEY) {
        res.status(401).json({
            status: false,
            message: "Unauthorized: Please provide a valid API Key!",
        });
    }
    else {
        next();
    }
};
exports.default = verifyApiKeyHeader;
//# sourceMappingURL=verifyApiKeyHeader.js.map