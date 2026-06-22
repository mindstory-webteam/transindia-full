const mongoose = require("mongoose");

const ClaimLeadsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    policyNumber: {
      type: String,
      required: [true, "Policy number is required"],
      trim: true,
    },
    insuranceType: {
      type: String,
      required: true,
      enum: ["Life Insurance", "Health Insurance", "Motor Insurance", "Travel Insurance"],
    },
    claimType: {
      type: String,
      required: true,
      enum: ["Death Claim", "Maturity Claim", "Surrender Claim", "Other"],
    },
    description: {
      type: String,
      trim: true,
    },
    documents: [
      {
        url:          String,
        publicId:     String,
        originalName: String,
      },
    ],
    isUrgent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Resolved", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClaimLeads", ClaimLeadsSchema);