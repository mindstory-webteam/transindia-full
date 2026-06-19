const Lead = require("../models/BmiLead");

/* Build a human-readable summary stored on the lead so it shows nicely
   in the dashboard "Message" column / detail page. */
function buildMessage(body) {
  const parts = [];
  if (body.bmi) parts.push(`BMI ${body.bmi}${body.bmiCategory ? ` (${body.bmiCategory})` : ""}`);
  if (Array.isArray(body.members) && body.members.length) {
    parts.push(`Members: ${body.members.join(", ")}`);
  }
  if (body.city) parts.push(`City: ${body.city}`);
  parts.push(`Existing illness: ${body.hasIllness ? "Yes" : "No"}`);
  return parts.join(" • ");
}

/* ─────────────────────────────────────────────────────────────
   POST /api/leads   (PUBLIC — submitted from the BMI calculator)
   ───────────────────────────────────────────────────────────── */
exports.createLead = async (req, res, next) => {
  try {
    const {
      name,
      fullName,
      email,
      phone,
      mobile,
      gender,
      city,
      members,
      memberAges,
      hasIllness,
      whatsappUpdates,
      bmi,
      bmiCategory,
    } = req.body;

    const leadName = (name || fullName || "").trim();
    const leadPhone = (phone || mobile || "").trim();

    if (!leadName || !email || !leadPhone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required.",
      });
    }

    const payload = {
      name: leadName,
      email: String(email).trim().toLowerCase(),
      phone: leadPhone,
      gender: gender === "female" ? "female" : "male",
      city: (city || "").trim(),
      members: Array.isArray(members) ? members : [],
      memberAges: Array.isArray(memberAges) ? memberAges : [],
      hasIllness: Boolean(hasIllness),
      whatsappUpdates: whatsappUpdates === undefined ? true : Boolean(whatsappUpdates),
      bmi: bmi != null ? Number(bmi) : null,
      bmiCategory: bmiCategory || "",
      service: "Health Insurance",
      source: "BMI Calculator",
      status: "new",
    };
    payload.message = buildMessage(payload);

    const lead = await Lead.create(payload);

    return res.status(201).json({
      success: true,
      message: "Lead submitted successfully",
      lead,
    });
  } catch (err) {
    next(err);
  }
};

/* ─────────────────────────────────────────────────────────────
   GET /api/leads   (ADMIN) — pagination, search, status filter
   query: ?page=1&limit=10&search=&status=
   ───────────────────────────────────────────────────────────── */
exports.getLeads = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status && ["new", "contacted", "converted", "closed"].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    if (req.query.search && req.query.search.trim()) {
      const term = req.query.search.trim();
      const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { email: rx }, { phone: rx }];
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Lead.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      leads,
      total,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (err) {
    next(err);
  }
};

/* ─────────────────────────────────────────────────────────────
   GET /api/leads/stats   (ADMIN) — counts for the stat cards
   ───────────────────────────────────────────────────────────── */
exports.getLeadStats = async (req, res, next) => {
  try {
    const agg = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = { total: 0, new: 0, contacted: 0, converted: 0, closed: 0 };
    agg.forEach((row) => {
      if (row._id && stats[row._id] !== undefined) stats[row._id] = row.count;
      stats.total += row.count;
    });

    return res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};

/* ─────────────────────────────────────────────────────────────
   GET /api/leads/:id   (ADMIN)
   ───────────────────────────────────────────────────────────── */
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.json({ success: true, lead });
  } catch (err) {
    next(err);
  }
};

/* ─────────────────────────────────────────────────────────────
   PATCH /api/leads/:id   (ADMIN) — update status (and other fields)
   ───────────────────────────────────────────────────────────── */
exports.updateLead = async (req, res, next) => {
  try {
    const allowed = ["status", "name", "email", "phone", "city", "message"];
    const update = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });

    if (update.status && !["new", "contacted", "converted", "closed"].includes(update.status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.json({ success: true, message: "Lead updated", lead });
  } catch (err) {
    next(err);
  }
};

/* ─────────────────────────────────────────────────────────────
   DELETE /api/leads/:id   (ADMIN)
   ───────────────────────────────────────────────────────────── */
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    return res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    next(err);
  }
};