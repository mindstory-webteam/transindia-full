const mongoose = require("mongoose");

/* Each insured member with their age (e.g. { member: "Self", age: 30 }) */
const memberAgeSchema = new mongoose.Schema(
  {
    member: { type: String, trim: true },
    age: { type: Number, min: 0, max: 120 },
  },
  { _id: false }
);

const bmiLeadSchema = new mongoose.Schema(
  {
    /* ── Core contact (shown in the dashboard table & detail page) ── */
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: [true, "Phone is required"], trim: true },

    /* ── Insurance / BMI specific fields ── */
    gender: { type: String, enum: ["male", "female"], default: "male" },
    city: { type: String, trim: true, default: "" },
    members: { type: [String], default: [] },
    memberAges: { type: [memberAgeSchema], default: [] },
    hasIllness: { type: Boolean, default: false },
    whatsappUpdates: { type: Boolean, default: true },

    bmi: { type: Number, default: null },
    bmiCategory: { type: String, default: "" },

    /* ── Meta ── */
    message: { type: String, default: "" }, // auto-composed summary
    service: { type: String, default: "Health Insurance" },
    source: { type: String, default: "BMI Calculator" },

    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
  },
  { timestamps: true } // createdAt / updatedAt
);

/* IMPORTANT: register as a DISTINCT model name ("BmiLead") and a distinct
   collection ("bmileads") so it never collides with the existing generic
   "Lead" model (which requires serviceSlug). The `mongoose.models.BmiLead ||`
   guard prevents OverwriteModelError during dev hot-reloads. */
module.exports =
  mongoose.models.BmiLead ||
  mongoose.model("BmiLead", bmiLeadSchema, "bmileads");