const Lead = require("../models/Lead");
const Service = require("../models/Service");

// ── POST /api/leads  (public — quote form submission) ─────────────────────
exports.createLead = async (req, res) => {
  try {
    const { serviceSlug, ...formData } = req.body;
    if (!serviceSlug)
      return res.status(400).json({ success: false, message: "serviceSlug is required" });

    const service = await Service.findOne({ slug: serviceSlug }).select("title");
    const lead = await Lead.create({
      serviceSlug,
      serviceTitle: service?.title || "",
      formData,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, message: "Quote request received!", data: { id: lead._id } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── GET /api/leads  (admin) ───────────────────────────────────────────────
exports.getLeads = async (req, res) => {
  try {
    const { status, serviceSlug, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (serviceSlug) filter.serviceSlug = serviceSlug;

    const skip = (Number(page) - 1) * Number(limit);
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Lead.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: Number(page), data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/leads/:id  (admin) ───────────────────────────────────────────
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/leads/:id  (admin — update status/notes) ──────────────────
exports.updateLead = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );
    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/leads/:id  (admin) ────────────────────────────────────────
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/leads/stats  (admin — dashboard numbers) ────────────────────
exports.getStats = async (req, res) => {
  try {
    const [total, byStatus, byService] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Lead.aggregate([
        { $group: { _id: "$serviceSlug", count: { $sum: 1 }, title: { $first: "$serviceTitle" } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const statusMap = {};
    byStatus.forEach((s) => (statusMap[s._id] = s.count));

    res.json({ success: true, data: { total, byStatus: statusMap, byService } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};