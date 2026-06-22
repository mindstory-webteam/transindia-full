"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";

const LOGO_SRC          = "/images/logo/transindia.png";
const ICON_ADDRESS_SRC  = "/images/Footer/location.svg";
const ICON_PHONE_SRC    = "/images/Footer/call.svg";
const ICON_EMAIL_SRC    = "/images/Footer/yellow mail envelope.svg";

const socialIcons: { name: string; src: string; href: string }[] = [
  { name: "X (Twitter)", href: "#", src: "/images/Footer/x.svg" },
  { name: "Instagram",   href: "#", src: "/images/Footer/instagram logo.svg" },
  { name: "Facebook",    href: "#", src: "/images/Footer/facebook logo.svg" },
  { name: "YouTube",     href: "#", src: "/images/Footer/youtube logo.svg" },
  { name: "LinkedIn",    href: "#", src: "/images/Footer/linkedin logo.svg" },
];

interface Service {
  _id: string;
  title: string;
  name?: string;
  slug: string;
  isActive: boolean;
}

const FALLBACK_SERVICES: Service[] = [
  { _id: "1", title: "Life Insurance",   slug: "life-insurance",   isActive: true },
  { _id: "2", title: "Health Insurance", slug: "health-insurance", isActive: true },
  { _id: "3", title: "Motor Insurance",  slug: "motor-insurance",  isActive: true },
  { _id: "4", title: "Travel Insurance", slug: "travel-insurance", isActive: true },
  { _id: "5", title: "Home Insurance",   slug: "home-insurance",   isActive: true },
];

function extractServices(data: unknown): Service[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Service[];
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "services", "result", "results", "items", "payload"]) {
      const val = obj[key];
      if (Array.isArray(val) && val.length > 0) return val as Service[];
    }
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

const companyLinks = [
  { label: "About us", href: "/about" },
  // { label: "Our team", href: "#" },
  { label: "Become a PoSP", href: "#" },
  // { label: "Corporate solutions", href: "#" },
  { label: "Careers", href: "/careers" },
];

const supportLinks = [
  { label: "Make a claim", href: "/claims" },
  // { label: "Track claim", href: "#" },
  { label: "Contact us", href: "/contact-us" },
  { label: "Renew policy", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of use", href: "/terms" },
];

const bottomLinks = [
  { label: "Terms",         href: "/terms" },
  { label: "Privacy",       href: "/privacy-policy" },
  // { label: "Disclaimer",    href: "#" },
  { label: "Cookie policy", href: "/cookie-policy" },
];

const FooterColumn: React.FC<{ title: string; links: { label: string; href: string }[] }> = ({ title, links }) => (
  <div style={{ minWidth: 120 }}>
    <p
      style={{
        color: "#ffffff",
        fontWeight: 600,
        fontSize: 13,
        marginBottom: 14,
        marginTop: 0,
        letterSpacing: "0.02em",
      }}
    >
      {title}
    </p>
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {links.map((link) => (
        <li key={link.label} style={{ marginBottom: 9 }}>
          <Link
            href={link.href}
            style={{
              color: "#9ca3af",
              fontSize: 12.5,
              textDecoration: "none",
              lineHeight: 1.5,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#ffffff")}
            onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#9ca3af")}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const TransindiaFooter: React.FC = () => {
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiUrl  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res     = await fetch(`${apiUrl}/services`, {
          method:  "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) return;

        const raw      = await res.json();
        const fetched  = extractServices(raw);

        if (fetched.length > 0) {
          setServices(fetched.filter((s) => s.isActive !== false));
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[Footer] services fetch error:", err);
        }
      }
    };

    fetchServices();
  }, []);

  const productLinks = services.map(s => ({
    label: s.title || s.name || "",
    href: `/our-services/${s.slug}`
  }));

  return (
    <>
      <style>{RESPONSIVE_CSS}</style>
      <footer className="tf-footer">

        {/* Main content */}
        <div className="tf-main">

          {/* ── Left brand block ── */}
          <div className="tf-brand">
            <div style={{ marginBottom: 14 }}>
              <img
                src={LOGO_SRC}
                alt="Transindia logo"
                style={{ height: 36, width: "auto", objectFit: "contain" }}
              />
            </div>

            <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.65, marginBottom: 20, marginTop: 0 }}>
              IRDAI licensed insurance partner based in Kochi.
              <br />
              Helping individuals and businesses across India find
              <br />
              the right protection since 2009.
            </p>

            {/* ADDRESS */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
              <img src={ICON_ADDRESS_SRC} alt="Address"
                style={{ width: 14, height: 14, objectFit: "contain", marginTop: 2, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.6, color: "#9ca3af" }}>
                1st Floor, Indel House, Changampuzha Nagar,
                <br />
                Kalamassery, Kochi – 682 033
              </p>
            </div>

            {/* PHONE */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
              <img src={ICON_PHONE_SRC} alt="Phone"
                style={{ width: 14, height: 14, objectFit: "contain", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 11.5, color: "#9ca3af" }}>
                1800 425 8084 (Toll-free)
              </p>
            </div>

            {/* EMAIL */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center" }}>
              <img src={ICON_EMAIL_SRC} alt="Email"
                style={{ width: 14, height: 14, objectFit: "contain", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 11.5, color: "#9ca3af" }}>
                care@transindia.com
              </p>
            </div>

            {/* SOCIAL ICONS */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {socialIcons.map((icon) => (
                <a
                  key={icon.name}
                  href={icon.href}
                  title={icon.name}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: "50%", overflow: "hidden",
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                  }}
                >
                  <img src={icon.src} alt={icon.name}
                    style={{ width: 32, height: 32, objectFit: "cover" }} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Right nav columns ── */}
          <div className="tf-nav-cols">
            <FooterColumn title="Products" links={productLinks} />
            <FooterColumn title="Company" links={companyLinks} />
            <FooterColumn title="Support" links={supportLinks} />
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="tf-bottom">
          <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>
            © 2026 Transindia Insurance Broking Pvt. Ltd. All rights reserved.
          </p>
          <div className="tf-bottom-links">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: "#6b7280", fontSize: 11, textDecoration: "none", transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#ffffff")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#6b7280")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ height: 16 }} />
      </footer>
    </>
  );
};

export default TransindiaFooter;

// ─── Responsive CSS ───────────────────────────────────────────────────────────
const RESPONSIVE_CSS = `
  .tf-footer {
    background-color: #0d0f14;
    color: #9ca3af;
   font-family: var(--font-sora), "Sora", sans-serif;
    padding-top: 48px;
    border-top: 1px solid #1f2937;
  }

  /* Main two-column layout */
  .tf-main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 clamp(16px, 4vw, 32px);
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  /* Brand block */
  .tf-brand {
    max-width: 220px;
    min-width: 180px;
    flex: 1 1 180px;
  }

  /* Nav columns wrapper */
  .tf-nav-cols {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    flex: 2 1 400px;
    justify-content: flex-end;
  }

  /* Bottom bar */
  .tf-bottom {
    border-top: 1px solid #1f2937;
    margin-top: 40px;
    padding: 14px clamp(16px, 4vw, 32px);
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .tf-bottom-links {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  /* ── Tablet (≤768px): nav columns go 2-up under brand ── */
  @media (max-width: 768px) {
    .tf-main {
      flex-direction: column;
      gap: 32px;
    }
    .tf-brand {
      max-width: 100%;
      min-width: 0;
    }
    .tf-nav-cols {
      flex: unset;
      width: 100%;
      justify-content: flex-start;
      gap: 32px;
    }
  }

  /* ── Mobile (≤480px): nav columns stack to single column ── */
  @media (max-width: 480px) {
    .tf-nav-cols {
      flex-direction: column;
      gap: 28px;
    }
    .tf-bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    .tf-bottom-links {
      gap: 14px;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .tf-footer * { transition: none !important; }
  }
`;
