const express = require("express");
const {
  createChatbotLead,
  getChatbotLeads,
  updateChatbotLeadStatus,
  deleteChatbotLead
} = require("../controllers/chatbotLeadsController");

const router = express.Router();

router.route("/")
  .post(createChatbotLead)
  .get(getChatbotLeads);

router.route("/:id/status")
  .patch(updateChatbotLeadStatus);

router.route("/:id")
  .delete(deleteChatbotLead);

module.exports = router;
