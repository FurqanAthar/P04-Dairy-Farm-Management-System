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
    } else if (user) {
        res.status(401).json({ success: false, message: "Email Address already registered" });
    } else {
        // Register farm
        user = await User.create({ name, email, password, role: 'admin', cnic })
        farm = await Farm.create({ farmName, subdomain, users: [user._doc._id] });

        user = await User.findById(user._doc._id);

        if (user) {
            user.farmId = farm._doc._id;
            user.save()
            res.status(200).json({ success: true })
        }
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

const authenticateUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cnic: user.cnic,
        farmId: user.farmId,
        token: generateToken(user._id, user.farmId),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
})

const updateUserName = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      cnic: updatedUser.cnic,
      farmId: updatedUser.farmId,
      token: generateToken(updatedUser._id, updatedUser.farmId),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
})


export { registerFarm, validateSubDomain, authenticateUser, updateUserName };