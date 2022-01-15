import express from 'express'
const router = express.Router()
import {

  addCustomer,
} from "../controllers/customerController";
import { protect, admin } from '../middleware/authMiddleware.js'


// customer routes
router.route("/customer/add").post(protect, addCustomer)
export default router