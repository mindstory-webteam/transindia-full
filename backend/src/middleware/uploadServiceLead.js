const multer = require("multer");

/**
 * ✅ uploadServiceLead Middleware  (MEMORY STORAGE)
 *
 * WHY MEMORY STORAGE INSTEAD OF CloudinaryStorage:
 *   multer-storage-cloudinary with an ASYNC `params` function + multer.array()
 *   has a race condition: in a multi-file batch it reliably uploads only the
 *   FIRST file and silently drops the rest. That's why "upload 3, see 1".
 *
 *   The fix: multer just buffers every file in memory here, and the controller
 *   uploads each one to Cloudinary explicitly in a loop (see
 *   servicesFormController.js → uploadBufferToCloudinary). That guarantees ALL
 *   files are stored, and keeps the raw-PDF vs image handling (extension in the
 *   public_id for PDFs) exactly as before.
 *
 * After parsing, each file in req.files looks like:
 *   { fieldname, originalname, mimetype, size, buffer }
 */

const storage = multer.memoryStorage();

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
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 5,                  // up to 5 files per submission
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

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. You can upload up to 5 documents.",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected file field. Please use the upload box on the form.",
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