import express from 'express'
const router = express.Router()

router.route('/register').post(registerAccount)