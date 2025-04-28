import express from "express";
import { UserRouter } from "./user";
import { AuthRouter } from "./auth";
import { csrf } from "@/middleware/csrf";
import { authLimiter } from "@/utils/rateLimiter";

const router = express.Router();

// CSRF Protection
router.use(csrf);

router.use("/auth", authLimiter, AuthRouter);
router.use("/users", UserRouter);

export default router;
