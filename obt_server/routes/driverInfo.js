import express from "express";
import {
  createDriverInfo,
  deleteDriverInfo,
  getAllDriverInfo,
  getDriverInfo,
  updateDriverInfo,
} from "../controller/driverInfo.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

// Paribahan Notice
router.post("/create/:id", upload.single("photo"), createDriverInfo);
router.put("/update/:id", upload.single("photo"), updateDriverInfo);
router.get("/getall", getAllDriverInfo);
router.get("/getbyid/:id", getDriverInfo);
router.delete("/delete/:id", deleteDriverInfo);

export default router;
