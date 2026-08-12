// Anti-Spam / Bot Filtering Helpers
const SPAM_PHONES = [
  "1234567890", "9876543210", "0123456789", "0000000000",
  "1111111111", "2222222222", "3333333333", "4444444444",
  "5555555555", "6666666666", "7777777777", "8888888888",
  "9999999999", "9876598765", "1234512345"
];

const DISALLOWED_DOMAINS = [
  "test.com", "example.com", "tempmail.com", "mailinator.com",
  "yopmail.com", "10minutemail.com", "dispostable.com", "guerrillamail.com",
  "trashmail.com", "asdf.com", "fake.com", "dummy.com"
];

const SPAM_KEYWORDS = [
  "crypto", "casino", "poker", "viagra", "backlink", "seo rank",
  "whatsapp group", "telegram.me", "t.me/", "bit.ly", "escort"
];

const SPAM_NAMES = ["test", "testing", "asdf", "qwerty", "admin", "bot", "dummy", "fake", "1234", "aaa", "bbb", "xyz"];

function isSpamLead({ name, phone, email, query, honeypot }) {
  // 1. Honeypot check (hidden field filled by automated bots)
  if (honeypot && String(honeypot).trim().length > 0) {
    return { isSpam: true, reason: "Honeypot triggered" };
  }

  // 2. Name check
  const cleanName = (name || "").trim().toLowerCase();
  if (cleanName.length < 2 || SPAM_NAMES.includes(cleanName) || /^\d+$/.test(cleanName)) {
    return { isSpam: true, reason: "Invalid name" };
  }

  // 3. Phone check
  const phoneDigits = (phone || "").replace(/\D/g, "");
  if (phoneDigits.length !== 10 || !/^[6-9]\d{9}$/.test(phoneDigits) || SPAM_PHONES.includes(phoneDigits)) {
    return { isSpam: true, reason: "Invalid phone number" };
  }

  // 4. Email domain check
  const cleanEmail = (email || "").trim().toLowerCase();
  const domain = cleanEmail.split("@")[1];
  if (!domain || DISALLOWED_DOMAINS.includes(domain)) {
    return { isSpam: true, reason: "Disallowed email domain" };
  }

  // 5. Spam query check
  const cleanQuery = (query || "").toLowerCase();
  if (SPAM_KEYWORDS.some((kw) => cleanQuery.includes(kw))) {
    return { isSpam: true, reason: "Spam content in query" };
  }

  return { isSpam: false };
}

// @desc    Create a new chatbot lead
// @route   POST /api/chatbotleads
// @access  Public
exports.createChatbotLead = async (req, res, next) => {
  try {
    const { name, phone, email, query, service, serviceSlug, website } = req.body;

    if (!name || !phone || !email || !query) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    // Anti-Spam & Bot Filtering
    const spamCheck = isSpamLead({ name, phone, email, query, honeypot: website });
    if (spamCheck.isSpam) {
      console.log(`[Chatbot Anti-Spam] Ignored lead from "${name}" (${phone}): ${spamCheck.reason}`);
      // Return 200 success so bots think it worked, but DO NOT save to database
      return res.status(200).json({ success: true, message: "Lead submitted" });
    }

    // Duplicate check: Prevent duplicate submission from same phone/email within last 15 minutes
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existing = await ChatbotLead.findOne({
      $or: [{ phone: phone.trim() }, { email: email.trim().toLowerCase() }],
      createdAt: { $gte: fifteenMinsAgo },
    });

    if (existing) {
      console.log(`[Chatbot Anti-Spam] Ignored duplicate lead for ${phone} / ${email}`);
      return res.status(200).json({ success: true, message: "Lead already received", data: existing });
    }

    const lead = await ChatbotLead.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      query: query.trim(),
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