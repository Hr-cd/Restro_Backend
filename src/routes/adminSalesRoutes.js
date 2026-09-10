import express from "express";
import {
    getSalesSummary,
    getDailySalesReport,
    getWeeklySalesReport,
    getMonthlySalesReport,
    exportSalesToExcel
} from "../controllers/adminSalesController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, getSalesSummary);
router.get("/daily", protect, getDailySalesReport);
router.get("/weekly", protect, getWeeklySalesReport);
router.get("/monthly", protect, getMonthlySalesReport);
router.get("/export", protect, exportSalesToExcel); 

export default router;