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
export async function changePassword(currentPassword, newPassword) {
  return api.put("/auth/change-password", { currentPassword, newPassword });
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