"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// use this if needed inside error middleware
// will be easy to define the api related error and finding if the error is processable or not
class HttpError extends Error {
    constructor(opts) {
        super(opts.detail);
        this.opts = opts;
        Error.captureStackTrace(this);
    }
    sendError(res) {
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
exports.default = HttpError;
//# sourceMappingURL=httpError.js.map