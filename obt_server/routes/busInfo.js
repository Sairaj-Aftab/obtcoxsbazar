import express from "express";
import {
  createBusInfo,
  getBusInfo,
  updateBusInfo,
} from "../controller/busInfo.js";

const router = express.Router();

// Paribahan Notice
router.post("/createbusinfo/:id", createBusInfo);
router.put("/update/:id", updateBusInfo);
router.get("/:id", getBusInfo);

export default router;
