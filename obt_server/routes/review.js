import express from "express";
import {
  createReview,
  deleteReview,
  getAllReview,
  updateReview,
} from "../controller/review.js";

const router = express.Router();

router.get("/", getAllReview);
router.post("/create/:id", createReview);
router.put("/update/:id", updateReview);

router.delete("/delete/:id", deleteReview);

export default router;
