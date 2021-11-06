import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import Farm from '../models/farmModel.js'

const registerFarm = asyncHandler(async(req, res) => {
    const { farmName, subdomain, name, email, cnic, password } = req.body

    const farm = await Farm.findOne({ subdomain })
    const user = await User.findOne({ email })

    if (farm) {
        res.status(401)
        throw new Error('Sub-domain Already In Use')
    } else if (user) {
        res.status(401)
        throw new Error('Email Already Registered')
    }

    // Register farm
    const user = await User.create({ name, email, password, role: 'admin', cnic })
    console.log(user)

})