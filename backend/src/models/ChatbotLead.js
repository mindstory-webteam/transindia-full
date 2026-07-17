const mongoose = require("mongoose");

const ChatbotLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    query: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      trim: true,
      default: "",
    },
    serviceSlug: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatbotLead", ChatbotLeadSchema);