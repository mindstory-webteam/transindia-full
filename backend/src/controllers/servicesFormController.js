const path = require("path");
const ServiceLead = require("../models/ServicesForm");
const cloudinary = require("../config/cloudinary");
const https = require("https");
const http = require("http");

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

const MIME_BY_EXT = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

/*
 * Work out the real file extension + MIME type for a lead's attached
 * document, in order of trust:
 *
 *   1. insuranceDocumentOriginalName (saved at upload time — new leads)
 *   2. the extension visible directly in the Cloudinary URL
 *   3. ask Cloudinary's Admin API what format it actually recorded
 *      (covers leads uploaded before this fix, whose URLs have no
 *      extension at all)
 *
 * Returns { ext, mimeType } — either can be "" / null if truly unknown.
 */
async function resolveDocumentMeta(lead) {
  let mimeType = lead.insuranceDocumentMimeType || null;
  let ext = lead.insuranceDocumentOriginalName
    ? path.extname(lead.insuranceDocumentOriginalName).toLowerCase()
    : "";

  if (!ext) {
    const urlPath = (lead.insuranceDocument || "").split("?")[0];
    const m = urlPath.match(/\.([a-zA-Z0-9]+)$/);
    if (m) ext = `.${m[1].toLowerCase()}`;
  }

  if (!ext && lead.insuranceDocumentPublicId) {
    try {
      const resourceType = (lead.insuranceDocument || "").includes("/raw/upload/")
        ? "raw"
        : "image";
      const info = await cloudinary.api.resource(lead.insuranceDocumentPublicId, {
        resource_type: resourceType,
      });
      if (info?.format) {
        ext = `.${info.format.toLowerCase()}`;
      }
    } catch (e) {
      console.error("[resolveDocumentMeta] Cloudinary metadata lookup failed:", e.message);
    }
  }

  if (!mimeType && ext) {
    mimeType = MIME_BY_EXT[ext] || null;
  }

  return { ext, mimeType };
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

    // ✅ FIX: the public motor form does NOT collect a policy number, and the
    // document upload is OPTIONAL in the UI. The old code hard-required BOTH
    // (insuranceNumber + req.file), so every motor submission returned 400 and
    // never reached the database. Those checks are removed. We only keep the
    // miscellaneous "describe your needs" requirement, which the misc form
    // genuinely collects.
    if (formType === "miscellaneous" && !(b.insuranceTypes || "").trim()) {
      return res.status(400).json({ success: false, message: "Please describe your insurance needs." });
    }

    // ✅ FIX: the route now uses .array("insuranceDocuments"), so uploaded
    // file(s) arrive in req.files. We store the FIRST file in the existing
    // single-document fields so the admin download proxy + delete logic keep
    // working completely unchanged. (req.file kept as a fallback.)
    const uploadedFile = (req.files && req.files[0]) || req.file || null;

    let documentUrl = undefined;
    let documentPublicId = undefined;
    let documentMimeType = undefined;
    let documentOriginalName = undefined;

    if (uploadedFile) {
      // uploadedFile.path is the secure_url from Cloudinary
      documentUrl = uploadedFile.path;
      documentPublicId = uploadedFile.filename;
      documentMimeType = uploadedFile.mimetype;
      documentOriginalName = uploadedFile.originalname;

      // Validate that we got a proper URL from Cloudinary
      if (!documentUrl || !documentUrl.startsWith("http")) {
        console.error("Invalid Cloudinary URL:", documentUrl);
        return res.status(500).json({
          success: false,
          message: "Document upload failed. Please try again.",
        });
      }
    }

    // ✅ Fire/entertainment send `insuranceType` (singular). Fire also sends
    // `industries`. Fold them into `insuranceTypes` so the existing dashboard
    // "Requirements" column shows something without any extra UI changes,
    // while the individual fields are still stored separately below.
    const combinedRequirements =
      (b.insuranceTypes || "").trim() ||
      [b.industries, b.insuranceType].filter((x) => (x || "").trim()).join(" — ") ||
      undefined;

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

      // ✅ NEW field mappings so nothing the public forms send is lost
      pincode: b.pincode,
      query: b.query,
      wantsCallback: b.wantsCallback,
      agreeTerms: b.agreeTerms,
      plan: b.plan,
      lastFour: b.lastFour,

      // ── Motor form ──
      insuranceNumber: b.insuranceNumber,
      expiryDate: b.expiryDate,   // ✅ NEW
      vehicleType: b.vehicleType, // ✅ NEW

      // ── Fire / entertainment / miscellaneous ──
      industries: b.industries,           // ✅ NEW
      insuranceType: b.insuranceType,     // ✅ NEW (singular)
      insuranceTypes: combinedRequirements,

      // ✅ Store the validated Cloudinary URL + the real file metadata
      insuranceDocument: documentUrl,
      insuranceDocumentPublicId: documentPublicId,
      insuranceDocumentMimeType: documentMimeType,
      insuranceDocumentOriginalName: documentOriginalName,

      estimate: normalizeEstimate(estimateRaw),
      rawData: b,
    });

    return res.status(201).json({
      success: true,
      message: "Lead submitted successfully.",
      data: { id: lead._id, formType: lead.formType },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────
// PROXY DOCUMENT DOWNLOAD  —  GET /api/serviceleads/:id/document
//
// WHY NOT res.redirect():
//   Cloudinary "raw" PDFs are served as application/octet-stream with
//   no Content-Disposition header, so the browser opens a blank tab
//   instead of downloading. Direct URLs also hit Cloudinary CORS
//   restrictions when the referrer is your admin domain.
//
// FIX — stream through our own server:
//   1. Fetch from Cloudinary server-to-server (no CORS).
//   2. Forward the REAL Content-Type (resolved via resolveDocumentMeta,
//      not guessed from the URL — Cloudinary URLs aren't guaranteed to
//      carry an extension for "raw" resources).
//   3. Add Content-Disposition: attachment with a correctly-extensioned
//      filename so browsers always download it as the right file type.
//   4. Pipe the byte stream straight to the client (no buffering).
// ─────────────────────────────────────────────────────────────────────
exports.getServiceLeadDocument = async (req, res, next) => {
  try {
    const lead = await ServiceLead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }

    if (!lead.insuranceDocument) {
      return res.status(404).json({ success: false, message: "No document attached." });
    }

    const cloudinaryUrl = lead.insuranceDocument;

    // Validate the URL is a proper Cloudinary URL
    if (!cloudinaryUrl.startsWith("http")) {
      return res.status(400).json({ success: false, message: "Invalid document URL." });
    }

    console.log(`📄 Streaming document for lead ${req.params.id}:`, cloudinaryUrl);

    // ✅ Resolve the real extension/MIME type instead of regex-guessing
    // off the URL — this is what actually fixes "opens as garbage text".
    const { ext, mimeType } = await resolveDocumentMeta(lead);

    // Build a safe download filename from the lead's name
    const safeName = (lead.name || "document")
      .replace(/[^a-zA-Z0-9 _-]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .toLowerCase();

    const filename = `insurance-doc-${safeName}${ext}`;

    // Choose http or https module based on URL
    const transport = cloudinaryUrl.startsWith("https://") ? https : http;

    // Stream the file from Cloudinary to the client
    const cloudReq = transport.get(cloudinaryUrl, (cloudRes) => {
      // Follow a single redirect if Cloudinary issues one (rare but possible)
      if (
        (cloudRes.statusCode === 301 || cloudRes.statusCode === 302) &&
        cloudRes.headers.location
      ) {
        const redirectUrl = cloudRes.headers.location;
        const redirectTransport = redirectUrl.startsWith("https://") ? https : http;

        return redirectTransport.get(redirectUrl, (redirectRes) => {
          if (redirectRes.statusCode !== 200) {
            console.error(`[getServiceLeadDocument] Redirect target returned ${redirectRes.statusCode}`);
            if (!res.headersSent) {
              res.status(502).json({ success: false, message: "Could not retrieve document." });
            }
            return;
          }

          const contentType =
            mimeType ||
            redirectRes.headers["content-type"] ||
            (ext === ".pdf" ? "application/pdf" : "application/octet-stream");

          res.setHeader("Content-Type", contentType);
          res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
          res.setHeader("Cache-Control", "private, max-age=3600");

          if (redirectRes.headers["content-length"]) {
            res.setHeader("Content-Length", redirectRes.headers["content-length"]);
          }

          redirectRes.pipe(res);
          redirectRes.on("error", (err) => {
            console.error("[getServiceLeadDocument] Redirect stream error:", err.message);
            if (!res.writableEnded) res.end();
          });
        });
      }

      // Normal (non-redirect) response
      if (cloudRes.statusCode !== 200) {
        console.error(`[getServiceLeadDocument] Cloudinary returned ${cloudRes.statusCode}`);
        if (!res.headersSent) {
          return res.status(502).json({ success: false, message: "Could not retrieve document from storage." });
        }
        return;
      }

      // Prefer our resolved MIME type (the trustworthy one); fall back to
      // whatever Cloudinary sends, then to an extension-based guess.
      const contentType =
        mimeType ||
        cloudRes.headers["content-type"] ||
        (ext === ".pdf"
          ? "application/pdf"
          : ext === ".png"
          ? "image/png"
          : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : "application/octet-stream");

      res.setHeader("Content-Type", contentType);
      // "attachment" forces download prompt in every browser
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Cache-Control", "private, max-age=3600");

      // Forward content-length so browser shows progress bar
      if (cloudRes.headers["content-length"]) {
        res.setHeader("Content-Length", cloudRes.headers["content-length"]);
      }

      // Pipe bytes directly — no buffering in memory
      cloudRes.pipe(res);

      cloudRes.on("error", (streamErr) => {
        console.error("[getServiceLeadDocument] Stream error:", streamErr.message);
        if (!res.writableEnded) res.end();
      });
    });

    cloudReq.on("error", (reqErr) => {
      console.error("[getServiceLeadDocument] Request error:", reqErr.message);
      if (!res.headersSent) {
        res.status(502).json({ success: false, message: "Could not connect to document storage." });
      }
    });

    // Timeout after 15s
    cloudReq.setTimeout(15000, () => {
      console.error("[getServiceLeadDocument] Request timed out");
      cloudReq.destroy();
      if (!res.headersSent) {
        res.status(504).json({ success: false, message: "Document retrieval timed out." });
      }
    });

  } catch (err) {
    next(err);
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
      // ✅ FIX: detect resource_type from the URL path itself
      // (".../raw/upload/..." vs ".../image/upload/...") instead of
      // sniffing the file extension — the extension may be missing
      // entirely on older leads, which previously caused Cloudinary
      // deletes to silently use the wrong resource_type and fail.
      const resourceType = (lead.insuranceDocument || "").includes("/raw/upload/")
        ? "raw"
        : "image";
      try {
        await cloudinary.uploader.destroy(lead.insuranceDocumentPublicId, {
          resource_type: resourceType,
        });
        console.log(`🗑️  Deleted Cloudinary asset: ${lead.insuranceDocumentPublicId}`);
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