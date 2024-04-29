import { Request } from "express";
import mongoose from "mongoose";

export interface Config {
  [key: string]: {
    corsOptions: {
      origin: string[];
      credentials: boolean;
    };
    databaseURI: string;
    port: number | string;
    apiKey: string;
    appSecret: string;
    cookieName: string;
    useHTTP2: boolean;
    s3Options: S3BucketOptions;
  };
}

export interface ApiErrorInterface {
  code: number;
  title: string;
  detail: string;
}

enum Role {
  USER = "user",
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  MANAGER = "manager",
}

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  image?: string;
  refreshToken?: string;
  status: boolean;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  _id: mongoose.Types.ObjectId;
}

export interface ApiRequest extends Request {
  user?: User;
  otp?: string;
  token?: string;
}

export interface DecodedUser {
  id: string;
  email: string;
  role: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MailOptions {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html: string;
}

export interface S3BucketOptions {
  secretAccessKey: string;
  accessKeyId: string;
  region: string;
  directory: string;
  mimeTypes: string[];
  maxSize: number;
}

export interface S3UpdateResult {
  key?: string;
  url?: string;
}
