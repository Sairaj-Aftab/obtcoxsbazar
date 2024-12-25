import express from "express";
import {
  createSetting,
  getAllSettings,
  updateSetting,
} from "../controller/settings.js";

const router = express.Router();

router.get("/", getAllSettings);
router.post("/", createSetting);
router.put("/:id", updateSetting);

export default router;
