import express from "express";
import {
  createReview,
  deleteReview,
  getAllReview,
  getReviewsByParibahanUserId,
  updateReview,
} from "../controller/review.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get("/", getAllReview);
router.get("/getbyparibahan/:id", getReviewsByParibahanUserId);
router.post("/create/:id", upload.array("images"), createReview);
router.put("/update/:id", updateReview);

router.delete("/delete/:id", deleteReview);

// router.patch("/setid", setReviewId);

export default router;
