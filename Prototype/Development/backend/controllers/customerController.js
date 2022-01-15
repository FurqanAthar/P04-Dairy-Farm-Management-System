import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import Farm from '../models/farmModel.js'
import Customer from '../models/customerModel.js'

const addCustomer = asyncHandler(async(req, res) => {
    const { name, email, cnic ,dob, status, image } = req.body;
  
    let farm = await Farm.findById(req.user.farmId)
    try {
      const customer = await Customer.create({ name, email, cnic ,dob, status, image, createdBy: req.user._id, inFarm: req.user.farmId })
      if (customer && farm) {
        farm.customers = [...farm.customers, customer._id]
        farm.save()
        res.status(200).json({ customerData: { ...customer._doc } })
      } else {
        res
          .status(401)
          .json({ success: false, message: "Unknown Error Occured" });
        throw new Error('Unknown Error Occured');
      }
    } catch(error) {
      res.status(401).json({ success: false, message: "Please confirm that image is added " });
    }
  })
  
  export {
    addCustomer,
  };  