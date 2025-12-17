import Order from "../models/Order.js";

const trackingSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // 1️⃣ USER: order tracking start
    socket.on("joinOrder", (orderId) => {
      socket.join(orderId);
      console.log("👤 User tracking order:", orderId);
    });

    // 2️⃣ DELIVERY SIDE: live location send
    socket.on("sendLocation", async ({ orderId, lat, lng }) => {
      try {
        // order check
        const order = await Order.findById(orderId);
        if (!order) return;

        // DB backup
        order.currentLocation = { lat, lng };
        await order.save();

        // 🔥 LIVE PUSH
        io.to(orderId).emit("liveLocation", {
          orderId,
          lat,
          lng,
          updatedAt: Date.now(),
        });
      } catch (err) {
        console.log("Tracking error:", err.message);
      }
    });
  });
};

export default trackingSocket;
