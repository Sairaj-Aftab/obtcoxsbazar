import express from "express";
import {
  createLostAndFoundReport,
  getAllLostAndFound,
} from "../controller/lostAndFound.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.post("/create", upload.array("images"), createLostAndFoundReport);
router.get("/", getAllLostAndFound);

// router.delete("/delete/:id", deleteSchedule);

export default router;
