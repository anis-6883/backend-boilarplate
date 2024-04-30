import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Response } from "express";
import helmet from "helmet";
import logger from "morgan";
import { parse } from "express-form-data";
import rateLimit from "express-rate-limit";
import actuator from "express-actuator";
import errorMiddleware from "../middlewares/errorMiddleware";
import verifyApiKeyHeader from "../middlewares/verifyApiKeyHeader";
import adminRoutes from "../routes/admin.routes";
import webRoutes from "../routes/web.routes";
import config from "./config";
import connectToDatabase from "./database";
const env = process.env.NODE_ENV || "development";

// Connect to MongoDB with Mongoose
connectToDatabase(config[env].databaseURI);

const app = express();

// Batteries Include
app.use(helmet());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(parse());
app.use(cors(config[env].corsOptions));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(actuator({ infoGitMode: "full" }));
app.use(verifyApiKeyHeader);
app.use(
  rateLimit({
    windowMs: 14 * 16 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "You have bombered the api!",
  })
);

// Home Route
app.get("/", (_, res: Response) => {
  return res.status(200).json({ message: "Assalamu Alaikum World!" });
});

// Main Routes
app.use("/api/v1", webRoutes); // web
app.use("/api/v1/admin", adminRoutes); // admin

// 404 Route
app.use((_, res: Response, _next: NextFunction) => {
  return res.status(404).json({ status: false, message: "Route not found" });
});

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
