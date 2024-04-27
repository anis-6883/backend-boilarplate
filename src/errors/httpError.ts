import { Response } from "express";
import { ApiErrorInterface } from "types";

// use this if needed inside error middleware
// will be easy to define the api related error and finding if the error is processable or not
export default class HttpError extends Error {
  public readonly opts: ApiErrorInterface;

  constructor(opts: ApiErrorInterface) {
    super(opts.detail);
    this.opts = opts;
    Error.captureStackTrace(this);
  }

  sendError(res: Response) {
    return res.status(this.opts.code).json({
      errors: [
        {
          title: this.opts.title,
          detail: this.opts.detail,
          code: this.opts.code,
        },
      ],
    });
  }
}
