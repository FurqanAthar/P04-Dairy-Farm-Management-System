import mongoose from "mongoose";

const miscellaneousSchema = mongoose.Schema(
  {
    inFarm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
    },
    rateList: [],
    addressList: [],
  },
  {
    timestamps: true,
  }
);

const Miscellaneous = mongoose.model("Miscellaneous", miscellaneousSchema);

export default Miscellaneous;
