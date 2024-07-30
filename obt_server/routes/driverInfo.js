import express from "express";
import {
  createDriverInfo,
  deleteDriverInfo,
  getAllDriverInfo,
  getDriverInfo,
  updateDriverInfo,
} from "../controller/driverInfo.js";

const router = express.Router();

// Paribahan Notice
router.post("/create/:id", createDriverInfo);
router.put("/update/:id", updateDriverInfo);
router.get("/getall", getAllDriverInfo);
router.get("/getbyid/:id", getDriverInfo);
router.delete("/delete/:id", deleteDriverInfo);

export default router;
