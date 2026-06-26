const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/**
 * ✅ DEDICATED: uploadServiceLead Middleware
 * Handles Motor Insurance document uploads to Cloudinary.
 *
 * IMPORTANT FIX:
 * Cloudinary's "raw" resource type (used for PDFs) does NOT automatically
 * append a file extension to the delivery URL the way "image" uploads do.
 * If we let multer-storage-cloudinary auto-generate a public_id, raw PDFs
 * end up with a URL that has NO extension at all — which breaks downloads
 * (the OS can't tell what kind of file it is, so it opens with whatever
 * app handles extension-less files, e.g. Word, and shows raw garbage).
 *
 * The fix: explicitly build the public_id ourselves.
 *  - For PDFs (raw): embed the extension directly in the public_id,
 *    since Cloudinary won't add it for us.
 *  - For images: do NOT put a dot in the public_id (Cloudinary appends
 *    the format itself — adding our own dot would create "name.jpg.jpg").
 */

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";

    console.log(
      `📤 [uploadServiceLead] Attempting to upload: ${file.originalname} ` +
      `(${file.mimetype}, ${file.size} bytes) - Type: ${isPdf ? "PDF" : "Image"}`
    );

    // Extension taken from the original filename, falling back to a
    // sensible default based on mimetype if the filename has none.
    const extFromName = path.extname(file.originalname).toLowerCase().replace(".", "");
    const ext = extFromName || (isPdf ? "pdf" : "jpg");

    // Sanitised base name (no extension), used to keep filenames readable
    // in the Cloudinary dashboard instead of pure random IDs.
    const baseName = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 60) || "document";

    if (isPdf) {
      // RAW resource type: extension must be embedded in the public_id
      // itself, otherwise the resulting secure_url has no extension.
      return {
        folder: "transindia/serviceleads",
        resource_type: "raw",
        public_id: `${Date.now()}-${baseName}.${ext}`,
        allowed_formats: ["pdf"],
      };
    }

    // IMAGE resource type: Cloudinary appends the format automatically,
    // so public_id must NOT contain a dot/extension.
    return {
      folder: "transindia/serviceleads",
      resource_type: "image",
      public_id: `${Date.now()}-${baseName}`,
      format: ext, // force a consistent extension matching the upload
      allowed_formats: ["jpg", "jpeg", "png"],
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