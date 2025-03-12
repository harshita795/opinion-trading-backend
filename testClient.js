const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

const userId = "67cfea9aa23e3c03590d9f12";

socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
  socket.emit("registerUser", userId); // Register this user
});

socket.on("tradeUpdate", (data) => {
  console.log("Trade Update:", data);
});

socket.on("tradeResult", (data) => {
  console.log("Trade Result:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
