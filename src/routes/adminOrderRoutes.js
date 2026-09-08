import express from "express";

import {
    getAdminOrderById, 
    getAdminOrders,
    updateOrderStatus
} from "../controllers/adminOrderController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAdminOrders);
router.get("/:id", protect, getAdminOrderById);
router.put(
    "/orders/:id/status",
    protect,
    updateOrderStatus
);

export default router;