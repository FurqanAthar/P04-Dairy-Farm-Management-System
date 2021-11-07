import express from 'express'
const router = express.Router()
import {
  registerFarm,
  validateSubDomain,
  authenticateUser,
  updateUserName,
} from "../controllers/farmController.js";
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/validate/subdomain').post(validateSubDomain)
router.route('/register').post(registerFarm)
router.route('/login').post(authenticateUser)
router.route("/update/user/name").put(protect, updateUserName)

export default router