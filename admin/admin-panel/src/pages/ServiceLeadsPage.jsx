import React, { useEffect, useState } from "react";
import {
  getServiceLeads,
  getServiceLeadStats,
  updateServiceLead,
  deleteServiceLead,
} from "../services/api";
import {
  Calculator, Mail, Phone, Trash2, ChevronDown, Clock, PhoneCall,
  CheckCircle, XCircle, RefreshCw, FileSpreadsheet, FileText,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STYLES = `
  .sl-stat { transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease; }
  .sl-stat:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(15,23,42,0.08); border-color:#DCE3EC; }
  .sl-table tbody tr { transition: background .12s ease; }
  .sl-table tbody tr:hover td { background:#FAFBFD; }
  .sl-tab { transition: background .15s ease, color .15s ease, border-color .15s ease; }
  .sl-del { transition: background .15s ease, color .15s ease; }
  .sl-del:hover { background:#FEE2E2; color:#DC2626; }
  .sl-select { font-family:inherit; }
  .sl-export { transition: background .15s ease, border-color .15s ease, opacity .15s ease; }
  .sl-export:hover:not(:disabled) { background:#F4F7FB; border-color:#DCE3EC; }
  @media (prefers-reduced-motion: reduce) {
    .sl-stat, .sl-tab, .sl-del, .sl-export { transition:none !important; }
  }
`;

// Status badge colours, reused for the inline <select>.
const STATUS_META = {
  new:       { label: "New",       color: "#D97706", bg: "#FEF3C7" },
  contacted: { label: "Contacted", color: "#0891B2", bg: "#E0F7FA" },
  converted: { label: "Converted", color: "#16A34A", bg: "#DCFCE7" },
  closed:    { label: "Closed",    color: "#DC2626", bg: "#FEE2E2" },
};

const STATUS_TABS = [
  { key: "all",       label: "All" },
  { key: "new",       label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "converted", label: "Converted" },
  { key: "closed",    label: "Closed" },
];

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div
      className="sl-stat"
      style={{
        background: "#fff", borderRadius: 16, padding: "18px 20px",
        border: "1px solid var(--border)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        display: "flex", alignItems: "center", gap: 14,
      }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 13, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={21} color={color} />
      </div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</p>
        <p style={{ fontSize: 12.5, color: "#64748B", marginTop: 5 }}>{label}</p>
      </div>
    </div>
  );
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ServiceLeadsPage() {
  const [leads, setLeads]     = useState([]);
  const [stats, setStats]     = useState(null);
  const [filter, setFilter]   = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId]   = useState(null);

  const load = (status = filter) => {
    setLoading(true);
    Promise.all([
      getServiceLeads(status === "all" ? undefined : { status }),
      getServiceLeadStats(),
    ])
      .then(([leadsRes, statsRes]) => {
        setLeads(leadsRes.data.data || []);
        setStats(statsRes.data.data || null);
      })
      .catch((e) => console.error("Failed to load service leads:", e))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); /* eslint-disable-next-line */ }, [filter]);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await updateServiceLead(id, { status });
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
      // Refresh stats counts in the background.
      getServiceLeadStats().then((r) => setStats(r.data.data)).catch(() => {});
    } catch (e) {
      console.error("Status update failed:", e);
      alert("Could not update status. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead permanently?")) return;
    setBusyId(id);
    try {
      await deleteServiceLead(id);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      getServiceLeadStats().then((r) => setStats(r.data.data)).catch(() => {});
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Could not delete the lead. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  // ── Exports ─────────────────────────────────────────────────────────────────
  // Both export the CURRENTLY loaded leads, so they respect the active filter.
  const fileStamp = () => new Date().toISOString().slice(0, 10);

  // Full, detailed rows for the spreadsheet (every field, incl. the estimate).
  const buildRows = () =>
    leads.map((l) => ({
      Name: l.name || "",
      Email: l.email || "",
      Phone: l.phone || "",
      Gender: l.gender || "",
      "Marital Status": l.maritalStatus || "",
      "Date of Birth": l.dob || "",
      Address: l.address || "",
      Service: l.serviceTitle || l.serviceSlug || "",
      Smoker: l.smoker || "",
      "Sum Assured": l.sumAssured || "",
      "Policy Term": l.policyTerm || "",
      "Annual Income": l.annualIncome || "",
      Coverage: l.estimate?.coverage || "",
      "Premium / Month": l.estimate?.monthly || "",
      "Premium / Year": l.estimate?.yearly || "",
      "Total Over Term": l.estimate?.total || "",
      Status: STATUS_META[l.status]?.label || l.status || "",
      "Submitted On": fmtDate(l.createdAt),
    }));

  const exportExcel = () => {
    if (!leads.length) return;
    const rows = buildRows();
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = Object.keys(rows[0]).map((k) => ({ wch: Math.max(12, k.length + 2) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Service Leads");
    XLSX.writeFile(wb, `service-leads-${fileStamp()}.xlsx`);
  };

  const exportPDF = () => {
    if (!leads.length) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42);
    doc.text("Service Leads", 40, 38);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Exported ${new Date().toLocaleString("en-IN")}   •   ${leads.length} lead(s)` +
        (filter !== "all" ? `   •   Filter: ${STATUS_META[filter]?.label || filter}` : ""),
      40,
      54
    );

    const head = [[
      "Name", "Phone", "Email", "Service", "Sum Assured",
      "Term", "Premium/mo", "Status", "Date",
    ]];
    const body = leads.map((l) => [
      l.name || "",
      l.phone || "",
      l.email || "",
      l.serviceTitle || l.serviceSlug || "",
      l.sumAssured || "",
      l.policyTerm || "",
      l.estimate?.monthly || "—",
      STATUS_META[l.status]?.label || l.status || "",
      fmtDate(l.createdAt),
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 66,
      styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
      headStyles: { fillColor: [241, 90, 62], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [250, 251, 253] },
      margin: { left: 40, right: 40 },
    });

    doc.save(`service-leads-${fileStamp()}.pdf`);
  };

  const statCards = [
    { label: "Total",     value: stats?.total || 0,                 icon: Calculator,  color: "#F15A3E", bg: "#FEEEE9" },
    { label: "New",       value: stats?.byStatus?.new || 0,         icon: Clock,       color: "#D97706", bg: "#FEF3C7" },
    { label: "Contacted", value: stats?.byStatus?.contacted || 0,   icon: PhoneCall,   color: "#0891B2", bg: "#E0F7FA" },
    { label: "Converted", value: stats?.byStatus?.converted || 0,   icon: CheckCircle, color: "#16A34A", bg: "#DCFCE7" },
    { label: "Closed",    value: stats?.byStatus?.closed || 0,      icon: XCircle,     color: "#DC2626", bg: "#FEE2E2" },
  ];

  const exportBtnStyle = {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
    background: "#fff", color: "#0F172A", borderRadius: 10, fontSize: 13,
    fontWeight: 600, border: "1px solid var(--border)", cursor: "pointer",
    fontFamily: "inherit",
  };

  return (
    <div>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(120deg, #FFF4F0 0%, #FFFFFF 58%)",
        border: "1px solid #FBE0D8", borderRadius: 18,
        padding: "22px 24px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, flexWrap: "wrap",
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>Service Leads</h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>Leads from the premium calculator on your service pages</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button
            className="sl-export"
            onClick={exportExcel}
            disabled={!leads.length}
            style={{ ...exportBtnStyle, opacity: leads.length ? 1 : 0.5, cursor: leads.length ? "pointer" : "not-allowed" }}
            title="Download as Excel (.xlsx)"
          >
            <FileSpreadsheet size={15} color="#16A34A" /> Excel
          </button>
          <button
            className="sl-export"
            onClick={exportPDF}
            disabled={!leads.length}
            style={{ ...exportBtnStyle, opacity: leads.length ? 1 : 0.5, cursor: leads.length ? "pointer" : "not-allowed" }}
            title="Download as PDF"
          >
            <FileText size={15} color="#DC2626" /> PDF
          </button>
          <button
            onClick={() => load(filter)}
            className="sl-export"
            style={exportBtnStyle}
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {statCards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {STATUS_TABS.map((t) => {
          const active = filter === t.key;
          return (
            <button
              key={t.key}
              className="sl-tab"
              onClick={() => setFilter(t.key)}
              style={{
                padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                border: `1px solid ${active ? "#F15A3E" : "var(--border)"}`,
                background: active ? "#FEEEE9" : "#fff",
                color: active ? "#F15A3E" : "#64748B",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)", overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: 28, color: "#64748B", fontSize: 14 }}>Loading leads…</p>
        ) : leads.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <Calculator size={34} color="#CBD5E1" style={{ marginBottom: 10 }} />
            <p style={{ color: "#64748B", fontSize: 14, fontWeight: 600 }}>No leads yet</p>
            <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>Leads will appear here as visitors use the premium calculator.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="sl-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 900 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border)" }}>
                  {["Name", "Contact", "Service", "Sum Assured", "Term", "Premium", "Date", "Status", ""].map((h, i) => (
                    <th key={i} style={{ padding: "12px 16px", textAlign: i >= 7 ? "center" : "left", fontWeight: 600, color: "#64748B", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => {
                  const meta = STATUS_META[l.status] || STATUS_META.new;
                  return (
                    <tr key={l._id} style={{ borderBottom: i < leads.length - 1 ? "1px solid var(--border)" : "none", opacity: busyId === l._id ? 0.55 : 1 }}>
                      {/* Name + gender/marital */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top" }}>
                        <p style={{ color: "#0F172A", fontWeight: 700 }}>{l.name}</p>
                        <p style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>
                          {[l.gender, l.maritalStatus].filter(Boolean).join(" · ") || "—"}
                        </p>
                      </td>

                      {/* Contact */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top" }}>
                        <a href={`mailto:${l.email}`} style={{ display: "flex", alignItems: "center", gap: 6, color: "#0F172A", textDecoration: "none", fontWeight: 500 }}>
                          <Mail size={13} color="#94A3B8" /> {l.email}
                        </a>
                        <a href={`tel:${l.phone}`} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", textDecoration: "none", marginTop: 4 }}>
                          <Phone size={13} color="#94A3B8" /> {l.phone}
                        </a>
                      </td>

                      {/* Service */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", color: "#0F172A", fontWeight: 500 }}>
                        {l.serviceTitle || l.serviceSlug || "—"}
                      </td>

                      {/* Sum assured + smoker */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", color: "#0F172A" }}>
                        {l.sumAssured || "—"}
                        {l.smoker && (
                          <p style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>Smoker: {l.smoker}</p>
                        )}
                      </td>

                      {/* Term + income */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", color: "#0F172A" }}>
                        {l.policyTerm || "—"}
                        {l.annualIncome && (
                          <p style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>{l.annualIncome}</p>
                        )}
                      </td>

                      {/* Premium estimate */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", color: "#0F172A" }}>
                        {l.estimate?.monthly ? (
                          <>
                            <p style={{ fontWeight: 700, color: "#047857" }}>{l.estimate.monthly}<span style={{ color: "#94A3B8", fontWeight: 500 }}>/mo</span></p>
                            {l.estimate?.coverage && (
                              <p style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>Cover: {l.estimate.coverage}</p>
                            )}
                          </>
                        ) : "—"}
                      </td>

                      {/* Date */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", color: "#64748B", whiteSpace: "nowrap" }}>
                        {fmtDate(l.createdAt)}
                      </td>

                      {/* Status select */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", textAlign: "center" }}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <select
                            className="sl-select"
                            value={l.status}
                            disabled={busyId === l._id}
                            onChange={(e) => handleStatusChange(l._id, e.target.value)}
                            style={{
                              appearance: "none", WebkitAppearance: "none",
                              padding: "6px 26px 6px 12px", borderRadius: 999,
                              border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                              color: meta.color, background: meta.bg, outline: "none",
                            }}
                          >
                            {Object.keys(STATUS_META).map((k) => (
                              <option key={k} value={k} style={{ color: "#0F172A", background: "#fff" }}>
                                {STATUS_META[k].label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={13} color={meta.color} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        </div>
                      </td>

                      {/* Delete */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", textAlign: "center" }}>
                        <button
                          className="sl-del"
                          onClick={() => handleDelete(l._id)}
                          disabled={busyId === l._id}
                          title="Delete lead"
                          style={{ border: "none", background: "transparent", padding: 7, borderRadius: 8, cursor: "pointer", color: "#94A3B8", display: "inline-flex" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}