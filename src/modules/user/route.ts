import express from "express";
import { userRegistration } from "./controller";

const router = express.Router();

router.post("/register", userRegistration);

export default router;
