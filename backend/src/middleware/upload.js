const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ── IMPORTANT: params must be a function (not a plain object) in
//    multer-storage-cloudinary v4+. Using a plain object silently breaks
//    the upload and req.file ends up undefined or has no .path / .secure_url
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "transindia/services",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    // SVG must be uploaded as "raw" resource type, not "image"
    resource_type: file.mimetype === "image/svg+xml" ? "raw" : "image",
    transformation: [{ width: 1200, crop: "limit" }],
  }),
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|svg\+xml|webp/;
  const mimeOk = allowed.test(file.mimetype);
  if (mimeOk) cb(null, true);
  else cb(new Error("Only image files (jpg, png, gif, webp, svg) are allowed"), false);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});