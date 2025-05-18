import express from "express";
import {
  createTemplate,
  getTemplates,
  updateTemplate,
} from "../controller/displayTemplate.js";

const router = express.Router();

router.post("/create", createTemplate);
router.put("/update/:id", updateTemplate);
router.get("/getall", getTemplates);

export default router;
