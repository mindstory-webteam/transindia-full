const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    policyRef: { type: String, required: true },
    mobile: { type: String, required: true },
    category: { type: String, required: true },
    details: { type: String, default: "" },
    status: { type: String, enum: ["new", "investigating", "resolved", "closed"], default: "new" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", ComplaintSchema);
