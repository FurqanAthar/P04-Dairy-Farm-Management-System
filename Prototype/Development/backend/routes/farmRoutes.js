import express from 'express'
const router = express.Router()
import {
  registerFarm,
  validateSubDomain,
  authenticateUser,
  updateUserName,
  addAnimal,
  getAnimalsData
} from "../controllers/farmController.js";
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/validate/subdomain').post(validateSubDomain)
router.route('/register').post(registerFarm)
router.route('/login').post(authenticateUser)
router.route("/update/user/name").put(protect, updateUserName)
router.route("/animals/add").post(protect, addAnimal)
router.route("/animals").get(protect, getAnimalsData)

export default router