import express from "express";

import {
    getTables,
    createTable,
    updateTable,
    deleteTable,
    toggleTableStatus
} from "../controllers/adminTableController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTables);

router.post("/", protect, createTable);

router.put("/:id", protect, updateTable);

router.delete("/:id", protect, deleteTable);

router.patch("/:id/status", protect, toggleTableStatus);

export default router;