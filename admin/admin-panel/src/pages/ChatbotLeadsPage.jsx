import React, { useEffect, useState } from "react";
import { getChatbotLeads, deleteChatbotLead, updateChatbotLeadStatus } from "../services/api";
import { Trash2, Search, FileSpreadsheet, Download } from "lucide-react";
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

export default function ChatbotLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const load = () => {
    getChatbotLeads()
      .then(r => setLeads(r))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateChatbotLeadStatus(id, status);
      setLeads(prev => prev.map(l => l._id === id ? { ...l, status } : l));
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div>
          <p style={{ margin: "0 0 10px 0", fontWeight: 500 }}>Delete this chatbot lead?</p>
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

  const filtered = leads.filter(l => {
    const matchStatus = filterStatus === "All" || l.status === filterStatus;
    const sText = search.toLowerCase();
    const matchSearch =
      l.name?.toLowerCase().includes(sText) ||
      l.phone?.toLowerCase().includes(sText) ||
      l.email?.toLowerCase().includes(sText) ||
      l.query?.toLowerCase().includes(sText);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentLeads = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fileStamp = () => new Date().toISOString().slice(0, 10);

  const exportExcel = () => {
    if (!filtered.length) { toast.error("No leads to export"); return; }
    const headers = ["Date", "Name", "Phone", "Email", "Query", "Status"];
    const aoa = [headers];
    filtered.forEach((l) => {
      aoa.push([
        new Date(l.createdAt).toLocaleDateString("en-IN"),
        l.name || "",
        l.phone || "",
        l.email || "",
        l.query || "",
        l.status || "Pending",
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 40 }, { wch: 15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chatbot Leads");
    XLSX.writeFile(wb, `chatbot-leads-${fileStamp()}.xlsx`);
    toast.success(`Exported ${filtered.length} leads`);
  };

  const exportPDF = () => {
    if (!filtered.length) { toast.error("No leads to export"); return; }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const tableData = filtered.map(l => [
      new Date(l.createdAt).toLocaleDateString("en-IN"),
      l.name || "-",
      l.phone || "-",
      l.email || "-",
      l.query || "-",
      l.status || "Pending",
    ]);
    autoTable(doc, {
      head: [["Date", "Name", "Phone", "Email", "Query", "Status"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [241, 90, 64] },
      styles: { fontSize: 9, cellPadding: 6 },
    });
    doc.save(`chatbot-leads-${fileStamp()}.pdf`);
    toast.success(`Exported ${filtered.length} leads as PDF`);
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--ti-muted)" }}>Loading Chatbot Leads...</div>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 60 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ti-ink)", margin: "0 0 6px" }}>Chatbot Leads</h1>
          <p style={{ margin: 0, color: "var(--ti-muted)", fontSize: 14 }}>
            Manage queries captured directly from the frontend chatbot.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={exportExcel} style={{ padding: "8px 14px", border: "1px solid var(--border)", background: "#fff", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            <FileSpreadsheet size={16} color="#10B981" /> Export Excel
          </button>
          <button onClick={exportPDF} style={{ padding: "8px 14px", border: "1px solid var(--border)", background: "#fff", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            <Download size={16} color="#EF4444" /> Export PDF
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid var(--border)", boxShadow: "0 2px 4px rgba(0,0,0,.02)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 13, outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            {["All", ...STATUSES.map(s => s.value)].map(st => (
              <button
                key={st}
                onClick={() => { setFilterStatus(st); setCurrentPage(1); }}
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none",
                  background: filterStatus === st ? "var(--ti-brand-soft)" : "#F1F5F9",
                  color: filterStatus === st ? "var(--ti-brand)" : "#64748B",
                  transition: "all .2s"
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border)", color: "#64748B", fontWeight: 600 }}>
                <th style={{ padding: "14px 20px" }}>Date</th>
                <th style={{ padding: "14px 20px" }}>Name</th>
                <th style={{ padding: "14px 20px" }}>Contact</th>
                <th style={{ padding: "14px 20px" }}>Query</th>
                <th style={{ padding: "14px 20px" }}>Status</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "40px 20px", textAlign: "center", color: "#94A3B8" }}>
                    No chatbot leads found.
                  </td>
                </tr>
              ) : (
                currentLeads.map(l => {
                  const sColor = STATUS_COLORS[l.status] || { bg: "#F1F5F9", color: "#64748B" };
                  return (
                    <tr key={l._id} style={{ borderBottom: "1px solid var(--border)", background: "#fff", transition: "background .15s" }}>
                      <td style={{ padding: "14px 20px", color: "var(--ti-muted)" }}>
                        {new Date(l.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td style={{ padding: "14px 20px", fontWeight: 500, color: "var(--ti-ink)" }}>
                        {l.name}
                      </td>
                      <td style={{ padding: "14px 20px", color: "var(--ti-muted)" }}>
                        <div>{l.phone}</div>
                        <div style={{ fontSize: 12 }}>{l.email}</div>
                      </td>
                      <td style={{ padding: "14px 20px", color: "var(--ti-muted)", maxWidth: 250, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={l.query}>
                        {l.query}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <select
                          value={l.status}
                          onChange={(e) => handleStatusChange(l._id, e.target.value)}
                          style={{
                            appearance: "none", background: sColor.bg, color: sColor.color,
                            border: "none", padding: "4px 10px", borderRadius: 12,
                            fontSize: 12, fontWeight: 600, cursor: "pointer", outline: "none"
                          }}
                        >
                          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <button
                          onClick={() => handleDelete(l._id)}
                          style={{
                            background: "none", border: "none", color: "#94A3B8", cursor: "pointer",
                            padding: 6, borderRadius: 6, transition: "all .15s"
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "#FEE2E2"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.background = "none"; }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "var(--ti-muted)" }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} leads
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? .5 : 1 }}
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? .5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
