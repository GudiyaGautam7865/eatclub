import Order from "../models/Order.js";
import { persistOrderLocation } from "../utils/trackingPersist.js";

// Socket-based tracking should broadcast freely but persist to DB with backpressure
// WHY: Saving on every tick causes connection pool saturation and event-loop stalls.
const trackingSocket = (io) => {
  io.on("connection", (socket) => {
    // Basic connection logging + client count for observability
    console.log("🔌 Socket connected:", socket.id, "clients:", io.engine.clientsCount);

    // Track per-socket activity to guard against extreme flood patterns
    // (We DO NOT alter broadcast behavior here; we only detect and log floods.)
    socket.data.lastLocationTs = 0;

    // 1️⃣ USER: order tracking start
    socket.on("joinOrder", (orderId) => {
      try {
        // Prevent unlimited room joins per socket (basic safety)
        const MAX_ROOMS_PER_SOCKET = Number(process.env.SOCKET_MAX_ROOMS || 5);
        const joinedRooms = [...socket.rooms].filter((r) => r !== socket.id);
        if (joinedRooms.length >= MAX_ROOMS_PER_SOCKET) {
          console.warn("⚠️  Room join limit reached for", socket.id);
          return;
        }

        // Join order-specific room
        socket.join(orderId);
        console.log("👤 User tracking order:", orderId);
      } catch (e) {
        console.warn("joinOrder error:", e.message);
      }
    });

    // 2️⃣ DELIVERY SIDE: live location send
    socket.on("sendLocation", async ({ orderId, lat, lng }) => {
      try {
        // Basic validation
        if (!orderId || typeof lat !== "number" || typeof lng !== "number") return;

        // Broadcast live location immediately (keep behavior same)
        io.to(orderId).emit("liveLocation", {
          orderId,
          lat,
          lng,
          updatedAt: Date.now(),
        });

        // Detect extreme flood rates per socket for observability
        const now = Date.now();
        const minEmitGap = Number(process.env.SOCKET_LOCATION_MIN_INTERVAL_MS || 0); // 0 = no cap
        if (minEmitGap > 0 && socket.data.lastLocationTs && now - socket.data.lastLocationTs < minEmitGap) {
          console.warn("⚠️  High-frequency location emits from", socket.id, "interval(ms):", now - socket.data.lastLocationTs);
        }
        socket.data.lastLocationTs = now;

        // Persist to DB only if throttling allows (shared logic avoids duplicate writes)
        const result = await persistOrderLocation(orderId, lat, lng);
        if (!result.persisted && result.reason) {
          // Log throttling/no-change for diagnostics without impacting client behavior
          console.debug("ℹ️  Persist skipped:", result.reason, "order:", orderId);
        }
      } catch (err) {
        console.log("Tracking error:", err.message);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", socket.id, "reason:", reason, "clients:", io.engine.clientsCount);
      // Cleanup per-socket state to avoid leaks
      socket.data.lastLocationTs = 0;
    });
  });
};

export default trackingSocket;
