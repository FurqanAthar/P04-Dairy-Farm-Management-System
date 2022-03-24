import mongoose from "mongoose";

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

const MilkSupplyData = mongoose.model("MilkSupplyData", milkSupplyDataSchema);
export default MilkSupplyData;
