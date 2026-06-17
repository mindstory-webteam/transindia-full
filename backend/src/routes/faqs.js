const express = require("express");
const router = express.Router();

// FAQs are embedded inside each Service document.
// This route provides a convenience endpoint to get FAQs for a service.
router.get("/:slug", async (req, res) => {
  const Service = require("../models/Service");
  try {
    const service = await Service.findOne({ slug: req.params.slug }).select("faqs title");
    if (!service)
      return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service.faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;