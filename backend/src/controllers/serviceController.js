const Service = require("../models/Service");
const path = require("path");
const fs = require("fs");

// helper — build full image URL
const imageUrl = (req, filename) =>
  filename ? `${req.protocol}://${req.get("host")}/uploads/${filename}` : "";

// ── GET /api/services  (public — all active, sorted) ─────────────────────
exports.getServices = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.type) filter.serviceType = req.query.type;

    const services = await Service.find(filter)
      .sort({ sortOrder: 1, createdAt: 1 })
      .select("-__v");

    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/services/all  (admin — includes inactive) ───────────────────
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ sortOrder: 1, createdAt: 1 }).select("-__v");
    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/services/:slug ───────────────────────────────────────────────
exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service)
      return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/services  (admin) ───────────────────────────────────────────
exports.createService = async (req, res) => {
  try {
    const body = { ...req.body };

    // Parse JSON arrays/objects sent as strings from FormData
    const jsonFields = [
      "heroStats","benefits","stages","faqs","calcFields",
      "features","whyBody","withoutItems","withItems",
    ];
    jsonFields.forEach((f) => {
      if (body[f] && typeof body[f] === "string") {
        try { body[f] = JSON.parse(body[f]); } catch (_) {}
      }
    });

    // If image uploaded via multer
    if (req.file) body.image = `/uploads/${req.file.filename}`;

    const service = await Service.create(body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── PUT /api/services/:id  (admin) ────────────────────────────────────────
exports.updateService = async (req, res) => {
  try {
    const body = { ...req.body };

    const jsonFields = [
      "heroStats","benefits","stages","faqs","calcFields",
      "features","whyBody","withoutItems","withItems",
    ];
    jsonFields.forEach((f) => {
      if (body[f] && typeof body[f] === "string") {
        try { body[f] = JSON.parse(body[f]); } catch (_) {}
      }
    });

    if (req.file) {
      // Delete old image if exists
      const old = await Service.findById(req.params.id);
      if (old?.image) {
        const oldPath = path.join(__dirname, "../", old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      body.image = `/uploads/${req.file.filename}`;
    }

    const service = await Service.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!service)
      return res.status(404).json({ success: false, message: "Service not found" });

    res.json({ success: true, data: service });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/services/:id  (admin) ────────────────────────────────────
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ success: false, message: "Service not found" });

    // Remove uploaded image
    if (service.image) {
      const imgPath = path.join(__dirname, "../", service.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await service.deleteOne();
    res.json({ success: true, message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/services/:id/toggle  (admin — toggle active) ──────────────
exports.toggleActive = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ success: false, message: "Service not found" });
    service.isActive = !service.isActive;
    await service.save();
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/services/reorder  (admin — update sort orders) ────────────
exports.reorderServices = async (req, res) => {
  // body: [{ id, sortOrder }, ...]
  try {
    const updates = req.body;
    await Promise.all(
      updates.map(({ id, sortOrder }) =>
        Service.findByIdAndUpdate(id, { sortOrder })
      )
    );
    res.json({ success: true, message: "Order updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};