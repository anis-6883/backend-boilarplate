import { NextFunction, Response } from "express";
import { ApiRequest } from "types";

export default function (allowed: string[]) {
  return async (req: ApiRequest, _res: Response, next: NextFunction): Promise<void> => {
    if (req.user && allowed.includes(req?.user?.role)) return next();
    else throw new Error("Unauthorized.");
  };
}
