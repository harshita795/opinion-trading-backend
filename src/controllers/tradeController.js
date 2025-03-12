const Trade = require("../models/Trade");
const User = require("../models/User");
const Event = require("../models/Event");

const placeTrade = async (req, res) => {
  try {
    // Extract and rename fields correctly
    const { eventId, amount, prediction } = req.body;

    // Ensure required fields are present
    if (!eventId || !amount || !prediction) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new trade with fields
    const trade = new Trade({
      event: eventId,
      amount,
      choice: prediction,
      user: req.user.id,
    });

    await trade.save();

    // Emit trade event
    const io = req.app.get("io");
    io.emit("tradeUpdate", { message: "New trade placed", trade });

    res.status(201).json({ message: "Trade placed successfully", trade });
  } catch (error) {
    console.error("Error placing trade:", error.message);
    res.status(500).json({ message: "Error placing trade", error });
  }
};

const getTrades = async (req, res) => {
  try {
    const trades = await Trade.find()
      .populate("event", "_id") // Populate only the event ID
      .select("_id event amount choice status");

    // Format response
    const formattedTrades = trades.map((trade) => ({
      _id: trade._id,
      eventId: trade.event ? trade.event._id : null,
      amount: trade.amount,
      prediction: trade.choice,
      status: trade.status,
    }));

    res.status(200).json(formattedTrades);
  } catch (error) {
    console.error("Error fetching trades:", error.message);
    res.status(500).json({ message: "Error fetching trades", error });
  }
};

const updateTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ message: "Trade not found" });

    if (trade.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Trade.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Emit trade update event
    const io = req.app.get("io");
    io.emit("tradeUpdate", { message: "Trade updated", trade });

    res.json({ message: "Trade updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating trade", error });
  }
};

const cancelTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ message: "Trade not found" });

    if (trade.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Trade.findByIdAndDelete(req.params.id);

    // Emit trade cancellation event
    const io = req.app.get("io");
    io.emit("tradeUpdate", { message: "Trade canceled", trade });

    res.json({ message: "Trade canceled" });
  } catch (error) {
    res.status(500).json({ message: "Error canceling trade", error });
  }
};

const settleTrades = async (req, res) => {
  try {
    const { eventId, outcome } = req.body;

    // Fetch trades related to the event
    const trades = await Trade.find({ event: eventId, status: "pending" });

    if (!trades.length) {
      return res
        .status(404)
        .json({ message: "No pending trades found for this event" });
    }

    // Get the io instance
    const io = req.app.get("io");
    const userSockets = req.app.get("userSockets");

    const settledTrades = [];

    for (let trade of trades) {
      let status = "lost";
      let payout = 0;

      // Check if the trade choice matches the event outcome
      if (trade.choice.toLowerCase().trim() === outcome.toLowerCase().trim()) {
        status = "won";
        payout = trade.amount * 2; // Example: Double the amount if won

        // Check if the user exists
        const user = await User.findById(trade.user);
        if (!user) {
          return res
            .status(404)
            .json({ message: `User not found for trade: ${trade._id}` });
        }

        // Update user balance
        await User.findByIdAndUpdate(trade.user, { $inc: { balance: payout } });

        // Add to settledTrades
        settledTrades.push({ tradeId: trade._id, status, payout });
      }

      // Update trade status
      await Trade.findByIdAndUpdate(trade._id, { status, payout });

      // Emit WebSocket event (only if the user has an active socket)
      if (userSockets.has(trade.user.toString())) {
        const socketId = userSockets.get(trade.user.toString());
        if (socketId) {
          io.to(socketId).emit("tradeResult", {
            message: `Your trade on event ${eventId} is ${status}`,
            tradeId: trade._id,
            status,
            payout,
          });
        }
      }
    }

    res.json({
      message: "Trades settled successfully",
      settledTrades,
    });
  } catch (error) {
    console.error("Error settling trades:", error);
    res.status(500).json({ message: "Error settling trades", error });
  }
};

module.exports = {
  placeTrade,
  getTrades,
  updateTrade,
  cancelTrade,
  settleTrades,
};
