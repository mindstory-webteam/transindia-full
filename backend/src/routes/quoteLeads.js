
const express = require("express");
const router = express.Router();
const {
  createQuoteLead,
  getQuoteLeads,
  getQuoteLeadStats,
  getQuoteLeadById,
  updateQuoteLead,
  deleteQuoteLead,
} = require("../controllers/quoteLeadController");

// IMPORTANT: /stats must come before /:id, otherwise Express treats
// "stats" as an :id value and the route never matches.
router.get("/stats", getQuoteLeadStats);

router.route("/")
  .get(getQuoteLeads)
  .post(createQuoteLead);

router.route("/:id")
  .get(getQuoteLeadById)
  .patch(updateQuoteLead)
  .delete(deleteQuoteLead);

module.exports = router;