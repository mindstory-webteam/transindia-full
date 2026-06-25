const QuoteLead = require("../models/QuoteLead");

exports.createQuoteLead = async (req, res, next) => {
  try {
    const { insuranceType, sumInsured, mobile } = req.body;
    if (!insuranceType || !sumInsured || !mobile) {
      return res.status(400).json({
        success: false,
        message: "insuranceType, sumInsured and mobile are required",
      });
    }
    const lead = await QuoteLead.create({ insuranceType, sumInsured, mobile });
    res.status(201).json({ success: true, message: "Lead captured successfully", data: lead });
  } catch (err) {
    next(err);
  }
};

exports.getQuoteLeads = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { search, status } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ mobile: regex }, { insuranceType: regex }, { sumInsured: regex }];
    }

    const total = await QuoteLead.countDocuments(filter);
    const leads = await QuoteLead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      leads,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    next(err);
  }
};

exports.getQuoteLeadStats = async (req, res, next) => {
  try {
    const [total, newCount, contacted, converted, closed] = await Promise.all([
      QuoteLead.countDocuments(),
      QuoteLead.countDocuments({ status: "new" }),
      QuoteLead.countDocuments({ status: "contacted" }),
      QuoteLead.countDocuments({ status: "converted" }),
      QuoteLead.countDocuments({ status: "closed" }),
    ]);
    res.status(200).json({ success: true, stats: { total, new: newCount, contacted, converted, closed } });
  } catch (err) {
    next(err);
  }
};

exports.getQuoteLeadById = async (req, res, next) => {
  try {
    const lead = await QuoteLead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

exports.updateQuoteLead = async (req, res, next) => {
  try {
    const lead = await QuoteLead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

exports.deleteQuoteLead = async (req, res, next) => {
  try {
    const lead = await QuoteLead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.status(200).json({ success: true, message: "Lead deleted" });
  } catch (err) {
    next(err);
  }
};