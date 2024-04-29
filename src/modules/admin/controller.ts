import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { IUser } from "types";
import { COOKIE_KEY, REFRESH_TOKEN_KEY } from "../../configs/constants";
import operations from "../../controller/operations";
import { apiResponse, asyncHandler, generateSignature, validateBody } from "../../helpers";
import User from "../user/model";
import { loginSchema, registerSchema } from "./validation";

// Admin Registration
export const adminRegistration = asyncHandler(async (req: Request, res: Response) => {
  const result = validateBody(registerSchema, req.body);
  if (!result) return apiResponse(res, 400, false, "Invalid Request!");

  const existingAdmin = await operations.findOne({ email: req.body.email });
  if (existingAdmin) return apiResponse(res, 400, false, "User already exists!");

  req.body.password = await bcrypt.hash(req.body.password, 10);

  const admin: IUser = await operations.create({ table: User, key: { ...req.body, role: "admin" } });

  const accessToken = generateSignature({ email: admin.email, role: admin.role }, "1d");
  const refreshToken = generateSignature({ email: admin.email, role: admin.role }, "7d");

  res.cookie(COOKIE_KEY, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return apiResponse(res, 200, true, "Admin Registration Successfully!", admin);
});

// Admin Login
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const result = validateBody(loginSchema, req.body);
  if (!result) return apiResponse(res, 400, false, "Invalid Request!");

  const admin: IUser = await operations.findOne({ table: User, key: { email: req.body.email } });
  if (!admin) return apiResponse(res, 401, false, "User does not exist!");

  const isPasswordValid = await bcrypt.compare(req.body.password, admin.password);
  if (!isPasswordValid) return apiResponse(res, 401, false, "Invalid Credentials!");

  const accessToken = generateSignature({ email: admin.email, role: admin.role }, "1d");
  const refreshToken = generateSignature({ email: admin.email, role: admin.role }, "7d");

  res.cookie(COOKIE_KEY, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return apiResponse(res, 200, true, "Admin Login Successfully!", admin);
});

// Admin Logout
export const adminLogout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie(COOKIE_KEY, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    expires: new Date(Date.now()),
  });

  res.clearCookie(REFRESH_TOKEN_KEY, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    expires: new Date(Date.now()),
  });

  return apiResponse(res, 200, true, "Admin Logout Successfully!");
});
