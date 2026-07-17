import React, { useEffect, useState } from "react";
import { getChatbotLeads, deleteChatbotLead, updateChatbotLeadStatus } from "../services/api";
import { Trash2, Search, X, ChevronDown, Eye, FileSpreadsheet, Download } from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUS_COLORS = {
  "Pending":  { bg: "#FEF3C7", color: "#D97706" },
  "Resolved": { bg: "#E0F7FA", color: "#0891B2" },
};

const STATUSES = [
  { value: "Pending", label: "Pending" },
  { value: "Resolved", label: "Resolved" }
];

const PAGE_STYLES = `
  .cl-export-btn { transition: background .15s, border-color .15s, opacity .15s; }
  .cl-export-btn:hover:not(:disabled) { background:#F4F7FB; border-color:#CBD5E1; }
  .cl-export-btn:disabled { opacity:.5; cursor:not-allowed; }
`;

export default function ChatbotLeadsPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const itemsPerPage = 7;

  const load = () => {
    getChatbotLeads()
      .then(r => setQueries(r))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateChatbotLeadStatus(id, status);
      setQueries(prev => prev.map(q => q._id === id ? { ...q, status } : q));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div>
          <p style={{ margin: "0 0 10px 0", fontWeight: 500 }}>Are you sure you want to delete this lead?</p>
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
                  await deleteChatbotLead(id);
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
      { duration: 5000 }
    );
  };

  const filtered = queries.filter(q => {
    const matchStatus = filterStatus === "All" || q.status === filterStatus;
    const sText = search.toLowerCase();
    const matchSearch =
      q.name?.toLowerCase().includes(sText) ||
      q.phone?.toLowerCase().includes(sText) ||
      q.email?.toLowerCase().includes(sText) ||
      q.query?.toLowerCase().includes(sText) ||
      q.service?.toLowerCase().includes(sText);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentQueries = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ── Exports ─────────────────────────────────────────────────────────────────
  const fileStamp = () => new Date().toISOString().slice(0, 10);

  const exportExcel = () => {
    if (!filtered.length) { toast.error("No chatbot leads to export"); return; }

    const headers = ["Date", "Name", "Phone", "Email", "Service", "Query", "Status"];
    const aoa = [headers];
    
    filtered.forEach((q) => {
      const row = [
        new Date(q.createdAt).toLocaleDateString("en-IN"),
        q.name || "",
        q.phone || "",
        q.email || "",
        q.service || "—",
        q.query || "",
        STATUSES.find(s => s.value === (q.status || "Pending"))?.label || q.status || "Pending",
      ];
      aoa.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [
      { wch: 15 },
      { wch: 18 },
      { wch: 15 },
      { wch: 22 },
      { wch: 20 },
      { wch: 35 },
      { wch: 14 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chatbot Leads");
    XLSX.writeFile(wb, `chatbot-leads-${fileStamp()}.xlsx`);
    toast.success(`Exported ${filtered.length} lead(s)`);
  };

  const exportPDF = () => {
    if (!filtered.length) { toast.error("No chatbot leads to export"); return; }

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const left = 40;

    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42);
    doc.text("Chatbot Leads", left, 38);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Exported ${new Date().toLocaleString("en-IN")}   •   ${filtered.length} lead(s)` +
        (filterStatus !== "All" ? `   •   Status: ${STATUSES.find(s => s.value === filterStatus)?.label}` : "") +
        (search.trim() ? `   •   Search: "${search.trim()}"` : ""),
      left,
      54
    );

    const head = [["Date", "Name", "Phone", "Email", "Service", "Query", "Status"]];
    const body = filtered.map((q) => [
      new Date(q.createdAt).toLocaleDateString("en-IN"),
      q.name || "",
      q.phone || "",
      q.email || "",
      q.service || "—",
      q.query || "—",
      STATUSES.find(s => s.value === (q.status || "Pending"))?.label || q.status || "Pending",
    ]);

    const PAD = 4;
    const FONT = 8;

    autoTable(doc, {
      head,
      body,
      startY: 66,
      styles: { fontSize: FONT, cellPadding: PAD, overflow: "linebreak", valign: "top" },
      headStyles: { fillColor: [241, 90, 62], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [250, 251, 253] },
      margin: { left: 40, right: 40 },
    });

    doc.save(`chatbot-leads-${fileStamp()}.pdf`);
    toast.success(`Exported ${filtered.length} lead(s)`);
  };

  const exportBtnStyle = {
    display: "flex", alignItems: "center", gap: 7, padding: "9px 14px",
    border: "1px solid #E8EDF3", background: "#fff", color: "#0F172A",
    borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit",
  };

  return (
    <div>
      <style>{PAGE_STYLES}</style>
      
      <div style={{ background: "linear-gradient(120deg, rgb(255, 244, 240) 0%, rgb(255, 255, 255) 58%)", border: "1px solid rgb(251, 224, 216)", borderRadius: "18px", padding: "22px 24px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        {/* LEFT: Title */}
        <div style={{ flex: "1 1 200px" }}>
          <h1 style={{ fontSize:22, fontWeight:800, margin: "0 0 4px 0" }}>Chatbot Leads</h1>
          <p style={{ color:"#64748B", fontSize:13, margin: 0 }}>Manage leads captured from the chatbot</p>
        </div>

        {/* RIGHT: Stats Chips + Exports */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: "1 1 200px", justifyContent: "flex-end", alignItems: "center" }}>
          {STATUSES.map(s => {
            const count = queries.filter(q => (q.status || "Pending") === s.value).length;
            const st = STATUS_COLORS[s.value];
            return (
              <div key={s.value} style={{ background: st.bg, borderRadius: 10, padding: "6px 14px", textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: st.color, margin: 0, lineHeight: 1 }}>{count}</p>
                <p style={{ fontSize: 10, color: st.color, margin: "2px 0 0", fontWeight: 600 }}>{s.label}</p>
              </div>
            );
          })}

          <button className="cl-export-btn" onClick={exportExcel} disabled={!filtered.length} style={exportBtnStyle} title="Download as Excel">
            <FileSpreadsheet size={15} color="#16A34A" /> Excel
          </button>
          <button className="cl-export-btn" onClick={exportPDF} disabled={!filtered.length} style={exportBtnStyle} title="Download as PDF">
            <Download size={15} color="#DC2626" /> PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: "20px" }}>
        {/* Search */}
        <div style={{ position: "relative", width: "300px", maxWidth: "100%" }}>
          <Search size={15} color="#94A3B8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search leads..."
            style={{
              width: "100%", padding: "10px 14px 10px 36px",
              border: "1px solid var(--border)", borderRadius: 10,
              fontSize: 14, color: "#0F172A", background: "#fff",
              outline: "none", boxSizing: "border-box"
            }}
          />
          {search && (
            <button onClick={() => { setSearch(""); setCurrentPage(1); }} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", display: "flex" }}>
              <X size={15} color="#94A3B8" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div style={{ position: "relative", width: "200px", maxWidth: "100%" }}>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            style={{
              width: "100%", padding: "10px 36px 10px 14px", border: "1px solid var(--border)",
              borderRadius: 10, fontSize: 14, color: "#0F172A",
              background: "#fff", outline: "none", cursor: "pointer",
              appearance: "none", boxSizing: "border-box"
            }}
          >
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <ChevronDown size={15} color="#94A3B8" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
      </div>

      {loading ? (
        <p style={{ color:"#64748B" }}>Loading…</p>
      ) : (
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid var(--border)", overflow:"hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth: 1000 }}>
              <thead>
              <tr style={{ background:"#F8FAFC", borderBottom:"1px solid var(--border)" }}>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Date</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Name</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Contact Info</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Service</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Query</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Status</th>
                <th style={{ padding:"12px 16px", textAlign:"right", fontWeight:600, color:"#64748B" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentQueries.map((q, i) => (
                <tr key={q._id} style={{ borderBottom: i < currentQueries.length-1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding:"12px 16px", color:"#64748B", whiteSpace:"nowrap" }}>
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding:"12px 16px", fontWeight:600, color:"#0F172A" }}>
                    {q.name}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div>{q.phone}</div>
                    <div style={{ color:"#64748B", fontSize:12 }}>{q.email}</div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    {q.service ? (
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 8,
                        background: "#F3E8FF", color: "#7C3AED", fontSize: 11.5, fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}>
                        {q.service}
                      </span>
                    ) : (
                      <span style={{ color: "#94A3B8" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding:"12px 16px", color:"#475569" }}>
                    {q.query ? (
                      <button 
                        onClick={() => setModalData({ title: "Query Details", text: q.query })}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer", color: "#0F172A", fontWeight: 600, fontSize: 13 }}
                      >
                        <Eye size={14} /> View
                      </button>
                    ) : "-"}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ position: "relative", width: "fit-content" }}>
                      <select
                        value={q.status || "Pending"}
                        onChange={e => handleStatusChange(q._id, e.target.value)}
                        style={{
                          padding: "4px 24px 4px 9px",
                          border: `1.5px solid ${STATUS_COLORS[q.status || "Pending"]?.color || "var(--border)"}`,
                          borderRadius: 8, fontSize: 12, fontWeight: 700,
                          color: STATUS_COLORS[q.status || "Pending"]?.color || "#334155",
                          background: STATUS_COLORS[q.status || "Pending"]?.bg || "#fff",
                          outline: "none", cursor: "pointer", appearance: "none",
                        }}
                      >
                        {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      <ChevronDown size={11} color={STATUS_COLORS[q.status || "Pending"]?.color || "#94A3B8"} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"flex-end" }}>
                      <button onClick={() => handleDelete(q._id)}
                        style={{ padding:"6px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex", cursor:"pointer" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding:32, textAlign:"center", color:"#94A3B8" }}>No chatbot leads found.</td></tr>
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

      {/* Modal */}
      {modalData && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 16, width: "100%", maxWidth: 500, position: "relative" }}>
            <button onClick={() => setModalData(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
              <X size={20} />
            </button>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: "#0F172A" }}>{modalData.title}</h3>
            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, fontSize: 14, color: "#334155", lineHeight: 1.6, maxHeight: "60vh", overflowY: "auto", whiteSpace: "pre-wrap" }}>
              {modalData.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}