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
        type: Number,
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
