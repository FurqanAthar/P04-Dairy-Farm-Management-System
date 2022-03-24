import mongoose from "mongoose";

const CustomerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email:{
        type: String,
        required:true,
    },
    cnic:{
        type: String,
        required:true,
    },
    dob: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
   image: {
        type: String,
        default:"",
    },
    type: {
      type: String,
      required: true,
    },
    sellingrate: {
        type: Number,
        required: true,
     },
    quantityperday: {
    type: String,
    required: true,
    },
    address: {
      type: String,
      required: true,
    },
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
},
    
  },
  {
    timestamps: true,
  }
);





const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
