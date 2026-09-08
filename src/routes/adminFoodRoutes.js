import express from "express";

import {
    getAdminFoodItems,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
    toggleFoodAvailability
} from "../controllers/adminFoodController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAdminFoodItems);

router.post("/", protect, createFoodItem);

router.put("/:id", protect, updateFoodItem);

router.delete("/:id", protect, deleteFoodItem);

router.patch(
    "/:id/availability",
    protect,
    toggleFoodAvailability
);

export default router;