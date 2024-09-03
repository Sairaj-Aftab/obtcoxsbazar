import express from "express";
import {
  createSchedule,
  deleteSchedule,
  getAllSchedules,
  getSchedulesByParibahanId,
  getSchedulesByPlace,
  updateSchedule,
} from "../controller/regularSchedule.js";

const router = express.Router();

router.get("/", getAllSchedules);
router.get("/getbyparibahanid/:id", getSchedulesByParibahanId);
router.get("/getbydestination/:destination", getSchedulesByPlace);
router.post("/create/:id", createSchedule);
router.put("/update/:id", updateSchedule);

router.delete("/delete/:id", deleteSchedule);

export default router;
