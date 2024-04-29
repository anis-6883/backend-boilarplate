"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuth = void 0;
const helpers_1 = require("../helpers");
const constants_1 = require("../configs/constants");
/**
 * This function is the middleware of socket auth.
 */
async function socketAuth(socket, next) {
    try {
        const token = (socket.handshake?.headers?.cookie || "")
            ?.split(";")
            ?.find((s) => s.includes(`${constants_1.COOKIE_KEY}=`))
            ?.replace(`${constants_1.COOKIE_KEY}=`, "")
            ?.replace(/\s/g, "") || socket.handshake?.headers?.[`${constants_1.COOKIE_KEY}`]?.replace("Bearer ", "");
        if (!token)
            return next();
        const user = await (0, helpers_1.decodeAuthToken)(token);
        if (!user)
            throw new Error("Unauthorized");
        socket.user = user;
        socket.join(user.id);
        // socket.join(user.role);
        next();
    }
    catch (e) {
        console.log(e);
        next(new Error("Unauthorized"));
    }
}
exports.socketAuth = socketAuth;
//# sourceMappingURL=socketAuth.js.map