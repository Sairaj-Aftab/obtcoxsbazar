import express from "express";
import {
  createEmergencyAlarm,
  deleteAlarm,
  getAlarmsByParibahanUserId,
  getAllAlarm,
} from "../controller/emergencyAlarm.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get("/", getAllAlarm);
router.get("/getbyparibahan/:id", getAlarmsByParibahanUserId);
router.post("/create/:id", upload.array("images"), createEmergencyAlarm);

router.delete("/delete/:id", deleteAlarm);

// router.patch("/setid", setReviewId);

export default router;
