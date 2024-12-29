import express from "express";
import {
  createSetting,
  getAllSettings,
  getSetting,
  updateSetting,
} from "../controller/settings.js";

const router = express.Router();

router.get("/", getAllSettings);
router.get("/getsingle/:name", getSetting);
router.post("/", createSetting);
router.put("/:id", updateSetting);

export default router;
