import express from "express";
import {
  createAdminNotice,
  createParibahanNotice,
  deleteAdminNotice,
  deleteParibahanNotice,
  getAdminNotice,
  getAllParibahanNotice,
  getSingleAdminNotice,
  getSingleParibahanNotice,
  updateAdminNotice,
  updateParibahanNotice,
} from "../controller/notice.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Paribahan Notice
router.post("/createparibahan/:id", createParibahanNotice);
router.get("/getallparibahan", getAllParibahanNotice);
router.get("/getsingleparibahan/:id", getSingleParibahanNotice);
router.put("/updateparibahannotice/:id", updateParibahanNotice);
router.delete("/deleteparibahan/:id", deleteParibahanNotice);

// Admin Notice
router.post("/createadmin/:id", createAdminNotice);
router.get("/getalladmin", getAdminNotice);
router.get("/getsingleadmin/:id", getSingleAdminNotice);
router.put("/updateadminnotice/:id", verifyToken, updateAdminNotice);
router.delete("/deleteadmin/:id", deleteAdminNotice);

export default router;
