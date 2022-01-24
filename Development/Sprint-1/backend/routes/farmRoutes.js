import express from "express";
const router = express.Router();
import {
	addWorker,
	editWorker,
	getWorkers,
	registerFarm,
	validateSubDomain,
	authenticateUser,
	updateUserName,
	updateUserPassword,
	updateUserImage,
	addAnimal,
	deleteAnimal,
	getAnimalsData,
	updateAnimalData,
	getAnimalData,
	addMilkRecord,
	getMilkRecords,
	addMember,
	deleteMember,
	getMembers,
} from "../controllers/farmController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/validate/subdomain").post(validateSubDomain);
router.route("/register").post(registerFarm);
router.route("/login").post(authenticateUser);

router.route("/user/update/name").put(protect, updateUserName);
router.route("/user/update/password").put(protect, updateUserPassword);
router.route("/user/update/image").put(protect, updateUserImage);

router.route("/member/add").post(protect, addMember);
router.route("/member/delete").post(protect, deleteMember);
router.route("/teamMembers").get(protect, getMembers);
router.route("/update/user/name").put(protect, updateUserName)
router.route("/animals/add").post(protect, addAnimal)
router.route("/animals/delete").post(protect, deleteAnimal)
router.route("/animals").get(protect, getAnimalsData)
router.route("/productions/add").post(protect, addMilkRecord)
router.route("/productions").get(protect, getMilkRecords)
router.route("/worker/add").post(protect, addWorker)
router.route("/worker/edit").put(protect, editWorker)
router.route("/workers").get(protect, getWorkers)

router.route("/animals/add").post(protect, addAnimal);
router.route("/animals/delete").post(protect, deleteAnimal);
router.route("/animals/:id").get(protect, getAnimalData);
router.route("/animals/update").put(protect, updateAnimalData);
router.route("/animals").get(protect, getAnimalsData);

router.route("/productions/add").post(protect, addMilkRecord);
router.route("/productions").get(protect, getMilkRecords);

export default router;
