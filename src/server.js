const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

const {
  fetchAndStoreEvents,
} = require("../src/controllers/eventController.js");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/admin", adminRoutes);

// Create HTTP Server for WebSocket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSockets = new Map(); // Store userId -> socketId mapping

// WebSocket Connection
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("registerUser", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of userSockets) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Attach io to app (for use in controllers)
app.set("io", io);
app.set("userSockets", userSockets);

// const interval = setInterval(async () => {
//   try {
//     const data = await fetchAndStoreEvents();
//     console.log("Fetched events:", data);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//   }
// }, 10000);

// Start server
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, server };
