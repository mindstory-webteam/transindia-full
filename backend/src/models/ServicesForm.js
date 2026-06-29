const mongoose = require("mongoose");

/*
 * One model for every form on the public site:
 *   formType: "calculator" (life/health) | "motor" | "miscellaneous" | "simple"
 * Most fields are optional because they differ per form type.
 * The full original payload is also kept in `rawData` so nothing is ever lost.
 */

// Normalised estimate the admin table reads (coverage / monthly / yearly / total).
const estimateSchema = new mongoose.Schema(
  {
    coverage: String, // e.g. "₹1 crore"
    monthly: String, // e.g. "₹3,456"
    yearly: String, // e.g. "₹41,472"
    total: String, // e.g. "₹12,44,160"
    coverageCaption: String,
    totalLabel: String,
    note: String,
    disclaimer: String,
  },
  { _id: false }
);

const serviceLeadSchema = new mongoose.Schema(
  {
    // ── Which service / which form ──────────────────────────────
    serviceSlug: { type: String, required: true, trim: true, index: true },
    serviceTitle: { type: String, trim: true },
    formType: {
      type: String,
      enum: ["calculator", "motor", "miscellaneous", "simple"],
      required: true,
      index: true,
    },
    source: { type: String, default: "website", trim: true },

    // ── Contact — present on EVERY form ─────────────────────────
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true },

    // ── Calculator "about you" + quote fields (life / health) ───
    dob: { type: String, trim: true },
    gender: { type: String, trim: true },
    maritalStatus: { type: String, trim: true }, // sent as "marital"
    address: { type: String, trim: true },
    smoker: { type: String, trim: true },
    sumAssured: { type: String, trim: true },
    policyTerm: { type: String, trim: true }, // sent as "term"
    annualIncome: { type: String, trim: true }, // sent as "income"
    coverType: { type: String, trim: true },
    sumInsured: { type: String, trim: true },
    conditions: { type: String, trim: true },
    cityTier: { type: String, trim: true },

    // ✅ NEW: extra fields the public forms actually send but the schema
    // never stored — so they used to vanish into rawData only.
    pincode: { type: String, trim: true },       // life form
    query: { type: String, trim: true },         // health hero form
    wantsCallback: { type: String, trim: true }, // health / exact-quote
    agreeTerms: { type: String, trim: true },    // health hero form
    plan: { type: String, trim: true },          // exact-quote modal
    lastFour: { type: String, trim: true },      // exact-quote modal

    // ── Motor form ──────────────────────────────────────────────
    insuranceNumber: { type: String, trim: true },
    expiryDate: { type: String, trim: true },    // ✅ NEW: motor policy expiry
    vehicleType: { type: String, trim: true },   // ✅ NEW: car / bike / truck…
    insuranceDocument: { type: String, trim: true }, // Cloudinary secure_url (string!)
    insuranceDocumentPublicId: { type: String, trim: true }, // for deletion
    // ✅ recorded at upload time so downloads never have to guess
    // the file type from the URL (which can be missing an extension).
    insuranceDocumentMimeType: { type: String, trim: true }, // e.g. "application/pdf"
    insuranceDocumentOriginalName: { type: String, trim: true }, // e.g. "old-policy.pdf"

    // ── Fire / entertainment / miscellaneous ────────────────────
    industries: { type: String, trim: true },    // ✅ NEW: fire form
    insuranceType: { type: String, trim: true },  // ✅ NEW: fire / entertainment (singular)
    insuranceTypes: { type: String, trim: true }, // miscellaneous (plural)

    // ── Calculator estimate snapshot ────────────────────────────
    estimate: estimateSchema,

    // ── Full original payload (audit / future-proof) ────────────
    rawData: { type: mongoose.Schema.Types.Mixed },

    // ── Lead lifecycle (drives the admin dashboard) ─────────────
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
      index: true,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceLead", serviceLeadSchema);