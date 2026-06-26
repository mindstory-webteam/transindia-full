const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/**
 * ✅ DEDICATED: uploadServiceLead Middleware
 * Handles Motor Insurance document uploads to Cloudinary.
 */

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";

    console.log(
      `📤 [uploadServiceLead] Attempting to upload: ${file.originalname} ` +
      `(${file.mimetype}, ${file.size} bytes) - Type: ${isPdf ? "PDF" : "Image"}`
    );

    return {
      folder: "transindia/serviceleads",
      resource_type: isPdf ? "raw" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    };
  },
});

/**
 * File filter: Only accept PDF, JPG, JPEG, PNG
 */
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    console.log(`✅ [uploadServiceLead] File accepted: ${file.originalname}`);
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type: ${file.mimetype}. Only PDF, JPG, JPEG, and PNG allowed.`
    );
    error.status = 400;
    console.error(`❌ [uploadServiceLead] ${error.message}`);
    cb(error, false);
  }
};

/**
 * Main multer instance for service lead uploads
 */
const uploadServiceLead = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

/**
 * Error handler middleware
 * Catches multer and other upload errors
 */
const uploadErrorHandler = (err, req, res, next) => {
  // Multer errors
  if (err instanceof multer.MulterError) {
    console.error(`⚠️ [uploadServiceLead] Multer error:`, err.code, err.message);

    if (err.code === "FILE_TOO_LARGE" || err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File size exceeds 5MB limit. Please upload a smaller file.",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "No file provided or unexpected field name.",
      });
    }

    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }

  // Custom errors from fileFilter
  if (err && err.status === 400) {
    console.error(`⚠️ [uploadServiceLead] Validation error:`, err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Cloudinary errors
  if (err && err.http_code) {
    console.error(`⚠️ [uploadServiceLead] Cloudinary error:`, err.message);
    return res.status(500).json({
      success: false,
      message: "Document upload to cloud storage failed. Please try again.",
    });
  }

  // Unknown errors
  if (err) {
    console.error(`⚠️ [uploadServiceLead] Unknown error:`, err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred during upload. Please try again.",
    });
  }

  // No error, pass to next middleware
  next();
};

// ✅ CRITICAL: Proper exports
module.exports = uploadServiceLead;
module.exports.uploadErrorHandler = uploadErrorHandler;