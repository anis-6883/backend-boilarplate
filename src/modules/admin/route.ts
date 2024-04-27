import express from "express";
import { adminLogin, adminLogout, adminRegistration } from "./controller";
const router = express.Router();

router.post("/login", adminLogin);
router.post("/register", adminRegistration);
router.post("/logout", adminLogout);

export default router;
