const express = require("express");
const router = express.Router();

// ═══════════════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════════════

// Controllers
const {
  createServiceLead,
  getServiceLeads,
  getServiceLeadStats,
  getServiceLeadById,
  getServiceLeadDocument,
  updateServiceLead,
  deleteServiceLead,
} = require("../controllers/servicesFormController");

// Upload Middleware
const uploadServiceLead = require("../middleware/uploadServiceLead");
const uploadErrorHandler = uploadServiceLead.uploadErrorHandler;

// Auth Middleware
const { protect, authorise } = require("../middleware/auth");

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/serviceleads
 * Create a new service lead (PUBLIC - no auth required)
 * 
 * Handles multiple form types:
 * - calculator (life/health insurance)
 * - simple (home/travel/marine/fire/entertainment)
 * - motor (with file upload)
 * - miscellaneous
 * 
 * Request:
 *   - Form data with optional file: insuranceDocument
 *   - Fields: name, email, phone, serviceSlug, insuranceNumber (for motor), etc.
 * 
 * Response (201):
 *   { success: true, data: { id, formType } }
 */
router.post(
  "/",
  uploadServiceLead.single("insuranceDocument"),  // Upload file to Cloudinary
  uploadErrorHandler,                              // Handle upload errors
  createServiceLead                                // Save lead to database
);

// ═══════════════════════════════════════════════════════════════
// PROTECTED ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/serviceleads
 * List all service leads with optional filters (ADMIN ONLY)
 * 
 * Query params:
 *   ?status=new|contacted|converted|closed
 *   ?slug=motor-insurance|life-insurance|etc
 *   ?formType=calculator|motor|simple|miscellaneous
 * 
 * Example:
 *   GET /api/serviceleads?status=new&slug=motor-insurance
 * 
 * Response (200):
 *   { success: true, count: 10, data: [...leads] }
 */
router.get(
  "/",
  protect,
  authorise("admin"),  // Only admin role
  getServiceLeads
);

/**
 * GET /api/serviceleads/stats
 * Get statistics about service leads by status (ADMIN ONLY)
 * 
 * Response (200):
 *   {
 *     success: true,
 *     data: {
 *       total: 100,
 *       byStatus: {
 *         new: 50,
 *         contacted: 30,
 *         converted: 15,
 *         closed: 5
 *       }
 *     }
 *   }
 */
router.get(
  "/stats",
  protect,
  authorise("admin"),
  getServiceLeadStats
);

/**
 * GET /api/serviceleads/:id/document
 * Download or view insurance document from Cloudinary (PUBLIC or ADMIN)
 * 
 * NOTE: Currently PUBLIC. Uncomment protect/authorise if you want to restrict.
 * 
 * Example with auth:
 *   router.get("/:id/document", protect, authorise("admin"), getServiceLeadDocument);
 * 
 * Response (302):
 *   Redirects to Cloudinary secure_url
 */
router.get(
  "/:id/document",
  getServiceLeadDocument  // ← Currently public (no auth)
  // Uncomment below to make admin-only:
  // protect,
  // authorise("admin"),
  // getServiceLeadDocument
);

/**
 * GET /api/serviceleads/:id
 * Get a single service lead by ID (ADMIN ONLY)
 * 
 * Response (200):
 *   { success: true, data: { ...lead } }
 */
router.get(
  "/:id",
  protect,
  authorise("admin"),
  getServiceLeadById
);

/**
 * PUT /api/serviceleads/:id
 * Update lead status or notes (ADMIN ONLY)
 * 
 * Request body:
 *   {
 *     "status": "contacted|converted|closed",  // optional
 *     "notes": "Internal notes about the lead"  // optional
 *   }
 * 
 * Response (200):
 *   { success: true, data: { ...updatedLead } }
 */
router.put(
  "/:id",
  protect,
  authorise("admin"),
  updateServiceLead
);

/**
 * DELETE /api/serviceleads/:id
 * Delete a service lead and its attachments (ADMIN ONLY)
 * 
 * Automatically:
 * - Removes lead from MongoDB
 * - Deletes Cloudinary document (if attached)
 * - Logs deletion
 * 
 * Response (200):
 *   { success: true, message: "Lead deleted." }
 */
router.delete(
  "/:id",
  protect,
  authorise("admin"),
  deleteServiceLead
);

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════

/**
 * If a route doesn't match above, return 404
 * (optional - Express does this by default)
 */
router.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.path}` 
  });
});

module.exports = router;