import mongoose from "mongoose";
import Order from "../models/Order.js";

// 1️⃣ Tracking page load
export const getTrackingDetails = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  const order = await Order.findById(orderId).select(
    "status driverName driverPhone currentLocation"
  );

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  res.json({
    success: true,
    data: {
      orderId: order._id,
      status: order.status,
      driver: order.driverName
        ? { name: order.driverName, phone: order.driverPhone }
        : null,
      currentLocation: order.currentLocation || null,
    },
  });
};

// 2️⃣ Page refresh
export const getOrderLocation = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  const order = await Order.findById(orderId).select("currentLocation");

  if (!order || !order.currentLocation) {
    return res.status(404).json({ success: false, message: "Location not available" });
  }

  res.json({ success: true, data: order.currentLocation });
};

// 3️⃣ Live location update
export const updateOrderLocation = async (req, res) => {
  const { orderId } = req.params;
  const { lat, lng } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  order.currentLocation = { lat, lng, updatedAt: new Date() };
  await order.save();

  // 🔥 socket push
  req.io.to(orderId).emit("liveLocation", {
    orderId,
    lat,
    lng,
    updatedAt: Date.now(),
  });

  res.json({ success: true, message: "Location updated" });
};

// 4️⃣ Delivery assignment
export const assignDelivery = async (req, res) => {
  const { orderId } = req.params;
  const { driverName, driverPhone } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  order.driverName = driverName;
  order.driverPhone = driverPhone;
  order.status = "OUT_FOR_DELIVERY";
  await order.save();

  // 🔥 socket push
  req.io.to(orderId).emit("driverAssigned", {
    orderId,
    driver: { name: driverName, phone: driverPhone },
    status: "OUT_FOR_DELIVERY"
  });

  res.json({ success: true, message: "Driver assigned successfully" });
};
