import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import Farm from '../models/farmModel.js'

const registerFarm = asyncHandler(async(req, res) => {
    const { farmName, subdomain, name, email, cnic, password } = req.body

    let farm = await Farm.findOne({ subdomain })
    let user = await User.findOne({ email })

    if (farm) {
        res.status(401).json({ success: false, message: "Sub-domain Already In Use" });
        // throw new Error('Sub-domain Already In Use')
    } else if (user) {
        res.status(401).json({ success: false, message: "Email Address already registered" });
        // throw new Error('Email Already Registered')
    } else {
        // Register farm
        user = await User.create({ name, email, password, role: 'admin', cnic })
        farm = await Farm.create({ farmName, subdomain, users: [user._doc._id] });

        if (farm) {
            res.status(200).json({ success: true })
        }
        // console.log(user)
    }


})

const validateSubDomain = asyncHandler(async(req, res) => {
    const { subdomain } = req.body;
    const farm = await Farm.findOne({ subdomain });

    if (farm) {
    //   res.status(400);
      res.json({ success: false, message: "Sub-domain Already In Use" });
    } else {
        res.json({ success: true })
    }
})

export { registerFarm, validateSubDomain }