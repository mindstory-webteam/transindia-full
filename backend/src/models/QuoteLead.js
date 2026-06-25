const mongoose = require("mongoose");

const quoteLeadSchema = new mongoose.Schema(
  {
    insuranceType: {
      type: String,
      required: [true, "Insurance type is required"],
      trim: true,
    },
    sumInsured: {
      type: String,
      required: [true, "Sum insured is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"],
    },
    source: {
      type: String,
      default: "homepage-banner",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuoteLead", quoteLeadSchema);