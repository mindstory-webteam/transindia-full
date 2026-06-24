import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllServices, getLeadStats, getServiceLeadStats } from "../services/api";
import { ShieldCheck, Users, TrendingUp, CheckCircle, Clock, PhoneCall, XCircle, ArrowRight, Sparkles, Calculator } from "lucide-react";

const DASH_STYLES = `
  .ti-stat {
    transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
  }
  .ti-stat:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(15,23,42,0.08);
    border-color: #DCE3EC;
  }
  .ti-svc-table tbody tr { transition: background .12s ease; }
  .ti-svc-table tbody tr:hover td { background: #FAFBFD; }
  .ti-action-primary { transition: background .15s ease, transform .15s ease; }
  .ti-action-primary:hover { background: #DC4426; transform: translateY(-1px); }
  .ti-action-ghost { transition: background .15s ease, border-color .15s ease; }
  .ti-action-ghost:hover { background: #F4F7FB; border-color: #DCE3EC; }
  @media (prefers-reduced-motion: reduce) {
    .ti-stat, .ti-action-primary, .ti-action-ghost { transition: none !important; }
  }
`;

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div
      className="ti-stat"
      style={{
        background: "#fff", borderRadius: 16, padding: "20px 22px",
        border: "1px solid var(--border)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        display: "flex", alignItems: "center", gap: 16,
      }}
    >
      <div style={{ width: 50, height: 50, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={23} color={color} />
      </div>
      <div>
        <p style={{ fontSize: 27, fontWeight: 800, color: "#0F172A", lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</p>
        <p style={{ fontSize: 13, color: "#64748B", marginTop: 5 }}>{label}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>{children}</h2>
  );
}

export default function DashboardPage() {
  const [services, setServices]   = useState([]);
  const [stats, setStats]         = useState(null);
  const [svcLeads, setSvcLeads]   = useState(null);   // service (premium calculator) lead stats
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getAllServices(), getLeadStats(), getServiceLeadStats()])
      .then(([svcRes, statsRes, svcLeadRes]) => {
        setServices(svcRes.data);            // svcRes is already the unwrapped body { success, data }
        setStats(statsRes.data.data);        // statsRes is the raw axios response
        setSvcLeads(svcLeadRes.data.data);   // service lead stats { total, byStatus, byService }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "#64748B" }}>Loading dashboard…</p>;

  const statusCards = [
    { label: "New Leads",  value: stats?.byStatus?.new       || 0, icon: Clock,       color: "#D97706", bg: "#FEF3C7" },
    { label: "Contacted",  value: stats?.byStatus?.contacted || 0, icon: PhoneCall,   color: "#0891B2", bg: "#E0F7FA" },
    { label: "Converted",  value: stats?.byStatus?.converted || 0, icon: CheckCircle, color: "#16A34A", bg: "#DCFCE7" },
    { label: "Closed",     value: stats?.byStatus?.closed    || 0, icon: XCircle,     color: "#DC2626", bg: "#FEE2E2" },
  ];

  return (
    <div>
      <style>{DASH_STYLES}</style>

      {/* Welcome banner */}
      <div style={{
        background: "linear-gradient(120deg, #FFF4F0 0%, #FFFFFF 58%)",
        border: "1px solid #FBE0D8", borderRadius: 18,
        padding: "22px 24px", marginBottom: 28,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>Dashboard</h1>
            <p style={{ color: "#64748B", fontSize: 13, marginTop: 4 }}>Overview of your insurance services and leads</p>
          </div>
        </div>

        <Link
          to="/services/new"
          className="ti-action-primary"
          style={{ padding: "11px 20px", background: "#F15A3E", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 8px 18px rgba(241,90,62,0.28)" }}
        >
          + Add Service
        </Link>
      </div>

      {/* Top stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16, marginBottom: 30 }}>
        <StatCard label="Total Services"  value={services.length}                          icon={ShieldCheck} color="#F15A3E" bg="#FEEEE9" />
        <StatCard label="Active Services" value={services.filter(s => s.isActive).length}   icon={CheckCircle} color="#16A34A" bg="#DCFCE7" />
        <StatCard label="Total Leads"     value={stats?.total || 0}                         icon={Users}       color="#7C3AED" bg="#F5F3FF" />
        <StatCard label="Service Leads"   value={svcLeads?.total || 0}                      icon={Calculator}  color="#F15A3E" bg="#FEEEE9" />
        <StatCard label="Conversion Rate" value={stats?.total ? `${Math.round((stats.byStatus?.converted || 0) / stats.total * 100)}%` : "0%"} icon={TrendingUp} color="#0891B2" bg="#E0F7FA" />
      </div>

      {/* Lead status breakdown */}
      <div style={{ marginBottom: 14 }}><SectionLabel>Leads by Status</SectionLabel></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 14, marginBottom: 34 }}>
        {statusCards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Service (premium calculator) leads summary */}
      {svcLeads?.total > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <SectionLabel>Service Leads by Status</SectionLabel>
            <Link to="/serviceleads" style={{ fontSize: 12, fontWeight: 600, color: "#F15A3E", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 14, marginBottom: 34 }}>
            <StatCard label="New"       value={svcLeads?.byStatus?.new || 0}        icon={Clock}       color="#D97706" bg="#FEF3C7" />
            <StatCard label="Contacted" value={svcLeads?.byStatus?.contacted || 0}  icon={PhoneCall}   color="#0891B2" bg="#E0F7FA" />
            <StatCard label="Converted" value={svcLeads?.byStatus?.converted || 0}  icon={CheckCircle} color="#16A34A" bg="#DCFCE7" />
            <StatCard label="Closed"    value={svcLeads?.byStatus?.closed || 0}     icon={XCircle}     color="#DC2626" bg="#FEE2E2" />
          </div>
        </>
      )}

      {/* Leads by service */}
      {stats?.byService?.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <SectionLabel>Leads by Service</SectionLabel>
            <Link to="/leads" style={{ fontSize: 12, fontWeight: 600, color: "#F15A3E", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", boxShadow: "0 1px 2px rgba(15,23,42,0.04)", overflow: "hidden", marginBottom: 34 }}>
            <table className="ti-svc-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "12px 18px", textAlign: "left", fontWeight: 600, color: "#64748B", letterSpacing: "0.02em" }}>Service</th>
                  <th style={{ padding: "12px 18px", textAlign: "right", fontWeight: 600, color: "#64748B", letterSpacing: "0.02em" }}>Leads</th>
                </tr>
              </thead>
              <tbody>
                {stats.byService.map((s, i) => (
                  <tr key={s._id} style={{ borderBottom: i < stats.byService.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "12px 18px", color: "#0F172A", fontWeight: 500 }}>{s.title || s._id}</td>
                    <td style={{ padding: "12px 18px", textAlign: "right", fontWeight: 700, color: "#0F172A" }}>{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          to="/services/new"
          className="ti-action-primary"
          style={{ padding: "11px 20px", background: "#F15A3E", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 18px rgba(241,90,62,0.24)" }}
        >
          + Add Service
        </Link>
        <Link
          to="/leads"
          className="ti-action-ghost"
          style={{ padding: "11px 20px", background: "#fff", color: "#0F172A", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "1px solid var(--border)", textDecoration: "none" }}
        >
          View Leads
        </Link>
        <Link
          to="/serviceleads"
          className="ti-action-ghost"
          style={{ padding: "11px 20px", background: "#fff", color: "#0F172A", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "1px solid var(--border)", textDecoration: "none" }}
        >
          View Service Leads
        </Link>
      </div>
    </div>
  );
}