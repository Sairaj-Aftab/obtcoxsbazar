import express from "express";
import { createDriverInfo, getDriverInfo, updateDriverInfo } from "../controller/driverInfo.js";

const router = express.Router();

// Paribahan Notice
router.post("/create/:id", createDriverInfo);
router.put("/update/:id", updateDriverInfo);
router.get("/getbyid/:id", getDriverInfo);

export default router;
