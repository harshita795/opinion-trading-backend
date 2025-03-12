const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sport: { type: String, required: true },
    category: { type: String }, // E.g., "Football", "Cricket"
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
    result: { type: String }, // Store event outcome
    startTime: { type: Date, required: true },
    scores: {
      home: { type: Number, default: 0 },
      away: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
