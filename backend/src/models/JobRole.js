const mongoose = require("mongoose");

const jobRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    department: { type: String, trim: true },
    role: { type: String, trim: true },
    grade: { type: String, trim: true },
    reportingTo: { type: String, trim: true },
    body: { type: String, default: "" },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobRole", jobRoleSchema);
