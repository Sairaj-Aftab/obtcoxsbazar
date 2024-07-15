import express from "express";
import {
  createPlace,
  deletePlace,
  getDestinationsPlaces,
  getLeavingPlaces,
  getPlaces,
} from "../controller/places.js";

const router = express.Router();

router.post("/", createPlace);
router.get("/", getPlaces);
router.get("/leave", getLeavingPlaces);
router.get("/destination", getDestinationsPlaces);
router.delete("/:id", deletePlace);

export default router;
