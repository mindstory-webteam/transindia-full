import React, { useEffect, useState } from "react";
import { getComplaints, deleteComplaint, updateComplaintStatus } from "../services/api";
import { Trash2, Search, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  "new":           { bg: "#FEF3C7", color: "#D97706" },
  "investigating": { bg: "#E0F7FA", color: "#0891B2" },
  "resolved":      { bg: "#DCFCE7", color: "#16A34A" },
  "closed":        { bg: "#FEE2E2", color: "#DC2626" },
};

const STATUSES = [
  { value: "new", label: "New" },
  { value: "investigating", label: "Investigating" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" }
];

export default function ComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const load = () => {
    getComplaints()
      .then(r => setComplaints(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateComplaintStatus(id, status);
      setComplaints(prev => prev.map(c => c._id === id ? { ...c, status } : c));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div>
          <p style={{ margin: "0 0 10px 0", fontWeight: 500 }}>Are you sure you want to delete this complaint?</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button 
              onClick={() => toast.dismiss(t.id)} 
              style={{ padding: "6px 12px", border: "1px solid var(--border)", background: "#fff", borderRadius: 4, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteComplaint(id);
                  toast.success("Deleted successfully");
                  load();
                } catch (err) {
                  toast.error("Failed to delete");
                }
              }}
              style={{ padding: "6px 12px", border: "none", background: "#E1483B", color: "#fff", borderRadius: 4, cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const filtered = complaints.filter(c => {
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const sText = search.toLowerCase();
    const matchSearch =
      c.name?.toLowerCase().includes(sText) ||
      c.mobile?.toLowerCase().includes(sText) ||
      c.policyRef?.toLowerCase().includes(sText) ||
      c.category?.toLowerCase().includes(sText);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentComplaints = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap: "wrap", gap: 16 }}>
        {/* LEFT: Title */}
        <div style={{ flex: "1 1 200px" }}>
          <h1 style={{ fontSize:22, fontWeight:800 }}>Complaints</h1>
          <p style={{ color:"#64748B", fontSize:13 }}>Manage complaint form submissions</p>
        </div>

        {/* CENTER: Filters */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: "1 1 300px", justifyContent: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 200px" }}>
            <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search complaints..."
              style={{
                width: "100%", padding: "9px 12px 9px 32px",
                border: "1px solid var(--border)", borderRadius: 10,
                fontSize: 13, color: "#0F172A", background: "#fff",
                outline: "none", boxSizing: "border-box", height: "100%",
              }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setCurrentPage(1); }} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", display: "flex" }}>
                <X size={13} color="#94A3B8" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div style={{ position: "relative" }}>
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              style={{
                padding: "9px 32px 9px 12px", border: "1px solid var(--border)",
                borderRadius: 10, fontSize: 13, color: "#0F172A",
                background: "#fff", outline: "none", cursor: "pointer",
                appearance: "none", height: "100%",
              }}
            >
              <option value="All">All Statuses</option>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown size={13} color="#94A3B8" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          </div>
        </div>

        {/* RIGHT: Stats Chips (Bricks) */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: "1 1 200px", justifyContent: "flex-end" }}>
          {STATUSES.map(s => {
            const count = complaints.filter(c => (c.status || "new") === s.value).length;
            const st = STATUS_COLORS[s.value];
            return (
              <div key={s.value} style={{ background: st.bg, borderRadius: 10, padding: "6px 14px", textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: st.color, margin: 0, lineHeight: 1 }}>{count}</p>
                <p style={{ fontSize: 10, color: st.color, margin: "2px 0 0", fontWeight: 600 }}>{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {loading ? (
        <p style={{ color:"#64748B" }}>Loading…</p>
      ) : (
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid var(--border)", overflow:"hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth: 900 }}>
              <thead>
              <tr style={{ background:"#F8FAFC", borderBottom:"1px solid var(--border)" }}>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Date</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Name</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Policy / Ref</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Category</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Mobile</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Details</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Status</th>
                <th style={{ padding:"12px 16px", textAlign:"right", fontWeight:600, color:"#64748B" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentComplaints.map((c, i) => (
                <tr key={c._id} style={{ borderBottom: i < currentComplaints.length-1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding:"12px 16px", color:"#64748B", whiteSpace:"nowrap" }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding:"12px 16px", fontWeight:600, color:"#0F172A" }}>
                    {c.name}
                  </td>
                  <td style={{ padding:"12px 16px", fontFamily:"monospace", color:"#475569" }}>
                    {c.policyRef}
                  </td>
                  <td style={{ padding:"12px 16px", color:"#DC2626", fontWeight:500 }}>
                    {c.category}
                  </td>
                  <td style={{ padding:"12px 16px", color:"#475569" }}>
                    {c.mobile}
                  </td>
                  <td style={{ padding:"12px 16px", color:"#475569", maxWidth: "200px" }}>
                    {c.details || "-"}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ position: "relative", width: "fit-content" }}>
                      <select
                        value={c.status || "new"}
                        onChange={e => handleStatusChange(c._id, e.target.value)}
                        style={{
                          padding: "4px 24px 4px 9px",
                          border: `1.5px solid ${STATUS_COLORS[c.status || "new"]?.color || "var(--border)"}`,
                          borderRadius: 8, fontSize: 12, fontWeight: 700,
                          color: STATUS_COLORS[c.status || "new"]?.color || "#334155",
                          background: STATUS_COLORS[c.status || "new"]?.bg || "#fff",
                          outline: "none", cursor: "pointer", appearance: "none",
                        }}
                      >
                        {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      <ChevronDown size={11} color={STATUS_COLORS[c.status || "new"]?.color || "#94A3B8"} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"flex-end" }}>
                      <button onClick={() => handleDelete(c._id)}
                        style={{ padding:"6px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex", cursor:"pointer" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding:32, textAlign:"center", color:"#94A3B8" }}>No complaints found.</td></tr>
              )}
            </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: "1px solid var(--border)", background: "#fff" }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>Previous</button>
              <span style={{ fontSize: 13, color: "#64748B" }}>Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
