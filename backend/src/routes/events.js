// src/routes/events.js
const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadEvents");
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// If you have auth middleware (you already have /api/auth), protect the
// mutating routes. Adjust the import to match your project, e.g.:
//   const { protect, admin } = require("../middleware/auth");
// then add it before the handler:  router.post("/", protect, admin, upload.array(...), createEvent);

// Public reads
router.get("/", getEvents);
router.get("/:id", getEvent);

// Admin writes — "images" is the form-data field name, max 10 files
router.post("/", upload.array("images", 10), createEvent);
router.put("/:id", upload.array("images", 10), updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;