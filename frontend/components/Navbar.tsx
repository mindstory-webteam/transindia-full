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

interface SimpleLink {
  label: string;
  href: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

// NOTE: NEXT_PUBLIC_API_URL already includes the "/api" suffix
// (e.g. https://transindia-full-2.onrender.com/api), so endpoints are built as
// `${API_BASE}/services`, NOT `${API_BASE}/api/services`.
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

// How long (ms) the dropdown waits before closing after the cursor leaves.
const DROPDOWN_CLOSE_DELAY = 240;

const NAV_ITEMS: NavItem[] = [
  { label: "Services",              hasDropdown: true, href: "/our-services" },
  { label: "Renew existing policy", href: "/renew"      },
  { label: "Events", href: "/events"      },
  { label: "About us",              href: "/about"      },
  { label: "Connect",               hasDropdown: true, href: "/contact-us" },
];

// Sub-links shown under the "Connect" dropdown.
const CONTACT_ITEMS: SimpleLink[] = [
  { label: "Contact us", href: "/contact-us" },
  { label: "Careers",    href: "/careers"    },
];

const MANUAL_SERVICES: Service[] = [
  { _id: "m1",  title: "Life Insurance",          slug: "life-insurance",          isActive: true },
  { _id: "m2",  title: "Health Insurance",        slug: "health-insurance",        isActive: true },
  { _id: "m3",  title: "Motor Insurance",         slug: "motor-insurance",         isActive: true },
  { _id: "m4",  title: "Home Insurance",          slug: "home-insurance",          isActive: true },

  { _id: "m6",  title: "Marine Insurance",        slug: "marine-insurance",        isActive: true },
  { _id: "m7",  title: "Fire Insurance",          slug: "fire-insurance",          isActive: true },
  { _id: "m8",  title: "Miscellaneous Insurance", slug: "miscellaneous-insurance", isActive: true },
  { _id: "m9",  title: "Entertainment Insurance", slug: "entertainment-insurance", isActive: true },

];

// Slugs that have a real static detail page. Backend services NOT in this set
// are skipped to avoid linking to a 404 (e.g. Marine/Fire with no page yet).
// ⛔ Remove this guard if you add a dynamic [slug] catch-all route.
const VALID_SLUGS = new Set(MANUAL_SERVICES.map((s) => s.slug));

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

export default function Navbar({ alwaysSolid = false }: { alwaysSolid?: boolean } = {}) {
  const [scrolled,           setScrolled]           = useState(false);
  const [mobileOpen,         setMobileOpen]         = useState(false);
  const [services,           setServices]           = useState<Service[]>(MANUAL_SERVICES);
  const [siteTitle,          setSiteTitle]          = useState<string>("");

  // Services dropdown state (desktop + mobile)
  const [dropdownOpen,       setDropdownOpen]       = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Contact us dropdown state (desktop + mobile)
  const [contactDropdownOpen,       setContactDropdownOpen]       = useState(false);
  const [mobileContactDropdownOpen, setMobileContactDropdownOpen] = useState(false);
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const contactCloseTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Hover-intent handlers for the desktop Services dropdown ────────────────
  const openDropdown = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setDropdownOpen(true);
  };

  const scheduleCloseDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDropdownOpen(false), DROPDOWN_CLOSE_DELAY);
  };

  const closeDropdownNow = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setDropdownOpen(false);
  };

  // ── Hover-intent handlers for the desktop Contact us dropdown ──────────────
  const openContactDropdown = () => {
    if (contactCloseTimer.current) {
      clearTimeout(contactCloseTimer.current);
      contactCloseTimer.current = null;
    }
    setContactDropdownOpen(true);
  };

  const scheduleCloseContactDropdown = () => {
    if (contactCloseTimer.current) clearTimeout(contactCloseTimer.current);
    contactCloseTimer.current = setTimeout(() => setContactDropdownOpen(false), DROPDOWN_CLOSE_DELAY);
  };

  const closeContactDropdownNow = () => {
    if (contactCloseTimer.current) {
      clearTimeout(contactCloseTimer.current);
      contactCloseTimer.current = null;
    }
    setContactDropdownOpen(false);
  };

  // Clear any pending timers on unmount
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (contactCloseTimer.current) clearTimeout(contactCloseTimer.current);
  }, []);

  // ── Fetch services & merge with manual list ─────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE}/services`, {
          method:  "GET",
          headers: { "Content-Type": "application/json" },
          signal:  controller.signal,
        });

        if (!res.ok) return; // keep manual list

        const raw     = await res.json();
        const fetched = extractServices(raw);

        if (process.env.NODE_ENV !== "production") {
          console.log("[Navbar] extracted services:", fetched.length);
        }

        // ── Merge: manual base + backend, deduped by slug ──────────────────
        // Manual entries come first (order preserved). Backend services are
        // added only if active, not already present, and have a real page.
        const merged: Service[] = [...MANUAL_SERVICES];
        const seen = new Set(merged.map((s) => s.slug));

        for (const s of fetched) {
          if (s.isActive === false) continue;
          if (!s.slug || seen.has(s.slug)) continue;
          // Skip backend services with no static page (avoids 404).
          // ⛔ Remove this line if you add a dynamic [slug] catch-all route.
          if (!VALID_SLUGS.has(s.slug)) continue;

          merged.push(s);
          seen.add(s.slug);
        }

        setServices(merged);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        if (process.env.NODE_ENV !== "production") {
          console.warn("[Navbar] services fetch failed — using manual list.");
        }
      }
    };

    fetchServices();
    return () => controller.abort();
  }, []);

  // ── Optional: dynamic brand title ───────────────────────────────────────────
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

  // ── Close desktop dropdowns on outside click ────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdownNow();
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(e.target as Node)) {
        closeContactDropdownNow();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      <nav className={`nav-root${scrolled || mobileOpen ? " nav-scrolled" : ""}`}>
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
            {NAV_ITEMS.map((item) => {
              if (item.label === "Services") {
                return (
                  <li key={item.label}>
                    <div
                      className="nav-dropdown-wrapper"
                      ref={dropdownRef}
                      onMouseEnter={openDropdown}
                      onMouseLeave={scheduleCloseDropdown}
                    >
                      <Link
                        href={item.href || "/our-services"}
                        className="nav-link nav-dropdown-trigger"
                        aria-expanded={dropdownOpen}
                        onClick={closeDropdownNow}
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

                      {/* ── Services Dropdown Menu ── */}
                      <div className={`nav-dropdown-menu${dropdownOpen ? " dropdown-visible" : ""}`}
                           aria-hidden={!dropdownOpen}>
                        {services.map((service) => (
                          <Link
                            key={service._id}
                            href={`/our-services/${service.slug}`}
                            className="dropdown-item"
                            onClick={closeDropdownNow}
                            tabIndex={dropdownOpen ? 0 : -1}
                          >
                            {service.title || service.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

              if (item.label === "Connect" || item.label === "Contact us") {
                return (
                  <li key={item.label}>
                    <div
                      className="nav-dropdown-wrapper"
                      ref={contactDropdownRef}
                      onMouseEnter={openContactDropdown}
                      onMouseLeave={scheduleCloseContactDropdown}
                    >
                      <Link
                        href={item.href || "/contact-us"}
                        className="nav-link nav-dropdown-trigger"
                        aria-expanded={contactDropdownOpen}
                        onClick={closeContactDropdownNow}
                      >
                        {item.label}
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          width={13}
                          height={13}
                          className={`chevron${contactDropdownOpen ? " chevron-open" : ""}`}
                        >
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                        </svg>
                      </Link>

                      {/* ── Contact us Dropdown Menu ── */}
                      <div className={`nav-dropdown-menu${contactDropdownOpen ? " dropdown-visible" : ""}`}
                           aria-hidden={!contactDropdownOpen}>
                        {CONTACT_ITEMS.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="dropdown-item"
                            onClick={closeContactDropdownNow}
                            tabIndex={contactDropdownOpen ? 0 : -1}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link href={item.href || "#"} className="nav-link">
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── CTA Buttons ── */}
          <div className="nav-actions">
            {/* <a href="#" className="btn-outline">Become an Advisor</a> */}
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
            {NAV_ITEMS.map((item) => {
              if (item.label === "Services") {
                return (
                  <div key={item.label}>
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
                  </div>
                );
              }

              if (item.label === "Connect" || item.label === "Contact us") {
                return (
                  <div key={item.label}>
                    <button
                      className="drawer-link drawer-dropdown-trigger"
                      onClick={() => setMobileContactDropdownOpen((o) => !o)}
                      aria-expanded={mobileContactDropdownOpen}
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width={14}
                        height={14}
                        className={`chevron${mobileContactDropdownOpen ? " chevron-open" : ""}`}
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                      </svg>
                    </button>

                    <div className={`drawer-dropdown-menu${mobileContactDropdownOpen ? " dropdown-visible" : ""}`}
                         aria-hidden={!mobileContactDropdownOpen}>
                      {CONTACT_ITEMS.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="drawer-dropdown-item"
                          tabIndex={mobileContactDropdownOpen ? 0 : -1}
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileContactDropdownOpen(false);
                          }}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.label}>
                  <Link href={item.href || "#"} className="drawer-link" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                </div>
              );
            })}
            <div className="drawer-actions">
              {/* <a href="https://www.transindiainsurance.com/partner/posp-home" className="btn-outline drawer-btn">Become a PoSP</a> */}
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
    background: #FFFFFF;
    border-bottom: 1px solid #E2E8F0;
    box-shadow: 0 2px 14px rgba(0, 26, 90, 0.05);
    transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }

  /* ── When scrolling: background BLUE (#001A5A), nav items WHITE (#FFFFFF) ── */
  .nav-scrolled {
    background: #001A5A;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 28px rgba(0, 15, 60, 0.4);
  }

  .nav-scrolled .nav-brand-text {
    color: #FFFFFF;
  }

  .nav-scrolled .nav-link {
    color: #FFFFFF;
  }

  .nav-scrolled .nav-link:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #FFFFFF;
  }

  .nav-scrolled .chevron {
    color: #FFFFFF;
    opacity: 0.95;
  }

  .nav-scrolled .nav-link:hover .chevron {
    color: #FFFFFF;
    opacity: 1;
  }

  .nav-scrolled .nav-hamburger {
    color: #FFFFFF;
  }
  .nav-scrolled .nav-hamburger:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .nav-scrolled .btn-outline {
    border-color: rgba(255, 255, 255, 0.85);
    color: #FFFFFF;
  }
  .nav-scrolled .btn-outline:hover {
    border-color: #FFFFFF;
    background: rgba(255, 255, 255, 0.15);
  }

  .nav-scrolled .nav-dropdown-menu {
    background: #001A5A;
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 16px 48px rgba(0, 10, 40, 0.55);
  }
  .nav-scrolled .dropdown-item {
    color: #FFFFFF;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .nav-scrolled .dropdown-item:hover {
    background: rgba(255, 255, 255, 0.14);
    color: #FFFFFF;
  }

  .nav-scrolled .nav-drawer {
    background: #001A5A;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .nav-scrolled .drawer-link {
    color: #FFFFFF;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .nav-scrolled .drawer-link:hover {
    color: #FFFFFF;
  }
  .nav-scrolled .drawer-dropdown-menu {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }
  .nav-scrolled .drawer-dropdown-item {
    color: #FFFFFF;
  }
  .nav-scrolled .drawer-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #FFFFFF;
  }

  .nav-inner {
    max-width: 1480px;
    margin: 0 auto;
    padding: 0 32px;
    height: 80px;
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
    height: 44px;
    width: auto;
    display: block;
    object-fit: contain;
  }
  .nav-brand-text {
    font-size: 22px;
    font-weight: 800;
    color: #001A5A;
    letter-spacing: -0.3px;
    white-space: nowrap;
  }

  /* ── Chevron ── */
  .chevron {
    color: #001A5A;
    opacity: 0.8;
    flex-shrink: 0;
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
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
    color: #001A5A;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    white-space: nowrap;
    transition: background 0.18s, color 0.18s;
    border: none;
    background: none;
    cursor: pointer;
  }
  .nav-link:hover {
    background: rgba(0, 26, 90, 0.06);
    color: #0284C7;
  }
  .nav-link:hover .chevron {
    color: #0284C7;
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
    background: #FFFFFF;
    border: 1px solid #D8EBF8;
    border-radius: 12px;
    min-width: 240px;
    box-shadow: 0 16px 40px rgba(0, 26, 90, 0.12), 0 4px 12px rgba(0, 26, 90, 0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 300;
    pointer-events: none;

    opacity: 0;
    transform: translateY(-14px) scaleY(0.92);
    transform-origin: top center;
    transition:
      opacity    0.4s cubic-bezier(0.22, 1, 0.36, 1),
      transform  0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .nav-dropdown-menu::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -14px;
    height: 16px;
    background: transparent;
  }

  .nav-dropdown-menu.dropdown-visible {
    opacity: 1;
    transform: translateY(0) scaleY(1);
    pointer-events: auto;
  }

  .dropdown-item {
    padding: 13px 18px;
    color: #001A5A;
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 600;
    border-bottom: 1px solid #F1F5F9;
    transition: background 0.2s, color 0.2s, padding-left 0.2s;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dropdown-item:last-child { border-bottom: none; }
  .dropdown-item:hover {
    background: #F0F9FF;
    color: #0284C7;
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
    border: 1.5px solid #001A5A;
    border-radius: 8px;
    color: #001A5A;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    background: transparent;
    font-family: 'matterregular', sans-serif;
    transition: border-color 0.18s, background 0.18s, color 0.18s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .btn-outline:hover {
    border-color: #0284C7;
    color: #0284C7;
    background: #F0F9FF;
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
    color: #001A5A;
    border-radius: 8px;
    transition: background 0.18s;
  }
  .nav-hamburger:hover { background: rgba(0, 26, 90, 0.06); }

  /* ── Mobile Drawer ── */
  .nav-drawer {
    display: flex;
    flex-direction: column;
    padding: 8px 24px 24px;
    border-top: 1px solid #E2E8F0;
    background: #FFFFFF;
    box-shadow: 0 16px 32px rgba(0, 26, 90, 0.08);
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
    color: #001A5A;
    text-decoration: none;
    font-size: 15px;
    font-weight: 600;
    border-bottom: 1px solid #F1F5F9;
    font-family: 'matterregular', sans-serif;
    border: none;
    background: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: color 0.15s;
  }
  .drawer-link:hover { color: #0284C7; }

  /* ── Mobile Dropdown — CSS-animated (slower) ── */
  .drawer-dropdown-menu {
    display: flex;
    flex-direction: column;
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    overflow: hidden;

    max-height: 0;
    opacity: 0;
    transition:
      max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1),
      opacity    0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .drawer-dropdown-menu.dropdown-visible {
    max-height: 600px;
    opacity: 1;
    margin: 6px 0 10px;
  }

  .drawer-dropdown-item {
    padding: 11px 18px 11px 32px;
    color: #001A5A;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
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
    background: #F0F9FF;
    color: #0284C7;
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
    .nav-inner     { gap: 0; height: 74px; }
  }

  @media (max-width: 480px) {
    .nav-inner      { padding: 0 16px; height: 70px; }
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