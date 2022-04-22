import express from 'express'
const router = express.Router()
import {

  addCustomer,
  deleteCustomer,
  getCustomersData,
  getCustomerData,
  updateCustomerData,

} from "../controllers/customerController.js";
import { protect, admin } from '../middleware/authMiddleware.js'


// customer routes
router.route("/add").post(protect, addCustomer)
router.route("/delete").post(protect, deleteCustomer);
router.route("/:id").get(protect, getCustomerData);
router.route("").get(protect, getCustomersData);
router.route("/update").put(protect, updateCustomerData);


export default router