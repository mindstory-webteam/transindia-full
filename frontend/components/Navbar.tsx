"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  hasDropdown?: boolean;
  href?: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Services",          hasDropdown: true , href: "/our-services" },
  { label: "Renew existing policy",      },
  { label: "Become an advisor" },
  { label: "About us",              href: "/about"     },
  { label: "Contact us",   href: "/contact-us"  },
];

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Switch from transparent → solid on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <style>{CSS}</style>

      <nav className={`nav-root${scrolled || mobileOpen ? " nav-scrolled" : ""}`}>
        <div className="nav-inner">

          {/* ── Logo ── */}
          <Link href="/" className="nav-logo">
            <img
              src="/images/logo/transindia.png"
              alt="TransIndia logo"
              className="nav-logo-img"
            />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link href={item.href || "#"} className="nav-link">
                  {item.label}
                  {item.hasDropdown && (
                    <svg viewBox="0 0 20 20" fill="currentColor" width={13} height={13} style={{ opacity: 0.65, flexShrink: 0 }}>
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                    </svg>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── CTA Buttons ── */}
          <div className="nav-actions">
            <a href="https://www.transindiainsurance.com/partner/posp-home" className="btn-outline">Become a PoSP</a>
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
              <Link key={item.label} href={item.href || "#"} className="drawer-link" onClick={() => setMobileOpen(false)}>
                {item.label}
                {item.hasDropdown && (
                  <svg viewBox="0 0 20 20" fill="currentColor" width={14} height={14} style={{ opacity: 0.5 }}>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                  </svg>
                )}
              </Link>
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

  /* ── Root nav — floats over page content ── */
  .nav-root {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 200;
     font-family: var(--font-sora), "Sora", sans-serif;

    background: transparent;
    border-bottom: 1px solid transparent;
    box-shadow: none;

    transition:
      background 0.35s ease,
      border-color 0.35s ease,
      box-shadow 0.35s ease;
  }

  /* ── Scrolled state (or drawer open) — theme dark blue ── */
  .nav-scrolled {
    background: #07174A;
    border-bottom: 1px solid rgba(56,189,248,0.12);
    box-shadow: 0 4px 32px rgba(0,0,0,0.45);
  }

  /* ── Inner layout ── */
  .nav-inner {
    max-width: 1480px;
    margin: 0 auto;
    padding: 0 32px;
    height: 68px;
    display: flex;
    align-items: center;
    gap: 32px;
  }

  /* ── Logo ── */
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

  /* ── Nav links list ── */
  .nav-links {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0;
    flex: 1;
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
  }

  .nav-link:hover {
    background: rgba(255,255,255,0.09);
    color: #fff;
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

 

  /* ── Hamburger — hidden on desktop ── */
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

  .nav-hamburger:hover {
    background: rgba(255,255,255,0.1);
  }

  /* ── Mobile Drawer ── */
  .nav-drawer {
    display: flex;
    flex-direction: column;
    padding: 8px 24px 24px;
    border-top: 1px solid rgba(255,255,255,0.08);
    background: #07174A;
    /* Smooth open — max-height animation */
    animation: drawer-open 0.22s ease forwards;
  }

  @keyframes drawer-open {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
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
  }

  .drawer-link:last-of-type {
    border-bottom: none;
  }

  .drawer-actions {
    display: flex;
    gap: 12px;
    margin-top: 22px;
    flex-wrap: wrap;
  }

  /* Drawer CTA buttons stretch full-width on very small screens */
  .drawer-btn {
    flex: 1 1 120px;
    text-align: center;
  }

  /* ── Responsive breakpoints ── */

  /* Large screens: tighten gaps to fit all long links */
  @media (max-width: 1400px) {
    .nav-inner { gap: 16px; padding: 0 24px; }
    .nav-link { padding: 8px 10px; font-size: 13px; }
    .nav-actions { gap: 8px; }
  }

  /* Tablet/mobile: hide desktop nav, show hamburger earlier to avoid overlap */
  @media (max-width: 1150px) {
    .nav-links   { display: none; }
    .nav-actions { display: none; }
    .nav-hamburger { display: flex; }
    .nav-inner { gap: 0; }
  }

  /* Small mobile: tighter padding */
  @media (max-width: 480px) {
    .nav-inner { padding: 0 16px; }
    .drawer-actions { flex-direction: column; gap: 10px; }
    .drawer-btn { flex: unset; width: 100%; }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .nav-drawer { animation: none; }
    .nav-root, .btn-fill, .btn-outline, .nav-link, .nav-hamburger {
      transition: none !important;
    }
  }
`;
