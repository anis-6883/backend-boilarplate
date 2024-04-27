import { NextFunction, Response } from "express";
import { decodeAuthToken } from "helpers";
import logger from "helpers/logger";
import { ApiRequest } from "types";

export default async function auth(req: ApiRequest, res: Response, next: NextFunction): Promise<any> {
  try {
    const token = req?.cookies?.[process.env.COOKIE_KEY!] || req.headers?.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).send("Unauthorized");
    const user = await decodeAuthToken(token);
    if (!user) return res.status(401).send("Unauthorized");
    req.token = token;
    req.user = user;
    return next();
  } catch (err) {
    logger.error(err);
    return res.status(401).send("Unauthorized");
  }
}
