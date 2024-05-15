import { NextFunction, Request, Response } from "express";

const verifyApiKeyHeader = (req: Request, res: Response, next: NextFunction) => {
  const API_KEY = req.headers["x-api-key"];
  if (API_KEY !== process.env.API_KEY) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized: Please provide a valid API Key!",
    });
  }
  return next();
};

export default verifyApiKeyHeader;
