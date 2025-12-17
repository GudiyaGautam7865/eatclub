import { io } from "socket.io-client";

console.log("🚀 test-delivery script started");

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnectionAttempts: 3,
});

const orderId = "6937f450626cfea15d879958";

socket.on("connect", () => {
  console.log("🚴 DELIVERY connected:", socket.id);

  setInterval(() => {
    const lat = 19 + Math.random();
    const lng = 72 + Math.random();

    console.log("📤 Sending location...");
    socket.emit("sendLocation", { orderId, lat, lng });
  }, 3000);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connect error:", err.message);
});

socket.on("disconnect", () => {
  console.log("⚠️ Socket disconnected");
});
