import express from "express";
import userAuthRoutes from "../modules/user/route";
import { fileUp } from "../controller/fileUp";
const router = express.Router();

router.use("/users", userAuthRoutes);

fileUp;

export default router;
