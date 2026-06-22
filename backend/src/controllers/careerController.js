const JobRole = require("../models/JobRole");
const JobApplication = require("../models/JobApplication");

// ─── PUBLIC ROUTES ─────────────────────────────────────────────

// @desc    Get all active job roles
// @route   GET /api/careers/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await JobRole.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for a job
// @route   POST /api/careers/jobs/:id/apply
// @access  Public
exports.applyForJob = async (req, res, next) => {
  try {
    const { id: jobId } = req.params;
    const { name, email, phone, message } = req.body;

    const job = await JobRole.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job role not found" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload your resume (PDF)" });
    }

    const application = await JobApplication.create({
      jobId,
      name,
      email,
      phone,
      message,
      resumeUrl: req.file.path, // Populated by multer-storage-cloudinary
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN ROUTES ──────────────────────────────────────────────

// @desc    Get all job roles (including inactive)
// @route   GET /api/careers/admin/jobs
// @access  Private (Admin)
exports.getAdminJobs = async (req, res, next) => {
  try {
    const jobs = await JobRole.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job role
// @route   POST /api/careers/admin/jobs
// @access  Private (Admin)
exports.createJob = async (req, res, next) => {
  try {
    const job = await JobRole.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job role
// @route   PUT /api/careers/admin/jobs/:id
// @access  Private (Admin)
exports.updateJob = async (req, res, next) => {
  try {
    const job = await JobRole.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job role not found" });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job role
// @route   DELETE /api/careers/admin/jobs/:id
// @access  Private (Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await JobRole.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job role not found" });
    }
    // Optional: Delete related applications or keep them? Usually kept for records.
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications
// @route   GET /api/careers/admin/applications
// @access  Private (Admin)
exports.getApplications = async (req, res, next) => {
  try {
    // Populate the jobId to get the job title
    const applications = await JobApplication.find()
      .populate("jobId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};
