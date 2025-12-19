import express from "express";
import {
  getTrackingDetails,
  getOrderLocation,
  updateOrderLocation,
  assignDelivery,
  updateUserLocation,
} from "../controllers/tracking.controller.js";

const router = express.Router();



router.get("/orders/:orderId/tracking", getTrackingDetails);
router.get("/orders/:orderId/location", getOrderLocation);
router.post("/orders/:orderId/location", updateOrderLocation);
router.post("/orders/:orderId/assign-delivery", assignDelivery);
router.post("/orders/:orderId/user-location", updateUserLocation);

export default router;
