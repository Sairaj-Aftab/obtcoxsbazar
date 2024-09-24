import express from "express";
import {
  createTouristBusEntryPermission,
  getAllTouristBusEntryPermissions,
  getTouristBusEntriesByReturnDate,
  updateTouristBusEntryPermission,
} from "../controller/touristBusEntryPermission.js";

const router = express.Router();

router.get("/", getAllTouristBusEntryPermissions);
router.get("/getreturnofdate", getTouristBusEntriesByReturnDate);
router.post("/create", createTouristBusEntryPermission);
router.put("/update/:id", updateTouristBusEntryPermission);

// router.delete("/delete/:id", deleteSchedule);

export default router;
