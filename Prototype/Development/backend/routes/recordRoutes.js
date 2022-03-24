import express from "express";
import { addSupplyRecord } from "../controllers/recordController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for adding milk supply records
router.route("/supply/add").post(protect, addSupplyRecord);

export default router;
