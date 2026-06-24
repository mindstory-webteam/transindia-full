import React, { useState, useEffect } from "react";
import axios from "../axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit, FileText, X, Eye } from "lucide-react";

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState("roles"); // "roles" | "applications"
  
  // Job Roles State
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "Remote",
    jobType: "Full-time",
    order: 0,
    isActive: true,
  });

  // Applications State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appModalData, setAppModalData] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get("/careers/admin/jobs");
      if (data.success) setJobs(data.data);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get("/careers/admin/applications");
      if (data.success) setApplications(data.data);
    } catch (err) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoadingApps(false);
    }
  };

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        description: job.description,
        location: job.tags && job.tags[0] ? job.tags[0] : "Remote",
        jobType: job.tags && job.tags[1] ? job.tags[1] : "Full-time",
        order: job.order || 0,
        isActive: job.isActive,
      });
    } else {
      setEditingJob(null);
      setFormData({ title: "", description: "", location: "Remote", jobType: "Full-time", order: 0, isActive: true });
    }
    setIsJobModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsJobModalOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: [formData.location, formData.jobType],
      };

      if (editingJob) {
        await axios.put(`/careers/admin/jobs/${editingJob._id}`, payload);
        toast.success("Job updated successfully");
      } else {
        await axios.post("/careers/admin/jobs", payload);
        toast.success("Job created successfully");
      }
      
      handleCloseModal();
      fetchJobs();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save job");
    }
  };

  const handleDeleteJob = (id) => {
    toast(
      (t) => (
        <div>
          <p style={{ margin: "0 0 10px 0", fontWeight: 500 }}>Are you sure you want to delete this role?</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button 
              onClick={() => toast.dismiss(t.id)} 
              style={{ padding: "6px 12px", border: "1px solid var(--ti-line)", background: "#fff", borderRadius: 4, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.delete(`/careers/admin/jobs/${id}`);
                  toast.success("Job deleted successfully");
                  fetchJobs();
                } catch (err) {
                  toast.error("Failed to delete job");
                }
              }}
              style={{ padding: "6px 12px", border: "none", background: "#E1483B", color: "#fff", borderRadius: 4, cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleDeleteApp = (id) => {
    toast(
      (t) => (
        <div>
          <p style={{ margin: "0 0 10px 0", fontWeight: 500 }}>Are you sure you want to delete this application?</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button 
              onClick={() => toast.dismiss(t.id)} 
              style={{ padding: "6px 12px", border: "1px solid var(--ti-line)", background: "#fff", borderRadius: 4, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.delete(`/careers/admin/applications/${id}`);
                  toast.success("Application deleted successfully");
                  fetchApplications();
                } catch (err) {
                  toast.error("Failed to delete application");
                }
              }}
              style={{ padding: "6px 12px", border: "none", background: "#E1483B", color: "#fff", borderRadius: 4, cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ background: "linear-gradient(120deg, rgb(255, 244, 240) 0%, rgb(255, 255, 255) 58%)", border: "1px solid rgb(251, 224, 216)", borderRadius: "18px", padding: "22px 24px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--ti-ink)" }}>Careers Management</h1>
        {activeTab === "roles" && (
          <button 
            onClick={() => handleOpenModal()}
            style={{ 
              display: "flex", alignItems: "center", gap: 8, background: "var(--ti-brand)", 
              color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600
            }}
          >
            <Plus size={16} /> Add Role
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 20, borderBottom: "1px solid var(--ti-line)", marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab("roles")}
          style={{
            padding: "10px 4px", border: "none", background: "none", cursor: "pointer",
            borderBottom: activeTab === "roles" ? "2px solid var(--ti-brand)" : "2px solid transparent",
            color: activeTab === "roles" ? "var(--ti-brand)" : "var(--ti-muted)",
            fontWeight: activeTab === "roles" ? 700 : 500, fontSize: 15
          }}
        >
          Job Roles
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          style={{
            padding: "10px 4px", border: "none", background: "none", cursor: "pointer",
            borderBottom: activeTab === "applications" ? "2px solid var(--ti-brand)" : "2px solid transparent",
            color: activeTab === "applications" ? "var(--ti-brand)" : "var(--ti-muted)",
            fontWeight: activeTab === "applications" ? 700 : 500, fontSize: 15
          }}
        >
          Applications
        </button>
      </div>

      {/* ROLES TAB */}
      {activeTab === "roles" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--ti-line)", overflow: "hidden" }}>
          {loadingJobs ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--ti-muted)" }}>Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--ti-muted)" }}>No job roles found. Create one above.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead style={{ background: "#F8FAFC", borderBottom: "1px solid var(--ti-line)", textAlign: "left" }}>
                <tr>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Title</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Location Type</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Job Type</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Order</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Status</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} style={{ borderBottom: "1px solid var(--ti-line)" }}>
                    <td style={{ padding: "16px 20px", fontWeight: 600 }}>{job.title}</td>
                    <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>{job.tags?.[0] || "-"}</td>
                    <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>{job.tags?.[1] || "-"}</td>
                    <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>{job.order || 0}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ 
                        background: job.isActive ? "#DEF7EC" : "#FDE8E8", 
                        color: job.isActive ? "#03543F" : "#9B1C1C",
                        padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600
                      }}>
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                      <button onClick={() => handleOpenModal(job)} style={{ background: "none", border: "none", color: "var(--ti-muted)", cursor: "pointer" }}><Edit size={16} /></button>
                      <button onClick={() => handleDeleteJob(job._id)} style={{ background: "none", border: "none", color: "#E1483B", cursor: "pointer" }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* APPLICATIONS TAB */}
      {activeTab === "applications" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--ti-line)", overflow: "hidden" }}>
          {loadingApps ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--ti-muted)" }}>Loading applications...</div>
          ) : applications.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--ti-muted)" }}>No applications received yet.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead style={{ background: "#F8FAFC", borderBottom: "1px solid var(--ti-line)", textAlign: "left" }}>
                <tr>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Applicant</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Email</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Mobile</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Role</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Message</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Date</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Resume</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} style={{ borderBottom: "1px solid var(--ti-line)" }}>
                    <td style={{ padding: "16px 20px", fontWeight: 600 }}>{app.name}</td>
                    <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>{app.email}</td>
                    <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>{app.phone}</td>
                    <td style={{ padding: "16px 20px", fontWeight: 500, color: "var(--ti-ink)" }}>{app.jobId?.title || "Unknown Role"}</td>
                    <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>
                      {app.message ? (
                        <button 
                          onClick={() => setAppModalData({ title: "Message Details", text: app.message })}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer", color: "#0F172A", fontWeight: 600, fontSize: 13 }}
                        >
                          <Eye size={14} /> View
                        </button>
                      ) : "-"}
                    </td>
                    <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 }}>
                      <a 
                        href={app.resumeUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ti-brand)", textDecoration: "none", fontWeight: 600, fontSize: 14 }}
                      >
                        <FileText size={16} /> View PDF
                      </a>
                      <button onClick={() => handleDeleteApp(app._id)} style={{ background: "none", border: "none", color: "#E1483B", cursor: "pointer", display: "flex", alignItems: "center" }} title="Delete Application">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* JOB MODAL */}
      {isJobModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: 600, borderRadius: 12, padding: 24, position: "relative" }}>
            <button 
              onClick={handleCloseModal}
              style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "var(--ti-muted)" }}
            >
              <X size={20} />
            </button>
            
            <h2 style={{ marginTop: 0, marginBottom: 20 }}>{editingJob ? "Edit Job Role" : "Create Job Role"}</h2>
            
            <form onSubmit={handleSaveJob} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Job Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 15 }}
                />
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Location Type</label>
                  <select 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 15, background: "#fff" }}
                  >
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Job Type</label>
                  <select 
                    value={formData.jobType}
                    onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 15, background: "#fff" }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internships">Internships</option>
                    <option value="Contract/Temporary">Contract/Temporary</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 15, fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <label htmlFor="isActive" style={{ fontWeight: 600, fontSize: 14 }}>Active (Visible)</label>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <label htmlFor="order" style={{ fontWeight: 600, fontSize: 14 }}>Order:</label>
                  <input 
                    type="number" 
                    id="order"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: e.target.value === "" ? "" : Number(e.target.value)})}
                    style={{ width: "80px", padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: "10px 16px", borderRadius: 6, border: "none", background: "#f1f5f9", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: "10px 16px", borderRadius: 6, border: "none", background: "var(--ti-brand)", color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* App Message Modal */}
      {appModalData && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 16, width: "100%", maxWidth: 500, position: "relative" }}>
            <button onClick={() => setAppModalData(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
              <X size={20} />
            </button>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{appModalData.title}</h3>
            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, fontSize: 14, color: "#334155", lineHeight: 1.6, maxHeight: "60vh", overflowY: "auto", whiteSpace: "pre-wrap" }}>
              {appModalData.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
