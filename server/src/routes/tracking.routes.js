import express from "express";
import {
  getTrackingDetails,
  getOrderLocation,
  updateOrderLocation,
  assignDelivery,
  updateUserLocation,
  updateDeliveryStatus,
  getDriverOrders,
  acceptOrderByDriver,
  getUserLocationForDriver,
} from "../controllers/tracking.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();



// Handle OPTIONS for preflight requests
router.options("*", (req, res) => {
  res.sendStatus(200);
});

router.get("/orders/:orderId/tracking", getTrackingDetails);
router.get("/orders/:orderId/location", getOrderLocation);
router.post("/orders/:orderId/location", authMiddleware, updateOrderLocation);
// Assigning delivery is an admin-only action
router.post("/orders/:orderId/assign-delivery", authMiddleware, adminMiddleware, assignDelivery);
router.post("/orders/:orderId/user-location", authMiddleware, updateUserLocation);
router.post("/orders/:orderId/delivery-status", authMiddleware, updateDeliveryStatus);
router.get("/driver/orders", authMiddleware, getDriverOrders);
router.post("/driver/orders/:orderId/accept", authMiddleware, acceptOrderByDriver);
router.get("/driver/orders/:orderId/user-location", authMiddleware, getUserLocationForDriver);

export default router;
