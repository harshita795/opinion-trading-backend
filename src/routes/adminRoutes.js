const express = require("express");
const { settleTrades } = require("../controllers/tradeController");
const { createEvent, deleteEvent } = require("../controllers/eventController");
const { protect, admin } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Only admins can manage events and trades
router.post("/event", protect, admin, createEvent);
router.delete("/event/:id", protect, admin, deleteEvent);
router.post("/settle-trades", protect, admin, settleTrades);

module.exports = router;
