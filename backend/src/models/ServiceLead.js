const mongoose = require("mongoose");

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE LEAD
// A lead captured from the public "Calculate your premium" form on a service
// page. The website submits this on the step-2 "Continue" click, so the
// calculator inputs (smoker / sumAssured / term / income) arrive with their
// defaults and the computed estimate may be empty until step 3 is reached.
// ─────────────────────────────────────────────────────────────────────────────
const serviceLeadSchema = new mongoose.Schema(
  {
    // ── Step 1: contact ──
    name:  { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], trim: true, lowercase: true },
    phone: { type: String, required: [true, "Phone is required"], trim: true },

    // ── Step 2: about you ──
    dob:           { type: String, default: "" }, // raw yyyy-mm-dd string from the date input
    maritalStatus: { type: String, default: "" },
    address:       { type: String, default: "" },
    gender:        { type: String, default: "" },

    // ── Step 3: calculator inputs (sent with defaults from step 2) ──
    smoker:       { type: String, default: "" },
    sumAssured:   { type: String, default: "" },
    policyTerm:   { type: String, default: "" },
    annualIncome: { type: String, default: "" },

    // ── Optional computed estimate (present only if submitted after step 3) ──
    estimate: {
      coverage: { type: String, default: "" },
      monthly:  { type: String, default: "" },
      yearly:   { type: String, default: "" },
      total:    { type: String, default: "" },
    },

    // ── Which service page the lead came from ──
    serviceSlug:  { type: String, default: "", index: true },
    serviceTitle: { type: String, default: "" },

    // ── CRM ──
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
      index: true,
    },
    source: { type: String, default: "website" },
    notes:  { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceLead", serviceLeadSchema);