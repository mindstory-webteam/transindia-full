const ClaimLeads = require("../models/ClaimLeads");

// ── POST /api/claimleads  — public: submit claim intimation ──────────────────
exports.submitClaim = async (req, res) => {
  try {
    const { name, mobile, policyNumber, insuranceType, claimType, description, isUrgent } = req.body;

    const documents = (req.files || []).map((file) => ({
      url:          file.path,         // Cloudinary secure_url
      publicId:     file.filename,     // Cloudinary public_id
      originalName: file.originalname,
    }));

    const claim = await ClaimLeads.create({
      name,
      mobile,
      policyNumber,
      insuranceType,
      claimType,
      description,
      isUrgent: isUrgent === "true" || isUrgent === true,
      documents,
    });

    res.status(201).json({
      success: true,
      message: "Claim submitted successfully. Our team will contact you shortly.",
      data: claim,
    });
  } catch (err) {
    console.error("submitClaim error:", err.message);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

// ── GET /api/claimleads  — admin: all claims newest first ────────────────────
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await ClaimLeads.find().sort({ createdAt: -1 });
    res.json({ success: true, count: claims.length, data: claims });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/claimleads/:id  — admin: single claim ───────────────────────────
exports.getClaimById = async (req, res) => {
  try {
    const claim = await ClaimLeads.findById(req.params.id);
    if (!claim) return res.status(404).json({ success: false, message: "Claim not found" });
    res.json({ success: true, data: claim });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/claimleads/:id/status  — admin: update status ─────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const claim = await ClaimLeads.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!claim) return res.status(404).json({ success: false, message: "Claim not found" });
    res.json({ success: true, data: claim });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/claimleads/:id  — admin: delete claim ────────────────────────
exports.deleteClaim = async (req, res) => {
  try {
    const claim = await ClaimLeads.findByIdAndDelete(req.params.id);
    if (!claim) return res.status(404).json({ success: false, message: "Claim not found" });
    res.json({ success: true, message: "Claim deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};