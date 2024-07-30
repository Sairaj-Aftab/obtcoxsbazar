import express from "express";
import {
  createSchedule,
  deleteSchedule,
  getAllSchedules,
  getSchedulesByPlace,
  updateSchedule,
} from "../controller/regularSchedule.js";

const router = express.Router();

router.get("/", getAllSchedules);
router.get("/getbydestination/:destination", getSchedulesByPlace);
router.post("/create", createSchedule);
router.put("/update/:id", updateSchedule);

router.delete("/delete/:id", deleteSchedule);

export default router;
