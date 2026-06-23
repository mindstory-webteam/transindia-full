const express = require("express");
const router = express.Router();

const {
  getJobs,
  applyForJob,
  getAdminJobs,
  createJob,
  updateJob,
  deleteJob,
  getApplications,
  deleteApplication,
} = require("../controllers/careerController");

const resumeUpload = require("../middleware/resumeUpload");
const { protect } = require("../middleware/auth"); // Assuming admin auth exists here

// Public Routes
router.get("/jobs", getJobs);
router.post("/jobs/:id/apply", resumeUpload.single("resume"), applyForJob);

// Admin Routes (Protect these with auth middleware)
router.get("/admin/jobs", protect, getAdminJobs);
router.post("/admin/jobs", protect, createJob);
router.put("/admin/jobs/:id", protect, updateJob);
router.delete("/admin/jobs/:id", protect, deleteJob);

router.get("/admin/applications", protect, getApplications);
router.delete("/admin/applications/:id", protect, deleteApplication);

module.exports = router;
