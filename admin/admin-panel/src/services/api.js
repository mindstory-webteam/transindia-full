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
 * Pass a plain object; this builds the multipart form for the optional image file.
 * e.g. createService({ title, slug, description, price, image: fileObjectOrNull })
 */
export async function createService(serviceData) {
  const formData = buildServiceFormData(serviceData);
  const { data } = await api.post("/services", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Admin — update an existing service by id.
 * Same shape as createService; only include `image` if a new file was chosen.
 */
export async function updateService(id, serviceData) {
  const formData = buildServiceFormData(serviceData);
  const { data } = await api.put(`/services/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
 * Pass an array of { id, order } (or whatever shape your reorderServices
 * controller expects) — adjust the payload key below to match it exactly.
 */
export async function reorderServices(order) {
  const { data } = await api.patch("/services/admin/reorder", { order });
  return data;
}

/**
 * Builds a FormData object from a plain service object.
 * - Skips null/undefined values
 * - Only appends `image` if it's a File (so editing without changing
 *   the image won't overwrite it with an empty value)
 * - Arrays/objects (e.g. faqs) are JSON-stringified
 */
function buildServiceFormData(serviceData = {}) {
  const formData = new FormData();

  Object.entries(serviceData).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (key === "image") {
      if (value instanceof File) {
        formData.append("image", value);
      }
      return;
    }

    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}