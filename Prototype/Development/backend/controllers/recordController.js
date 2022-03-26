import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import MilkSupplyData from "../models/milkSupplyData.js";
import Farm from "../models/farmModel.js";
import MilkSupply from "../models/milkSupply.js";
import Customer from "../models/customerModel.js";

const revenueCalculations = (customersData, info) => {
  let date = info.date;
  let waste = { quantity: info.totalWasted, reason: info.reasonWasted };
  let customers = customersData;
  let totalQuantitySupplied,
    totalRevenue = 0;
  let totalToCustomers = { quantity: 0, revenue: 0 };
  let totalToMilkmans = { quantity: 0, revenue: 0 };

  // Calculating other info at backend
  customersData.forEach((c) => {
    if (c.type === "Milkman") {
      totalToMilkmans.quantity =
        totalToMilkmans.quantity + c.milkSupplyQuantity;
      totalToMilkmans.revenue =
        totalToMilkmans.revenue + c.milkSupplyQuantity * c.milkSupplyRate;
    } else {
      totalToCustomers.quantity =
        totalToCustomers.quantity + c.milkSupplyQuantity;
      totalToCustomers.revenue =
        totalToCustomers.revenue + c.milkSupplyQuantity * c.milkSupplyRate;
    }
  });

  // TOTALS
  totalRevenue = totalToCustomers.revenue + totalToMilkmans.revenue;
  totalQuantitySupplied =
    parseFloat(totalToCustomers.quantity) +
    parseFloat(totalToMilkmans.quantity);

  return {
    date,
    waste,
    customers,
    totalQuantitySupplied,
    totalRevenue,
    totalToCustomers,
    totalToMilkmans,
  };
};

export const addSupplyRecord = asyncHandler(async (req, res) => {
  const { customersData, info } = req.body;
  try {
    let alreadyPresentSupplyData = await MilkSupplyData.findOne({
      date: info.date,
      inFarm: req.user.farmId,
    });

    if (!alreadyPresentSupplyData) {
      let doneBy = req.user._id;
      let inFarm = req.user.farmId;

      const {
        date,
        waste,
        customers,
        totalQuantitySupplied,
        totalRevenue,
        totalToCustomers,
        totalToMilkmans,
      } = revenueCalculations(customersData, info);

      let milkSupplyData = await MilkSupplyData.create({
        date,
        customers,
        waste,
        totalQuantitySupplied,
        totalRevenue,
        totalToCustomers,
        totalToMilkmans,
        doneBy,
        inFarm,
      });

      let ltc = await milkSupplyData.linkToCustomers();

      let milkSupply = await MilkSupply.findOne({ inFarm: req.user.farmId });
      if (milkSupply && milkSupplyData) {
        // adding data to farm link
        let data = {
          ...milkSupply._doc.data,
          [date]: { dataId: milkSupplyData._id },
        };
        milkSupply.data = data;
        milkSupply.save();

        res.status(200).json({
          success: true,
          message: "Supply Record Added Successfully",
        });
      }
    } else {
      res.status(200).json({
        success: false,
        message: "Supply Record already present in this date",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unknown Error Occured",
    });
  }
});

export const getSupplyRecord = asyncHandler(async (req, res) => {
  try {
    let farm = await Farm.findById(req.user.farmId);
    if (farm) {
      let data = await farm.getSuppliesData();
      res.json({ success: true, data: [...data] });
    } else {
      res.status(200).json({
        success: false,
        message: "Farm not present",
      });
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Unknown Error Occured",
    });
  }
});

export const getSupplyRecordById = asyncHandler(async (req, res) => {
  try {
    let data = await MilkSupplyData.findOne({
      _id: req.params.id,
      inFarm: req.user.farmId,
    });

    if (data) {
      res.status(200).json({
        success: true,
        data: data._doc,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No Record by this ID",
      });
    }
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Unknown Error Occured",
    });
  }
});

export const updateSupplyRecordById = asyncHandler(async (req, res) => {
  try {
    const { id, customersData, info } = req.body;

    let milkSupplyData = await MilkSupplyData.findOne({
      _id: id,
      inFarm: req.user.farmId,
    });

    if (milkSupplyData) {
      const {
        date,
        waste,
        customers,
        totalQuantitySupplied,
        totalRevenue,
        totalToCustomers,
        totalToMilkmans,
      } = revenueCalculations(customersData, info);

      milkSupplyData.customers = customers;
      milkSupplyData.waste = waste;
      milkSupplyData.totalQuantitySupplied = totalQuantitySupplied;
      milkSupplyData.totalRevenue = totalRevenue;
      milkSupplyData.totalToCustomers = totalToCustomers;
      milkSupplyData.totalToMilkmans = totalToMilkmans;

      await milkSupplyData.save();

      res.status(200).json({
        success: true,
        message: `Record Updated for ${date}`,
      });
    } else {
      res.status(200).json({
        success: false,
        message: `No Record on this Date`,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(200).json({
      success: false,
      message: `Unknown Error Occured`,
    });
  }
});
