const Event = require("../models/Event");
const { fetchLiveOdds } = require("../services/apiService.js");

const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event Not Found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
};

const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      status: "open",
    });
    await event.save();
    res.status(201).json({ message: "Event Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event.status === "closed") {
      return res.status(400).json({ message: "Cannot update a closed event" });
    }

    await Event.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Event Updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event.status === "closed") {
      return res.status(400).json({ message: "Cannot delete a closed event" });
    }

    // Optionally, we might want to ensure there are no active trades before deletion
    // Example: Check if there are any trades placed for this event
    const activeTrades = await Trade.find({
      eventId: event._id,
      status: "pending",
    });
    if (activeTrades.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete event with active trades" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};

const fetchAndStoreEvents = async (req, res) => {
  try {
    const oddsData = await fetchLiveOdds();

    if (!oddsData.length) {
      return res.status(404).json({ message: "No live events found" });
    }

    // Transform data to match Mongoose schema
    const formattedEvents = oddsData.map((event) => ({
      name: `${event.home_team} vs ${event.away_team}`,
      sport: event.sport_key,
      category: event.sport_title,
      startTime: new Date(event.commence_time),
      status: "upcoming",
      oddsData: event.odds,
    }));

    // Store events in MongoDB
    const events = await Event.insertMany(formattedEvents, { ordered: false });

    res.status(201).json({ message: "Events stored successfully", events });
  } catch (error) {
    console.error("Error storing events:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const closeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = "closed";
    await event.save();

    res.json({ message: "Event closed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error closing event", error });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchAndStoreEvents,
  closeEvent,
};
