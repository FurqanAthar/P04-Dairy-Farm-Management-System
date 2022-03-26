import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import Farm from "../models/farmModel.js";
import Customer from "../models/customerModel.js";

const addCustomer = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    cnic,
    dob,
    status,
    image,
    type,
    sellingrate,
    quantityperday,
    address,
  } = req.body;
  let farm = await Farm.findById(req.user.farmId);
  // console.log("this is the farm", req.user.farmId)
  try {
    // console.log("this will be used: ", name, email, cnic ,dob, status, image,type,sellingrate,quantityperday,address)
    const customer = await Customer.create({
      name,
      email,
      cnic,
      dob,
      status,
      image,
      type,
      sellingrate,
      quantityperday,
      address,
      createdBy: req.user._id,
      inFarm: req.user.farmId,
      supplyRecord: [],
    });
    // console.log("customer details that will be added ",customer)

    if (customer && farm) {
      // console.log("customer details that will be added ",customer)
      farm.customers = [...farm.customers, customer._id];
      farm.save();
      customer.save();

      res.status(200).json({ customerData: { ...customer._doc } });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Unknown Error Occured" });
      throw new Error("Unknown Error Occured");
    }
  } catch (error) {
    console.log("error is ", error);
    res
      .status(401)
      .json({ success: false, message: "Please confirm that image is added " });
  }
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const { id } = req.body;

  try {
    let customer = await Customer.deleteOne({ _id: id });

    if (customer) {
      res.json({ success: true, message: "Customer Removed!" });
    } else {
      throw new Error("Deletion Failed!");
    }
  } catch (error) {
    res.json({ success: false, message: "Deletion Failed!" });
  }
});

const getCustomerData = asyncHandler(async (req, res) => {
  try {
    console.log("here");
    let customer = await Customer.findOne({
      _id: req.params.id,
      inFarm: req.user.farmId,
    });
    if (customer) {
      res.json({ success: true, details: customer });
    } else {
      res.json({ success: false, message: "Customer Doesn't Exists" });
    }
  } catch (error) {
    res.json({ success: false, message: "Customer Doesn't Exists" });
  }
});

const getCustomersData = asyncHandler(async (req, res) => {
  try {
    let farm = await Farm.findById(req.user.farmId);

    if (farm) {
      let data = await farm.getCustomersData();

      res.json({ customersData: [...data] });
    } else {
      res.status(401);
      throw new Error("Farm not present");
    }
  } catch (error) {
    res.status(401);
    res.json(error);
  }
});

const updateCustomerData = asyncHandler(async (req, res) => {
  const {
    id,
    name,
    email,
    cnic,
    dob,
    status,
    image,
    type,
    sellingrate,
    quantityperday,
    address,
  } = req.body;
  // console.log({ id,name, email, cnic ,dob, status, image})

  try {
    const customer = await Customer.findOne({
      _id: id,
      inFarm: req.user.farmId,
    });

    if (customer) {
      customer.name = name;
      customer.email = email;
      customer.dob = dob;
      customer.cnic = cnic;
      customer.status = status;
      customer.image = image;
      customer.address = address;
      customer.type = type;
      customer.sellingrate = sellingrate;
      customer.quantityperday = quantityperday;
      await customer.save();

      // console.log("the values are here now",customer)
      res.json({ success: true, details: customer });
    } else {
      res.json({ success: false, message: "Customer Doesn't Exists" });
    }
  } catch (error) {
    res.json({ success: false, message: "Customer Doesn't Exists" });
  }
});

export {
  addCustomer,
  deleteCustomer,
  getCustomersData,
  getCustomerData,
  updateCustomerData,
};
