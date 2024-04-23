import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { EXPIRE_TIME } from "../../configs/constants";
import { asyncHandler, exclude, generateSignature, validatePassword } from "../../helpers";
import Admin from "../user/model";

// Admin Registration
export const adminRegistration = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // const { email, password, firstName, lastName } = req.body;

  const existingAdmin = await Admin.findOne({ email: req.body.email });

  if (existingAdmin) {
    return res.json({ status: false, message: "This email already exist!" });
  }

  req.body.password = await bcrypt.hash(req.body.password, 10);
  // generatePassword(req.body.password, salt);

  const newAdmin: any = new Admin(req.body);

  await newAdmin.save();

  // const responseData = exclude(newAdmin._doc, ["__v", "password", "salt", "createdAt", "updatedAt"]);

  const accessToken = generateSignature({ email: newAdmin.email, role: newAdmin.role }, 60 * 60 * 24); // 1 Day
  // cookie set with access token
  return res.json({
    status: true,
    message: "Admin Registered successfully!",
    data: { ...newAdmin, accessToken },
  });
});

// Admin Login
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const existingAdmin: any = await Admin.findOne({ email });

    if (!existingAdmin) {
      return res.json({ status: false, message: "Your credentials are incorrect!" });
    }

    const validPassword = await validatePassword(password, existingAdmin.password, existingAdmin.salt);

    if (!validPassword) {
      return res.json({ status: false, message: "Your credentials are incorrect!" });
    }

    const accessToken = generateSignature(
      {
        email: existingAdmin.email,
        role: existingAdmin.role,
      },
      60 * 60 * 24 * 30 // 30 Days
    );

    const refreshToken = generateSignature(
      {
        email: existingAdmin.email,
        role: existingAdmin.role,
      },
      60 * 60 * 24 * 60 // 60 Days
    );

    const admin = exclude(existingAdmin._doc, [
      "_id",
      "__v",
      "verify_code",
      "password",
      "salt",
      "forget_code",
      "createdAt",
      "updatedAt",
    ]);

    return res.json({
      status: true,
      message: "Admin Login Successfully!",
      data: {
        accessToken,
        refreshToken,
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        ...admin,
      },
    });
  } catch (error) {
    next(error);
  }
};
