import { NextFunction, Response } from "express";
import { apiResponse, decodeAuthToken } from "../helpers";
import logger from "../helpers/logger";
import { ApiRequest } from "../types";
import { COOKIE_KEY } from "../configs/constants";

export default async function auth(req: ApiRequest, res: Response, next: NextFunction): Promise<any> {
  try {
    const token = req?.cookies?.[COOKIE_KEY] || req.headers?.authorization?.replace("Bearer ", "");
    if (!token) return apiResponse(res, 401, false, "Unauthorized!");
    const user = await decodeAuthToken(token);
    if (!user) return apiResponse(res, 401, false, "Unauthorized!");
    req.token = token;
    req.user = user;
    return next();
  } catch (err) {
    logger.error(err);
    return apiResponse(res, 401, false, "Unauthorized!");
  }
}
