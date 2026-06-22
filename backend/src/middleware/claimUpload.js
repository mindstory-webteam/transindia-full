const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    return {
      folder: "transindia/claim-documents",
      resource_type: isPdf ? "raw" : "image",
      // raw PDFs need the .pdf extension baked into public_id to stay openable
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}${isPdf ? ".pdf" : ""}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only jpg, png, and pdf files are allowed"), false);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});