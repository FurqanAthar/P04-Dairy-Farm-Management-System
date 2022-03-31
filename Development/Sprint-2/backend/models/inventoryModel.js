import mongoose from "mongoose";
import Category from "./categoryModel.js";

const inventorySchema = mongoose.Schema(
  {
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category",
      },
    ],
    categoriesCount: {
      type: Number,
      default: 0,
    },
    itemsCount: {
      type: Number,
      default: 0,
    },
    inFarm: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "Farm",
    },
  },
  {
    timestamps: true,
  }
);

// counting categories before saving the inventory instance
inventorySchema.pre("save", async function (next) {
  let itemsCount = 0;
  this.categories.forEach(async (c) => {
    let cData = await Category.findById(c);
    if (cData != null) {
      itemsCount = itemsCount + cData.items.length;
    }
  });

  this.itemsCount = itemsCount;
  this.categoriesCount = await this.categories.length;
});

inventorySchema.methods.getCategories = async function () {
  var results = await Promise.all(
    this.categories.map(async (a) => {
      let categoryData = await Category.findById(a);
      if (categoryData != null) {
        let itemsData = await categoryData.getItems();
        return { ...categoryData._doc, items: [...itemsData] };
      } else {
        return categoryData;
      }
    })
  );

  var filtered = results.filter(function (el) {
    return el != null;
  });

  return filtered;
};

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
