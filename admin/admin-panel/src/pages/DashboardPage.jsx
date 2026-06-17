import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllServices, getLeadStats } from "../services/api";
import { ShieldCheck, Users, TrendingUp, CheckCircle, Clock, PhoneCall, XCircle, ArrowRight } from "lucide-react";

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div style={{ background:"#fff", borderRadius:12, padding:"20px 24px", border:"1px solid var(--border)", display:"flex", alignItems:"center", gap:16 }}>
      <div style={{ width:48, height:48, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <p style={{ fontSize:26, fontWeight:800, color:"#0F172A", lineHeight:1 }}>{value}</p>
        <p style={{ fontSize:13, color:"#64748B", marginTop:4 }}>{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [services, setServices] = useState([]);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([getAllServices(), getLeadStats()])
      .then(([svcRes, statsRes]) => {
        setServices(svcRes.data);        // FIXED: svcRes is already the unwrapped body { success, data }
        setStats(statsRes.data.data);    // unchanged: statsRes is the raw axios response
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color:"#64748B" }}>Loading dashboard…</p>;

  const statusCards = [
    { label:"New Leads",        value: stats?.byStatus?.new       || 0, icon:Clock,       color:"#D97706", bg:"#FEF3C7" },
    { label:"Contacted",        value: stats?.byStatus?.contacted  || 0, icon:PhoneCall,   color:"#2563EB", bg:"#EFF6FF" },
    { label:"Converted",        value: stats?.byStatus?.converted  || 0, icon:CheckCircle, color:"#16A34A", bg:"#DCFCE7" },
    { label:"Closed",           value: stats?.byStatus?.closed     || 0, icon:XCircle,     color:"#DC2626", bg:"#FEE2E2" },
  ];

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:"#0F172A" }}>Dashboard</h1>
        <p style={{ color:"#64748B", fontSize:13, marginTop:4 }}>Overview of your insurance services and leads</p>
      </div>

      {/* Top stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:16, marginBottom:28 }}>
        <StatCard label="Total Services" value={services.length}   icon={ShieldCheck} color="#2563EB" bg="#EFF6FF" />
        <StatCard label="Active Services" value={services.filter(s=>s.isActive).length} icon={CheckCircle} color="#16A34A" bg="#DCFCE7" />
        <StatCard label="Total Leads"    value={stats?.total || 0} icon={Users}       color="#7C3AED" bg="#F5F3FF" />
        <StatCard label="Conversion Rate" value={stats?.total ? `${Math.round((stats.byStatus?.converted||0)/stats.total*100)}%` : "0%"} icon={TrendingUp} color="#D97706" bg="#FEF3C7" />
      </div>

      {/* Lead status breakdown */}
      <h2 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>Leads by Status</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:14, marginBottom:32 }}>
        {statusCards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Leads by service */}
      {stats?.byService?.length > 0 && (
        <>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <h2 style={{ fontSize:15, fontWeight:700 }}>Leads by Service</h2>
            <Link to="/leads" style={{ fontSize:12, color:"#2563EB", display:"flex", alignItems:"center", gap:4 }}>View all <ArrowRight size={12} /></Link>
          </div>
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid var(--border)", overflow:"hidden", marginBottom:32 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#F8FAFC", borderBottom:"1px solid var(--border)" }}>
                  <th style={{ padding:"10px 16px", textAlign:"left", fontWeight:600, color:"#64748B" }}>Service</th>
                  <th style={{ padding:"10px 16px", textAlign:"right", fontWeight:600, color:"#64748B" }}>Leads</th>
                </tr>
              </thead>
              <tbody>
                {stats.byService.map((s, i) => (
                  <tr key={s._id} style={{ borderBottom: i < stats.byService.length-1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding:"10px 16px" }}>{s.title || s._id}</td>
                    <td style={{ padding:"10px 16px", textAlign:"right", fontWeight:600 }}>{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Quick actions */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <Link to="/services/new" style={{ padding:"10px 18px", background:"#1E40AF", color:"#fff", borderRadius:8, fontSize:13, fontWeight:600 }}>
          + Add Service
        </Link>
        <Link to="/leads" style={{ padding:"10px 18px", background:"#fff", color:"#0F172A", borderRadius:8, fontSize:13, fontWeight:600, border:"1px solid var(--border)" }}>
          View Leads
        </Link>
      </div>
    </div>
  );
}