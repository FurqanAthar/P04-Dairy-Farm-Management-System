import mongoose from "mongoose";
import Animal from "./animalModel.js";
import Customer from "./customerModel.js";
import MilkSupply from "./milkSupply.js";
import MilkSupplyData from "./milkSupplyData.js";

const employeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    joinedAt: {
      type: Date,
      required: true,
    },
    isWorking: {
      type: Boolean,
      required: true,
    },
    leftAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const farmSchema = mongoose.Schema(
  {
    farmName: {
      type: String,
      required: true,
    },
    subdomain: {
      type: String,
      required: true,
      unique: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    workers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Worker",
      },
    ],
    animals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Animal",
      },
    ],
    customers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Customer",
      },
    ],

    milkRecords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "MilkProduction",
      },
    ],
    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Inventory",
    },
    milkSupply: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "MilkSupply",
    },
    miscellaneous: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Miscellaneous",
    },
  },
  {
    timestamps: true,
  }
);

farmSchema.methods.checkUserById = async function (id) {
  let user = this.users.find((u) => {
    return u == id ? u : null;
  });
  return user ? true : false;
};

farmSchema.methods.getAnimalsData = async function () {
  var results = await Promise.all(
    this.animals.map(async (a) => {
      let animalData = await Animal.findOne({ _id: a, active: true });
      return animalData;
    })
  );

  var filtered = results.filter(function (el) {
    return el != null;
  });

  return filtered;
};

farmSchema.methods.getCustomersData = async function () {
  var results = await Promise.all(
    this.customers.map(async (a) => {
      let customerData = await Customer.findOne({ _id: a, active: true });
      return customerData;
    })
  );

  var filtered = results.filter(function (el) {
    return el != null;
  });

  return filtered;
};

farmSchema.methods.getSuppliesData = async function () {
  let milkSupply = await MilkSupply.findById(this.milkSupply);
  var results = await Promise.all(
    Object.keys(milkSupply._doc.data).map(async (date) => {
      let milkSupplyData = await MilkSupplyData.findById(
        milkSupply._doc.data[date].dataId
      );
      return milkSupplyData;
    })
  );

  var filtered = results.filter(function (el) {
    return el != null;
  });

  // var formatted = {};

  // key: date, value: data
  // filtered.forEach((f) => {
  //   formatted = {
  //     ...formatted,
  //     [f._doc.date]: f._doc,
  //   };
  // });

  var formatted = [];
  // array of data
  filtered.forEach((f) => {
    formatted = [...formatted, f._doc];
  });

  return formatted;
};

const Farm = mongoose.model("Farm", farmSchema);

export default Farm;
