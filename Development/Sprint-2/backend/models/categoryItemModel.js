import mongoose from "mongoose";
import ItemTransaction from "./itemTransactionModel.js";

const categoryItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    metric: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ItemTransaction",
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
    inCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
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

// method to reload transactions of item from transaction collection
// can be used whenever a transaction will be deleted
categoryItemSchema.methods.reloadTransactions = async function () {
  let latestSequenceNumber = this.transactions.length - 1;
  let transaction = await ItemTransaction.find({
    sequenceNumber: latestSequenceNumber,
    ofItem: this._id,
  });
  if (transaction) {
    console.log(transaction[0].new);
    this.quantity = transaction[0].new;
  }
};

const CategoryItem = mongoose.model("CategoryItem", categoryItemSchema);

export default CategoryItem;
