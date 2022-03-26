import express from "express";
import {
  addSupplyRecord,
  getSupplyRecord,
  getSupplyRecordById,
  updateSupplyRecordById,
} from "../controllers/recordController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for adding milk supply records
router.route("/supply/add").post(protect, addSupplyRecord);
router.route("/supply").get(protect, getSupplyRecord);
router.route("/supply/:id").get(protect, getSupplyRecordById);
router.route("/supply/update").put(protect, updateSupplyRecordById);

export default router;
