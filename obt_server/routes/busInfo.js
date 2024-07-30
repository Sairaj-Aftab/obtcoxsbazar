import express from "express";
import {
  createBusInfo,
  deleteBusInfo,
  getAllBusInfo,
  getBusInfo,
  updateBusInfo,
} from "../controller/busInfo.js";

const router = express.Router();

// Paribahan Notice
router.post("/createbusinfo/:id", createBusInfo);
router.put("/update/:id", updateBusInfo);
router.get("/getall", getAllBusInfo);
router.get("/:id", getBusInfo);
router.delete("/delete/:id", deleteBusInfo);

export default router;
