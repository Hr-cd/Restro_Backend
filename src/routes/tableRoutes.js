import express from "express";

import { resolveTable } from "../controllers/tableController.js";

const router = express.Router();

router.get("/resolve", resolveTable);

export default router;