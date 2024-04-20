import { NextFunction, Request, Response } from "express";
import { EXPIRE_TIME } from "../../configs/constants";
import { exclude, generatePassword, generateSalt, generateSignature, validatePassword } from "../../helpers";
import Admin from "../user/model";

// Admin Registration
export const adminRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.json({ status: false, message: "This email already exist!" });
    }

    const salt = await generateSalt();
    const hashedPassword = await generatePassword(password, salt);

    const newAdmin: any = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      salt: salt,
    });

    await newAdmin.save();

    const responseData = exclude(newAdmin._doc, ["__v", "password", "salt", "createdAt", "updatedAt"]);

    const accessToken = generateSignature({ email, role: "admin" }, 60 * 60 * 24); // 1 Day

    return res.json({
      status: true,
      message: "Admin Registered successfully!",
      data: { ...responseData, accessToken },
    });
  } catch (error) {
    next(error);
  }
};

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
