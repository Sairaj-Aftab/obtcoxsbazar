import express from "express";
import {
  createReview,
  deleteReview,
  getAllReview,
  getReviewsByParibahanUserId,
  updateReview,
} from "../controller/review.js";

const router = express.Router();

router.get("/", getAllReview);
router.get("/getbyparibahan/:id", getReviewsByParibahanUserId);
router.post("/create/:id", createReview);
router.put("/update/:id", updateReview);

router.delete("/delete/:id", deleteReview);

export default router;
