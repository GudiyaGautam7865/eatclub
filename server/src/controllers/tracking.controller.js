import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { persistOrderLocation } from "../utils/trackingPersist.js";

// 1️⃣ Tracking page load
export const getTrackingDetails = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  const order = await Order.findById(orderId).select(
    "status deliveryStatus driverName driverPhone driverVehicleNumber currentLocation userLocation address items total createdAt statusHistory"
  );

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  res.json({
    success: true,
    data: {
      orderId: order._id,
      status: order.status,
      deliveryStatus: order.deliveryStatus || null,
      driver: order.driverName
        ? { 
            name: order.driverName, 
            phone: order.driverPhone,
            vehicleNumber: order.driverVehicleNumber 
          }
        : null,
      userLocation: order.userLocation,
      deliveryAddress: order.address,
      orderDetails: {
        items: order.items,
        total: order.total,
        placedAt: order.createdAt
      },
      currentLocation: order.currentLocation || null,
      statusHistory: Array.isArray(order.statusHistory) ? order.statusHistory : [],
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

  // Minimize DB reads: authorize based on stored fields when available with lean lookup
  const order = await Order.findById(orderId).select("driverId driverPhone").lean();
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const driverId = req.user && (req.user._id || req.user.id);
  const phone = req.user?.phone || req.user?.phoneNumber;
  if (order.driverId && driverId && order.driverId.toString() !== driverId.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to update this order" });
  }
  if (!order.driverId && order.driverPhone && phone && order.driverPhone !== phone) {
    return res.status(403).json({ success: false, message: "Not authorized to update this order" });
  }

  // Persist only if throttling allows (shared utility ensures no duplicate writes vs socket)
  const result = await persistOrderLocation(orderId, Number(lat), Number(lng));
  if (!result.persisted) {
    return res.json({ success: true, message: "Location update accepted" });
  }

  res.json({ success: true, message: "Location updated" });
};

// 4️⃣ Delivery assignment
export const assignDelivery = async (req, res) => {
  const { orderId } = req.params;
  const { driverName, driverPhone, driverVehicleNumber, driverId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (driverId) {
    order.driverId = driverId;
  }
  order.driverName = driverName;
  order.driverPhone = driverPhone;
  order.driverVehicleNumber = driverVehicleNumber;
  order.status = "OUT_FOR_DELIVERY";
  order.deliveryStatus = "ASSIGNED";
  order.statusHistory = order.statusHistory || [];
  order.statusHistory.push({
    status: order.status,
    deliveryStatus: order.deliveryStatus,
    actorId: req.user ? (req.user._id || req.user.id) : undefined,
    actorRole: req.user ? req.user.role : 'ADMIN',
    timestamp: new Date(),
    note: 'Driver assigned',
  });
  // Bound status history to avoid unbounded growth
  const MAX_HISTORY = Number(process.env.ORDER_STATUS_HISTORY_MAX || 200);
  if (order.statusHistory.length > MAX_HISTORY) {
    order.statusHistory = order.statusHistory.slice(-MAX_HISTORY);
  }

  await order.save();

  res.json({ success: true, message: "Driver assigned successfully", data: order });
};

// 5️⃣ Update user location
export const updateUserLocation = async (req, res) => {
  const { orderId } = req.params;
  const { lat, lng } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  const order = await Order.findById(orderId).select('_id').lean();
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  await Order.updateOne(
    { _id: orderId },
    { $set: { userLocation: { lat: Number(lat), lng: Number(lng) } } }
  );

  res.json({ success: true, message: "User location updated" });
};

// 6️⃣ Delivery status updates (driver controls deliveryStatus only)
export const updateDeliveryStatus = async (req, res) => {
  const { orderId } = req.params;
  const { deliveryStatus } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  const validDeliveryStatuses = ['ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'];
  if (!validDeliveryStatuses.includes(deliveryStatus)) {
    return res.status(400).json({ success: false, message: `Invalid deliveryStatus. Must be one of: ${validDeliveryStatuses.join(', ')}` });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.status !== 'OUT_FOR_DELIVERY') {
    return res.status(400).json({ success: false, message: "Order is not out for delivery" });
  }

  const transitions = {
    ASSIGNED: ['PICKED_UP'],
    PICKED_UP: ['ON_THE_WAY'],
    ON_THE_WAY: ['DELIVERED'],
    DELIVERED: [],
    null: ['ASSIGNED'],
  };

  const current = order.deliveryStatus || null;
  const allowedNext = transitions[current] || [];
  if (!allowedNext.includes(deliveryStatus) && current !== deliveryStatus) {
    return res.status(400).json({ success: false, message: `Invalid transition from ${current || 'NONE'} to ${deliveryStatus}` });
  }

  order.deliveryStatus = deliveryStatus;
  
  // When deliveryStatus is DELIVERED, update main status to DELIVERED
  if (deliveryStatus === 'DELIVERED') {
    order.status = 'DELIVERED';
  }
  
  order.statusHistory = order.statusHistory || [];
  order.statusHistory.push({
    status: order.status,
    deliveryStatus,
    actorId: req.user ? (req.user._id || req.user.id) : undefined,
    actorRole: req.user ? req.user.role : 'DELIVERY',
    timestamp: new Date(),
    note: 'Delivery status updated',
  });
  const MAX_HISTORY = Number(process.env.ORDER_STATUS_HISTORY_MAX || 200);
  if (order.statusHistory.length > MAX_HISTORY) {
    order.statusHistory = order.statusHistory.slice(-MAX_HISTORY);
  }

  await order.save();

  res.json({ success: true, message: "Delivery status updated", data: order });
};

// 7️⃣ Driver: list assigned/in-progress orders for the logged-in delivery user
export const getDriverOrders = async (req, res) => {
  const driverId = req.user && (req.user._id || req.user.id);
  if (!driverId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const phone = req.user?.phone || req.user?.phoneNumber;

  // Build query conditions
  const conditions = [
    // Available orders for pickup
    { status: 'READY_FOR_PICKUP', driverId: { $exists: false } },
    { status: 'READY_FOR_PICKUP', driverId: null },
  ];

  // Only add driverId condition if it's a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(driverId)) {
    conditions.push({ driverId });
  }

  // Add phone condition if available
  if (phone) {
    conditions.push({ driverPhone: phone });
  }

  const orders = await Order.find({
    $or: conditions,
  })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: orders });
};

// 8️⃣ Driver accepts an available order
export const acceptOrderByDriver = async (req, res) => {
  const { orderId } = req.params;
  const driverId = req.user && (req.user._id || req.user.id);
  
  if (!driverId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  // Check if order is available for pickup
  if (order.status !== 'READY_FOR_PICKUP') {
    return res.status(400).json({ success: false, message: "Order is not ready for pickup" });
  }

  // Check if already assigned to another driver
  if (order.driverId && order.driverId.toString() !== driverId.toString()) {
    return res.status(400).json({ success: false, message: "Order already assigned to another driver" });
  }

  // Fetch driver details from User collection
  const driver = await User.findById(driverId).select('name phoneNumber phone vehicleNumber vehicleType');
  if (!driver) {
    return res.status(404).json({ success: false, message: "Driver not found" });
  }

  console.log(`✅ Driver found:`, {
    id: driver._id,
    name: driver.name,
    phone: driver.phone || driver.phoneNumber,
    vehicleNumber: driver.vehicleNumber
  });

  // Assign driver with details from User model
  order.driverId = driverId;
  order.driverName = driver.name || 'Driver';
  order.driverPhone = driver.phone || driver.phoneNumber;
  order.driverVehicleNumber = driver.vehicleNumber;
  order.status = "OUT_FOR_DELIVERY";
  order.deliveryStatus = "PICKED_UP";
  
  order.statusHistory = order.statusHistory || [];
  order.statusHistory.push({
    status: order.status,
    deliveryStatus: order.deliveryStatus,
    actorId: driverId,
    actorRole: 'DELIVERY',
    timestamp: new Date(),
    note: 'Order accepted by driver',
  });
  const MAX_HISTORY = Number(process.env.ORDER_STATUS_HISTORY_MAX || 200);
  if (order.statusHistory.length > MAX_HISTORY) {
    order.statusHistory = order.statusHistory.slice(-MAX_HISTORY);
  }

  await order.save();

  // Emit socket event to notify customer that order was accepted
  if (req.io) {
    const socketData = {
      orderId: orderId.toString(),
      deliveryBoyId: driverId.toString(),
      driverName: order.driverName,
      driverPhone: order.driverPhone,
      driverVehicleNumber: order.driverVehicleNumber,
      timestamp: new Date().toISOString()
    };
    
    req.io.to(orderId).emit('orderAccepted', socketData);
    console.log(`📢 Socket event 'orderAccepted' emitted for order ${orderId} with driver:`, {
      name: socketData.driverName,
      phone: socketData.driverPhone,
      vehicle: socketData.driverVehicleNumber
    });
  }

  res.json({ success: true, message: "Order accepted successfully", data: order });
};

// 9️⃣ Get user location for delivery boy
export const getUserLocationForDriver = async (req, res) => {
  const { orderId } = req.params;
  const driverId = req.user && (req.user._id || req.user.id);
  
  if (!driverId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid orderId" });
  }

  const order = await Order.findById(orderId).select('driverId driverPhone userLocation address user').populate('user', 'name phone phoneNumber');
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  // Verify driver is assigned to this order
  const phone = req.user?.phone || req.user?.phoneNumber;
  if (order.driverId && driverId && order.driverId.toString() !== driverId.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized for this order" });
  }
  if (!order.driverId && order.driverPhone && phone && order.driverPhone !== phone) {
    return res.status(403).json({ success: false, message: "Not authorized for this order" });
  }

  res.json({ 
    success: true, 
    data: {
      userLocation: order.userLocation,
      deliveryAddress: order.address,
      customerName: order.user?.name,
      customerPhone: order.user?.phone || order.user?.phoneNumber
    }
  });
};
