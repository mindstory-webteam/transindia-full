const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadServiceLead");
const ctrl = require("../controllers/servicesFormController");

/*
 * Turns multer/file errors (wrong type, too large) into a clean 400 JSON.
 * 4-arg signature => Express treats it as an error handler: it only runs when
 * `upload` calls next(err); on success Express skips it and hits the controller.
 */
function handleUpload(err, req, res, next) {
  if (err) {
    const msg =
      err.code === "LIMIT_FILE_SIZE" ? "File must be under 5MB." : err.message;
    return res.status(400).json({ success: false, message: msg });
  }
  next();
}

// ── PUBLIC ──────────────────────────────────────────────────────────
// Every form on the site posts here. `upload.single` only activates for
// multipart/form-data (the motor form); JSON bodies pass straight through.
router.post("/", upload.single("insuranceDocument"), handleUpload, ctrl.createServiceLead);

// ── ADMIN ───────────────────────────────────────────────────────────
// NOTE: /stats must be declared BEFORE /:id or "stats" is read as an id.
router.get("/stats", ctrl.getServiceLeadStats);
router.get("/", ctrl.getServiceLeads);
router.get("/:id", ctrl.getServiceLeadById);
// Your admin api.js uses api.patch(); PUT kept as well so both work.
router.patch("/:id", ctrl.updateServiceLead);
router.put("/:id", ctrl.updateServiceLead);
router.delete("/:id", ctrl.deleteServiceLead);

module.exports = router;