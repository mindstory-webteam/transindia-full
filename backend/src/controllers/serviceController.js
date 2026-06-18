const Service    = require("../models/Service");
const cloudinary = require("../config/cloudinary");

// ── Helper: delete a Cloudinary image by URL ─────────────────────────────────
function extractPublicId(url) {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const afterUpload = parts[1].replace(/^v\d+\//, "");
    return afterUpload.replace(/\.[^/.]+$/, "");
  } catch { return null; }
}

async function deleteFromCloudinary(url) {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  try { await cloudinary.uploader.destroy(publicId); }
  catch (err) { console.warn("Cloudinary delete:", err.message); }
}

// ── Shared body parser ───────────────────────────────────────────────────────
function parseBody(rawBody) {
  const body = { ...rawBody };
  const jsonFields = ["heroStats","benefits","stages","faqs","calcFields","features","whyBody","withoutItems","withItems"];
  jsonFields.forEach((f) => {
    if (body[f] && typeof body[f] === "string") {
      try { body[f] = JSON.parse(body[f]); } catch (_) {}
    }
  });
  if (body.sortOrder !== undefined) body.sortOrder = Number(body.sortOrder);
  if (body.isActive  !== undefined) body.isActive  = body.isActive === "true" || body.isActive === true;
  return body;
}

// ── GET /api/services ────────────────────────────────────────────────────────
exports.getServices = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.type) filter.serviceType = req.query.type;
    const services = await Service.find(filter).sort({ sortOrder: 1, createdAt: 1 }).select("-__v");
    res.json({ success: true, count: services.length, data: services });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── GET /api/services/admin/all ──────────────────────────────────────────────
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ sortOrder: 1, createdAt: 1 }).select("-__v");
    res.json({ success: true, count: services.length, data: services });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── GET /api/services/:slug ──────────────────────────────────────────────────
exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── POST /api/services ───────────────────────────────────────────────────────
// Images are uploaded directly from the browser to Cloudinary.
// The body just contains the Cloudinary URL string in body.image (and icon fields).
// No multer / file handling needed here.
exports.createService = async (req, res) => {
  try {
    const body = parseBody(req.body);
    const service = await Service.create(body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    console.error("createService error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── PUT /api/services/:id ────────────────────────────────────────────────────
exports.updateService = async (req, res) => {
  try {
    const body = parseBody(req.body);

    // If the main image changed, delete the old one from Cloudinary
    if (body.image !== undefined) {
      const old = await Service.findById(req.params.id);
      if (old?.image && old.image !== body.image && old.image.includes("cloudinary.com")) {
        await deleteFromCloudinary(old.image);
      }
    }

    const service = await Service.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) {
    console.error("updateService error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/services/:id ─────────────────────────────────────────────────
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    if (service.image) await deleteFromCloudinary(service.image);
    await service.deleteOne();
    res.json({ success: true, message: "Service deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── PATCH /api/services/:id/toggle ──────────────────────────────────────────
exports.toggleActive = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    service.isActive = !service.isActive;
    await service.save();
    res.json({ success: true, data: service });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ── PATCH /api/services/admin/reorder ───────────────────────────────────────
exports.reorderServices = async (req, res) => {
  try {
    await Promise.all(req.body.map(({ id, sortOrder }) => Service.findByIdAndUpdate(id, { sortOrder })));
    res.json({ success: true, message: "Order updated" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};