import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import MilkSupplyData from "./milkSupplyData.js";

const CustomerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    cnic: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
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
    supplyRecord: [],
  },
  {
    timestamps: true,
  }
);

CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

CustomerSchema.methods.getSupplyRecord = async function () {
  var results = await Promise.all(
    this.supplyRecord.map(async (c) => {
      let supplyData = await MilkSupplyData.findById(c);
      let data = null;
      if (supplyData != null) {
        data = supplyData.customers.filter((cust) => {
          return cust._id == this._id ? cust : null;
        });
        if (data.length > 0) {
          return { ...data[0], date: supplyData.date };
        }
        return null;
      } else {
        return null;
      }
    })
  );

  var filtered = results.filter(function (el) {
    return el != null;
  });

  return filtered;
};

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
