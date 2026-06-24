const Admin = require("../models/Admin");

// ── POST /api/auth/login ──────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password required" });

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = admin.getSignedJwt();
    res.json({
      success: true,
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

// ── POST /api/auth/register  (superadmin only — seed use) ────────────────
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const admin = await Admin.create({ name, email, password, role });
    const token = admin.getSignedJwt();
    res.status(201).json({ success: true, token, admin: { id: admin._id, name, email, role: admin.role } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── PUT /api/auth/change-password ─────────────────────────────────────────
exports.changePassword = async (req, res) => {
  const { newPassword } = req.body;
  
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "New password must be at least 6 characters long." });
  }

  try {
    const admin = await Admin.findById(req.admin._id).select("+password");
    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};