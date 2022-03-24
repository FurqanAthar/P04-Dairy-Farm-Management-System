import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import Farm from '../models/farmModel.js'
import Customer from '../models/customerModel.js'
import nodemailer from 'nodemailer';
import sendgridTransport from "nodemailer-sendgrid-transport";
const transporter=nodemailer.createTransport(
  sendgridTransport(
    {
        auth:{
          api_key:"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"
        }

    }
  )

)

const addCustomer = asyncHandler(async(req, res) => {
    const { name, email, cnic ,dob, status, image,type,sellingrate,quantityperday,address } = req.body;
    let farm = await Farm.findById(req.user.farmId)
    // console.log("this is the farm", req.user.farmId)
    try {
      // console.log("this will be used: ", name, email, cnic ,dob, status, image,type,sellingrate,quantityperday,address)
      const customer = await Customer.create({ name, email, cnic ,dob, status, image, type, sellingrate, quantityperday, address ,createdBy: req.user._id, inFarm: req.user.farmId })
      // console.log("customer details that will be added ",customer)
     
      if (customer && farm) {
        // console.log("customer details that will be added ",customer)
        farm.customers = [...farm.customers, customer._id]
        farm.save()
        customer.save()
        
       
        res.status(200).json({ customerData: { ...customer._doc } })


        transporter.sendMail(
          {
            
            to:email,
            from:"noreply.qazidairies@gmail.com",
            subject:"Your qazi dairies access credentials",
            text:"Welcome to Qazi Dairies",
            html:`<h1>Welcome to Qazi dairies! </h1>
             <h4>Dear customer ${name},</h4> 
             <h5><b>Please find your username and password below:</b></h5> </br></br>
             <div><b>username:</b> ${email} </div>
             <div><b>password:</b>  (please do not share this password)</div></br>
             <div><b>Please do not write to this email, this is an un-attended mail box. Thank you !  </b></div> `  
            

          }
          

        )
      } else {
         res
          .status(401)
          .json({ success: false, message: "Unknown Error Occured" });
        throw new Error('Unknown Error Occured');
      }
    } catch(error) {
      console.log("error is ",error)
      res.status(401).json({ success: false, message: "Please confirm that image is added " });
    }
  })


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
    
    
    console.log("here")
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
  
  const { id,name, email, cnic ,dob, status, image,type,sellingrate,quantityperday,address} = req.body;
  // console.log({ id,name, email, cnic ,dob, status, image})
  
  try {
   
    const customer = await Customer.findOne({
      _id: id,
      inFarm: req.user.farmId,
    });
    
    if (customer) {
      customer.name = name;
      customer.email= email;
      customer.dob = dob;
      customer.cnic=cnic;
      customer.status = status;
      customer.image = image;
      customer.address=address;
      customer.type=type;
      customer.sellingrate=sellingrate;
      customer.quantityperday=quantityperday;
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