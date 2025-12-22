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

    // 1️⃣ USER/DELIVERY BOY: Join order-specific room using orderId
    socket.on("joinOrderRoom", (orderId) => {
      try {
        if (!orderId) {
          console.warn("⚠️  Invalid orderId for room join");
          return;
        }

        // Prevent unlimited room joins per socket (basic safety)
        const MAX_ROOMS_PER_SOCKET = Number(process.env.SOCKET_MAX_ROOMS || 5);
        const joinedRooms = [...socket.rooms].filter((r) => r !== socket.id);
        if (joinedRooms.length >= MAX_ROOMS_PER_SOCKET) {
          console.warn("⚠️  Room join limit reached for", socket.id);
          return;
        }

        // Join order-specific room
        socket.join(orderId);
        console.log(`👥 Socket ${socket.id} joined room: ${orderId}`);
      } catch (e) {
        console.warn("joinOrderRoom error:", e.message);
      }
    });

    // 2️⃣ DELIVERY BOY: Live location update
    socket.on("deliveryLocationUpdate", async ({ orderId, lat, lng }) => {
      try {
        // Basic validation
        if (!orderId || typeof lat !== "number" || typeof lng !== "number") {
          console.warn("⚠️  Invalid location update data");
          return;
        }

        console.log(`📍 Location update for order ${orderId}:`, { lat, lng });

        // Broadcast live location to ALL users in the order room (REAL-TIME)
        io.to(orderId).emit("deliveryLocationUpdate", {
          orderId,
          lat,
          lng,
          timestamp: new Date().toISOString(),
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
        console.error("❌ deliveryLocationUpdate error:", err.message);
      }
    });

    // 3️⃣ DELIVERY BOY: Order acceptance
    socket.on("orderAccepted", async ({ orderId, deliveryBoyId }) => {
      try {
        if (!orderId || !deliveryBoyId) {
          console.warn("⚠️  Invalid orderAccepted data");
          return;
        }

        console.log(`✅ Order ${orderId} accepted by delivery boy ${deliveryBoyId}`);

        // Broadcast to all users in the order room that order was accepted
        io.to(orderId).emit("orderAccepted", {
          orderId,
          deliveryBoyId,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error("❌ orderAccepted error:", err.message);
      }
    });

    // 4️⃣ ORDER STATUS UPDATE
    socket.on("orderStatusUpdate", async ({ orderId, status, deliveryStatus }) => {
      try {
        if (!orderId) {
          console.warn("⚠️  Invalid orderId for status update");
          return;
        }

        console.log(`📢 Order ${orderId} status update:`, { status, deliveryStatus });

        // Broadcast status update to all users in the order room
        io.to(orderId).emit("orderStatusUpdate", {
          orderId,
          status: status || null,
          deliveryStatus: deliveryStatus || null,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error("❌ orderStatusUpdate error:", err.message);
      }
    });

    // Legacy: USER joining order tracking (for backward compatibility)
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

    // Legacy: DELIVERY BOY sending location (for backward compatibility with DeliveryApp.jsx)
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
