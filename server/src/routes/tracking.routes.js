import express from "express";
import {
  getTrackingDetails,
  getOrderLocation,
  updateOrderLocation,
} from "../controllers/tracking.controller.js";

const router = express.Router();



router.get("/orders/:orderId/tracking", getTrackingDetails);
router.get("/orders/:orderId/location", getOrderLocation);
router.post("/orders/:orderId/location", updateOrderLocation);

export default router;
