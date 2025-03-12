const express = require("express");
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  closeEvent,
} = require("../controllers/eventController");
const { fetchAndStoreEvents } = require("../controllers/eventController.js");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getEvents);
router.get("/fetch", protect, admin, fetchAndStoreEvents);
router.get("/:id", protect, getEvent);
router.post("/", protect, admin, createEvent);
router.put("/:id", protect, admin, updateEvent);
router.delete("/:id", protect, admin, deleteEvent);
router.post("/:id/close", protect, admin, closeEvent);

module.exports = router;
