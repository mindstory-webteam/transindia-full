const mongoose = require("mongoose");

const GeneralQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    insuranceType: { type: String, required: true },
    query: { type: String, default: "" },
    callback: { type: Boolean, default: false },
    status: { type: String, enum: ["new", "in-progress", "closed"], default: "new" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GeneralQuery", GeneralQuerySchema);
