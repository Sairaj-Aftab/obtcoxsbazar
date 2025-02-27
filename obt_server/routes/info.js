import express from "express";
import { getCountInfo } from "../controller/info.js";

const router = express.Router();

router.get("/", getCountInfo);

export default router;
