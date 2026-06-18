import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, ShieldCheck, Users, Settings,
  LogOut, Menu, X, ChevronRight, MessageSquare, ChevronDown
} from "lucide-react";

const NAV = [
  { to: "/",         icon: LayoutDashboard, label: "Dashboard" },
  { to: "/services", icon: ShieldCheck,     label: "Services" },
  { to: "/leads",    icon: Users,           label: "Leads" },
  { to: "/settings", icon: Settings,        label: "Settings" },
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: "var(--sidebar-w)", flexShrink: 0,
        background: "#0F172A", display: "flex", flexDirection: "column",
        position: window.innerWidth < 768 ? "fixed" : "relative",
        inset: "0 auto 0 0", zIndex: 50,
        transform: (window.innerWidth < 768 && !open) ? "translateX(-100%)" : "none",
        transition: "transform 0.25s ease",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #1E293B" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:"#1E40AF", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ShieldCheck size={20} color="#fff" />
            </div>
            <div>
              <p style={{ color:"#fff", fontWeight:700, fontSize:14 }}>TransIndia</p>
              <p style={{ color:"#64748B", fontSize:11 }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 12px", overflowY:"auto" }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display:"flex", alignItems:"center", gap:10,
                padding:"10px 12px", borderRadius:8, marginBottom:2,
                background: isActive ? "#1E40AF" : "transparent",
                color: isActive ? "#fff" : "#94A3B8",
                fontSize:14, fontWeight:500,
                transition:"all 0.15s",
              })}
              onMouseEnter={e => { if (!e.currentTarget.style.background.includes("1E40AF")) e.currentTarget.style.background="#1E293B"; }}
              onMouseLeave={e => { if (!e.currentTarget.style.background.includes("1E40AF")) e.currentTarget.style.background="transparent"; }}
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}

          {/* Contact Dropdown */}
          <div style={{ marginTop: 2 }}>
            <button
              onClick={() => setContactOpen(!contactOpen)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 8, background: "transparent", border: "none",
                color: "#94A3B8", fontSize: 14, fontWeight: 500, cursor: "pointer",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background="#1E293B"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <MessageSquare size={18} /> Contacts
              </div>
              <ChevronDown size={16} style={{ transform: contactOpen ? "rotate(180deg)" : "none", transition: "0.2s" }} />
            </button>
            {contactOpen && (
              <div style={{ paddingLeft: 30, display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
                <NavLink
                  to="/contact/general-queries"
                  onClick={() => setOpen(false)}
                  style={({ isActive }) => ({
                    padding: "8px 12px", borderRadius: 8, color: isActive ? "#fff" : "#94A3B8", fontSize: 13, background: isActive ? "#1E40AF" : "transparent", textDecoration: "none", transition: "all 0.15s"
                  })}
                  onMouseEnter={e => { if (!e.currentTarget.style.background.includes("1E40AF")) e.currentTarget.style.background="#1E293B"; }}
                  onMouseLeave={e => { if (!e.currentTarget.style.background.includes("1E40AF")) e.currentTarget.style.background="transparent"; }}
                >
                  General Queries
                </NavLink>
                <NavLink
                  to="/contact/claim-support"
                  onClick={() => setOpen(false)}
                  style={({ isActive }) => ({
                    padding: "8px 12px", borderRadius: 8, color: isActive ? "#fff" : "#94A3B8", fontSize: 13, background: isActive ? "#1E40AF" : "transparent", textDecoration: "none", transition: "all 0.15s"
                  })}
                  onMouseEnter={e => { if (!e.currentTarget.style.background.includes("1E40AF")) e.currentTarget.style.background="#1E293B"; }}
                  onMouseLeave={e => { if (!e.currentTarget.style.background.includes("1E40AF")) e.currentTarget.style.background="transparent"; }}
                >
                  Claim Support
                </NavLink>
                <NavLink
                  to="/contact/complaints"
                  onClick={() => setOpen(false)}
                  style={({ isActive }) => ({
                    padding: "8px 12px", borderRadius: 8, color: isActive ? "#fff" : "#94A3B8", fontSize: 13, background: isActive ? "#1E40AF" : "transparent", textDecoration: "none", transition: "all 0.15s"
                  })}
                  onMouseEnter={e => { if (!e.currentTarget.style.background.includes("1E40AF")) e.currentTarget.style.background="#1E293B"; }}
                  onMouseLeave={e => { if (!e.currentTarget.style.background.includes("1E40AF")) e.currentTarget.style.background="transparent"; }}
                >
                  Complaints
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* Admin info + logout */}
        <div style={{ padding:"16px 12px", borderTop:"1px solid #1E293B" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"#1E40AF", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:14 }}>
              {admin?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow:"hidden" }}>
              <p style={{ color:"#F1F5F9", fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{admin?.name}</p>
              <p style={{ color:"#64748B", fontSize:11 }}>{admin?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 12px", borderRadius:8, border:"none", background:"#1E293B", color:"#F87171", fontSize:13, fontWeight:500 }}
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <header style={{ height:56, background:"#fff", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", padding:"0 24px", flexShrink:0 }}>
          <button onClick={() => setOpen(!open)} style={{ border:"none", background:"none", marginRight:12, display:"block" }}>
            <Menu size={20} color="#64748B" />
          </button>
          <span style={{ fontSize:13, color:"#64748B" }}>Welcome back, <strong style={{ color:"#0F172A" }}>{admin?.name}</strong></span>
        </header>

        {/* Page content */}
        <main style={{ flex:1, overflowY:"auto", padding:24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}