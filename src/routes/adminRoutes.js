import express from "express";
import {
    getDashboardStats
} from "../controllers/adminDashboardController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test", protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin route is protected",
        admin: req.admin
    });
});
router.get("/dashboard", protect, getDashboardStats);

export default router;