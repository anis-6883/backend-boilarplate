import { Request, Response } from "express";
import { apiResponse, asyncHandler } from "../../helpers";
import { registerSchema } from "./validation";

export const userRegistration = asyncHandler((req: Request, res: Response) => {
  const result = registerSchema.validate(req.body, {
    allowUnknown: true,
    abortEarly: false,
  });

  // result ? res.status(200).send(result) : res.status(400).send(BAD_REQUEST)

  if (result.error) {
    const format: any = {};

    result.error.details.forEach((detail) => {
      format[detail.context.label] = detail.message;
    });

    // return apiResponse(res, 400, false, "Input validation failed!", format);
    return res.status(200);
  }

  return apiResponse(res, 200, true, "User Registration!");
});
