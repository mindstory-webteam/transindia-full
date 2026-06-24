const ServiceLead = require("../models/ServiceLead");

// Wrap async handlers so thrown/rejected errors reach the global error middleware
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ── POST /api/serviceleads  (PUBLIC — the website premium form posts here) ──
exports.createServiceLead = wrap(async (req, res) => {
  const {
    name, email, phone,
    dob, maritalStatus, address, gender,
    smoker, sumAssured, policyTerm, annualIncome,
    estimate, serviceSlug, serviceTitle, source,
  } = req.body;

  if (!name || !email || !phone) {
    return res
      .status(400)
      .json({ success: false, message: "Name, email and phone are required." });
  }

  const lead = await ServiceLead.create({
    name, email, phone,
    dob, maritalStatus, address, gender,
    smoker, sumAssured, policyTerm, annualIncome,
    estimate: estimate || {},
    serviceSlug, serviceTitle,
    source: source || "website",
  });

  res.status(201).json({ success: true, message: "Lead captured", data: lead });
});

// ── GET /api/serviceleads  (admin) — supports ?status= & ?service= ──
exports.getAllServiceLeads = wrap(async (req, res) => {
  const { status, service } = req.query;
  const filter = {};
  if (status && status !== "all") filter.status = status;
  if (service) filter.serviceSlug = service;

  const leads = await ServiceLead.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: leads.length, data: leads });
});

// ── GET /api/serviceleads/stats  (admin) ──
exports.getServiceLeadStats = wrap(async (req, res) => {
  const total = await ServiceLead.countDocuments();

  const statusAgg = await ServiceLead.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const byStatus = { new: 0, contacted: 0, converted: 0, closed: 0 };
  statusAgg.forEach((s) => {
    if (s._id && byStatus[s._id] !== undefined) byStatus[s._id] = s.count;
  });

  const byService = await ServiceLead.aggregate([
    {
      $group: {
        _id: "$serviceSlug",
        title: { $first: "$serviceTitle" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.json({ success: true, data: { total, byStatus, byService } });
});

// ── GET /api/serviceleads/:id  (admin) ──
exports.getServiceLeadById = wrap(async (req, res) => {
  const lead = await ServiceLead.findById(req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  res.json({ success: true, data: lead });
});

// ── PATCH /api/serviceleads/:id  (admin) — update status / notes ──
exports.updateServiceLead = wrap(async (req, res) => {
  const { status, notes } = req.body;
  const update = {};
  if (status !== undefined) update.status = status;
  if (notes !== undefined) update.notes = notes;

  const lead = await ServiceLead.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  res.json({ success: true, message: "Lead updated", data: lead });
});

// ── DELETE /api/serviceleads/:id  (admin) ──
exports.deleteServiceLead = wrap(async (req, res) => {
  const lead = await ServiceLead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  res.json({ success: true, message: "Lead deleted" });
});