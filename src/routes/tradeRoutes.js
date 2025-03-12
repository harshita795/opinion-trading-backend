const express = require("express");
const {
  placeTrade,
  getTrades,
  updateTrade,
  cancelTrade,
  settleTrades,
} = require("../controllers/tradeController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, placeTrade);
router.get("/", protect, getTrades);
router.put("/:id", protect, updateTrade);
router.delete("/:id", protect, cancelTrade);
router.post("/settle", protect, settleTrades);

module.exports = router;
