import express from 'express'
const router = express.Router()
import { registerFarm, validateSubDomain } from '../controllers/farmController.js'

router.route('/validate/subdomain').post(validateSubDomain)

export default router