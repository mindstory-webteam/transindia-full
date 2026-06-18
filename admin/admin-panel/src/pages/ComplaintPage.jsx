import React, { useEffect, useState } from "react";
import { getComplaints, deleteComplaint } from "../services/api";
import { Trash2, Check, X as CloseIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function ComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const load = () => {
    getComplaints()
      .then(r => setComplaints(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id) => {
    toast((t) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#0F172A" }}>Delete this complaint?</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={async () => {
            toast.dismiss(t.id);
            try {
              await deleteComplaint(id);
              toast.success("Deleted successfully");
              load();
            } catch (err) {
              toast.error("Failed to delete");
            }
          }} style={{ background: "#16A34A", color: "white", border: "none", borderRadius: 4, padding: "4px", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Check size={16} />
          </button>
          <button onClick={() => toast.dismiss(t.id)} style={{ background: "#DC2626", color: "white", border: "none", borderRadius: 4, padding: "4px", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <CloseIcon size={16} />
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  const totalPages = Math.ceil(complaints.length / itemsPerPage);
  const currentComplaints = complaints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800 }}>Complaints</h1>
          <p style={{ color:"#64748B", fontSize:13 }}>Manage complaint form submissions</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color:"#64748B" }}>Loading…</p>
      ) : (
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid var(--border)", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"#F8FAFC", borderBottom:"1px solid var(--border)" }}>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Date</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Name</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Policy / Ref</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Category</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Mobile</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Details</th>
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
                  <td style={{ padding:"12px 16px", color:"#475569", maxWidth: "250px" }}>
                    {c.details || "-"}
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
              {complaints.length === 0 && (
                <tr><td colSpan={7} style={{ padding:32, textAlign:"center", color:"#94A3B8" }}>No complaints yet.</td></tr>
              )}
            </tbody>
          </table>
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
