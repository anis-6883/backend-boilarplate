"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(allowed) {
    return async (req, _res, next) => {
        if (req.user && allowed.includes(req?.user?.role))
            return next();
        else
            throw new Error("Unauthorized.");
    };
}
exports.default = default_1;
//# sourceMappingURL=checkRole.js.map