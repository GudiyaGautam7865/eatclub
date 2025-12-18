import { io } from "socket.io-client";

console.log("🚀 test-user script started");

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const orderId = "6937f450626cfea15d879958";

socket.on("connect", () => {
  console.log("👤 USER connected:", socket.id);

  socket.emit("joinOrder", orderId);
  console.log("👀 Joined order room:", orderId);
});

socket.on("liveLocation", (data) => {
  console.log("📡 LIVE LOCATION RECEIVED:", data);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket error:", err.message);
});
