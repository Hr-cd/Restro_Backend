import express from "express";

import {
    getCategories,
    getFoodItems,
    getFoodItemById
} from "../controllers/menuController.js";

const router = express.Router();

router.get("/categories", getCategories);

router.get("/items", getFoodItems);

router.get("/items/:id", getFoodItemById);

export default router;