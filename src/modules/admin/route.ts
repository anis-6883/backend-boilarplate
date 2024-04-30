import express from "express";
import { adminLogin, adminLogout, adminRegistration, adminProfile } from "./controller";
import auth from "../../middlewares/authMiddleware";
const router = express.Router();

router.post("/login", adminLogin);
router.post("/register", adminRegistration);
router.post("/logout", adminLogout);
router.get("/profile", auth, adminProfile);
router.get("/refresh-token", auth, adminProfile);

export default router;
