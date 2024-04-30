import express from "express";
import userAuthRoutes from "../modules/user/route";
import { authCheck } from "../modules/user/controller";
const router = express.Router();

router.get("/auth-check", authCheck);
router.use("/users", userAuthRoutes);

export default router;
