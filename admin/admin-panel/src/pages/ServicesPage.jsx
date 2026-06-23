import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllServices, deleteService, toggleServiceActive } from "../services/api";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Eye } from "lucide-react";

const LIST_STYLES = `
  .svc-add-btn { transition: background .15s ease, transform .15s ease; }
  .svc-add-btn:hover { background: #DC4426; transform: translateY(-1px); }
  .svc-list-table tbody tr { transition: background .12s ease; }
  .svc-list-table tbody tr:hover td { background: #FAFBFD; }
`;

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

 const load = () => {
  getAllServices()
    .then(r => setServices(r.data))
    .finally(() => setLoading(false));
};

  useEffect(() => { load(); }, []);

  const handleToggle = async (svc) => {
    try {
      await toggleServiceActive(svc._id);
      toast.success(`${svc.title} ${svc.isActive ? "deactivated" : "activated"}`);
      load();
    } catch { toast.error("Failed to toggle"); }
  };

  const handleDelete = (svc) => {
    toast(
      (t) => (
        <div>
          <p style={{ margin: "0 0 10px 0", fontWeight: 500 }}>Delete "{svc.title}"? This cannot be undone.</p>
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
                  await deleteService(svc._id);
                  toast.success("Service deleted");
                  load();
                } catch { toast.error("Delete failed"); }
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

  return (
    <div>
      <style>{LIST_STYLES}</style>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#0F172A", letterSpacing:"-0.02em" }}>Services</h1>
          <p style={{ color:"#64748B", fontSize:13 }}>Manage all insurance services shown on the website</p>
        </div>
        <Link to="/services/new" className="svc-add-btn" style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 18px", background:"#F15A3E", color:"#fff", borderRadius:10, fontSize:13, fontWeight:700, textDecoration:"none", boxShadow:"0 8px 18px rgba(241,90,62,0.24)" }}>
          <Plus size={15} /> Add Service
        </Link>
      </div>

      {loading ? (
        <p style={{ color:"#64748B" }}>Loading…</p>
      ) : (
        <div style={{ background:"#fff", borderRadius:16, border:"1px solid var(--border)", boxShadow:"0 1px 2px rgba(15,23,42,0.04)", overflow:"hidden" }}>
          <table className="svc-list-table" style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:"#F8FAFC", borderBottom:"1px solid var(--border)" }}>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Service</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Slug</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Type</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Badge</th>
                <th style={{ padding:"12px 16px", textAlign:"center", fontWeight:600, color:"#64748B" }}>Status</th>
                <th style={{ padding:"12px 16px", textAlign:"right", fontWeight:600, color:"#64748B" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc, i) => (
                <tr key={svc._id} style={{ borderBottom: i < services.length-1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ fontWeight:600, color:"#0F172A" }}>{svc.title}</div>
                    <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>{svc.description?.slice(0,60)}…</div>
                  </td>
                  <td style={{ padding:"12px 16px", color:"#64748B", fontFamily:"monospace", fontSize:12 }}>{svc.slug}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ padding:"2px 8px", borderRadius:4, background: svc.serviceType==="personal" ? "#FEEEE9":"#F0FDF4", color: svc.serviceType==="personal"?"#C2410C":"#16A34A", fontSize:11, fontWeight:600 }}>
                      {svc.serviceType}
                    </span>
                  </td>
                  <td style={{ padding:"12px 16px", color:"#64748B" }}>{svc.badge}</td>
                  <td style={{ padding:"12px 16px", textAlign:"center" }}>
                    <span style={{ padding:"3px 10px", borderRadius:20, background: svc.isActive?"#DCFCE7":"#FEE2E2", color: svc.isActive?"#16A34A":"#DC2626", fontSize:11, fontWeight:600 }}>
                      {svc.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
                      <button onClick={() => handleToggle(svc)} title={svc.isActive?"Deactivate":"Activate"}
                        style={{ padding:"6px", background:"none", border:"1px solid var(--border)", borderRadius:6, color:"#64748B", display:"flex" }}>
                        {svc.isActive ? <ToggleRight size={15} color="#16A34A" /> : <ToggleLeft size={15} />}
                      </button>
                      <Link to={`/services/${svc._id}/edit`}
                        style={{ padding:"6px", background:"none", border:"1px solid var(--border)", borderRadius:6, color:"#64748B", display:"flex" }}>
                        <Edit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(svc)}
                        style={{ padding:"6px", background:"none", border:"1px solid #FEE2E2", borderRadius:6, color:"#DC2626", display:"flex" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan={6} style={{ padding:32, textAlign:"center", color:"#94A3B8" }}>No services yet. <Link to="/services/new" style={{ color:"#F15A3E", fontWeight:600 }}>Add one</Link></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}