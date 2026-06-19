const express = require("express");
const router = express.Router();

const {
  createLead,
  getLeads,
  getLeadStats,
  getLead,
  updateLead,
  deleteLead,
} = require("../controllers/bmiLeadController");

/* Support either `module.exports = fn` or `module.exports = { protect }`
   styles of your existing auth middleware. */
let auth = require("../middleware/auth");
if (auth && typeof auth !== "function" && auth.protect) auth = auth.protect;

/* PUBLIC — the BMI calculator form posts here (no login required) */
router.post("/", createLead);

/* ADMIN — protected by auth middleware.
   NOTE: /stats must be declared before /:id so it isn't treated as an id. */
router.get("/stats", auth, getLeadStats);
router.get("/", auth, getLeads);
router.get("/:id", auth, getLead);
router.patch("/:id", auth, updateLead);
router.delete("/:id", auth, deleteLead);

module.exports = router;