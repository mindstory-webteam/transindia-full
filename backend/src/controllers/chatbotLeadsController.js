const ChatbotLead = require("../models/ChatbotLead");

// @desc    Create a new chatbot lead
// @route   POST /api/chatbotleads
// @access  Public
exports.createChatbotLead = async (req, res, next) => {
  try {
    const { name, phone, email, query, service, serviceSlug } = req.body;

    if (!name || !phone || !email || !query) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const lead = await ChatbotLead.create({
      name,
      phone,
      email,
      query,
      service: service || "",
      serviceSlug: serviceSlug || "",
    });

    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all chatbot leads
// @route   GET /api/chatbotleads
// @access  Public / Admin
exports.getChatbotLeads = async (req, res, next) => {
  try {
    const leads = await ChatbotLead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leads });
  } catch (err) {
    next(err);
  }
};

// @desc    Update chatbot lead status
// @route   PATCH /api/chatbotleads/:id/status
// @access  Public / Admin
exports.updateChatbotLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const lead = await ChatbotLead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a chatbot lead
// @route   DELETE /api/chatbotleads/:id
// @access  Admin
exports.deleteChatbotLead = async (req, res, next) => {
  try {
    const lead = await ChatbotLead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};