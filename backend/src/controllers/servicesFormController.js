const ServiceLead = require("../models/ServicesForm");
const cloudinary = require("../config/cloudinary");

// slug → form type, so the server never trusts the client for it.
const SLUG_FORM_TYPE = {
  "life-insurance": "calculator",
  "health-insurance": "calculator",
  "motor-insurance": "motor",
  "miscellaneous-insurance": "miscellaneous",
  "home-insurance": "simple",
  "travel-insurance": "simple",
  "marine-insurance": "simple",
  "fire-insurance": "simple",
  "entertainment-insurance": "simple",
  "risk-consultation": "simple",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * The public calculator sends estimate keys
 *   { coverageLabel, primaryAmount, secondaryAmount, total, ... }
 * but the admin table reads { coverage, monthly, yearly, total }.
 * Normalise here so the dashboard renders correctly either way.
 */
function normalizeEstimate(estimate) {
  if (!estimate || typeof estimate !== "object") return undefined;
  return {
    coverage: estimate.coverage ?? estimate.coverageLabel ?? "",
    monthly: estimate.monthly ?? estimate.primaryAmount ?? "",
    yearly: estimate.yearly ?? estimate.secondaryAmount ?? "",
    total: estimate.total ?? "",
    coverageCaption: estimate.coverageCaption ?? "",
    totalLabel: estimate.totalLabel ?? "",
    note: estimate.note ?? "",
    disclaimer: estimate.disclaimer ?? "",
  };
}

// ─────────────────────────────────────────────────────────────────────
// CREATE  —  POST /api/serviceleads   (public)
// JSON for calculator/simple/miscellaneous; multipart for motor (+ file).
// ─────────────────────────────────────────────────────────────────────
exports.createServiceLead = async (req, res, next) => {
  try {
    const b = req.body || {};

    // Server-side validation (mirrors the frontend; never trust the client).
    const name = (b.name || "").trim();
    const email = (b.email || "").trim();
    const phoneDigits = (b.phone || "").replace(/\D/g, "");

    if (!name) return res.status(400).json({ success: false, message: "Name is required." });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ success: false, message: "A valid email is required." });
    if (phoneDigits.length < 10) return res.status(400).json({ success: false, message: "A valid 10-digit phone number is required." });
    if (!b.serviceSlug) return res.status(400).json({ success: false, message: "serviceSlug is required." });

    const formType = SLUG_FORM_TYPE[b.serviceSlug] || b.formType || "simple";

    // estimate arrives as object (JSON) or string (FormData).
    let estimateRaw = b.estimate;
    if (typeof estimateRaw === "string") {
      try {
        estimateRaw = JSON.parse(estimateRaw);
      } catch {
        estimateRaw = undefined;
      }
    }

    // Per-type required-field checks.
    if (formType === "motor") {
      if (!(b.insuranceNumber || "").trim()) {
        return res.status(400).json({ success: false, message: "Insurance policy number is required." });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Please upload your old insurance document." });
      }
    }
    if (formType === "miscellaneous" && !(b.insuranceTypes || "").trim()) {
      return res.status(400).json({ success: false, message: "Please describe your insurance needs." });
    }

    const lead = await ServiceLead.create({
      serviceSlug: b.serviceSlug,
      serviceTitle: b.serviceTitle,
      formType,
      source: b.source || "website",

      name,
      email,
      phone: (b.phone || "").trim(),

      // calculator + about-you (aliases mapped to schema field names)
      dob: b.dob,
      gender: b.gender,
      maritalStatus: b.marital,
      address: b.address,
      smoker: b.smoker,
      sumAssured: b.sumAssured,
      policyTerm: b.term,
      annualIncome: b.income,
      coverType: b.coverType,
      sumInsured: b.sumInsured,
      conditions: b.conditions,
      cityTier: b.cityTier,

      insuranceNumber: b.insuranceNumber,
      insuranceTypes: b.insuranceTypes,

      // Cloudinary: req.file.path = secure_url, req.file.filename = public_id
      insuranceDocument: req.file ? req.file.path : undefined,
      insuranceDocumentPublicId: req.file ? req.file.filename : undefined,

      estimate: normalizeEstimate(estimateRaw),
      rawData: b,
    });

    return res.status(201).json({
      success: true,
      message: "Lead submitted successfully.",
      data: { id: lead._id, formType: lead.formType },
    });
  } catch (err) {
    next(err); // handled by the global error handler in server.js
  }
};

// ─────────────────────────────────────────────────────────────────────
// LIST  —  GET /api/serviceleads?status=&slug=&formType=   (admin)
// ─────────────────────────────────────────────────────────────────────
exports.getServiceLeads = async (req, res, next) => {
  try {
    const { status, slug, formType } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (slug) filter.serviceSlug = slug;
    if (formType) filter.formType = formType;

    const leads = await ServiceLead.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────
// STATS  —  GET /api/serviceleads/stats   (admin)
// Returns { total, byStatus: { new, contacted, converted, closed } }
// ─────────────────────────────────────────────────────────────────────
exports.getServiceLeadStats = async (req, res, next) => {
  try {
    const total = await ServiceLead.countDocuments();
    const agg = await ServiceLead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const byStatus = { new: 0, contacted: 0, converted: 0, closed: 0 };
    agg.forEach((a) => {
      if (a._id && byStatus[a._id] !== undefined) byStatus[a._id] = a.count;
    });

    res.json({ success: true, data: { total, byStatus } });
  } catch (err) {
    next(err);
  }
};

// GET ONE  —  GET /api/serviceleads/:id   (admin)
exports.getServiceLeadById = async (req, res, next) => {
  try {
    const lead = await ServiceLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found." });
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// UPDATE status / notes  —  PUT /api/serviceleads/:id   (admin)
exports.updateServiceLead = async (req, res, next) => {
  try {
    const update = {};
    if (req.body.status) update.status = req.body.status;
    if (req.body.notes !== undefined) update.notes = req.body.notes;

    const lead = await ServiceLead.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found." });
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// DELETE  —  DELETE /api/serviceleads/:id   (admin)
exports.deleteServiceLead = async (req, res, next) => {
  try {
    const lead = await ServiceLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found." });

    // Remove the attached document from Cloudinary too.
    if (lead.insuranceDocumentPublicId) {
      const isPdf = (lead.insuranceDocument || "").toLowerCase().endsWith(".pdf");
      try {
        await cloudinary.uploader.destroy(lead.insuranceDocumentPublicId, {
          resource_type: isPdf ? "raw" : "image",
        });
      } catch (e) {
        console.error("Cloudinary delete failed:", e.message);
      }
    }

    await lead.deleteOne();
    res.json({ success: true, message: "Lead deleted." });
  } catch (err) {
    next(err);
  }
};