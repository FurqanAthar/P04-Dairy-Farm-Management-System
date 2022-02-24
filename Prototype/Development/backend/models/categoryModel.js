import mongoose from "mongoose";
import CategoryItem from "./categoryItemModel.js";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metric: {
      type: String,
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Item",
      },
    ],
    inFarm: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Farm",
    },
    inInventory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Inventory",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.methods.getItems = async function () {
  var results = await Promise.all(
    this.items.map(async (a) => {
      let itemData = await CategoryItem.findById(a);
      if (itemData != null) {
        return itemData._doc;
      }
      return itemData;
    })
  );

  var filtered = results.filter(function (el) {
    return el != null;
  });

  return filtered;
};

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
