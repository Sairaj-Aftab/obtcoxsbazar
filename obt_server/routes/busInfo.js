import express from "express";
import {
  createBusInfo,
  deleteBusInfo,
  getAllBusInfo,
  getBusInfo,
  getBusInfoById,
  updateBusInfo,
} from "../controller/busInfo.js";

const router = express.Router();

// Paribahan Notice
router.post("/createbusinfo/:id", createBusInfo);
router.put("/update/:id", updateBusInfo);
router.get("/getall", getAllBusInfo);
router.get("/:id", getBusInfo);
router.get("/getbusinfo/:id", getBusInfoById);
router.delete("/delete/:id", deleteBusInfo);

// router.put("/update-all-qr", updateMultipleBusInfoQR);

export default router;
