import express from "express";
import { loginAdmin } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/login", loginLimiter, loginAdmin);

export default router;