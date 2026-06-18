const mongoose = require("mongoose");

const ClaimSupportSchema = new mongoose.Schema(
  {
    policyNumber: { type: String, required: true },
    policyHolder: { type: String, required: true },
    mobile: { type: String, required: true },
    claimType: { type: String, required: true },
    incident: { type: String, default: "" },
    status: { type: String, enum: ["new", "in-progress", "resolved", "closed"], default: "new" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClaimSupport", ClaimSupportSchema);
