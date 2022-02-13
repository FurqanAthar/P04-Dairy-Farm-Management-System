import mongoose from "mongoose";

const itemTransactionSchema = mongoose.Schema(
  {
    old: {
      type: Number,
      required: true,
    },
    new: {
      type: Number,
      required: true,
    },
    ofItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CategoryItem",
    },
    doneBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    sequenceNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ItemTransaction = mongoose.model(
  "ItemTransaction",
  itemTransactionSchema
);

export default ItemTransaction;
