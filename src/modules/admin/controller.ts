import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { BAD_REQUEST, COOKIE_KEY, NOT_FOUND, REFRESH_TOKEN_KEY } from "../../configs/constants";
import operations from "../../controller/operations";
import { asyncHandler, generateSignature, validateBody } from "../../helpers";
import User from "../user/model";
import { loginSchema, registerSchema } from "./validation";

// Admin Registration
export const adminRegistration = asyncHandler(async (req: Request, res: Response) => {
  const result = validateBody(registerSchema, req.body);
  if (!result) return res.status(400).json(BAD_REQUEST);

  const existingAdmin = await operations.findOne({ email: req.body.email });
  if (existingAdmin) return res.status(400).json({ message: "This email already exist!" });

  req.body.password = await bcrypt.hash(req.body.password, 10);

  const admin: any = await operations.create({ table: User, key: req.body });

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

  return res.status(200).json(admin);
});

// Admin Login
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const result = validateBody(loginSchema, req.body);
  if (!result) return res.status(400).json(BAD_REQUEST);

  const admin = await operations.findOne({ table: User, key: { email: req.body.email } });
  if (!admin) return res.status(401).json(NOT_FOUND);

  const isPasswordValid = await bcrypt.compare(req.body.password, admin.password);
  if (!isPasswordValid) return res.status(400).json({ message: "Password is invalid" });

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

  return res.status(200).json(admin);
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

  return res.status(200).json({ message: "Logged out successfully" });
});
