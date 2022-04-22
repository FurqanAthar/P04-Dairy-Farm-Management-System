import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import Category from "../models/CategoryModel.js";
import User from "../models/userModel.js";
import Farm from "../models/farmModel.js";
import Inventory from "../models/inventoryModel.js";
import CategoryItem from "../models/categoryItemModel.js";
import ItemTransaction from "../models/itemTransactionModel.js";

// finding farm, then finding inventory and then creating category
// after creating category, adding its id to inventory's categories list
const addInventoryCategory = asyncHandler(async (req, res) => {
  const { name, description, metric } = req.body;

  let farm = await Farm.findById(req.user.farmId);
  let inventory = await Inventory.findById(farm._doc.inventory);
  try {
    const category = await Category.create({
      name,
      description,
      metric,
      items: [],
      inFarm: req.user.farmId,
      inInventory: farm._doc.inventory,
      createdBy: req.user._id,
    });
    if (category && inventory) {
      inventory.categories = [...inventory.categories, category._id];
      inventory.save();
      res
        .status(200)
        .json({ success: true, categories: { ...inventory.categories } });
    } else {
      throw new Error("Unknown Error Occured, try again!");
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Unknown Error Occured, try again!",
    });
  }
});

const addInventoryItem = asyncHandler(async (req, res) => {
  const { name, quantity, metric, unit, categoryId } = req.body;

  let farm = await Farm.findById(req.user.farmId);
  let inventory = await Inventory.findById(farm._doc.inventory);
  let category = await Category.findById(categoryId);
  try {
    // creating item first
    const item = await CategoryItem.create({
      name,
      metric,
      unit,
      quantity,
      transactions: [],
      inFarm: req.user.farmId,
      inInventory: farm._doc.inventory,
      inCategory: categoryId,
      createdBy: req.user._id,
    });
    // then creating its initial transaction
    const transaction = await ItemTransaction.create({
      old: 0,
      new: quantity,
      ofItem: item._doc._id,
      doneBy: req.user._id,
      sequenceNumber: 0,
    });

    // saving that transaction back to item
    if (item && transaction) {
      item.transactions = [...item.transactions, transaction._id];
      category.items = [...category.items, item._id];

      item.save();
      category.save();
      inventory.save();

      res.status(200).json({ success: true, item: { ...item._doc } });
    } else {
      throw new Error("Unknown Error Occured, try again!");
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Unknown Error Occured, try again!",
    });
  }
});

const addItemTransaction = asyncHandler(async (req, res) => {
  const { id, oldQuantity, newQuantity } = req.body;

  let farm = await Farm.findById(req.user.farmId);
  let item = await CategoryItem.findById(id);
  try {
    // creating transaction first
    const transaction = await ItemTransaction.create({
      old: oldQuantity,
      new: newQuantity,
      ofItem: id,
      doneBy: req.user._id,
      sequenceNumber: item._doc.transactions.length,
    });

    // adding that transaction to item
    if (item && transaction) {
      item.quantity = newQuantity;
      item.transactions = [...item.transactions, transaction._id];
      item.save();

      res.status(200).json({ success: true, item: { ...item._doc } });
    } else {
      throw new Error("Unknown Error Occured, try again!");
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Unknown Error Occured, try again!",
    });
  }
});

// Getting Inventory Categories and their data
const getInventoryCategories = asyncHandler(async (req, res) => {
  try {
    let farm = await Farm.findById(req.user.farmId);
    if (farm) {
      // finding inventory
      let inventory = await Inventory.findById(farm._doc.inventory);
      // getting categories in inventory
      let data = await inventory.getCategories();
      res.json({ success: true, categoriesData: [...data] });
    } else {
      throw new Error("Farm not present");
    }
  } catch (error) {
    res.status(200).json({ success: false, message: "Unknown Error occured" });
  }
});

const getItemData = asyncHandler(async (req, res) => {
  try {
    let item = await CategoryItem.findOne({
      _id: req.params.id,
      inFarm: req.user.farmId,
    });

    // getting transactions and users that did transactions
    let transactions = await ItemTransaction.find({ ofItem: item._id });

    let updatedTransactions = await Promise.all(
      // getting user data from database who did transaction
      transactions.map(async (t, index) => {
        let u = await User.findById(t.doneBy);
        return { ...t, doneBy: u._doc };
      })
    );
    updatedTransactions = updatedTransactions.map((ut, index) => {
      return { ...ut._doc, doneBy: ut.doneBy };
    });

    transactions = updatedTransactions;

    let user = await User.findById(item.createdBy);
    if (item && transactions && user) {
      res.json({
        success: true,
        data: {
          ...item._doc,
          transactions: transactions,
          createdBy: user._doc,
        },
      });
    } else {
      res.json({ success: false, message: "Item Doesn't Exist" });
    }
  } catch (error) {
    res.json({ success: false, message: "Item Doesn't Exist" });
  }
});

const deleteItemTransaction = asyncHandler(async (req, res) => {
  const { sequenceNumber, ofItem } = req.body;

  try {
    let item = await CategoryItem.findById(ofItem);
    let maxSequence = item.transactions.length;

    // starting from current sequence number and deleting all after that
    let deletePromises = [];
    for (var i = sequenceNumber; i < maxSequence; i++) {
      deletePromises = [
        ...deletePromises,
        await ItemTransaction.deleteOne({
          ofItem: ofItem,
          sequenceNumber: i,
        }),
      ];
    }

    await Promise.all(deletePromises);

    // getting remaining transactions of item
    let transactions = await ItemTransaction.find({ ofItem: item._id });
    let transactionIds = transactions.map((t) => {
      return t._id;
    });

    item.transactions = [...transactionIds];
    await item.reloadTransactions();
    item.save();

    res.json({ success: true, item: { ...item._doc } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unknown Error Occured!" });
  }
});

export {
  getItemData,
  addInventoryItem,
  addItemTransaction,
  addInventoryCategory,
  deleteItemTransaction,
  getInventoryCategories,
};
