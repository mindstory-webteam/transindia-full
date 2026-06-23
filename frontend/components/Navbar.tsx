"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  hasDropdown?: boolean;
  href?: string;
}

interface Service {
  _id: string;
  title: string;  // matches MongoDB ServiceSchema field
  name?: string;  // fallback in case some docs use name
  slug: string;
  isActive: boolean;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

// NOTE: NEXT_PUBLIC_API_URL already includes the "/api" suffix
// (e.g. https://transindia-full-2.onrender.com/api), so endpoints are built as
// `${API_BASE}/services`, NOT `${API_BASE}/api/services`.
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const NAV_ITEMS: NavItem[] = [
  { label: "Services",              hasDropdown: true, href: "/our-services" },
  { label: "Renew existing policy", href: "/renew"      },
  { label: "About us",              href: "/about"      },
  { label: "Contact us",            href: "/contact-us" },
];

const FALLBACK_SERVICES: Service[] = [
  { _id: "1", title: "Life Insurance",   slug: "life-insurance",   isActive: true },
  { _id: "2", title: "Health Insurance", slug: "health-insurance", isActive: true },
  { _id: "3", title: "Motor Insurance",  slug: "motor-insurance",  isActive: true },
  { _id: "4", title: "Travel Insurance", slug: "travel-insurance", isActive: true },
  { _id: "5", title: "Home Insurance",   slug: "home-insurance",   isActive: true },
];

// ─── HELPER: drill into any backend shape and find the services array ─────────
function extractServices(data: unknown): Service[] {
  if (!data) return [];

  // Already a plain array
  if (Array.isArray(data)) return data as Service[];

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;

    // Common envelope keys — try every one
    for (const key of ["data", "services", "result", "results", "items", "payload"]) {
      const val = obj[key];
      if (Array.isArray(val) && val.length > 0) return val as Service[];
    }

    // Nested: { data: { services: [...] } }
    if (obj.data && typeof obj.data === "object") {
      const nested = obj.data as Record<string, unknown>;
      for (const key of ["services", "items", "results"]) {
        const val = nested[key];
        if (Array.isArray(val) && val.length > 0) return val as Service[];
      }
    }
  }

  return [];
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

export default function Navbar({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  const [scrolled,           setScrolled]           = useState(false);
  const [mobileOpen,         setMobileOpen]         = useState(false);
  const [services,           setServices]           = useState<Service[]>(FALLBACK_SERVICES);
  const [siteTitle,          setSiteTitle]          = useState<string>("");
  const [dropdownOpen,       setDropdownOpen]       = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Fetch services ──────────────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        // API_BASE already ends with /api → final URL is .../api/services
        const res = await fetch(`${API_BASE}/services`, {
          method:  "GET",
          headers: { "Content-Type": "application/json" },
          signal:  controller.signal,
        });

        if (!res.ok) return; // keep fallback

        const raw     = await res.json();
        const fetched = extractServices(raw);

        if (process.env.NODE_ENV !== "production") {
          console.log("[Navbar] extracted services:", fetched.length);
        }

        if (fetched.length > 0) {
          setServices(fetched.filter((s) => s.isActive !== false));
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        if (process.env.NODE_ENV !== "production") {
          console.warn("[Navbar] services fetch failed — using fallback.");
        }
      }
    };

    fetchServices();
    return () => controller.abort();
  }, []);

  // ── Optional: dynamic brand title ───────────────────────────────────────────
  // Disabled by default. Your backend currently has no settings endpoint, so
  // probing for one only produces 404 noise. To enable, set a FULL endpoint URL
  // in NEXT_PUBLIC_SETTINGS_URL (e.g. https://.../api/settings). When unset, no
  // request is made and the logo image is shown.
  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_SETTINGS_URL;
    if (!endpoint) return;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(endpoint, { signal: controller.signal });
        if (!res.ok) return;

        const data  = await res.json();
        const obj   = (typeof data === "object" && data !== null) ? data as Record<string, unknown> : {};
        const inner = (obj.data && typeof obj.data === "object") ? obj.data as Record<string, unknown> : obj;

        const title =
          (inner.siteName  as string) ||
          (inner.siteTitle as string) ||
          (inner.title     as string) ||
          (inner.name      as string) ||
          "";

        if (title) setSiteTitle(title);
      } catch {
        /* ignore — logo image fallback */
      }
    })();

    return () => controller.abort();
  }, []);

  // ── Scroll listener ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Body scroll lock when drawer open ─────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Close desktop dropdown on outside click ────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <nav className={`nav-root${alwaysSolid || scrolled || mobileOpen ? " nav-scrolled" : ""}`}>
        <div className="nav-inner">

          {/* ── Logo / Brand ── */}
          <Link href="/" className="nav-logo">
            {siteTitle ? (
              <span className="nav-brand-text">{siteTitle}</span>
            ) : (
              <img
                src="/images/logo/transindia.png"
                alt="TransIndia logo"
                className="nav-logo-img"
              />
            )}
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.hasDropdown ? (
                  <div
                    className="nav-dropdown-wrapper"
                    ref={dropdownRef}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    {/* Clicking "Services" navigates to /our-services;
                        hovering opens the dropdown below. */}
                    <Link
                      href={item.href || "/our-services"}
                      className="nav-link nav-dropdown-trigger"
                      aria-expanded={dropdownOpen}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width={13}
                        height={13}
                        className={`chevron${dropdownOpen ? " chevron-open" : ""}`}
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                      </svg>
                    </Link>

                    {/* ── Dropdown Menu — always in DOM, animated via CSS ── */}
                    <div className={`nav-dropdown-menu${dropdownOpen ? " dropdown-visible" : ""}`}
                         aria-hidden={!dropdownOpen}>
                      {services.map((service) => (
                        <Link
                          key={service._id}
                          href={`/our-services/${service.slug}`}
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                          tabIndex={dropdownOpen ? 0 : -1}
                        >
                          {service.title || service.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link href={item.href || "#"} className="nav-link">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* ── CTA Buttons ── */}
          <div className="nav-actions">
            <a href="#" className="btn-outline">Become an advisor</a>
            <a href="/claims" className="btn-fill">Make a claim</a>
          </div>

          {/* ── Hamburger (mobile) ── */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" width={22} height={22} stroke="currentColor" strokeWidth={2} fill="none">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width={22} height={22} stroke="currentColor" strokeWidth={2} fill="none">
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileOpen && (
          <div className="nav-drawer">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                {item.hasDropdown ? (
                  <>
                    <button
                      className="drawer-link drawer-dropdown-trigger"
                      onClick={() => setMobileDropdownOpen((o) => !o)}
                      aria-expanded={mobileDropdownOpen}
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width={14}
                        height={14}
                        className={`chevron${mobileDropdownOpen ? " chevron-open" : ""}`}
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                      </svg>
                    </button>

                    <div className={`drawer-dropdown-menu${mobileDropdownOpen ? " dropdown-visible" : ""}`}
                         aria-hidden={!mobileDropdownOpen}>
                      {services.map((service) => (
                        <Link
                          key={service._id}
                          href={`/our-services/${service.slug}`}
                          className="drawer-dropdown-item"
                          tabIndex={mobileDropdownOpen ? 0 : -1}
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileDropdownOpen(false);
                          }}
                        >
                          {service.title || service.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={item.href || "#"} className="drawer-link" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="drawer-actions">
              <a href="https://www.transindiainsurance.com/partner/posp-home" className="btn-outline drawer-btn">Become a PoSP</a>
              <a href="/claims" className="btn-fill drawer-btn">Make a claim</a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .nav-root {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 200;
    font-family: var(--font-sora), "Sora", sans-serif;
    background: transparent;
    border-bottom: 1px solid transparent;
    box-shadow: none;
    transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
  }

  .nav-scrolled {
    background: #07174A;
    border-bottom: 1px solid rgba(56,189,248,0.12);
    box-shadow: 0 4px 32px rgba(0,0,0,0.45);
  }

  .nav-inner {
    max-width: 1480px;
    margin: 0 auto;
    padding: 0 32px;
    height: 68px;
    display: flex;
    align-items: center;
    gap: 32px;
  }

  /* ── Logo / Brand ── */
  .nav-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    flex-shrink: 0;
  }
  .nav-logo-img {
    height: 40px;
    width: auto;
    display: block;
    object-fit: contain;
  }
  .nav-brand-text {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.3px;
    white-space: nowrap;
  }

  /* ── Chevron ── */
  .chevron {
    opacity: 0.65;
    flex-shrink: 0;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .chevron-open {
    transform: rotate(180deg);
  }

  /* ── Nav links ── */
  .nav-links {
    display: flex;
    list-style: none;
    margin: 0; padding: 0;
    gap: 0; flex: 1;
    justify-content: flex-start;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 16px;
    color: rgba(255,255,255,0.88);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    white-space: nowrap;
    transition: background 0.18s, color 0.18s;
    border: none;
    background: none;
    cursor: pointer;
  }
  .nav-link:hover {
    background: rgba(255,255,255,0.09);
    color: #fff;
  }

  /* ── Dropdown Wrapper ── */
  .nav-dropdown-wrapper {
    position: relative;
  }

  /* ── Dropdown Menu — CSS-animated, always in DOM ── */
  .nav-dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    background: #07174A;
    border: 1px solid rgba(56,189,248,0.15);
    border-radius: 10px;
    min-width: 230px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 300;
    pointer-events: none;

    /* ── Slow smooth animation ── */
    opacity: 0;
    transform: translateY(-12px) scaleY(0.94);
    transform-origin: top center;
    transition:
      opacity    0.38s cubic-bezier(0.4, 0, 0.2, 1),
      transform  0.38s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Invisible bridge that fills the 8px gap between the trigger and the menu,
     so moving the cursor from "Services" down to the list never crosses dead
     space (which would otherwise fire mouseleave and close the dropdown). */
  .nav-dropdown-menu::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -12px;
    height: 12px;
    background: transparent;
  }

  .nav-dropdown-menu.dropdown-visible {
    opacity: 1;
    transform: translateY(0) scaleY(1);
    pointer-events: auto;
  }

  .dropdown-item {
    padding: 13px 18px;
    color: rgba(255,255,255,0.88);
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 500;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: background 0.2s, color 0.2s, padding-left 0.2s;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dropdown-item:last-child { border-bottom: none; }
  .dropdown-item:hover {
    background: rgba(56,189,248,0.13);
    color: #fff;
    padding-left: 24px;
  }

  /* ── CTA Buttons ── */
  .nav-actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
    margin-left: auto;
    align-items: center;
  }

  .btn-outline {
    padding: 9px 22px;
    border: 1.5px solid rgba(255,255,255,0.75);
    border-radius: 8px;
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    background: transparent;
    font-family: 'matterregular', sans-serif;
    transition: border-color 0.18s, background 0.18s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .btn-outline:hover {
    border-color: #fff;
    background: rgba(255,255,255,0.08);
  }

  .btn-fill {
    padding: 9px 22px;
    background: #EC4F34;
    border: none;
    border-radius: 8px;
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
    font-family: 'matterregular', sans-serif;
    transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* ── Hamburger ── */
  .nav-hamburger {
    display: none;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    margin-left: auto;
    flex-shrink: 0;
    color: #fff;
    border-radius: 8px;
    transition: background 0.18s;
  }
  .nav-hamburger:hover { background: rgba(255,255,255,0.1); }

  /* ── Mobile Drawer ── */
  .nav-drawer {
    display: flex;
    flex-direction: column;
    padding: 8px 24px 24px;
    border-top: 1px solid rgba(255,255,255,0.08);
    background: #07174A;
    animation: drawer-open 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes drawer-open {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  .drawer-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    color: rgba(255,255,255,0.85);
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-family: 'matterregular', sans-serif;
    border: none;
    background: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: color 0.15s;
  }
  .drawer-link:hover { color: #fff; }

  /* ── Mobile Dropdown — CSS-animated ── */
  .drawer-dropdown-menu {
    display: flex;
    flex-direction: column;
    background: rgba(56,189,248,0.07);
    border-radius: 8px;
    overflow: hidden;

    /* Slow smooth height + fade animation */
    max-height: 0;
    opacity: 0;
    transition:
      max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1),
      opacity    0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .drawer-dropdown-menu.dropdown-visible {
    max-height: 600px;   /* large enough for any service list */
    opacity: 1;
    margin: 6px 0 10px;
  }

  .drawer-dropdown-item {
    padding: 11px 18px 11px 32px;
    color: rgba(255,255,255,0.85);
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    border: none;
    background: none;
    display: block;
    transition: background 0.15s, color 0.15s;
    text-align: left;
    font-family: 'matterregular', sans-serif;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .drawer-dropdown-item:hover {
    background: rgba(56,189,248,0.15);
    color: #fff;
  }

  .drawer-actions {
    display: flex;
    gap: 12px;
    margin-top: 22px;
    flex-wrap: wrap;
  }
  .drawer-btn { flex: 1 1 120px; text-align: center; }

  /* ── Responsive ── */
  @media (max-width: 1400px) {
    .nav-inner   { gap: 16px; padding: 0 24px; }
    .nav-link    { padding: 8px 10px; font-size: 13px; }
    .nav-actions { gap: 8px; }
  }

  @media (max-width: 1150px) {
    .nav-links     { display: none; }
    .nav-actions   { display: none; }
    .nav-hamburger { display: flex; }
    .nav-inner     { gap: 0; }
  }

  @media (max-width: 480px) {
    .nav-inner      { padding: 0 16px; }
    .drawer-actions { flex-direction: column; gap: 10px; }
    .drawer-btn     { flex: unset; width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-drawer, .nav-dropdown-menu, .drawer-dropdown-menu {
      animation: none !important;
      transition: none !important;
    }
    .nav-root, .btn-fill, .btn-outline, .nav-link, .nav-hamburger, .dropdown-item {
      transition: none !important;
    }
  }
`;