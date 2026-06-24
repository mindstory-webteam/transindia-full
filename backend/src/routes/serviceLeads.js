const express = require("express");
const router = express.Router();

const {
  createServiceLead,
  getAllServiceLeads,
  getServiceLeadStats,
  getServiceLeadById,
  updateServiceLead,
  deleteServiceLead,
} = require("../controllers/serviceLeadController");

// Auth middleware — resolved defensively so this works regardless of how your
// middleware/auth.js exports it (named `protect`, named `auth`, a default
// export, or `module.exports = fn`). If yours is named differently and this
// guesses wrong, just replace the line below with your real import.
const authModule = require("../middleware/auth");
const protect =
  authModule.protect || authModule.auth || authModule.default || authModule;

// ── Public: the website premium form submits here ──
router.post("/", createServiceLead);

// ── Admin (protected) ──
// NOTE: /stats is declared before /:id so "stats" isn't captured as an :id.
router.get("/", protect, getAllServiceLeads);
router.get("/stats", protect, getServiceLeadStats);
router.get("/:id", protect, getServiceLeadById);
router.patch("/:id", protect, updateServiceLead);
router.delete("/:id", protect, deleteServiceLead);

module.exports = router;