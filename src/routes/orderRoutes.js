import express from "express";

import {
    createOrder,
    getOrderById,
    orderLimiter
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);

router.get("/:id", getOrderById);

router.post("/", orderLimiter, createOrder);

export default router;