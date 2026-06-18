const express = require("express");
const router = express.Router();
const {
  submitGeneralQuery,
  submitClaimSupport,
  submitComplaint,
  getGeneralQueries,
  getClaimSupports,
  getComplaints,
  deleteGeneralQuery,
  deleteClaimSupport,
  deleteComplaint
} = require("../controllers/contactController");

router.post("/general-query", submitGeneralQuery);
router.post("/claim-support", submitClaimSupport);
router.post("/complaint", submitComplaint);

router.get("/general-query", getGeneralQueries);
router.get("/claim-support", getClaimSupports);
router.get("/complaint", getComplaints);

router.delete("/general-query/:id", deleteGeneralQuery);
router.delete("/claim-support/:id", deleteClaimSupport);
router.delete("/complaint/:id", deleteComplaint);

module.exports = router;
