import { Request, Response } from "express";
import { apiResponse, asyncHandler, decodeAuthToken } from "../../helpers";
import { COOKIE_KEY } from "../../configs/constants";

export const userRegistration = asyncHandler((_req: Request, res: Response) => {
  return apiResponse(res, 200, true, "User Registration!");
});

export const authCheck = asyncHandler(async (req: Request, res: Response) => {
  const token = req?.cookies?.[COOKIE_KEY] || req.headers?.authorization?.replace("Bearer ", "");
  if (!token) return apiResponse(res, 401, false, "Unauthorized!");
  const user = await decodeAuthToken(token);
  if (!user) return apiResponse(res, 401, false, "Unauthorized!");

  return apiResponse(res, 200, true, "Authorized!", user);
});
