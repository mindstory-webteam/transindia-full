import React, { useState, useEffect } from "react";
import axios from "../axios";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit, FileText, X } from "lucide-react";

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
    tags: "",
    isActive: true,
  });

  // Applications State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

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
        tags: job.tags ? job.tags.join(", ") : "",
        isActive: job.isActive,
      });
    } else {
      setEditingJob(null);
      setFormData({ title: "", description: "", tags: "", isActive: true });
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
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
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

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await axios.delete(`/careers/admin/jobs/${id}`);
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#F8FAFC", borderBottom: "1px solid var(--ti-line)", textAlign: "left" }}>
                <tr>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Title</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Tags</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Status</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} style={{ borderBottom: "1px solid var(--ti-line)" }}>
                    <td style={{ padding: "16px 20px", fontWeight: 600 }}>{job.title}</td>
                    <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>{job.tags?.join(", ")}</td>
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#F8FAFC", borderBottom: "1px solid var(--ti-line)", textAlign: "left" }}>
                <tr>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Applicant</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Role</th>
                  <th style={{ padding: "14px 20px", color: "var(--ti-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Date</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Resume</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} style={{ borderBottom: "1px solid var(--ti-line)" }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: 600 }}>{app.name}</div>
                      <div style={{ color: "var(--ti-muted)", fontSize: 13 }}>{app.email}</div>
                      <div style={{ color: "var(--ti-muted)", fontSize: 13 }}>{app.phone}</div>
                    </td>
                    <td style={{ padding: "16px 20px", fontWeight: 500, color: "var(--ti-ink)" }}>{app.jobId?.title || "Unknown Role"}</td>
                    <td style={{ padding: "16px 20px", color: "var(--ti-muted)", fontSize: 14 }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <a 
                        href={app.resumeUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ti-brand)", textDecoration: "none", fontWeight: 600, fontSize: 14 }}
                      >
                        <FileText size={16} /> View PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Tags (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="Remote, Full-time, Design"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 15 }}
                />
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

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <label htmlFor="isActive" style={{ fontWeight: 600, fontSize: 14 }}>Active (Visible on Website)</label>
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
    </div>
  );
}
