import api from "../axios";

/**
 * Auth — log in with email + password.
 * Returns the full response object so callers can read res.data.token / res.data.admin
 */
export async function login(email, password) {
  return api.post("/auth/login", { email, password });
}

/**
 * Auth — register a new admin (only used during initial setup)
 */
export async function register(payload) {
  return api.post("/auth/register", payload);
}

/**
 * Auth — get the currently logged-in admin's profile (validates the token)
 */
export async function getMe() {
  return api.get("/auth/me");
}

/**
 * Auth — change password for the logged-in admin
 */
export async function changePassword(newPassword) {
  return api.put("/auth/change-password", { newPassword });
}

/**
 * Leads — get aggregate stats (totals, by status, by service)
 */
export async function getLeadStats() {
  return api.get("/leads/stats");
}

/**
 * Admin — get a paginated/filterable list of leads
 */
export async function getLeads(params = {}) {
  return api.get("/leads", { params });
}

/**
 * Admin — get a single lead by id
 */
export async function getLead(id) {
  return api.get(`/leads/${id}`);
}

/**
 * Admin — update a lead (e.g. status)
 */
export async function updateLead(id, payload) {
  return api.patch(`/leads/${id}`, payload);
}

/**
 * Admin — delete a lead
 */
export async function deleteLead(id) {
  return api.delete(`/leads/${id}`);
}

/**
 * Public — get active services (e.g. for a public listing page)
 */
export async function getServices(params = {}) {
  const { data } = await api.get("/services", { params });
  return data;
}

/**
 * Public — get a single service by slug
 */
export async function getServiceBySlug(slug) {
  const { data } = await api.get(`/services/${slug}`);
  return data;
}

/**
 * Admin — get all services (active + inactive), for the admin list page
 */
export async function getAllServices(params = {}) {
  const { data } = await api.get("/services/admin/all", { params });
  return data;
}

/**
 * Admin — create a new service.
 */
export async function createService(serviceData) {
  const { data } = await api.post("/services", serviceData);
  return data;
}

/**
 * Admin — update an existing service by id.
 */
export async function updateService(id, serviceData) {
  const { data } = await api.put(`/services/${id}`, serviceData);
  return data;
}

/**
 * Admin — delete a service by id
 */
export async function deleteService(id) {
  const { data } = await api.delete(`/services/${id}`);
  return data;
}

/**
 * Admin — toggle a service's active/inactive status
 */
export async function toggleServiceActive(id) {
  const { data } = await api.patch(`/services/${id}/toggle`);
  return data;
}

/**
 * Admin — reorder services.
 */
export async function reorderServices(order) {
  const { data } = await api.patch("/services/admin/reorder", { order });
  return data;
}

/**
 * Contact Forms
 */
export async function getGeneralQueries() {
  const { data } = await api.get("/contact/general-query");
  return data;
}

export async function deleteGeneralQuery(id) {
  const { data } = await api.delete(`/contact/general-query/${id}`);
  return data;
}

export async function updateGeneralQueryStatus(id, status) {
  const { data } = await api.patch(`/contact/general-query/${id}/status`, { status });
  return data.data;
}

export async function getClaimSupports() {
  const { data } = await api.get("/contact/claim-support");
  return data;
}

export async function deleteClaimSupport(id) {
  const { data } = await api.delete(`/contact/claim-support/${id}`);
  return data;
}

export async function updateClaimSupportStatus(id, status) {
  const { data } = await api.patch(`/contact/claim-support/${id}/status`, { status });
  return data.data;
}

export async function getComplaints() {
  const { data } = await api.get("/contact/complaint");
  return data;
}

export async function deleteComplaint(id) {
  const { data } = await api.delete(`/contact/complaint/${id}`);
  return data;
}

export async function updateComplaintStatus(id, status) {
  const { data } = await api.patch(`/contact/complaint/${id}/status`, { status });
  return data.data;
}

// ── Claim Leads ───────────────────────────────────────────────────────────────

/**
 * Admin — get all claim leads (newest first)
 */
export async function getClaimLeads() {
  const { data } = await api.get("/claimleads");
  return data.data;
}

/**
 * Admin — get a single claim lead by id
 */
export async function getClaimLead(id) {
  const { data } = await api.get(`/claimleads/${id}`);
  return data.data;
}

/**
 * Admin — update status of a claim lead
 */
export async function updateClaimLeadStatus(id, status) {
  const { data } = await api.patch(`/claimleads/${id}/status`, { status });
  return data.data;
}

/**
 * Admin — delete a claim lead
 */
export async function deleteClaimLead(id) {
  const { data } = await api.delete(`/claimleads/${id}`);
  return data;
}

/**
 * Public — submit a claim intimation form (multipart with documents)
 */
export async function submitClaimLead(formData) {
  const { data } = await api.post("/claimleads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// ── Service Leads ─────────────────────────────────────────────────────────────
// All admin functions return the RAW axios response so pages read res.data.data.
// The update function uses PUT to match router.put("/:id") in servicesFormRoutes.js

/**
 * Public — submit a service/premium-calculator lead
 */
export async function submitServiceLead(payload) {
  return api.post("/serviceleads", payload);
}

/**
 * Admin — get all service leads (optionally filter by ?status= / ?slug= / ?formType=)
 *
 * Usage:
 *   getServiceLeads()                         → all leads
 *   getServiceLeads({ status: "new" })        → filtered by status
 *   getServiceLeads({ slug: "motor-insurance" })
 */
export async function getServiceLeads(params = {}) {
  return api.get("/serviceleads", { params });
}

/**
 * Admin — get aggregate service-lead stats (total, byStatus)
 */
export async function getServiceLeadStats() {
  return api.get("/serviceleads/stats");
}

/**
 * Admin — get a single service lead by id
 */
export async function getServiceLead(id) {
  return api.get(`/serviceleads/${id}`);
}

/**
 * Admin — update a service lead (status / notes)
 *
 * ⚠️  Uses PUT — must match router.put("/:id") in servicesFormRoutes.js.
 *     The previous version used api.patch() which returned 404 because
 *     no PATCH route exists for this resource.
 */
export async function updateServiceLead(id, payload) {
  return api.put(`/serviceleads/${id}`, payload);   // ← PUT not PATCH
}

/**
 * Admin — delete a service lead
 */
export async function deleteServiceLead(id) {
  return api.delete(`/serviceleads/${id}`);
}

// ── Chatbot Leads ─────────────────────────────────────────────────────────────

export async function getChatbotLeads() {
  const { data } = await api.get("/chatbotleads");
  return data.data;
}

export async function updateChatbotLeadStatus(id, status) {
  const { data } = await api.patch(`/chatbotleads/${id}/status`, { status });
  return data.data;
}

export async function deleteChatbotLead(id) {
  const { data } = await api.delete(`/chatbotleads/${id}`);
  return data;
}

// ── BMI Leads ─────────────────────────────────────────────────────────────────
// Matches routes/bmiLeadRoutes.js: POST /, GET /stats, GET /, GET /:id, PATCH /:id, DELETE /:id

/**
 * Public — submit a BMI calculator lead
 */
export async function submitBmiLead(payload) {
  return api.post("/bmileads", payload);
}

/**
 * Admin — get aggregate BMI lead stats (total, byStatus)
 */
export async function getBmiLeadStats() {
  return api.get("/bmileads/stats");
}

/**
 * Admin — get a paginated/filterable list of BMI leads
 */
export async function getBmiLeads(params = {}) {
  return api.get("/bmileads", { params });
}

/**
 * Admin — get a single BMI lead by id
 */
export async function getBmiLead(id) {
  return api.get(`/bmileads/${id}`);
}

/**
 * Admin — update a BMI lead (e.g. status)
 */
export async function updateBmiLead(id, payload) {
  return api.patch(`/bmileads/${id}`, payload);
}

/**
 * Admin — delete a BMI lead
 */
export async function deleteBmiLead(id) {
  return api.delete(`/bmileads/${id}`);
}

// ── Careers: Jobs & Applications ──────────────────────────────────────────────
// Matches routes/careerRoutes.js (mounted at /careers): 
// GET /jobs (public), POST /jobs/:id/apply (public, resume upload),
// GET /admin/jobs, POST /admin/jobs, PUT /admin/jobs/:id, DELETE /admin/jobs/:id,
// GET /admin/applications, DELETE /admin/applications/:id

/**
 * Public — get all published job openings
 */
export async function getJobs(params = {}) {
  const { data } = await api.get("/careers/jobs", { params });
  return data;
}

/**
 * Public — apply for a job (multipart with resume file)
 */
export async function applyForJob(jobId, formData) {
  const { data } = await api.post(`/careers/jobs/${jobId}/apply`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Admin — get all job openings (active + inactive)
 */
export async function getAdminJobs(params = {}) {
  const { data } = await api.get("/careers/admin/jobs", { params });
  return data;
}

/**
 * Admin — create a new job opening
 */
export async function createJob(payload) {
  const { data } = await api.post("/careers/admin/jobs", payload);
  return data;
}

/**
 * Admin — update an existing job opening
 */
export async function updateJob(id, payload) {
  const { data } = await api.put(`/careers/admin/jobs/${id}`, payload);
  return data;
}

/**
 * Admin — delete a job opening
 */
export async function deleteJob(id) {
  const { data } = await api.delete(`/careers/admin/jobs/${id}`);
  return data;
}

/**
 * Admin — get all job applications
 */
export async function getJobApplications(params = {}) {
  const { data } = await api.get("/careers/admin/applications", { params });
  return data;
}

/**
 * Admin — delete a job application
 */
export async function deleteJobApplication(id) {
  const { data } = await api.delete(`/careers/admin/applications/${id}`);
  return data;
}

// ── Quote Leads ───────────────────────────────────────────────────────────────
// Matches routes/quoteLeadRoutes.js: GET /stats, GET /, POST /, GET /:id, PATCH /:id, DELETE /:id

/**
 * Public — submit a quote lead (e.g. homepage banner quote bar)
 */
export async function submitQuoteLead(payload) {
  return api.post("/quoteleads", payload);
}

/**
 * Admin — get aggregate quote lead stats (total, byStatus)
 */
export async function getQuoteLeadStats() {
  return api.get("/quoteleads/stats");
}

/**
 * Admin — get a paginated/filterable list of quote leads
 */
export async function getQuoteLeads(params = {}) {
  return api.get("/quoteleads", { params });
}

/**
 * Admin — get a single quote lead by id
 */
export async function getQuoteLeadById(id) {
  return api.get(`/quoteleads/${id}`);
}

/**
 * Admin — update a quote lead (e.g. status)
 */
export async function updateQuoteLead(id, payload) {
  return api.patch(`/quoteleads/${id}`, payload);
}

/**
 * Admin — delete a quote lead
 */
export async function deleteQuoteLead(id) {
  return api.delete(`/quoteleads/${id}`);
}

// ── Events ────────────────────────────────────────────────────────────────────
// Matches routes/events.js: GET /, GET /:id, POST / (images upload), PUT /:id, DELETE /:id

/**
 * Public/Admin — get all events
 */
export async function getEvents(params = {}) {
  const { data } = await api.get("/events", { params });
  return data;
}

/**
 * Public/Admin — get a single event by id
 */
export async function getEvent(id) {
  const { data } = await api.get(`/events/${id}`);
  return data;
}

/**
 * Admin — create a new event (multipart, up to 10 images under "images")
 */
export async function createEvent(formData) {
  const { data } = await api.post("/events", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Admin — update an event (multipart, up to 10 images under "images")
 */
export async function updateEvent(id, formData) {
  const { data } = await api.put(`/events/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Admin — delete an event
 */
export async function deleteEvent(id) {
  const { data } = await api.delete(`/events/${id}`);
  return data;
}