const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

/**
 * ✅ Middleware: protect
 * Verifies JWT token and checks if admin is active
 * 
 * Usage:
 *   router.get("/", protect, getServiceLeads);
 */
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorised — no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin || !req.admin.isActive) {
      return res.status(401).json({ success: false, message: "Account not active" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

/**
 * ✅ Middleware Factory: authorise
 * Checks if user has required role(s)
 * 
 * Usage:
 *   router.get("/", protect, authorise("admin"), getServiceLeads);
 *   router.get("/", protect, authorise("admin", "superAdmin"), getServiceLeads);
 * 
 * @param {...string} roles - Required roles
 * @returns {Function} Express middleware
 */
exports.authorise = (...roles) => (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ 
      success: false, 
      message: `Insufficient permissions. Required role(s): ${roles.join(", ")}` 
    });
  }

  next();
};

/**
 * ✅ LEGACY EXPORT: admin
 * Convenience export for routes that just need admin role check
 * 
 * Usage:
 *   router.get("/", protect, admin, getServiceLeads);
 * 
 * Equivalent to:
 *   router.get("/", protect, authorise("admin"), getServiceLeads);
 */
 exports.admin = exports.authorise("admin");