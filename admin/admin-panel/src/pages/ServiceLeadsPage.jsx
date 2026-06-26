import React, { useEffect, useState } from "react";
import {
  getServiceLeads,
  getServiceLeadStats,
  updateServiceLead,
  deleteServiceLead,
} from "../services/api";
import {
  Calculator, Mail, Phone, Trash2, ChevronDown, Clock, PhoneCall,
  CheckCircle, XCircle, RefreshCw, FileSpreadsheet, FileText, Paperclip,
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
  .sl-doc { color:#0891B2; text-decoration:none; display:inline-flex; align-items:center; gap:5px; }
  .sl-doc:hover { text-decoration:underline; }
  .sl-doc:active { opacity:0.7; }
  @media (prefers-reduced-motion: reduce) {
    .sl-stat, .sl-tab, .sl-del, .sl-export { transition:none !important; }
  }
`;

// ─── API base (strip trailing /api if present) ────────────────────────────────
const API_HOST = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

/**
 * Always use the backend proxy for document access.
 *
 * WHY: Cloudinary "raw" PDFs return a content-type of
 *      application/octet-stream and may have CORS restrictions that
 *      prevent the browser from opening / downloading them directly.
 *      Going through our own backend endpoint lets us:
 *        1. Set the correct Content-Disposition header.
 *        2. Add auth if needed later.
 *        3. Avoid CORS entirely.
 *
 * The endpoint  GET /api/serviceleads/:id/document
 * looks up the lead, reads lead.insuranceDocument (the Cloudinary URL),
 * and either proxies the stream or redirects with proper headers.
 */
const docProxyUrl = (leadId) =>
  leadId ? `${API_HOST}/api/serviceleads/${leadId}/document` : "";

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

const subText = { color: "#94A3B8", fontSize: 12, marginTop: 2 };

// ─── LeadDetails ─────────────────────────────────────────────────────────────
// Always routes document access through the backend proxy URL.
function LeadDetails({ l }) {
  const slug   = (l.serviceSlug || "").toLowerCase();
  const hasDoc = Boolean(l.insuranceDocument);
  const proxyUrl = docProxyUrl(l._id);

  // Motor — policy number + document download via proxy
  if (slug.includes("motor") || l.insuranceNumber || hasDoc) {
    return (
      <div>
        {l.insuranceNumber && (
          <p style={{ color: "#0F172A", fontWeight: 600 }}>Policy #: {l.insuranceNumber}</p>
        )}
        {hasDoc ? (
          // Use an <a> with target="_blank" so the browser opens the proxied URL.
          // The backend sets Content-Disposition: attachment so it downloads.
          <a
            className="sl-doc"
            href={proxyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12.5, marginTop: 3 }}
            title="View / download insurance document"
          >
            <Paperclip size={12} /> View document
          </a>
        ) : (
          !l.insuranceNumber && <span style={{ color: "#94A3B8" }}>—</span>
        )}
      </div>
    );
  }

  // Miscellaneous — free-text requirements
  if (l.insuranceTypes) {
    return (
      <p style={{ color: "#0F172A", maxWidth: 260, whiteSpace: "normal" }} title={l.insuranceTypes}>
        {l.insuranceTypes.length > 90 ? l.insuranceTypes.slice(0, 90) + "…" : l.insuranceTypes}
      </p>
    );
  }

  // Life — sum assured / term / smoker / income
  if (l.sumAssured || l.policyTerm) {
    return (
      <div>
        <p style={{ color: "#0F172A", fontWeight: 600 }}>
          {l.sumAssured || "—"}{l.policyTerm ? ` · ${l.policyTerm}` : ""}
        </p>
        {l.smoker      && <p style={subText}>Smoker: {l.smoker}</p>}
        {l.annualIncome && <p style={subText}>{l.annualIncome}</p>}
      </div>
    );
  }

  // Health — sum insured / cover type / conditions / city tier
  if (l.sumInsured || l.coverType) {
    return (
      <div>
        <p style={{ color: "#0F172A", fontWeight: 600 }}>
          {l.sumInsured || "—"}{l.coverType ? ` · ${l.coverType}` : ""}
        </p>
        {l.conditions && l.conditions !== "None" && <p style={subText}>{l.conditions}</p>}
        {l.cityTier && <p style={subText}>{l.cityTier}</p>}
      </div>
    );
  }

  return <span style={{ color: "#94A3B8" }}>—</span>;
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ServiceLeadsPage() {
  const [leads,   setLeads]   = useState([]);
  const [stats,   setStats]   = useState(null);
  const [filter,  setFilter]  = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyId,  setBusyId]  = useState(null);

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

  // ── Exports ──────────────────────────────────────────────────────────────────
  const fileStamp = () => new Date().toISOString().slice(0, 10);

  const buildRows = () =>
    leads.map((l) => ({
      Name:              l.name || "",
      Email:             l.email || "",
      Phone:             l.phone || "",
      Service:           l.serviceTitle || l.serviceSlug || "",
      Gender:            l.gender || "",
      "Marital Status":  l.maritalStatus || "",
      "Date of Birth":   l.dob || "",
      Address:           l.address || "",
      Smoker:            l.smoker || "",
      "Sum Assured":     l.sumAssured || "",
      "Policy Term":     l.policyTerm || "",
      "Annual Income":   l.annualIncome || "",
      "Cover Type":      l.coverType || "",
      "Sum Insured":     l.sumInsured || "",
      Conditions:        l.conditions || "",
      "City Tier":       l.cityTier || "",
      "Policy Number":   l.insuranceNumber || "",
      // Use proxy URL so the Excel link also works correctly
      Document:          l.insuranceDocument ? docProxyUrl(l._id) : "",
      Requirements:      l.insuranceTypes || "",
      Coverage:          l.estimate?.coverage || "",
      "Premium / Month": l.estimate?.monthly || "",
      "Premium / Year":  l.estimate?.yearly || "",
      "Total Over Term": l.estimate?.total || "",
      Status:            STATUS_META[l.status]?.label || l.status || "",
      "Submitted On":    fmtDate(l.createdAt),
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

  // Short text details for the PDF "Details" column
  const pdfDetails = (l) => {
    const parts = [];
    if (l.insuranceNumber)   parts.push(`Policy: ${l.insuranceNumber}`);
    if (l.insuranceDocument) parts.push("Doc ↗");   // visual indicator; real link added via didDrawCell
    if (l.insuranceTypes)    return l.insuranceTypes;
    if (l.sumAssured || l.policyTerm)
      return [l.sumAssured, l.policyTerm].filter(Boolean).join(" / ");
    if (l.sumInsured || l.coverType)
      return [l.sumInsured, l.coverType].filter(Boolean).join(" / ");
    return parts.join(", ") || "—";
  };

  const exportPDF = () => {
    if (!leads.length) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    // Header
    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42);
    doc.text("Service Leads", 40, 38);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Exported ${new Date().toLocaleString("en-IN")}   •   ${leads.length} lead(s)` +
        (filter !== "all" ? `   •   Filter: ${STATUS_META[filter]?.label || filter}` : ""),
      40, 54
    );

    // Build table rows — keep a parallel array of doc URLs indexed by row
    const docUrls = [];
    const head = [["Name", "Phone", "Email", "Service", "Details", "Document", "Premium/mo", "Status", "Date"]];
    const body = leads.map((l, i) => {
      // Store proxy URL (or empty) at same index so didDrawCell can look it up
      docUrls[i] = l.insuranceDocument ? docProxyUrl(l._id) : "";

      return [
        l.name || "",
        l.phone || "",
        l.email || "",
        l.serviceTitle || l.serviceSlug || "",
        pdfDetails(l),
        l.insuranceDocument ? "View doc" : "—",   // col 5 — text; link drawn below
        l.estimate?.monthly || "—",
        STATUS_META[l.status]?.label || l.status || "",
        fmtDate(l.createdAt),
      ];
    });

    // Column index for the "Document" column (0-based)
    const DOC_COL = 5;

    autoTable(doc, {
      head,
      body,
      startY: 66,
      styles: { fontSize: 7.5, cellPadding: 4, overflow: "linebreak" },
      headStyles: { fillColor: [241, 90, 62], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [250, 251, 253] },
      columnStyles: {
        0: { cellWidth: 80 },   // Name
        1: { cellWidth: 75 },   // Phone
        2: { cellWidth: 115 },  // Email
        3: { cellWidth: 75 },   // Service
        4: { cellWidth: 80 },   // Details
        5: { cellWidth: 55 },   // Document
        6: { cellWidth: 55 },   // Premium
        7: { cellWidth: 55 },   // Status
        8: { cellWidth: 60 },   // Date
      },
      margin: { left: 40, right: 40 },

      /**
       * didDrawCell — fires after each cell is painted.
       * For the Document column, if there is a URL we:
       *   1. Paint a cyan underline under the "View doc" text.
       *   2. Register a clickable link rectangle so it's interactive in PDF viewers.
       */
      didDrawCell(data) {
        if (data.section !== "body") return;
        if (data.column.index !== DOC_COL) return;

        const url = docUrls[data.row.index];
        if (!url) return;

        const { x, y, width, height } = data.cell;
        const text = "View doc";

        // Measure text width at current font size
        doc.setFontSize(7.5);
        const textW = doc.getTextWidth(text);
        const textX = x + 4;                       // cell left-padding = 4 (matches cellPadding)
        const textY = y + height / 2 + 2.5;        // vertical centre (approx baseline)

        // Draw the text in link colour (overwrite the default black)
        doc.setTextColor(8, 145, 178);              // #0891B2
        doc.text(text, textX, textY);
        doc.setTextColor(0, 0, 0);                  // reset

        // Underline
        doc.setDrawColor(8, 145, 178);
        doc.setLineWidth(0.5);
        doc.line(textX, textY + 1, textX + textW, textY + 1);
        doc.setDrawColor(0, 0, 0);                  // reset

        // Clickable hotspot — works in Acrobat, Evince, Chrome PDF viewer, etc.
        doc.link(x, y, width, height, { url });
      },
    });

    doc.save(`service-leads-${fileStamp()}.pdf`);
  };

  // ── Stat cards ────────────────────────────────────────────────────────────────
  const statCards = [
    { label: "Total",     value: stats?.total || 0,               icon: Calculator,  color: "#F15A3E", bg: "#FEEEE9" },
    { label: "New",       value: stats?.byStatus?.new || 0,       icon: Clock,       color: "#D97706", bg: "#FEF3C7" },
    { label: "Contacted", value: stats?.byStatus?.contacted || 0, icon: PhoneCall,   color: "#0891B2", bg: "#E0F7FA" },
    { label: "Converted", value: stats?.byStatus?.converted || 0, icon: CheckCircle, color: "#16A34A", bg: "#DCFCE7" },
    { label: "Closed",    value: stats?.byStatus?.closed || 0,    icon: XCircle,     color: "#DC2626", bg: "#FEE2E2" },
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
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>Leads from every insurance form across your service pages</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button className="sl-export" onClick={exportExcel} disabled={!leads.length}
            style={{ ...exportBtnStyle, opacity: leads.length ? 1 : 0.5, cursor: leads.length ? "pointer" : "not-allowed" }}
            title="Download as Excel (.xlsx)">
            <FileSpreadsheet size={15} color="#16A34A" /> Excel
          </button>
          <button className="sl-export" onClick={exportPDF} disabled={!leads.length}
            style={{ ...exportBtnStyle, opacity: leads.length ? 1 : 0.5, cursor: leads.length ? "pointer" : "not-allowed" }}
            title="Download as PDF">
            <FileText size={15} color="#DC2626" /> PDF
          </button>
          <button onClick={() => load(filter)} className="sl-export" style={exportBtnStyle}>
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
            <button key={t.key} className="sl-tab" onClick={() => setFilter(t.key)}
              style={{
                padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                border: `1px solid ${active ? "#F15A3E" : "var(--border)"}`,
                background: active ? "#FEEEE9" : "#fff",
                color: active ? "#F15A3E" : "#64748B",
              }}>
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
            <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>Leads will appear here as visitors submit any service form.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="sl-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 980 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border)" }}>
                  {["Name", "Contact", "Service", "Details", "Premium", "Date", "Status", ""].map((h, i) => (
                    <th key={i} style={{ padding: "12px 16px", textAlign: i >= 6 ? "center" : "left", fontWeight: 600, color: "#64748B", whiteSpace: "nowrap" }}>{h}</th>
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
                        <p style={subText}>{[l.gender, l.maritalStatus].filter(Boolean).join(" · ") || "—"}</p>
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

                      {/* Adaptive details */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top" }}>
                        <LeadDetails l={l} />
                      </td>

                      {/* Premium estimate */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", color: "#0F172A" }}>
                        {l.estimate?.monthly ? (
                          <>
                            <p style={{ fontWeight: 700, color: "#047857" }}>{l.estimate.monthly}<span style={{ color: "#94A3B8", fontWeight: 500 }}>/mo</span></p>
                            {l.estimate?.coverage && <p style={subText}>Cover: {l.estimate.coverage}</p>}
                          </>
                        ) : <span style={{ color: "#94A3B8" }}>—</span>}
                      </td>

                      {/* Date */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", color: "#64748B", whiteSpace: "nowrap" }}>
                        {fmtDate(l.createdAt)}
                      </td>

                      {/* Status select */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", textAlign: "center" }}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <select className="sl-select" value={l.status} disabled={busyId === l._id}
                            onChange={(e) => handleStatusChange(l._id, e.target.value)}
                            style={{
                              appearance: "none", WebkitAppearance: "none",
                              padding: "6px 26px 6px 12px", borderRadius: 999,
                              border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                              color: meta.color, background: meta.bg, outline: "none",
                            }}>
                            {Object.keys(STATUS_META).map((k) => (
                              <option key={k} value={k} style={{ color: "#0F172A", background: "#fff" }}>{STATUS_META[k].label}</option>
                            ))}
                          </select>
                          <ChevronDown size={13} color={meta.color} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        </div>
                      </td>

                      {/* Delete */}
                      <td style={{ padding: "13px 16px", verticalAlign: "top", textAlign: "center" }}>
                        <button className="sl-del" onClick={() => handleDelete(l._id)} disabled={busyId === l._id} title="Delete lead"
                          style={{ border: "none", background: "transparent", padding: 7, borderRadius: 8, cursor: "pointer", color: "#94A3B8", display: "inline-flex" }}>
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