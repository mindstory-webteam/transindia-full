const express = require("express");
const router = express.Router();
const {
  getServices, getAllServices, getServiceBySlug,
  createService, updateService, deleteService,
  toggleActive, reorderServices,
} = require("../controllers/serviceController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public
router.get("/",         getServices);
router.get("/:slug",    getServiceBySlug);

// Admin (protected)
router.get("/admin/all",            protect, getAllServices);
router.post("/",                    protect, upload.single("image"), createService);
router.put("/:id",                  protect, upload.single("image"), updateService);
router.delete("/:id",               protect, deleteService);
router.patch("/:id/toggle",         protect, toggleActive);
router.patch("/admin/reorder",      protect, reorderServices);

module.exports = router;