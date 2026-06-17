const express = require("express");
const router = express.Router();
const {
  createLead, getLeads, getLead,
  updateLead, deleteLead, getStats,
} = require("../controllers/leadController");
const { protect } = require("../middleware/auth");

// Public — quote form submit
router.post("/", createLead);

// Admin
router.get("/stats", protect, getStats);
router.get("/",      protect, getLeads);
router.get("/:id",   protect, getLead);
router.patch("/:id", protect, updateLead);
router.delete("/:id",protect, deleteLead);

module.exports = router;