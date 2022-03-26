import mongoose from "mongoose";
import Customer from "./customerModel.js";

const wasteSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
  },
});

// to regular as well as milkmans
const toCustomersSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
});

const milkSupplyDataSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      isUnique: true,
    },
    customers: [],
    waste: {
      type: wasteSchema,
    },
    totalQuantitySupplied: {
      type: Number,
      required: true,
    },
    totalRevenue: {
      type: Number,
      required: true,
    },
    totalToCustomers: {
      type: toCustomersSchema,
      required: true,
    },
    totalToMilkmans: {
      type: toCustomersSchema,
      required: true,
    },
    doneBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inFarm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

milkSupplyDataSchema.methods.linkToCustomers = async function () {
  var results = await Promise.all(
    this.customers.map(async (c) => {
      let customer = await Customer.findById(c._id);
      if (customer != null) {
        customer._doc.supplyRecord = [...customer._doc.supplyRecord, this._id];
        customer.markModified("supplyRecord");
        return await customer.save().catch((err) => console.log("err", err));
      } else {
        return null;
      }
    })
  );

  console.log("results", results);
  var filtered = results.filter(function (el) {
    return el != null;
  });

  return filtered;
};

const MilkSupplyData = mongoose.model("MilkSupplyData", milkSupplyDataSchema);
export default MilkSupplyData;
