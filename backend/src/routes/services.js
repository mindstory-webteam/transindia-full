const express = require("express");
const router  = express.Router();
const {
  getServices, getAllServices, getServiceBySlug,
  createService, updateService, deleteService,
  toggleActive, reorderServices,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/auth");

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", getServices);

// ── Admin static routes — MUST come before /:slug ────────────────────────────
router.get("/admin/all",       protect, getAllServices);
router.patch("/admin/reorder", protect, reorderServices);

// ── Admin CRUD — no upload middleware needed (images uploaded direct to Cloudinary from browser)
router.post("/",         protect, createService);
router.put("/:id",       protect, updateService);
router.delete("/:id",    protect, deleteService);
router.patch("/:id/toggle", protect, toggleActive);

// ── Public slug lookup — LAST ─────────────────────────────────────────────────
router.get("/:slug", getServiceBySlug);

module.exports = router;