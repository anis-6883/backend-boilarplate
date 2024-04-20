import express from "express";
import { adminLogin, adminRegistration } from "./controller";
const router = express.Router();

router.post("/login", adminLogin);
router.post("/register", adminRegistration);

export default router;
