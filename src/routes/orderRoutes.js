import express from "express";

import {
    createOrder,
    getOrderById,
    orderLimiter
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/:id", getOrderById);

router.post("/", orderLimiter, createOrder);

export default router;