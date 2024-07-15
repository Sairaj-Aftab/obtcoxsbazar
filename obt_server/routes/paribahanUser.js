import express from "express";
import {
  createParibahanUserAccount,
  deleteParibahanUser,
  getAllParibahanUser,
  getParibahanUser,
  logedInUser,
  login,
  logout,
  updateParibahanUser,
} from "../controller/paribahanUser.js";
import verifyTokenForParibahan from "../middleware/verifyTokenForParibahan.js";

const router = express.Router();

router.post("/register/:authUserId", createParibahanUserAccount);
router.put("/update/:id", updateParibahanUser);
router.get("/", getAllParibahanUser);
router.get("/getsingle/:id", getParibahanUser);
router.delete("/:id", deleteParibahanUser);

// Authentication
router.post("/login", login);
router.get("/me", verifyTokenForParibahan, logedInUser);
router.post("/logout", logout);

export default router;
