const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/*
 * Motor-insurance documents can be PDF or image. Cloudinary stores PDFs as
 * "raw" and images as "image" — params() inspects each file and picks the
 * right resource_type. `req.file.path` becomes the secure_url we save, and
 * `req.file.filename` becomes the public_id we keep for later deletion.
 *
 * NOTE: params MUST be a function in multer-storage-cloudinary v4+.
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    return {
      folder: "transindia/serviceleads",
      resource_type: isPdf ? "raw" : "image",
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const ok =
    file.mimetype === "application/pdf" ||
    /image\/(jpeg|jpg|png)/.test(file.mimetype);
  if (ok) cb(null, true);
  else cb(new Error("Only PDF, JPG, JPEG and PNG files are allowed."), false);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB — matches the frontend check
});