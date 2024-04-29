import bcrypt from "bcrypt";
import { Request, Response } from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { APP_SECRET, SERVER_ERROR } from "../configs/constants";
import logger from "./logger";
import User from "../modules/user/model";

export const asyncHandler = (func: any) => async (req: Request, res: Response) => {
  try {
    await func(req, res);
  } catch (err) {
    console.log(err);
    return res.status(400).json(SERVER_ERROR);
  }
};

export const apiResponse = (res: Response, statusCode: number, status: boolean, message: string, data?: any) => {
  return res.status(statusCode).json({ status, message, data });
};

export const transformErrorsToMap = (errors: any[]) => {
  const errorMap: { [key: string]: string } = {};

  errors.forEach((error: { path: string; msg: string }) => {
    const { path, msg } = error;
    errorMap[path] = msg;
  });

  return errorMap;
};

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const generatePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const generateSignature = (payload: any, expiresIn: number | string) => {
  return jwt.sign(payload, APP_SECRET!, { expiresIn });
};

export const validatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
  return (await generatePassword(enteredPassword, salt)) === savedPassword;
};

export const excludeMany = async (array: any[], keys: any[]): Promise<any[]> => {
  let newArray: any[] = [];
  array?.map((item) => {
    const temp: any = { ...item._doc };
    for (let key of keys) {
      delete temp[key];
    }
    newArray.push(temp);
  });
  return newArray;
};

export const exclude = (existingApp: any, keys: any[]) => {
  for (let key of keys) {
    delete existingApp[key];
  }
  return existingApp;
};

export const validateBody = (schema: any, body: Object): Boolean => {
  const result = schema.validate(body, {
    allowUnknown: true,
    abortEarly: false,
  });

  if (result.error) return false;
  return true;
  // if (result.error) {
  //   const format: any = {};
  //   result.error.details.forEach((detail: any) => {
  //     format[detail.context.label] = detail.message;
  //   });
  // }
};

export const generateOtp = function (len: number): string {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < len; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
};

export const decodeAuthToken = async (token: string) => {
  try {
    const decoded: any = jwt.verify(token, process.env.SECRET!);
    const user = await User.findOne({ id: decoded?.id });
    if (!user) throw new Error("User not found");
    return user;
  } catch (err) {
    logger.error(err);
  }
};

export const encodOtpToken = (email: string): string => {
  const otp = generateOtp(6);
  const validity = Date.now() + parseInt(process.env.OTP_VERIFICATION_DURATION!);
  let token = jwt.sign({ email, validity, otp }, process.env.SECRET!);
  token = CryptoJS.AES.encrypt(token, process.env.SECRET!).toString();
  token = btoa(token);
  return token;
};

export const decodeOtpToken = (encryptedToken: string, otp: string) => {
  try {
    let token: any = atob(encryptedToken);
    token = CryptoJS.AES.decrypt(token, process.env.SECRET!).toString(CryptoJS.enc.Utf8);
    if (Date.now() - token.validity) return { valid: false, message: "OTP expired", email: token.email };
    if (token.otp.toString().trim() !== otp.trim()) return { valid: false, message: "Invalid otp", email: undefined };
    return { valid: true, message: "OTP verified", email: token.email };
  } catch (err) {
    logger.error(err);
    return null;
  }
};
