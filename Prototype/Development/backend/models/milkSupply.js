import mongoose from "mongoose";

const milkDataSchema = mongoose.Schema({
  dataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MilkSupplyData",
  },
});

const milkSupplySchema = mongoose.Schema(
  {
    inFarm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
    },
    data: {},
  },
  {
    timestamps: true,
  }
);

const MilkSupply = mongoose.model("MilkSupply", milkSupplySchema);

export default MilkSupply;
