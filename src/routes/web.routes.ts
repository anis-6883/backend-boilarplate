import express from "express";
import userAuthRoutes from "../modules/user/route";
const router = express.Router();

router.use("/users", userAuthRoutes);

export default router;
