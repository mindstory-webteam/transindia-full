const express     = require("express");
const router      = express.Router();
const claimUpload = require("../middleware/claimUpload");
const { protect } = require("../middleware/auth");
const {
  submitClaim,
  getAllClaims,
  getClaimById,
  updateStatus,
  deleteClaim,
} = require("../controllers/claimLeadsController");

// Public — anyone can submit a claim (multipart, up to 10 files)
router.post("/", claimUpload.array("documents", 10), submitClaim);

// Admin protected
router.get("/",             protect, getAllClaims);
router.get("/:id",          protect, getClaimById);
router.patch("/:id/status", protect, updateStatus);
router.delete("/:id",       protect, deleteClaim);

module.exports = router;