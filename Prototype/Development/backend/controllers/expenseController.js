import asyncHandler from "express-async-handler";
import Invoice from "../models/invoiceModel.js";
import Farm from "../models/farmModel.js";

// Getting invoices and their data
const getInvoices = asyncHandler(async (req, res) => {
    let farm = await Farm.findById(req.user.farmId);
    if (farm) {
        var records = await Promise.all(
            farm.invoices.map(async (userId) => {
                let record = await Invoice.findOne({ _id: userId });
                return record;
            })
        );
        var filtered = records.filter(function (el) {
            return el != null;
        });
        res.status(200).json({ success: true, invoices: [...filtered] });
    } else {
        res.json({ success: false, message: "Unknown Error exists!" });
    }
});

// Adding a new invoice
const addInvoice = asyncHandler(async (req, res) => {
    const { number, items, amount } = req.body;
    let alreadyPresentUser = await Invoice.findOne({ number: number });
    if (alreadyPresentUser) {
        res.json({ success: false, message: "Another invoice with the same number already exists!" });
    } else {
        try {
			let invoice = await Invoice.create({
				number,
				items,
				amount,
				farmId: req.user.farmId,
			});
			let farm = await Farm.findById(req.user.farmId);
			console.log("Test Passed!");
			if (farm && invoice) {
				farm.invoices = [...farm.invoices, invoice._id];
				farm.save();
				res.json({ success: true, message: "Invoice added successfully!" });
			} else {
				throw new Error("Unexpected Error");
			}
        } catch (error) {
        	res.json({ success: false, message: "Unexpected Error 200" });
        }
    }
});

export {
    addInvoice,
	getInvoices,
};