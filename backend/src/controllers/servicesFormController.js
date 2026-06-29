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
 * Work out the real file extension + MIME type for a single document,
 * in order of trust:
 *
 *   1. originalName (saved at upload time — new leads)
 *   2. the extension visible directly in the Cloudinary URL
 *   3. ask Cloudinary's Admin API what format it actually recorded
 *      (covers leads uploaded before this fix, whose URLs have no
 *      extension at all)
 *
 * `doc` is a normalised shape: { url, publicId, mimeType, originalName }.
 * Returns { ext, mimeType } — either can be "" / null if truly unknown.
 */
async function resolveDocumentMeta(doc) {
  const d = doc || {};
  let mimeType = d.mimeType || null;
  let ext = d.originalName ? path.extname(d.originalName).toLowerCase() : "";

  if (!ext) {
    const urlPath = (d.url || "").split("?")[0];
    const m = urlPath.match(/\.([a-zA-Z0-9]+)$/);
    if (m) ext = `.${m[1].toLowerCase()}`;
  }

  if (!ext && d.publicId) {
    try {
      const resourceType = (d.url || "").includes("/raw/upload/") ? "raw" : "image";
      const info = await cloudinary.api.resource(d.publicId, {
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

/*
 * Return every document attached to a lead as a normalised list:
 *   [{ url, publicId, mimeType, originalName }, ...]
 * Prefers the new `insuranceDocuments` array; falls back to the legacy
 * single-document fields for older leads.
 */
function getLeadDocuments(lead) {
  if (Array.isArray(lead.insuranceDocuments) && lead.insuranceDocuments.length) {
    return lead.insuranceDocuments.map((d) => ({
      url: d.url,
      publicId: d.publicId,
      mimeType: d.mimeType,
      originalName: d.originalName,
    }));
  }
  if (lead.insuranceDocument) {
    return [{
      url: lead.insuranceDocument,
      publicId: lead.insuranceDocumentPublicId,
      mimeType: lead.insuranceDocumentMimeType,
      originalName: lead.insuranceDocumentOriginalName,
    }];
  }
  return [];
}

// ─────────────────────────────────────────────────────────────────────
// CREATE  —  POST /api/serviceleads   (public)
// JSON for calculator/simple/miscellaneous; multipart for motor (+ files).
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

    // The public motor form does NOT collect a policy number, and the document
    // upload is OPTIONAL. Only the miscellaneous "describe your needs" field is
    // genuinely required.
    if (formType === "miscellaneous" && !(b.insuranceTypes || "").trim()) {
      return res.status(400).json({ success: false, message: "Please describe your insurance needs." });
    }

    // ✅ FIX: the route uses .array("insuranceDocuments"), so EVERY uploaded
    // file arrives in req.files. Previously only req.files[0] was stored, which
    // is why the lead page showed a single document. Store them ALL.
    const uploadedFiles =
      (Array.isArray(req.files) && req.files.length ? req.files : (req.file ? [req.file] : []));

    const documents = [];
    for (const f of uploadedFiles) {
      const url = f.path;            // Cloudinary secure_url
      if (!url || !url.startsWith("http")) {
        console.error("Invalid Cloudinary URL for file:", f.originalname, url);
        return res.status(500).json({
          success: false,
          message: "Document upload failed. Please try again.",
        });
      }
      documents.push({
        url,
        publicId: f.filename,
        mimeType: f.mimetype,
        originalName: f.originalname,
      });
    }

    // Keep the FIRST file in the legacy single-document fields so the existing
    // download proxy + delete logic keep working for older code paths.
    const first = documents[0] || null;

    // Fire/entertainment send `insuranceType` (singular). Fire also sends
    // `industries`. Fold them into `insuranceTypes` so the dashboard
    // "Requirements" column shows something; individual fields stored too.
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

      // extra fields the public forms send
      pincode: b.pincode,
      query: b.query,
      wantsCallback: b.wantsCallback,
      agreeTerms: b.agreeTerms,
      plan: b.plan,
      lastFour: b.lastFour,

      // ── Motor form ──
      insuranceNumber: b.insuranceNumber,
      expiryDate: b.expiryDate,
      vehicleType: b.vehicleType,

      // ── Fire / entertainment / miscellaneous ──
      industries: b.industries,
      insuranceType: b.insuranceType,
      insuranceTypes: combinedRequirements,

      // ✅ ALL documents
      insuranceDocuments: documents,

      // legacy single-doc fields (first file) — backward compatible
      insuranceDocument: first ? first.url : undefined,
      insuranceDocumentPublicId: first ? first.publicId : undefined,
      insuranceDocumentMimeType: first ? first.mimeType : undefined,
      insuranceDocumentOriginalName: first ? first.originalName : undefined,

      estimate: normalizeEstimate(estimateRaw),
      rawData: b,
    });

    return res.status(201).json({
      success: true,
      message: "Lead submitted successfully.",
      data: { id: lead._id, formType: lead.formType, documents: documents.length },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────
// PROXY DOCUMENT DOWNLOAD
//   GET /api/serviceleads/:id/document            → first document
//   GET /api/serviceleads/:id/document/:index     → the Nth document
//
// Streams the file through our own server so the browser always downloads
// it with the correct Content-Type + filename (Cloudinary "raw" PDFs have
// no extension/disposition of their own).
// ─────────────────────────────────────────────────────────────────────
exports.getServiceLeadDocument = async (req, res, next) => {
  try {
    const lead = await ServiceLead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }

    const docs = getLeadDocuments(lead);
    if (!docs.length) {
      return res.status(404).json({ success: false, message: "No document attached." });
    }

    // Pick the requested document (default to the first).
    let idx = 0;
    if (req.params.index != null) {
      idx = parseInt(req.params.index, 10);
      if (isNaN(idx) || idx < 0 || idx >= docs.length) {
        return res.status(404).json({ success: false, message: "Document not found." });
      }
    }
    const activeDoc = docs[idx];
    const cloudinaryUrl = activeDoc.url;

    if (!cloudinaryUrl || !cloudinaryUrl.startsWith("http")) {
      return res.status(400).json({ success: false, message: "Invalid document URL." });
    }

    console.log(`📄 Streaming document ${idx} for lead ${req.params.id}:`, cloudinaryUrl);

    const { ext, mimeType } = await resolveDocumentMeta(activeDoc);

    // Build a safe download filename from the lead's name (+ index when many)
    const safeName = (lead.name || "document")
      .replace(/[^a-zA-Z0-9 _-]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .toLowerCase();

    const suffix = docs.length > 1 ? `-${idx + 1}` : "";
    const filename = `insurance-doc-${safeName}${suffix}${ext}`;

    const transport = cloudinaryUrl.startsWith("https://") ? https : http;

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
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Cache-Control", "private, max-age=3600");

      if (cloudRes.headers["content-length"]) {
        res.setHeader("Content-Length", cloudRes.headers["content-length"]);
      }

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

    // ✅ Remove EVERY attached document from Cloudinary (not just the first).
    const docs = getLeadDocuments(lead);
    for (const d of docs) {
      if (!d.publicId) continue;
      const resourceType = (d.url || "").includes("/raw/upload/") ? "raw" : "image";
      try {
        await cloudinary.uploader.destroy(d.publicId, { resource_type: resourceType });
        console.log(`🗑️  Deleted Cloudinary asset: ${d.publicId}`);
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