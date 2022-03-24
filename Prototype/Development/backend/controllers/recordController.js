import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import MilkSupplyData from "../models/milkSupplyData.js";
import Farm from "../models/farmModel.js";
import MilkSupply from "../models/milkSupply.js";

export const addSupplyRecord = asyncHandler(async (req, res) => {
  const { customersData, info } = req.body;
  try {
    let alreadyPresentSupplyData = await MilkSupplyData.findOne({
      date: info.date,
      inFarm: req.user.farmId,
    });

    if (!alreadyPresentSupplyData) {
      let date = info.date;
      let waste = { quantity: info.totalWasted, reason: info.reasonWasted };
      let customers = customersData;
      let totalQuantitySupplied,
        totalRevenue = 0;
      let totalToCustomers = { quantity: 0, revenue: 0 };
      let totalToMilkmans = { quantity: 0, revenue: 0 };
      let doneBy = req.user._id;
      let inFarm = req.user.farmId;

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
        totalToCustomers.quantity + totalToMilkmans.quantity;

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

      let milkSupply = await MilkSupply.findOne({ inFarm: req.user.farmId });
      if (milkSupply && milkSupplyData) {
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
      message: "Please confirm that image is added and tag is unique",
    });
  }
});
