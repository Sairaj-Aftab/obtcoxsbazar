import express from "express";
import {
  createGuideInfo,
  deleteGuideInfo,
  getAllGuideInfo,
  getGuideInfo,
  updateGuideInfo,
} from "../controller/guideInfo.js";

const router = express.Router();

// Paribahan Notice
router.post("/create", createGuideInfo);
router.put("/update/:id", updateGuideInfo);
router.get("/getall", getAllGuideInfo);
router.get("/getbyid/:id", getGuideInfo);
router.delete("/delete/:id", deleteGuideInfo);

export default router;
