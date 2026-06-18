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
 * Images are uploaded straight to Cloudinary from the browser, so the
 * service object already contains plain URL strings (image, whyImage,
 * benefits[].icon, stages[].icon). We send it as JSON — the backend route
 * uses express.json() + parseBody, so no FormData / multipart is needed.
 */
export async function createService(serviceData) {
  const { data } = await api.post("/services", serviceData);
  return data;
}

/**
 * Admin — update an existing service by id. Same JSON shape as createService.
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
 * Pass an array of { id, sortOrder } to match the reorderServices controller.
 */
export async function reorderServices(order) {
  const { data } = await api.patch("/services/admin/reorder", { order });
  return data;
}