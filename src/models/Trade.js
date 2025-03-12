const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  amount: { type: Number, required: true },
  choice: { type: String, required: true }, // e.g., "Team A wins"
  status: {
    type: String,
    enum: ["pending", "won", "lost"],
    default: "pending",
  },
  payout: { type: Number, default: 0 },
});

module.exports = mongoose.model("Trade", tradeSchema);
