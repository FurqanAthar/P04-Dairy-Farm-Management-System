import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import Farm from "../models/farmModel.js";
import Animal from "../models/animalModel.js";
import MilkProduction from "../models/milkProductionModel.js";
import Worker from "../models/workerModel.js";

const registerFarm = asyncHandler(async (req, res) => {
  const { farmName, subdomain, name, email, cnic, password } = req.body;

  let farm = await Farm.findOne({ subdomain });
  let user = await User.findOne({ email });

  if (farm) {
    res
      .status(200)
      .json({ success: false, message: "Sub-domain Already In Use" });
  } else if (user) {
    res
      .status(200)
      .json({ success: false, message: "Email Address already registered" });
  } else {
    // Register farm
    user = await User.create({ name, email, password, role: "admin", cnic });
    farm = await Farm.create({ farmName, subdomain, users: [user._doc._id] });

    user = await User.findById(user._doc._id);

    if (user) {
      user.farmId = farm._doc._id;
      user.save();
      res.status(200).json({ success: true });
    }
  }
});

const validateSubDomain = asyncHandler(async (req, res) => {
  const { subdomain } = req.body;
  const farm = await Farm.findOne({ subdomain });

  if (farm) {
    //   res.status(400);
    res.json({ success: false, message: "Sub-domain Already In Use" });
  } else {
    res.json({ success: true });
  }
});

const authenticateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      cnic: user.cnic,
      farmId: user.farmId,
      image: user.image,
      token: generateToken(user._id, user.farmId),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const updateUserName = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      cnic: updatedUser.cnic,
      farmId: updatedUser.farmId,
      image: user.image,
      token: generateToken(updatedUser._id, updatedUser.farmId),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (user) {
    if (await user.matchPassword(oldPassword)) {
      user.password = password;
      const updatedUser = await user.save();

      res.json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        cnic: updatedUser.cnic,
        farmId: updatedUser.farmId,
        image: user.image,
        token: generateToken(updatedUser._id, updatedUser.farmId),
      });
    } else {
      res.json({ success: false, message: "Old Password is Incorrect!" });
    }
  } else {
    res.json({ success: false, message: "User Not Found!" });
  }
});

const updateUserImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { image } = req.body;

  try {
    if (user) {
      user.image = image;
      const updatedUser = await user.save();

      res.json({
        success: true,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        cnic: updatedUser.cnic,
        farmId: updatedUser.farmId,
        image: user.image,
        token: generateToken(updatedUser._id, updatedUser.farmId),
      });
    } else {
      res.json({ success: false, message: "User Not Found!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error Occured, Try Again!" });
  }
});

const addAnimal = asyncHandler(async (req, res) => {
  const { name, tag, dob, type, status, image } = req.body;

  let farm = await Farm.findById(req.user.farmId);
  try {
    const animal = await Animal.create({
      name,
      tag,
      dob,
      type,
      status,
      image,
      createdBy: req.user._id,
      inFarm: req.user.farmId,
    });
    if (animal && farm) {
      farm.animals = [...farm.animals, animal._id];
      farm.save();
      res.status(200).json({ animalData: { ...animal._doc } });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Unknown Error Occured" });
      throw new Error("Unknown Error Occured");
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Please confirm that image is added and tag is unique",
    });
  }
});

const getAnimalsData = asyncHandler(async (req, res) => {
  try {
    let farm = await Farm.findById(req.user.farmId);
    if (farm) {
      let data = await farm.getAnimalsData();
      res.json({ animalsData: [...data] });
    } else {
      res.status(401);
      throw new Error("Farm not present");
    }
  } catch (error) {
    res.status(401);
    res.json(error);
  }
});

const addMilkRecord = asyncHandler(async (req, res) => {
  const { date, record } = req.body;
  let farm = await Farm.findById(req.user.farmId);
  let alreadyPresent = await MilkProduction.findOne({
    date: date,
    farmId: farm._id,
  });
  if (alreadyPresent) {
    res
      .status(400)
      .json({ error: "Daily Milk Record Already Present With this date" });
    // throw new Error("Daily Milk Record Already Present With this date");
  } else {
    const newRecord = await MilkProduction.create({
      farmId: req.user.farmId,
      userId: req.user._id,
      date: date,
      record: record,
    });
    if (farm && newRecord) {
      farm.milkRecords = [...farm.milkRecords, newRecord._id];
      farm.save();
      res.json({ recordData: { ...newRecord._doc } });
    } else {
      res.status(400).json({ error: "Unknown Error Occured" });
      // throw new Error("");
    }
  }
});

const getMilkRecords = asyncHandler(async (req, res) => {
  let farm = await Farm.findById(req.user.farmId);
  if (farm) {
    console.log(farm)
    var records = await Promise.all(
      farm.milkRecords.map(async (recordId) => {
        let record = await MilkProduction.findById(recordId);
        return record;
      })
    );
    res.status(200).json({ milkRecords: [...records] });
  } else {
    res.status(400).json({ error: "No Farm Exists" });
  }
});

const addMember = asyncHandler(async (req, res) => {
  const { name, email, password, cnic, role } = req.body;
  let alreadyPresentUser = await User.findOne({ email: email });
  if (alreadyPresentUser) {
    res.json({ success: false, message: "Email Address already registered!" });
  } else {
    try {
      let user = await User.create({
        name,
        email,
        password,
        role,
        cnic,
        farmId: req.user.farmId,
      });
      let farm = await Farm.findById(req.user.farmId);
      if (farm && user) {
        farm.users = [...farm.users, user._id];
        farm.save();
        res.json({ success: true, message: "User added successfully!" });
      } else {
        throw new Error("Unexpected Error");
      }
    } catch (error) {
      res.json({ success: false, message: "Unexpected Error" });
    }
  }
});

const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.body;

  try {
    let user = await User.deleteOne({ _id: id });

    if (user) {
      res.json({ success: true, message: "Team Member Deleted!" });
    } else {
      throw new Error("Deletion Failed!");
    }
  } catch (error) {
    res.json({ success: false, message: "Deletion Failed!" });
  }
});

const deleteAnimal = asyncHandler(async (req, res) => {
  const { id } = req.body;

  try {
    let animal = await Animal.deleteOne({ _id: id });

    if (animal) {
      res.json({ success: true, message: "Animal Deleted!" });
    } else {
      throw new Error("Deletion Failed!");
    }
  } catch (error) {
    res.json({ success: false, message: "Deletion Failed!" });
  }
});

const getMembers = asyncHandler(async (req, res) => {
  let farm = await Farm.findById(req.user.farmId);
  if (farm) {
    var records = await Promise.all(
      farm.users.map(async (userId) => {
        let record = await User.findOne({ _id: userId, active: true });
        return record;
      })
    );
    var filtered = records.filter(function (el) {
      return el != null;
    });
    res.status(200).json({ success: true, teamMembers: [...filtered] });
  } else {
    res.json({ success: false, message: "Unknown Error exists" });
  }
});

const addWorker = asyncHandler(async (req, res) => {
  const { name, number, work, cnic, salary, status } = req.body;
  let alreadyPresentUser = await Worker.findOne({ cnic: cnic });
  if (alreadyPresentUser) {
    res.json({ success: false, message: "Worker already exists!" });
  } else {
    try {
      let worker = await Worker.create({
        name,
        number,
        work,
        cnic,
        salary,
        farmId: req.user.farmId,
        status,
      });
      let farm = await Farm.findById(req.user.farmId);
      if (farm && worker) {
        farm.workers = [...farm.workers, worker._id];
        farm.save();
        res.json({ success: true, message: "Worker added successfully!" });
      } else {
        throw new Error("Unexpected Error");
      }
    } catch (error) {
      res.json({ success: false, message: "Unexpected Error" });
    }
  }
});

const editWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.body._id);
  if (worker) {
    worker.name = req.body.name || worker.name;
    worker.number = req.body.number || worker.number;
    worker.work = req.body.work || worker.work;
    worker.cnic = req.body.cnic || worker.cnic;
    worker.salary = req.body.salary || worker.salary;
    worker.status = req.body.status || worker.status;
    await worker.save();
    res.json({ success: true, message: "Changes applied successfully!" });
  } else {
    res.json({ success: false, message: "Changes could not be applied!" });
  }
});

const getWorkers = asyncHandler(async (req, res) => {
  let farm = await Farm.findById(req.user.farmId);
  if (farm) {
    var records = await Promise.all(
      farm.workers.map(async (userId) => {
        let record = await Worker.findOne({ _id: userId });
        return record;
      })
    );
    var filtered = records.filter(function (el) {
      return el != null;
    });
    res.status(200).json({ success: true, workers: [...filtered] });
  } else {
    res.json({ success: false, message: "Unknown Error exists!" });
  }
});

const getAnimalData = asyncHandler(async (req, res) => {
  try {
    let animal = await Animal.findOne({
      _id: req.params.id,
      inFarm: req.user.farmId,
    });
    if (animal) {
      res.json({ success: true, details: animal });
    } else {
      res.json({ success: false, message: "Animal Data Doesn't Exists" });
    }
  } catch (error) {
    res.json({ success: false, message: "Animal Data Doesn't Exists" });
  }
});

const updateAnimalData = asyncHandler(async (req, res) => {
  const { id, name, tag, dob, type, status, image } = req.body;
  try {
    let animal = await Animal.findOne({
      _id: id,
      inFarm: req.user.farmId,
    });
    if (animal) {
      animal.name = name;
      animal.tag = tag;
      animal.dob = dob;
      animal.type = type;
      animal.status = status;
      animal.image = image;
      await animal.save();

      res.json({ success: true, details: animal });
    } else {
      res.json({ success: false, message: "Animal Doesn't Exists" });
    }
  } catch (error) {
    res.json({ success: false, message: "Animal Doesn't Exists" });
  }
});

export {
  registerFarm,
  validateSubDomain,
  authenticateUser,
  updateUserName,
  updateUserPassword,
  updateUserImage,
  addAnimal,
  getAnimalsData,
  getAnimalData,
  updateAnimalData,
  addMilkRecord,
  getMilkRecords,
  addMember,
  getMembers,
  deleteMember,
  deleteAnimal,
  addWorker,
  editWorker,
  getWorkers,
};
