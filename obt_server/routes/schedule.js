import express from "express";
import {
  createSchedule,
  deleteSchedule,
  getAllSchedules,
  getSchedulesByLimit,
  getSchedulesByParibahanUserId,
  getSchedulesByPlace,
  getTodaysSchedules,
  getTodaysSchedulesByParibahanUserId,
  updateSchedule,
} from "../controller/schedule.js";

const router = express.Router();

router.get("/", getAllSchedules);
router.get("/todays", getTodaysSchedules);
router.get("/getbylimit", getSchedulesByLimit);
router.get(
  "/gettodaysbyparibahan/:paribahanUserId",
  getTodaysSchedulesByParibahanUserId
);
router.get("/getbyparibahan/:paribahanUserId", getSchedulesByParibahanUserId);
router.get("/getbydestination/:destination", getSchedulesByPlace);
router.post("/:paribahanUserId", createSchedule);
router.put("/update/:id", updateSchedule);

router.delete("/delete/:id", deleteSchedule);

export default router;
