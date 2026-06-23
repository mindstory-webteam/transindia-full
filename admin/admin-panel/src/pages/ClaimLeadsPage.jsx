import React, { useEffect, useState } from "react";
import { FileText, Trash2, ChevronDown, AlertCircle, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import { getClaimLeads, deleteClaimLead, updateClaimLeadStatus } from "../services/api";

const STATUS_COLORS = {
  "New":         { bg: "#FEF3C7", color: "#D97706" },
  "In Progress": { bg: "#E0F7FA", color: "#0891B2" },
  "Resolved":    { bg: "#DCFCE7", color: "#16A34A" },
  "Closed":      { bg: "#FEE2E2", color: "#DC2626" },
};

const STATUSES = ["New", "In Progress", "Resolved", "Closed"];

const INSURANCE_COLORS = {
  "Life Insurance":   { bg: "#F5F3FF", color: "#7C3AED" },
  "Health Insurance": { bg: "#E0F7FA", color: "#0891B2" },
  "Motor Insurance":  { bg: "#FEF3C7", color: "#D97706" },
  "Travel Insurance": { bg: "#DCFCE7", color: "#16A34A" },
};

const PAGE_STYLES = `
  .cl-table tbody tr { transition: background .12s ease; }
  .cl-table tbody tr:hover td { background: #FAFBFD; }
  .cl-del-btn { transition: background .15s, color .15s; }
  .cl-del-btn:hover { background: #FEE2E2 !important; color: #DC2626 !important; }
  .cl-status-select { transition: border-color .15s; }
  .cl-status-select:hover { border-color: #CBD5E1; }
  .cl-modal-overlay { animation: fadeIn .15s ease; }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  .cl-modal-box { animation: slideUp .18s ease; }
  @keyframes slideUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
`;

function Badge({ label, map }) {
  const style = map?.[label] || { bg: "#F1F5F9", color: "#64748B" };
  return (
    <span style={{
      background: style.bg, color: style.color,
      fontSize: 11, fontWeight: 700, padding: "3px 9px",
      borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.02em",
    }}>
      {label}
    </span>
  );
}

function DetailModal({ claim, onClose }) {
  if (!claim) return null;
  return (
    <div
      className="cl-modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
        zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="cl-modal-box"
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 18, padding: "28px 30px",
          width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 24px 60px rgba(15,23,42,0.18)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>
              Claim Details
            </h2>
            <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
              {new Date(claim.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ border: "none", background: "#F1F5F9", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex" }}
          >
            <X size={16} color="#64748B" />
          </button>
        </div>

        {/* Badges row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <Badge label={claim.insuranceType} map={INSURANCE_COLORS} />
          <Badge label={claim.claimType}    map={{}} />
          <Badge label={claim.status}       map={STATUS_COLORS} />
          {claim.isUrgent && (
            <span style={{ background: "#FEE2E2", color: "#DC2626", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
              <AlertCircle size={11} /> Urgent
            </span>
          )}
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", marginBottom: 18 }}>
          {[
            ["Name",          claim.name],
            ["Mobile",        claim.mobile],
            ["Policy Number", claim.policyNumber],
            ["Insurance Type",claim.insuranceType],
            ["Claim Type",    claim.claimType],
            ["Status",        claim.status],
          ].map(([label, val]) => (
            <div key={label}>
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>{label}</p>
              <p style={{ fontSize: 13, color: "#0F172A", fontWeight: 600, margin: 0 }}>{val || "—"}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {claim.description && (
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Description</p>
            <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.65, margin: 0, background: "#F8FAFC", borderRadius: 10, padding: "12px 14px", border: "1px solid #E8EDF3" }}>
              {claim.description}
            </p>
          </div>
        )}

        {/* Documents */}
        {claim.documents?.length > 0 && (
          <div>
            <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
              Supporting Documents ({claim.documents.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {claim.documents.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10,
                    border: "1px solid #E8EDF3", background: "#F8FAFC",
                    textDecoration: "none", color: "#0F172A",
                    fontSize: 13, fontWeight: 500,
                  }}
                >
                  <FileText size={15} color="#64748B" />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {doc.originalName || `Document ${i + 1}`}
                  </span>
                  <span style={{ fontSize: 11, color: "#0066FF", fontWeight: 600, flexShrink: 0 }}>View</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClaimLeadsPage() {
  const [claims, setClaims]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  async function fetchClaims() {
    try {
      setLoading(true);
      const data = await getClaimLeads();
      setClaims(data);
    } catch {
      toast.error("Failed to load claim leads");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await updateClaimLeadStatus(id, status);
      setClaims(prev => prev.map(c => c._id === id ? { ...c, status } : c));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  function handleDelete(id) {
    toast(
      (t) => (
        <div>
          <p style={{ margin: "0 0 10px 0", fontWeight: 500 }}>Delete this claim lead? This cannot be undone.</p>
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
                  setDeletingId(id);
                  await deleteClaimLead(id);
                  setClaims(prev => prev.filter(c => c._id !== id));
                  toast.success("Claim deleted");
                } catch {
                  toast.error("Failed to delete claim");
                } finally {
                  setDeletingId(null);
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
  }

  const filtered = claims.filter(c => {
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      c.name?.toLowerCase().includes(q) ||
      c.mobile?.toLowerCase().includes(q) ||
      c.policyNumber?.toLowerCase().includes(q) ||
      c.insuranceType?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const urgentCount = claims.filter(c => c.isUrgent && c.status === "New").length;

  return (
    <div>
      <style>{PAGE_STYLES}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(120deg, #FFF4F0 0%, #FFFFFF 60%)",
        border: "1px solid #FBE0D8", borderRadius: 18,
        padding: "22px 24px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 13, flexShrink: 0,
            background: "linear-gradient(135deg, #F15A3E 0%, #FB7E54 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 18px rgba(241,90,62,0.3)",
          }}>
            <FileText size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
              Claim Leads
            </h1>
            <p style={{ color: "#64748B", fontSize: 13, marginTop: 3 }}>
              {claims.length} total
              {urgentCount > 0 && (
                <span style={{ marginLeft: 10, background: "#FEE2E2", color: "#DC2626", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                  {urgentCount} urgent
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Stats chips */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {STATUSES.map(s => {
            const count = claims.filter(c => c.status === s).length;
            const st = STATUS_COLORS[s];
            return (
              <div key={s} style={{ background: st.bg, borderRadius: 10, padding: "6px 14px", textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: st.color, margin: 0, lineHeight: 1 }}>{count}</p>
                <p style={{ fontSize: 10, color: st.color, margin: "2px 0 0", fontWeight: 600 }}>{s}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, mobile, policy…"
            style={{
              width: "100%", padding: "9px 12px 9px 32px",
              border: "1px solid #E8EDF3", borderRadius: 10,
              fontSize: 13, color: "#0F172A", background: "#fff",
              outline: "none", boxSizing: "border-box",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", display: "flex" }}>
              <X size={13} color="#94A3B8" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div style={{ position: "relative" }}>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="cl-status-select"
            style={{
              padding: "9px 32px 9px 12px", border: "1px solid #E8EDF3",
              borderRadius: 10, fontSize: 13, color: "#0F172A",
              background: "#fff", outline: "none", cursor: "pointer",
              appearance: "none",
            }}
          >
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} color="#94A3B8" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF3", boxShadow: "0 1px 2px rgba(15,23,42,0.04)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Loading claim leads…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <FileText size={32} color="#CBD5E1" style={{ margin: "0 auto 10px" }} />
            <p style={{ color: "#94A3B8", fontSize: 14, fontWeight: 500 }}>No claim leads found</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="cl-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E8EDF3" }}>
                  {["Name", "Mobile", "Policy No.", "Insurance Type", "Claim Type", "Urgent", "Status", "Date", "Actions"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: "#64748B", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c._id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #E8EDF3" : "none" }}>
                    {/* Name */}
                    <td style={{ padding: "12px 16px", color: "#0F172A", fontWeight: 600, whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => setSelected(c)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#0F172A", fontWeight: 600, fontSize: 13, textDecoration: "underline", textDecorationColor: "#CBD5E1" }}
                      >
                        {c.name}
                      </button>
                    </td>

                    {/* Mobile */}
                    <td style={{ padding: "12px 16px", color: "#334155", whiteSpace: "nowrap" }}>{c.mobile}</td>

                    {/* Policy */}
                    <td style={{ padding: "12px 16px", color: "#334155", fontFamily: "monospace", fontSize: 12 }}>{c.policyNumber}</td>

                    {/* Insurance type */}
                    <td style={{ padding: "12px 16px" }}>
                      <Badge label={c.insuranceType} map={INSURANCE_COLORS} />
                    </td>

                    {/* Claim type */}
                    <td style={{ padding: "12px 16px", color: "#334155", whiteSpace: "nowrap" }}>{c.claimType}</td>

                    {/* Urgent */}
                    <td style={{ padding: "12px 16px" }}>
                      {c.isUrgent ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#DC2626", fontWeight: 700, fontSize: 12 }}>
                          <AlertCircle size={13} /> Yes
                        </span>
                      ) : (
                        <span style={{ color: "#94A3B8", fontSize: 12 }}>—</span>
                      )}
                    </td>

                    {/* Status dropdown */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ position: "relative" }}>
                        <select
                          value={c.status}
                          onChange={e => handleStatusChange(c._id, e.target.value)}
                          className="cl-status-select"
                          style={{
                            padding: "4px 24px 4px 9px",
                            border: `1.5px solid ${STATUS_COLORS[c.status]?.color || "#E8EDF3"}`,
                            borderRadius: 8, fontSize: 12, fontWeight: 700,
                            color: STATUS_COLORS[c.status]?.color || "#334155",
                            background: STATUS_COLORS[c.status]?.bg || "#fff",
                            outline: "none", cursor: "pointer", appearance: "none",
                          }}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={11} color={STATUS_COLORS[c.status]?.color || "#94A3B8"} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ padding: "12px 16px", color: "#94A3B8", fontSize: 12, whiteSpace: "nowrap" }}>
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => setSelected(c)}
                          style={{
                            border: "1px solid #E8EDF3", background: "#F8FAFC",
                            borderRadius: 7, padding: "5px 10px", cursor: "pointer",
                            fontSize: 12, fontWeight: 600, color: "#334155",
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          disabled={deletingId === c._id}
                          className="cl-del-btn"
                          style={{
                            border: "1px solid #E8EDF3", background: "#F8FAFC",
                            borderRadius: 7, padding: "5px 7px", cursor: "pointer",
                            display: "flex", alignItems: "center", color: "#94A3B8",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && <DetailModal claim={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}