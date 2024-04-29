import { Request, Response } from "express";
import { apiResponse, asyncHandler } from "../../helpers";

export const userRegistration = asyncHandler((_req: Request, res: Response) => {
  return apiResponse(res, 200, true, "User Registration!");
});
