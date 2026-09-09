import express from "express";

import {
    getAdminOrderById, 
    getAdminOrders,
    updateOrderStatus
} from "../controllers/adminOrderController.js";
import {
    getOrdersByTable
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAdminOrders);
router.get("/:id", protect, getAdminOrderById);
router.get("/table/:tableId", protect, getOrdersByTable);
router.put(
    "/:id/status",
    protect,
    updateOrderStatus
);

export default router;