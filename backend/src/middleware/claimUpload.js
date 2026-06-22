const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// params must be a function (not plain object) in multer-storage-cloudinary v4+
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "transindia/claim-documents",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: file.mimetype === "application/pdf" ? "raw" : "image",
  }),
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only jpg, png, and pdf files are allowed"), false);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});