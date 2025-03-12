const express = require("express");
const { placeTrade } = require("../controllers/tradeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Users can place trades
router.post("/trade", protect, placeTrade);

module.exports = router;
