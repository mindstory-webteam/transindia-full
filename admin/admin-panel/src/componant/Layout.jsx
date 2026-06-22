import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, ShieldCheck, Users, Settings,
  LogOut, Menu, MessageSquare, ChevronDown, FileText,
} from "lucide-react";

const NAV = [
  { to: "/",         icon: LayoutDashboard, label: "Dashboard" },
  { to: "/services", icon: ShieldCheck,     label: "Services" },
  { to: "/leads",    icon: Users,           label: "Leads" },
  { to: "/claimleads", icon: FileText,      label: "Claim Leads" }, // ← NEW
];

const CONTACT_LINKS = [
  { to: "/contact/general-queries", label: "General Queries" },
  { to: "/contact/claim-support",   label: "Claim Support" },
  { to: "/contact/complaints",      label: "Complaints" },
];

const STYLES = `
  :root {
    --ti-brand:#F15A3E;
    --ti-brand-dark:#DC4426;
    --ti-brand-soft:#FEEEE9;
    --ti-cyan:#00BCD4;
    --ti-ink:#0F172A;
    --ti-muted:#64748B;
    --ti-bg:#F6F8FB;
    --ti-line:#E8EDF3;
    --sidebar-w:258px;
    --border:#E8EDF3;
  }
  * { box-sizing: border-box; }

  .ti-shell {
    display:flex; height:100vh; overflow:hidden;
    font-family:'Sora', system-ui, -apple-system, sans-serif;
    background:var(--ti-bg); color:var(--ti-ink);
  }

  .ti-sidebar {
    width:var(--sidebar-w); flex-shrink:0; background:#fff;
    border-right:1px solid var(--ti-line);
    display:flex; flex-direction:column; z-index:50;
  }
  @media (max-width:768px) {
    .ti-sidebar {
      position:fixed; inset:0 auto 0 0;
      transform:translateX(-100%); transition:transform .25s ease;
      box-shadow:0 0 50px rgba(15,23,42,.16);
    }
    .ti-sidebar.open { transform:translateX(0); }
  }

  .ti-overlay { position:fixed; inset:0; background:rgba(15,23,42,.45); z-index:40; }
  @media (min-width:768px) {
    .ti-overlay { display:none; }
    .ti-menu-btn { display:none !important; }
  }

  .ti-nav-link {
    display:flex; align-items:center; gap:11px;
    padding:11px 13px; border-radius:11px; margin-bottom:3px;
    color:var(--ti-muted); font-size:14px; font-weight:600;
    text-decoration:none; transition:background .15s, color .15s;
  }
  .ti-nav-link:hover { background:#F4F7FB; color:var(--ti-ink); }
  .ti-nav-link.active { background:var(--ti-brand-soft); color:var(--ti-brand); }

  .ti-disclosure {
    width:100%; display:flex; align-items:center; justify-content:space-between;
    padding:11px 13px; border-radius:11px; background:transparent; border:none;
    color:var(--ti-muted); font-size:14px; font-weight:600; cursor:pointer;
    font-family:inherit; transition:background .15s, color .15s;
  }
  .ti-disclosure:hover { background:#F4F7FB; color:var(--ti-ink); }

  .ti-sub-link {
    padding:8px 12px; border-radius:9px; color:var(--ti-muted);
    font-size:13px; font-weight:500; text-decoration:none;
    transition:background .15s, color .15s;
  }
  .ti-sub-link:hover { background:#F4F7FB; color:var(--ti-ink); }
  .ti-sub-link.active { background:var(--ti-brand-soft); color:var(--ti-brand); font-weight:600; }

  .ti-icon-btn {
    display:flex; padding:7px; border-radius:9px; color:var(--ti-muted);
    transition:background .15s, color .15s;
  }
  .ti-icon-btn:hover { background:#F4F7FB; color:var(--ti-ink); }
  .ti-icon-btn.active { background:var(--ti-brand-soft); color:var(--ti-brand); }

  .ti-logout {
    display:flex; align-items:center; gap:8px; width:100%;
    padding:10px 13px; border-radius:11px; cursor:pointer;
    border:1px solid #FBD5D0; background:#FEF3F1; color:#E1483B;
    font-size:13px; font-weight:600; font-family:inherit;
    transition:background .15s;
  }
  .ti-logout:hover { background:#FCE7E3; }

  .ti-topbar {
    height:60px; background:#fff; border-bottom:1px solid var(--ti-line);
    display:flex; align-items:center; padding:0 22px; flex-shrink:0;
  }
  .ti-menu-btn { border:none; background:none; margin-right:12px; cursor:pointer; display:flex; }
  .ti-main { flex:1; overflow-y:auto; padding:24px; }

  @media (prefers-reduced-motion: reduce) {
    .ti-sidebar, .ti-nav-link, .ti-sub-link, .ti-disclosure, .ti-icon-btn, .ti-logout {
      transition:none !important;
    }
  }
`;

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };
  const closeMobile  = () => setOpen(false);

  return (
    <>
      <style>{STYLES}</style>

      <div className="ti-shell">
        {open && <div className="ti-overlay" onClick={closeMobile} />}

        {/* Sidebar */}
        <aside className={`ti-sidebar${open ? " open" : ""}`}>
          {/* Logo */}
          <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid var(--ti-line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src="/logo/transindia.png" alt="TransIndia Logo" style={{ height: "38px", width: "auto", objectFit: "contain" }} />
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "14px 12px", overflowY: "auto" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#94A3B8", textTransform: "uppercase", padding: "0 13px", margin: "2px 0 10px" }}>
              Menu
            </p>

            {NAV.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={closeMobile}
                className={({ isActive }) => `ti-nav-link${isActive ? " active" : ""}`}
              >
                <Icon size={18} /> {label}
              </NavLink>
            ))}

            {/* Contact Dropdown */}
            <div style={{ marginTop: 2 }}>
              <button
                onClick={() => setContactOpen(o => !o)}
                className="ti-disclosure"
                aria-expanded={contactOpen}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <MessageSquare size={18} /> Contacts
                </span>
                <ChevronDown size={16} style={{ transform: contactOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>

              {contactOpen && (
                <div style={{ paddingLeft: 30, display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
                  {CONTACT_LINKS.map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={closeMobile}
                      className={({ isActive }) => `ti-sub-link${isActive ? " active" : ""}`}
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Admin info + logout */}
          <div style={{ padding: "16px 12px", borderTop: "1px solid var(--ti-line)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                <div style={{
                  flexShrink: 0, width: 38, height: 38, borderRadius: "50%",
                  background: "linear-gradient(135deg, #F15A3E 0%, #FB7E54 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 15,
                }}>
                  {admin?.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <p style={{ color: "var(--ti-ink)", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{admin?.name}</p>
                  <p style={{ color: "var(--ti-muted)", fontSize: 11 }}>{admin?.role}</p>
                </div>
              </div>
              <NavLink
                to="/settings"
                onClick={closeMobile}
                className={({ isActive }) => `ti-icon-btn${isActive ? " active" : ""}`}
                title="Settings"
              >
                <Settings size={18} />
              </NavLink>
            </div>

            <button onClick={handleLogout} className="ti-logout">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <header className="ti-topbar">
            <button className="ti-menu-btn" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
              <Menu size={20} color="#64748B" />
            </button>
            <span style={{ fontSize: 13, color: "var(--ti-muted)" }}>
              Welcome back, <strong style={{ color: "var(--ti-ink)", fontWeight: 700 }}>{admin?.name}</strong>
            </span>
          </header>

          <main className="ti-main">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}