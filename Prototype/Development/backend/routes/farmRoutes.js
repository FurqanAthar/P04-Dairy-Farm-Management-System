import express from "express";
const router = express.Router();
import {
  addWorker,
  editWorker,
  getWorkers,
  registerFarm,
  validateSubDomain,
  authenticateUser,
  updateUserName,
  updateUserPassword,
  updateUserImage,
  addAnimal,
  deleteAnimal,
  getAnimalsData,
  updateAnimalData,
  getAnimalData,
  addMilkRecord,
  getMilkRecords,
  addMember,
  deleteMember,
  getMembers,
  updateRateList,
  getRateList,
} from "../controllers/farmController.js";

import {
  getItemData,
  addInventoryItem,
  addItemTransaction,
  addInventoryCategory,
  deleteItemTransaction,
  getInventoryCategories,
} from "../controllers/inventoryController.js";

import {
  addInvoice,
  getInvoices,
} from "../controllers/expenseController.js";

import { 
  protect,
  admin 
} from "../middleware/authMiddleware.js";

router.route("/validate/subdomain").post(validateSubDomain);
router.route("/register").post(registerFarm);
router.route("/login").post(authenticateUser);

router.route("/user/update/name").put(protect, updateUserName);
router.route("/user/update/password").put(protect, updateUserPassword);
router.route("/user/update/image").put(protect, updateUserImage);

router.route("/member/add").post(protect, addMember);
router.route("/member/delete").post(protect, deleteMember);
router.route("/teamMembers").get(protect, getMembers);
router.route("/update/user/name").put(protect, updateUserName);
router.route("/animals/add").post(protect, addAnimal);
router.route("/animals/delete").post(protect, deleteAnimal);
router.route("/animals").get(protect, getAnimalsData);
router.route("/productions/add").post(protect, addMilkRecord);
router.route("/productions").get(protect, getMilkRecords);

router.route("/worker/add").post(protect, addWorker);
router.route("/worker/edit").put(protect, editWorker);
router.route("/workers").get(protect, getWorkers);

router.route("/animals/add").post(protect, addAnimal);
router.route("/animals/delete").post(protect, deleteAnimal);
router.route("/animals/:id").get(protect, getAnimalData);
router.route("/animals/update").put(protect, updateAnimalData);
router.route("/animals").get(protect, getAnimalsData);

router.route("/productions/add").post(protect, addMilkRecord);
router.route("/productions").get(protect, getMilkRecords);

// Inventory Routes
router.route("/inventory/category/add").post(protect, addInventoryCategory);
router.route("/inventory/category").get(protect, getInventoryCategories);
router.route("/inventory/item/add").post(protect, addInventoryItem);
router
  .route("/inventory/item/transaction/add")
  .post(protect, addItemTransaction);
router
  .route("/inventory/item/transaction/delete")
  .post(protect, deleteItemTransaction);
router.route("/inventory/item/:id").get(protect, getItemData);

// Expense Routes
router.route("/expense/getInvoices").get(protect, getInvoices);
router.route("/expense/addInvoice").post(protect, addInvoice);


// Miscellaneous Routes
router.route("/miscellaneous/rate/update").put(protect, updateRateList);
router.route("/miscellaneous/rate").get(protect, getRateList);

export default router;
