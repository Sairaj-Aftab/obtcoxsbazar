import express from "express";
import {
  createGuideInfo,
  getGuideInfo,
  updateGuideInfo,
} from "../controller/guideInfo.js";

const router = express.Router();

// Paribahan Notice
router.post("/create/:id", createGuideInfo);
router.put("/update/:id", updateGuideInfo);
router.get("/getbyid/:id", getGuideInfo);

export default router;
