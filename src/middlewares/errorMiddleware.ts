import { NextFunction, Request, Response } from "express";

const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.code && err.meta && err.meta.target ? 400 : 500;
  const message = err.message || "Internal Server Error!";

  res.status(status).json({ status: false, message });
};

export default errorMiddleware;
