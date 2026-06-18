const GeneralQuery = require("../models/GeneralQuery");
const ClaimSupport = require("../models/ClaimSupport");
const Complaint = require("../models/Complaint");

exports.submitGeneralQuery = async (req, res) => {
  try {
    const data = await GeneralQuery.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getGeneralQueries = async (req, res) => {
  try {
    const data = await GeneralQuery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteGeneralQuery = async (req, res) => {
  try {
    await GeneralQuery.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitClaimSupport = async (req, res) => {
  try {
    const data = await ClaimSupport.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getClaimSupports = async (req, res) => {
  try {
    const data = await ClaimSupport.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteClaimSupport = async (req, res) => {
  try {
    await ClaimSupport.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitComplaint = async (req, res) => {
  try {
    const data = await Complaint.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const data = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
