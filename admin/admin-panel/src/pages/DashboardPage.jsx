import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getAllServices, getLeadStats, getServiceLeadStats,
} from "../services/api";
import {
  ShieldCheck, Users, TrendingUp, CheckCircle, Clock, PhoneCall,
  XCircle, ArrowRight, Calculator, BarChart2, Activity, Layers,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── design tokens ─────────────────────────────────────────────── */
const C = {
  primary:   "#F15A3E",
  primaryDk: "#DC4426",
  primaryBg: "#FFF1EE",
  ink:       "#0F172A",
  muted:     "#64748B",
  border:    "#E8EDF5",
  surface:   "#FFFFFF",
  page:      "#F4F7FB",
  /* status */
  amber:  { fg: "#D97706", bg: "#FEF3C7" },
  cyan:   { fg: "#0891B2", bg: "#E0F7FA" },
  green:  { fg: "#16A34A", bg: "#DCFCE7" },
  red:    { fg: "#DC2626", bg: "#FEE2E2" },
};

const STATUS_COLORS = [
  "#D97706",   /* new */
  "#0891B2",   /* contacted */
  "#16A34A",   /* converted */
  "#DC2626",   /* closed */
];

/* ─── tiny helpers ───────────────────────────────────────────────── */
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

function card(extra = {}) {
  return {
    background: C.surface,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
    ...extra,
  };
}

/* ─── sub-components ────────────────────────────────────────────── */
function KpiCard({ label, value, icon: Icon, color, bg, trend }) {
  return (
    <div
      style={{
        ...card({ padding: "20px 22px", display: "flex", alignItems: "flex-start", gap: 14 }),
        transition: "transform .15s,box-shadow .15s",
        cursor: "default",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(15,23,42,0.09)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.06)"; }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 26, fontWeight: 800, color: C.ink, lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>{value}</p>
        <p style={{ fontSize: 12, color: C.muted, marginTop: 5, margin: "5px 0 0" }}>{label}</p>
        {trend != null && (
          <p style={{ fontSize: 11, marginTop: 4, color: trend >= 0 ? C.green.fg : C.red.fg, margin: "4px 0 0", fontWeight: 600 }}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, to, toLabel }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0, letterSpacing: "-0.01em" }}>{title}</h2>
      {to && (
        <Link to={to} style={{ fontSize: 12, fontWeight: 600, color: C.primary, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
          {toLabel || "View all"} <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

function StatusBadge({ value, color, bg, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 12px", ...card(), minWidth: 0 }}>
      <span style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.02em" }}>{value}</span>
      <span style={{ fontSize: 11, color: C.muted, textAlign: "center" }}>{label}</span>
      <span style={{ width: 24, height: 3, borderRadius: 2, background: color, opacity: 0.5 }} />
    </div>
  );
}

/* ─── custom tooltip ─────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...card({ padding: "10px 14px", borderRadius: 10 }), fontSize: 12 }}>
      {label && <p style={{ color: C.muted, margin: "0 0 6px", fontWeight: 600 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: "2px 0", color: p.color || C.ink, fontWeight: 600 }}>
          {p.name}: <span style={{ color: C.ink }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ─── main page ──────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [services, setServices] = useState([]);
  const [stats,    setStats]    = useState(null);
  const [svcLeads, setSvcLeads] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getAllServices(), getLeadStats(), getServiceLeadStats()])
      .then(([svcRes, statsRes, svcLeadRes]) => {
        setServices(svcRes.data);
        setStats(statsRes.data.data);
        setSvcLeads(svcLeadRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, gap: 10, color: C.muted }}>
        <Activity size={18} style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: 14 }}>Loading dashboard…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── derived data ── */
  const totalLeads      = stats?.total || 0;
  const totalSvcLeads   = svcLeads?.total || 0;
  const converted       = stats?.byStatus?.converted || 0;
  const conversionRate  = pct(converted, totalLeads);
  const activeServices  = services.filter(s => s.isActive).length;

  /* bar chart — lead status breakdown */
  const leadStatusData = [
    { name: "New",       value: stats?.byStatus?.new       || 0 },
    { name: "Contacted", value: stats?.byStatus?.contacted || 0 },
    { name: "Converted", value: stats?.byStatus?.converted || 0 },
    { name: "Closed",    value: stats?.byStatus?.closed    || 0 },
  ];

  /* donut — service leads breakdown */
  const svcLeadDonut = [
    { name: "New",       value: svcLeads?.byStatus?.new       || 0, color: C.amber.fg },
    { name: "Contacted", value: svcLeads?.byStatus?.contacted || 0, color: C.cyan.fg  },
    { name: "Converted", value: svcLeads?.byStatus?.converted || 0, color: C.green.fg },
    { name: "Closed",    value: svcLeads?.byStatus?.closed    || 0, color: C.red.fg   },
  ].filter(d => d.value > 0);

  /* bar chart — leads by service */
  const byServiceData = (stats?.byService || []).map(s => ({
    name:  (s.title || s._id || "").slice(0, 18),
    leads: s.count,
  }));

  /* funnel area sparkline — simulated trend (replace with real time-series if available) */
  const trendData = (() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun"];
    const base = Math.max(4, Math.round(totalLeads / 6));
    return months.map((m, i) => ({
      month: m,
      leads: Math.max(0, base + Math.round((Math.sin(i) * base * 0.4))),
    }));
  })();

  /* ── layout ── */
  return (
    <div style={{ background: C.page, minHeight: "100vh", padding: "0 0 40px" }}>

      {/* ─── Header banner ──────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, #FFF4F0 0%, #FFFFFF 60%)`,
        borderBottom: `1px solid ${C.border}`,
        padding: "24px 28px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
        marginBottom: 28,
      }}>
        <div>
          <p style={{ fontSize: 12, color: C.primary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
            Admin Panel
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: 0, letterSpacing: "-0.025em" }}>Dashboard</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            {services.length} services · {totalLeads + totalSvcLeads} total leads tracked
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            to="/leads"
            style={{ padding: "10px 18px", background: C.surface, color: C.ink, borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none", border: `1px solid ${C.border}` }}
          >
            View Leads
          </Link>
          <Link
            to="/services/new"
            style={{ padding: "10px 18px", background: C.primary, color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 16px rgba(241,90,62,0.30)", transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.primaryDk}
            onMouseLeave={e => e.currentTarget.style.background = C.primary}
          >
            + Add Service
          </Link>
        </div>
      </div>

      <div style={{ padding: "0 28px" }}>

        {/* ─── Row 1 — KPI cards ──────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
          <KpiCard label="Total Services"   value={services.length}                                            icon={ShieldCheck} color={C.primary}    bg={C.primaryBg} />
          <KpiCard label="Active Services"  value={activeServices}                                             icon={CheckCircle} color={C.green.fg}  bg={C.green.bg}  />
          <KpiCard label="All Leads"        value={totalLeads}                                                 icon={Users}       color="#7C3AED"      bg="#F5F3FF"     />
          <KpiCard label="Service Leads"    value={totalSvcLeads}                                              icon={Calculator}  color={C.primary}    bg={C.primaryBg} />
          <KpiCard label="Conversion Rate"  value={`${conversionRate}%`}                                       icon={TrendingUp}  color={C.cyan.fg}   bg={C.cyan.bg}   />
        </div>

        {/* ─── Row 2 — Area chart + Status breakdown ──────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, marginBottom: 24, alignItems: "stretch" }}>

          {/* area trend */}
          <div style={{ ...card({ padding: "22px 22px 14px" }) }}>
            <SectionHeader title="Lead Trend (6 months)" />
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.primary} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="leads" name="Leads"
                  stroke={C.primary} strokeWidth={2.5}
                  fill="url(#leadGrad)"
                  dot={{ r: 3.5, fill: C.primary, strokeWidth: 0 }}
                  activeDot={{ r: 5.5, fill: C.primary }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* status breakdown */}
          <div style={{ ...card({ padding: "22px 20px" }) }}>
            <SectionHeader title="Lead Status" to="/leads" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
              <StatusBadge value={stats?.byStatus?.new       || 0} color={C.amber.fg} bg={C.amber.bg} label="New"       />
              <StatusBadge value={stats?.byStatus?.contacted || 0} color={C.cyan.fg}  bg={C.cyan.bg}  label="Contacted" />
              <StatusBadge value={stats?.byStatus?.converted || 0} color={C.green.fg} bg={C.green.bg} label="Converted" />
              <StatusBadge value={stats?.byStatus?.closed    || 0} color={C.red.fg}   bg={C.red.bg}   label="Closed"    />
            </div>
            {/* conversion meter */}
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 6 }}>
                <span>Conversion rate</span>
                <span style={{ fontWeight: 700, color: C.green.fg }}>{conversionRate}%</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${conversionRate}%`, background: `linear-gradient(90deg, ${C.primary}, #16A34A)`, borderRadius: 3, transition: "width .6s ease" }} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Row 3 — Bar chart + Donut ──────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>

          {/* bar — lead status */}
          <div style={{ ...card({ padding: "22px 22px 14px" }) }}>
            <SectionHeader title="Leads by Status" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leadStatusData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: `${C.primary}10` }} />
                <Bar dataKey="value" name="Leads" radius={[6, 6, 0, 0]}>
                  {leadStatusData.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* donut — service leads */}
          <div style={{ ...card({ padding: "22px 20px" }) }}>
            <SectionHeader title="Service Leads Breakdown" to="/serviceleads" />
            {svcLeadDonut.length > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <ResponsiveContainer width={160} height={200}>
                  <PieChart>
                    <Pie
                      data={svcLeadDonut} cx="50%" cy="50%"
                      innerRadius={52} outerRadius={76}
                      paddingAngle={3} dataKey="value"
                    >
                      {svcLeadDonut.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, color: C.muted, marginBottom: 10, fontWeight: 600 }}>TOTAL</p>
                  <p style={{ fontSize: 30, fontWeight: 800, color: C.ink, letterSpacing: "-0.03em", margin: "0 0 14px" }}>{totalSvcLeads}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {svcLeadDonut.map((d, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                        <span style={{ color: C.muted, flex: 1 }}>{d.name}</span>
                        <span style={{ fontWeight: 700, color: C.ink }}>{d.value}</span>
                        <span style={{ color: C.muted, fontSize: 10, minWidth: 32, textAlign: "right" }}>
                          {pct(d.value, totalSvcLeads)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 180, gap: 10, color: C.muted }}>
                <Calculator size={28} color={C.border} />
                <span style={{ fontSize: 13 }}>No service leads yet</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── Row 4 — Leads by service bar chart ─────────────────── */}
        {byServiceData.length > 0 && (
          <div style={{ ...card({ padding: "22px 22px 14px", marginBottom: 24 }) }}>
            <SectionHeader title="Leads by Service" to="/leads" />
            <ResponsiveContainer width="100%" height={Math.max(180, byServiceData.length * 44 + 40)}>
              <BarChart data={byServiceData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: `${C.primary}10` }} />
                <Bar dataKey="leads" name="Leads" fill={C.primary} radius={[0, 6, 6, 0]}>
                  {byServiceData.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? C.primary : "#F8895A"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ─── Row 5 — Service list table ─────────────────────────── */}
        <div style={{ ...card({ overflow: "hidden", marginBottom: 28 }) }}>
          <div style={{ padding: "20px 22px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Layers size={16} color={C.primary} />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>Services</h2>
            </div>
            <Link to="/services/new" style={{ fontSize: 12, fontWeight: 600, color: C.primary, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Add new <ArrowRight size={12} />
            </Link>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                <th style={{ padding: "10px 22px", textAlign: "left", fontWeight: 600, color: C.muted, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>Service</th>
                <th style={{ padding: "10px 16px", textAlign: "center", fontWeight: 600, color: C.muted, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>Status</th>
                <th style={{ padding: "10px 22px", textAlign: "right", fontWeight: 600, color: C.muted, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>Leads</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => {
                const svcLeadCount = (stats?.byService || []).find(b => b._id === s._id)?.count || 0;
                return (
                  <tr
                    key={s._id || i}
                    style={{ borderTop: `1px solid ${C.border}`, transition: "background .1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFBFD"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >
                    <td style={{ padding: "13px 22px", color: C.ink, fontWeight: 600 }}>{s.title || s.name || "—"}</td>
                    <td style={{ padding: "13px 16px", textAlign: "center" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: s.isActive ? C.green.bg  : C.border,
                        color:      s.isActive ? C.green.fg  : C.muted,
                      }}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 22px", textAlign: "right", fontWeight: 700, color: svcLeadCount > 0 ? C.primary : C.muted }}>
                      {svcLeadCount}
                    </td>
                  </tr>
                );
              })}
              {services.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: "30px 22px", textAlign: "center", color: C.muted, fontSize: 13 }}>
                    No services yet — <Link to="/services/new" style={{ color: C.primary, fontWeight: 600, textDecoration: "none" }}>add one</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Quick actions ───────────────────────────────────────── */}
        {/* <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { to: "/services/new",  label: "+ Add Service",        primary: true  },
            { to: "/leads",         label: "View Leads",           primary: false },
            { to: "/serviceleads",  label: "View Service Leads",   primary: false },
          ].map(({ to, label, primary }) => (
            <Link
              key={to} to={to}
              style={{
                padding: "11px 20px", borderRadius: 10, fontSize: 13, fontWeight: primary ? 700 : 600,
                textDecoration: "none", transition: "background .15s, transform .15s",
                ...(primary
                  ? { background: C.primary, color: "#fff", boxShadow: "0 6px 16px rgba(241,90,62,0.28)" }
                  : { background: C.surface, color: C.ink,  border: `1px solid ${C.border}` }
                ),
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; if (primary) e.currentTarget.style.background = C.primaryDk; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; if (primary) e.currentTarget.style.background = C.primary; }}
            >
              {label}
            </Link>
          ))}
        </div> */}
      </div>
    </div>
  );
}