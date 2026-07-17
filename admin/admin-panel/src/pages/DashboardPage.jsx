import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllServices, getLeadStats, getServiceLeadStats,
  getBmiLeadStats, getQuoteLeadStats,
  getClaimLeads, getChatbotLeads,
  getGeneralQueries, getClaimSupports, getComplaints,
  getAdminJobs, getJobApplications, getEvents,
} from "../services/api";
import {
  ShieldCheck, Users, TrendingUp, CheckCircle, Calculator, Activity,
  Layers, HeartPulse, FileWarning, MessageCircle, MessagesSquare,
  LifeBuoy, AlertTriangle, Briefcase, FileText, CalendarDays, ArrowRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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
  violet: { fg: "#7C3AED", bg: "#F5F3FF" },
  pink:   { fg: "#DB2777", bg: "#FCE7F3" },
  indigo: { fg: "#4F46E5", bg: "#EEF2FF" },
  teal:   { fg: "#0D9488", bg: "#F0FDFA" },
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

/** Safely resolve a promise, returning a fallback on failure (e.g. route not mounted yet, 403, etc.) */
async function safe(promise, fallback) {
  try {
    return await promise;
  } catch (e) {
    console.warn("Dashboard fetch failed:", e?.config?.url || e?.message);
    return fallback;
  }
}

/** Merge N status objects like { new, contacted, converted, closed } into one */
function mergeStatus(...statusObjs) {
  const out = { new: 0, contacted: 0, converted: 0, closed: 0 };
  statusObjs.forEach((s) => {
    if (!s) return;
    out.new       += s.new       || 0;
    out.contacted += s.contacted || 0;
    out.converted += s.converted || 0;
    out.closed    += s.closed    || 0;
  });
  return out;
}

/** Derive a { new, contacted, converted, closed } breakdown from a raw array of items with a `status` field */
function statusFromArray(arr = []) {
  const out = { new: 0, contacted: 0, converted: 0, closed: 0 };
  arr.forEach((item) => {
    const s = (item?.status || "new").toLowerCase();
    if (out[s] !== undefined) out[s] += 1;
    else out.new += 1;
  });
  return out;
}

/* ─── sub-components ────────────────────────────────────────────── */
function KpiCard({ label, value, icon: Icon, color, bg, to }) {
  const inner = (
    <div
      style={{
        ...card({ padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 12 }),
        transition: "transform .15s,box-shadow .15s",
        cursor: to ? "pointer" : "default",
        textDecoration: "none",
        height: "100%",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(15,23,42,0.09)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.06)"; }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: C.ink, lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>{value}</p>
        <p style={{ fontSize: 11.5, color: C.muted, marginTop: 5, margin: "5px 0 0" }}>{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to} style={{ display: "block", height: "100%" }}>{inner}</Link> : inner;
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

/** Small horizontal "mini bar" summary row used in the module-summary cards */
function MiniRow({ label, value, total, color }) {
  const p = pct(value, total);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 5 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color: C.ink }}>{value}</span>
      </div>
      <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${p}%`, background: color, borderRadius: 3, transition: "width .5s ease" }} />
      </div>
    </div>
  );
}

/** Card summarising a "module" that doesn't have its own dedicated stats endpoint */
function ModuleCard({ title, icon: Icon, color, bg, total, to, toLabel, children }) {
  return (
    <div style={{ ...card({ padding: "20px 20px 18px" }) }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={17} color={color} />
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, margin: 0 }}>{title}</p>
            <p style={{ fontSize: 11, color: C.muted, margin: "2px 0 0" }}>{total} total</p>
          </div>
        </div>
        {to && (
          <Link to={to} style={{ fontSize: 11.5, fontWeight: 600, color: C.primary, display: "flex", alignItems: "center", gap: 3, textDecoration: "none", flexShrink: 0 }}>
            {toLabel || "View"} <ArrowRight size={11} />
          </Link>
        )}
      </div>
      {children}
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
  const [loading, setLoading] = useState(true);

  const [services,  setServices]  = useState([]);
  const [stats,     setStats]     = useState(null);   // /leads/stats
  const [svcLeads,  setSvcLeads]  = useState(null);   // /serviceleads/stats
  const [bmiStats,  setBmiStats]  = useState(null);   // /bmileads/stats
  const [quoteStats,setQuoteStats]= useState(null);   // /quoteleads/stats

  const [claimLeads,     setClaimLeads]     = useState([]);
  const [chatbotLeads,   setChatbotLeads]   = useState([]);
  const [generalQueries, setGeneralQueries] = useState([]);
  const [claimSupports,  setClaimSupports]  = useState([]);
  const [complaints,     setComplaints]     = useState([]);
  const [jobs,            setJobs]           = useState([]);
  const [applications,    setApplications]   = useState([]);
  const [events,          setEvents]         = useState([]);

  useEffect(() => {
    (async () => {
      const [
        svcRes, statsRes, svcLeadRes, bmiRes, quoteRes,
        claimRes, chatbotRes, gqRes, csRes, compRes,
        jobsRes, appsRes, eventsRes,
      ] = await Promise.all([
        safe(getAllServices(),      { data: [] }),
        safe(getLeadStats(),        { data: { data: null } }),
        safe(getServiceLeadStats(), { data: { data: null } }),
        safe(getBmiLeadStats(),     { data: { data: null } }),
        safe(getQuoteLeadStats(),   { data: { data: null } }),
        safe(getClaimLeads(),       []),
        safe(getChatbotLeads(),     []),
        safe(getGeneralQueries(),   { data: [] }),
        safe(getClaimSupports(),    { data: [] }),
        safe(getComplaints(),       { data: [] }),
        safe(getAdminJobs(),        { data: [] }),
        safe(getJobApplications(),  { data: [] }),
        safe(getEvents(),           { data: [] }),
      ]);

      setServices(svcRes.data || []);
      setStats(statsRes.data?.data || null);
      setSvcLeads(svcLeadRes.data?.data || null);
      setBmiStats(bmiRes.data?.data || null);
      setQuoteStats(quoteRes.data?.data || null);

      setClaimLeads(claimRes || []);
      setChatbotLeads(chatbotRes || []);
      setGeneralQueries(gqRes.data || gqRes || []);
      setClaimSupports(csRes.data || csRes || []);
      setComplaints(compRes.data || compRes || []);
      setJobs(jobsRes.data || jobsRes || []);
      setApplications(appsRes.data || appsRes || []);
      setEvents(eventsRes.data || eventsRes || []);

      setLoading(false);
    })();
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
  const totalGeneralLeads = stats?.total || 0;
  const totalQuoteLeads   = quoteStats?.total || 0;
  const totalSvcLeads     = svcLeads?.total || 0;
  const totalBmiLeads     = bmiStats?.total || 0;
  const totalClaimLeads   = claimLeads.length;
  const totalChatbotLeads = chatbotLeads.length;
  const totalGeneralQueries = generalQueries.length;
  const totalClaimSupport   = claimSupports.length;
  const totalComplaints     = complaints.length;
  const totalJobs           = jobs.length;
  const activeJobs          = jobs.filter(j => j.isActive !== false).length;
  const totalApplications   = applications.length;
  const totalEvents         = events.length;

  const activeServices = services.filter(s => s.isActive).length;

  const converted = stats?.byStatus?.converted || 0;
  const conversionRate = pct(converted, totalGeneralLeads);

  /* combined lead status (general + quote + service + bmi leads) */
  const claimStatus   = statusFromArray(claimLeads);
  const chatbotStatus = statusFromArray(chatbotLeads);

  const combinedStatus = mergeStatus(
    stats?.byStatus,
    quoteStats?.byStatus,
    svcLeads?.byStatus,
    bmiStats?.byStatus,
  );
  const combinedTotal = totalGeneralLeads + totalQuoteLeads + totalSvcLeads + totalBmiLeads;

  /* bar chart — combined lead status breakdown */
  const leadStatusData = [
    { name: "New",       value: combinedStatus.new },
    { name: "Contacted", value: combinedStatus.contacted },
    { name: "Converted", value: combinedStatus.converted },
    { name: "Closed",    value: combinedStatus.closed },
  ];

  /* donut — service leads breakdown */
  const svcLeadDonut = [
    { name: "New",       value: svcLeads?.byStatus?.new       || 0, color: C.amber.fg },
    { name: "Contacted", value: svcLeads?.byStatus?.contacted || 0, color: C.cyan.fg  },
    { name: "Converted", value: svcLeads?.byStatus?.converted || 0, color: C.green.fg },
    { name: "Closed",    value: svcLeads?.byStatus?.closed    || 0, color: C.red.fg   },
  ].filter(d => d.value > 0);

  /* bar chart — leads by service (from /leads/stats byService) */
  const byServiceData = (stats?.byService || []).map(s => ({
    name:  (s.title || s._id || "").slice(0, 18),
    leads: s.count,
  }));

  /* funnel area sparkline — simulated trend across ALL lead sources */
  const trendData = (() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun"];
    const base = Math.max(4, Math.round(combinedTotal / 6));
    return months.map((m, i) => ({
      month: m,
      leads: Math.max(0, base + Math.round((Math.sin(i) * base * 0.4))),
    }));
  })();

  /* pie — module distribution (which channel leads/requests come from) */
  const moduleDonut = [
   

    { name: "Service Leads", value: totalSvcLeads,     color: "#0891B2" },
   
    { name: "Claim Leads",   value: totalClaimLeads,   color: "#DC2626" },
    { name: "Chatbot Leads", value: totalChatbotLeads, color: "#DB2777" },
  ].filter(d => d.value > 0);
  const moduleTotal = moduleDonut.reduce((a, d) => a + d.value, 0);

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
            {services.length} services · {combinedTotal + totalClaimLeads + totalChatbotLeads} leads &amp; requests tracked across all modules
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

        {/* ─── Row 1 — KPI cards (all modules) ────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(178px, 1fr))", gap: 14, marginBottom: 28 }}>
          <KpiCard label="Total Services"     value={services.length}      icon={ShieldCheck}     color={C.primary}    bg={C.primaryBg} to="/services" />
          <KpiCard label="Active Services"    value={activeServices}       icon={CheckCircle}     color={C.green.fg}   bg={C.green.bg}  to="/services" />
          
         
          <KpiCard label="Service Leads"      value={totalSvcLeads}        icon={Calculator}      color={C.primary}    bg={C.primaryBg} to="/serviceleads" />
         
          <KpiCard label="Claim Leads"        value={totalClaimLeads}      icon={FileWarning}     color={C.red.fg}     bg={C.red.bg}    to="/claimleads" />
          <KpiCard label="Chatbot Leads"      value={totalChatbotLeads}    icon={MessageCircle}   color={C.pink.fg}    bg={C.pink.bg}   to="/chatbotleads" />
          <KpiCard label="General Queries"    value={totalGeneralQueries}  icon={MessagesSquare}  color={C.indigo.fg}  bg={C.indigo.bg} to="/contact/general-query" />
          <KpiCard label="Claim Support"      value={totalClaimSupport}    icon={LifeBuoy}        color={C.teal.fg}    bg={C.teal.bg}   to="/contact/claim-support" />
          <KpiCard label="Complaints"         value={totalComplaints}      icon={AlertTriangle}   color={C.amber.fg}   bg={C.amber.bg}  to="/contact/complaint" />
          <KpiCard label="Job Openings"       value={`${activeJobs}/${totalJobs}`} icon={Briefcase} color={C.violet.fg} bg={C.violet.bg} to="/careers/jobs" />
          <KpiCard label="Job Applications"   value={totalApplications}    icon={FileText}        color={C.cyan.fg}    bg={C.cyan.bg}   to="/careers/applications" />
          <KpiCard label="Events"             value={totalEvents}          icon={CalendarDays}    color={C.pink.fg}    bg={C.pink.bg}   to="/events" />
         
        </div>

        {/* ─── Row 2 — Area chart + Combined lead status ──────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, marginBottom: 24, alignItems: "stretch" }}>

          {/* area trend */}
          <div style={{ ...card({ padding: "22px 22px 14px" }) }}>
            <SectionHeader title="Lead Trend — all sources (6 months)" />
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

          {/* combined status breakdown */}
          <div style={{ ...card({ padding: "22px 20px" }) }}>
            <SectionHeader title="Combined Lead Status" to="/leads" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
              <StatusBadge value={combinedStatus.new}       color={C.amber.fg} bg={C.amber.bg} label="New"       />
              <StatusBadge value={combinedStatus.contacted} color={C.cyan.fg}  bg={C.cyan.bg}  label="Contacted" />
              <StatusBadge value={combinedStatus.converted} color={C.green.fg} bg={C.green.bg} label="Converted" />
              <StatusBadge value={combinedStatus.closed}    color={C.red.fg}   bg={C.red.bg}   label="Closed"    />
            </div>
            {/* conversion meter */}
            {/* <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 6 }}>
                <span>Conversion rate (general leads)</span>
                <span style={{ fontWeight: 700, color: C.green.fg }}>{conversionRate}%</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${conversionRate}%`, background: `linear-gradient(90deg, ${C.primary}, #16A34A)`, borderRadius: 3, transition: "width .6s ease" }} />
              </div>
            </div> */}
          </div>
        </div>

        {/* ─── Row 3 — Bar chart + Module distribution donut ──────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>

          {/* bar — combined lead status */}
          <div style={{ ...card({ padding: "22px 22px 14px" }) }}>
            <SectionHeader title="Leads by Status (all lead sources)" />
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

          {/* donut — where leads come from */}
          <div style={{ ...card({ padding: "22px 20px" }) }}>
            <SectionHeader title="Leads by Module" />
            {moduleDonut.length > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <ResponsiveContainer width={160} height={200}>
                  <PieChart>
                    <Pie
                      data={moduleDonut} cx="50%" cy="50%"
                      innerRadius={52} outerRadius={76}
                      paddingAngle={3} dataKey="value"
                    >
                      {moduleDonut.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, color: C.muted, marginBottom: 10, fontWeight: 600 }}>TOTAL</p>
                  <p style={{ fontSize: 30, fontWeight: 800, color: C.ink, letterSpacing: "-0.03em", margin: "0 0 14px" }}>{moduleTotal}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 130, overflowY: "auto" }}>
                    {moduleDonut.map((d, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                        <span style={{ color: C.muted, flex: 1 }}>{d.name}</span>
                        <span style={{ fontWeight: 700, color: C.ink }}>{d.value}</span>
                        <span style={{ color: C.muted, fontSize: 10, minWidth: 32, textAlign: "right" }}>
                          {pct(d.value, moduleTotal)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 180, gap: 10, color: C.muted }}>
                <Calculator size={28} color={C.border} />
                <span style={{ fontSize: 13 }}>No leads yet</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── Row 4 — Service leads donut + Leads by service ─────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>

          {/* donut — service leads breakdown (kept from original) */}
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

          {/* bar — leads by service */}
          <div style={{ ...card({ padding: "22px 22px 14px" }) }}>
            {/* <SectionHeader title="General Leads by Service" to="/leads" /> */}
            {byServiceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byServiceData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: `${C.primary}10` }} />
                  <Bar dataKey="leads" name="Leads" fill={C.primary} radius={[0, 6, 6, 0]}>
                    {byServiceData.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? C.primary : "#F8895A"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180, color: C.muted, fontSize: 13 }}>
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* ─── Row 5 — Support & Ops modules (contact forms, claims, chatbot) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, marginBottom: 24 }}>

          <ModuleCard title="Claim Leads" icon={FileWarning} color={C.red.fg} bg={C.red.bg} total={totalClaimLeads} to="/claimleads">
            <MiniRow label="New"       value={claimStatus.new}       total={totalClaimLeads} color={C.amber.fg} />
            <MiniRow label="Contacted" value={claimStatus.contacted} total={totalClaimLeads} color={C.cyan.fg} />
            <MiniRow label="Converted" value={claimStatus.converted} total={totalClaimLeads} color={C.green.fg} />
            <MiniRow label="Closed"    value={claimStatus.closed}    total={totalClaimLeads} color={C.red.fg} />
          </ModuleCard>

          <ModuleCard title="Chatbot Leads" icon={MessageCircle} color={C.pink.fg} bg={C.pink.bg} total={totalChatbotLeads} to="/chatbotleads">
            <MiniRow label="New"       value={chatbotStatus.new}       total={totalChatbotLeads} color={C.amber.fg} />
            <MiniRow label="Contacted" value={chatbotStatus.contacted} total={totalChatbotLeads} color={C.cyan.fg} />
            <MiniRow label="Converted" value={chatbotStatus.converted} total={totalChatbotLeads} color={C.green.fg} />
            <MiniRow label="Closed"    value={chatbotStatus.closed}    total={totalChatbotLeads} color={C.red.fg} />
          </ModuleCard>

          <ModuleCard title="Contact Forms" icon={MessagesSquare} color={C.indigo.fg} bg={C.indigo.bg} total={totalGeneralQueries + totalClaimSupport + totalComplaints} to="/contact/general-query">
            <MiniRow label="General Queries" value={totalGeneralQueries} total={totalGeneralQueries + totalClaimSupport + totalComplaints} color={C.indigo.fg} />
            <MiniRow label="Claim Support"    value={totalClaimSupport}  total={totalGeneralQueries + totalClaimSupport + totalComplaints} color={C.teal.fg} />
            <MiniRow label="Complaints"       value={totalComplaints}    total={totalGeneralQueries + totalClaimSupport + totalComplaints} color={C.amber.fg} />
          </ModuleCard>

          <ModuleCard title="Careers" icon={Briefcase} color={C.violet.fg} bg={C.violet.bg} total={totalJobs} to="/careers/jobs" toLabel="Manage jobs">
            <MiniRow label="Active openings"   value={activeJobs}              total={Math.max(totalJobs, 1)} color={C.green.fg} />
            <MiniRow label="Inactive openings" value={totalJobs - activeJobs}   total={Math.max(totalJobs, 1)} color={C.border === "#E8EDF5" ? "#94A3B8" : C.muted} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted }}>Total applications</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{totalApplications}</span>
            </div>
          </ModuleCard>

          <ModuleCard title="Events" icon={CalendarDays} color={C.pink.fg} bg={C.pink.bg} total={totalEvents} to="/events" toLabel="Manage events">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 0", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em" }}>{totalEvents}</span>
              <span style={{ fontSize: 12, color: C.muted }}>events published</span>
            </div>
          </ModuleCard>

        
        </div>

        {/* ─── Row 6 — Service list table ─────────────────────────── */}
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

      </div>
    </div>
  );
}