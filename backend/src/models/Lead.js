const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    serviceSlug: { type: String, required: true },
    serviceTitle:{ type: String, default: "" },
    formData:    { type: mongoose.Schema.Types.Mixed, required: true }, // dynamic fields
    status:      { type: String, enum: ["new", "contacted", "converted", "closed"], default: "new" },
    notes:       { type: String, default: "" },
    ipAddress:   { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);