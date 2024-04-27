import { NextFunction, Response } from "express";
import { decodeOtpToken } from "helpers";
import logger from "helpers/logger";
import User from "modules/user/model";
import { ApiRequest } from "types";

export default async function verifyOtp(req: ApiRequest, res: Response, next: NextFunction): Promise<any> {
  try {
    const otp = req.body || undefined;
    if (!otp) return res.status(400).send("OTP is required.");
    const token = req?.cookies?.[process.env.OTP_COOKIE_KEY!] || req?.headers?.["token"];
    if (!token) return res.status(401).send("Unauthorized");
    const { valid, message, email } = decodeOtpToken(token, otp);
    if (!valid) return res.status(401).send(message);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    req.user = user;
    req.otp = otp;
    req.token = token;
    return next();
  } catch (err) {
    logger.error(err);
    return res.status(401).send("Unauthorized");
  }
}
