"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Set this to your DEPLOYED Express server origin in .env.local, e.g.
//   NEXT_PUBLIC_API_URL=https://your-api.onrender.com
// (No trailing slash needed — it's stripped below.)
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

// Services router is mounted at /api/services.
const SERVICE_ENDPOINTS = [`${API_BASE}/services`];

// Base path of your service detail page (the [slug] route).
// Must match the navbar, which links to /our-services/<slug>.
// A card linking to "Health Insurance" with slug "health-insurance"
// will navigate to:  /our-services/health-insurance
const SERVICE_DETAIL_BASE = "/our-services";

// Background tints cycled across however many services the API returns.
const CARD_TINTS = ["#FFF0F0", "#F0F8FF", "#F5F0FF", "#FFFBF0"];

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Plan = {
  label: string;
  desc: string;
  cta: string;
  href: string; // resolved detail-page URL (built from slug)
  slug: string; // kept around in case you need it elsewhere
  imageSrc: string;
  imageAlt: string;
  imageBg: string;
};

// ─── FALLBACK DATA (used if the API call fails) ───────────────────────────────
// Each fallback now has a real slug so the "Know more" button still
// navigates to /services/<slug> even when the API is unreachable.
const FALLBACK_PLANS: Plan[] = [
  {
    label:    "Health Insurance",
    desc:     "Cover medical expenses, hospitalisation, and critical illnesses for individuals and families.",
    cta:      "Know more",
    slug:     "health-insurance",
    href:     `${SERVICE_DETAIL_BASE}/health-insurance`, // → /our-services/health-insurance
    imageSrc: "/images/section-2/Health insurance and healthcare.png",
    imageAlt: "Health Insurance illustration",
    imageBg:  "#FFF0F0",
  },
  {
    label:    "Motor Insurance",
    desc:     "Protect your vehicle against damage, theft, and third-party liability with comprehensive motor coverage.",
    cta:      "Know more",
    slug:     "motor-insurance",
    href:     `${SERVICE_DETAIL_BASE}/motor-insurance`,
    imageSrc: "/images/section-2/Group.png",
    imageAlt: "Motor Insurance illustration",
    imageBg:  "#F0F8FF",
  },
  {
    label:    "Life Insurance",
    desc:     "Build financial security for your loved ones and plan a retirement without worries.",
    cta:      "Know more",
    slug:     "life-insurance",
    href:     `${SERVICE_DETAIL_BASE}/life-insurance`,
    imageSrc: "/images/section-2/life-bike.png",
    imageAlt: "Life Insurance illustration",
    imageBg:  "#F5F0FF",
  },
  {
    label:    "Home Insurance",
    desc:     "Insure your home structure and household property against damage, fire, and natural disasters.",
    cta:      "Know more",
    slug:     "home-insurance",
    href:     `${SERVICE_DETAIL_BASE}/home-insurance`,
    imageSrc: "/images/section-2/House insurance or property insurance.png",
    imageAlt: "Home Insurance illustration",
    imageBg:  "#FFFBF0",
  },
];

const TRUST_ITEMS = [
  {
    label:    "24/7\nClaim Assistance",
    imageSrc: "/images/section-3/customer-support.svg",
    imageAlt: "24/7 Claim Assistance",
    iconBg:   "#E6F2FB",   // light blue
  },
  {
    label:    "Trusted\nCoverage",
    imageSrc: "/images/section-3/knight-shield.svg",
    imageAlt: "Trusted Coverage",
    iconBg:   "#E7F6EC",   // light green
  },
  {
    label:    "Fast\nApprovals",
    imageSrc: "/images/section-3/timer-02.svg",
    imageAlt: "Fast Approvals",
    iconBg:   "#ECE9FB",   // light purple
  },
  {
    label:    "Personalized\nPlans",
    imageSrc: "/images/section-3/user.svg",
    imageAlt: "Personalized Plans",
    iconBg:   "#FCEEE4",   // light peach
  },
];

// ─── HELPERS: normalise the API response ──────────────────────────────────────

// Accepts the many shapes a backend might return and returns a flat array.
function extractList(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.services)) return json.services;
  if (Array.isArray(json?.results)) return json.results;
  if (Array.isArray(json?.data?.services)) return json.data.services;
  return [];
}

// Image may be a plain URL string or a Cloudinary-style object { url } / { secure_url }.
function getImageSrc(s: any): string {
  const img =
    s.image ?? s.imageUrl ?? s.imageSrc ?? s.thumbnail ??
    (Array.isArray(s.images) ? s.images[0] : null);
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.url ?? img.secure_url ?? img.src ?? "";
}

// Turn an arbitrary name into a URL-safe slug.
// Used only as a last-resort fallback when the API gives us no slug/id.
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics → hyphen
    .replace(/^-+|-+$/g, "");    // trim leading/trailing hyphens
}

// Resolve the slug for a service: prefer an explicit slug, then an id,
// then fall back to a slugified name so the link is never dead.
function getSlug(s: any): string {
  const raw =
    s.slug ?? s._id ?? s.id ?? s.serviceId ?? slugify(s.title ?? s.name ?? s.label ?? "");
  return String(raw);
}

function mapServiceToPlan(s: any, i: number): Plan {
  const name = s.title ?? s.name ?? s.label ?? "Service";
  const slug = getSlug(s);
  return {
    label:    name,
    desc:     s.description ?? s.desc ?? s.shortDescription ?? s.summary ?? "",
    cta:      "Know more",
    slug,
    href:     slug ? `${SERVICE_DETAIL_BASE}/${slug}` : "#",
    imageSrc: getImageSrc(s),
    imageAlt: `${name} illustration`,
    imageBg:  CARD_TINTS[i % CARD_TINTS.length],
  };
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function InsurancePlansSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from the API.
  // Note: a failed request (404 / network error) must NOT crash the page — we
  // warn and fall back to FALLBACK_PLANS so the section always renders.
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      let json: any = null;

      for (const url of SERVICE_ENDPOINTS) {
        try {
          const res = await fetch(url, { signal: controller.signal });
          if (res.ok) {
            json = await res.json();
            break;
          }
          // non-OK (e.g. 404): just try the next candidate
        } catch (err: any) {
          if (err?.name === "AbortError") return; // unmounted — stop quietly
          // network error: try the next candidate
        }
      }

      if (json) {
        const list = extractList(json);
        const mapped = list.map(mapServiceToPlan);
        setPlans(mapped.length ? mapped : FALLBACK_PLANS);
      } else {
        console.warn(
          "[InsurancePlansSection] Could not reach the services API " +
          `(tried: ${SERVICE_ENDPOINTS.join(", ")}). Showing fallback content. ` +
          "Set NEXT_PUBLIC_API_URL and/or fix the path in SERVICE_ENDPOINTS."
        );
        setPlans(FALLBACK_PLANS);
      }

      setLoading(false);
    })();

    return () => controller.abort();
  }, []);

  // Scroll-reveal animation — re-attach whenever the rendered content changes
  // (the fetched cards mount after the first paint, so the observer must re-run).
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>(".fade-up");
    if (!els || els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [plans, loading]);

  return (
    <>
      <style>{CSS}</style>
      <section className="ips-section" ref={sectionRef}>
        <div className="ips-container">

          {/* ── TOP ROW: heading left + button right ── */}
          <div className="ips-toprow fade-up" style={{ "--d": "0s" } as React.CSSProperties}>
            <div className="ips-heading">
              <h2 className="ips-title">
                Every risk, <span className="ips-orange">covered.</span><br />
                Every life, <span className="ips-teal">protected.</span>
              </h2>
              <p className="ips-subtitle">
                Comprehensive protection across every aspect of<br className="ips-br" />
                your life and business.
              </p>
            </div>
            {/* "View all plans" → list page */}
            <Link href={SERVICE_DETAIL_BASE} className="ips-view-all">View all plans</Link>
          </div>

          {/* ── CARDS GRID ── */}
          <div className="ips-cards">
            {loading
              ? /* Skeleton placeholders while fetching */
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={`skel-${i}`} className="ips-skel">
                    <div className="ips-skel-img" />
                    <div className="ips-skel-body">
                      <div className="ips-skel-line title" />
                      <div className="ips-skel-line" />
                      <div className="ips-skel-line short" />
                      <div className="ips-skel-line cta" />
                    </div>
                  </div>
                ))
              : plans.map((plan, i) => (
                  <div
                    key={plan.slug || i}
                    className="ips-card fade-up"
                    style={{ "--d": `${0.1 + i * 0.1}s` } as React.CSSProperties}
                  >
                    {/* Image zone — each card has its own bg tint.
                        Wrapping it in the Link too means the whole image is
                        clickable and leads to the same detail page. */}
                    <Link
                      href={plan.href}
                      className="ips-card-img-link"
                      aria-label={`Explore ${plan.label} plans`}
                    >
                      <div className="ips-card-img-wrap" style={{ background: plan.imageBg }}>
                        {plan.imageSrc ? (
                          <img
                            src={plan.imageSrc}
                            alt={plan.imageAlt}
                            className="ips-card-img"
                          />
                        ) : null}
                      </div>
                    </Link>

                    {/* White body */}
                    <div className="ips-card-body">
                      <h3 className="ips-card-title">{plan.label}</h3>
                      <p className="ips-card-desc">{plan.desc}</p>
                      {/* Know more → navigates to /our-services/<slug> */}
                      <Link href={plan.href} className="ips-card-cta">
                        {plan.cta}
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M3.5 9H14.5M14.5 9L10 4.5M14.5 9L10 13.5"
                            stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
          </div>

          {/* ── TRUST BANNER ── */}
          <div className="ips-banner fade-up" style={{ "--d": "0.5s" } as React.CSSProperties}>

            {/* Left: shield image + text */}
            <div className="ips-banner-left">
              <img
                src="/images/section-3/magnific_create-a-clean-3d-shield-_cDOaj6u0eP.png"
                alt="Protection shield"
                className="ips-banner-shield"
              />
              <div className="ips-banner-text">
                <p className="ips-banner-title">
                  Protection that stays with you,<br />
                  <span className="ips-teal">every step of the way.</span>
                </p>
                <p className="ips-banner-desc">
                  Reliable coverage, expert support, and quick claim assistance
                  whenever you need it.
                </p>
              </div>
            </div>

            {/* Vertical divider (desktop only) */}
            <div className="ips-banner-divider" />

            {/* Right: 4 icon stats — icons are images */}
            <div className="ips-banner-stats">
              {TRUST_ITEMS.map((item, i) => (
                <div key={i} className="ips-banner-stat">
                  <div className="ips-stat-icon-wrap" style={{ background: item.iconBg }}>
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="ips-stat-icon"
                    />
                  </div>
                  <span className="ips-stat-label">
                    {item.label.split("\n").map((line, j) => (
                      <span key={j}>{line}{j === 0 && <br />}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,800&display=swap');

  .ips-section {
    background: linear-gradient(109deg, #FFE9E5 0%, #B2F6FF 150%);
    padding: clamp(60px, 8vw, 100px) 0 clamp(64px, 9vw, 108px);
     font-family: var(--font-sora), "Sora", sans-serif;
  }

  .ips-container {
    max-width: 1500px;
    margin: 0 auto;
    padding: 0 clamp(20px, 5vw, 88px);
  }

  /* ── Top row ── */
  .ips-toprow {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: clamp(36px, 5vw, 56px);
    flex-wrap: wrap;
  }

  .ips-heading { flex: 1; min-width: 260px; }

  .ips-title {
    font-size:38px;
    font-weight: 900;
    color: #111827;
    line-height: 1.15;
    margin: 0 0 14px;
    letter-spacing: -0.03em;
  }

  .ips-orange { color: #F15A3E; }
  .ips-teal   { color: #00BCD4; }

  .ips-subtitle {
    font-size: 18px;
    color: #535862;
    line-height: 1.7;
    margin: 0;
    font-weight: 400;
  }

  .ips-br { display: none; }
  @media(min-width:640px){ .ips-br { display: inline; } }

  /* "View all plans" button */
  .ips-view-all {
    flex-shrink: 0;
    padding: 13px 28px;
    border: 2px solid #1A1A2E;
    border-radius: 12px;
    color: #1A1A2E;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    background: transparent;
    transition: background 0.2s, color 0.2s;
    align-self: flex-start;
    margin-top: 4px;
  }

  .ips-view-all:hover {
    background: #1A1A2E;
    color: #fff;
  }

  /* On mobile, "View all" stretches full width below the heading */
  @media(max-width: 540px) {
    .ips-toprow {
      flex-direction: column;
      align-items: flex-start;
    }
    .ips-view-all {
      width: 100%;
      text-align: center;
    }
  }

  /* ── Cards grid — 4 equal-height columns ── */
  .ips-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(12px, 1.8vw, 20px);
    margin-bottom: clamp(24px, 3.5vw, 40px);
    align-items: stretch;
  }

  /* Tablet: 2 columns */
  @media(max-width: 960px) {
    .ips-cards { grid-template-columns: repeat(2, 1fr); }
  }

  /* Mobile: 1 column */
  @media(max-width: 520px) {
    .ips-cards {
      grid-template-columns: 1fr;
      max-width: 400px;
      margin-inline: auto;
      margin-bottom: clamp(24px, 3.5vw, 40px);
    }
  }

  /* ── Single card ── */
  .ips-card {
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    transition: transform 0.26s ease, box-shadow 0.26s ease;
  }

  .ips-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.11);
  }

  @media(hover: none) {
    .ips-card:hover {
      transform: none;
      box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    }
  }

  /* Make the image link behave like a block so the tint zone is clickable */
  .ips-card-img-link {
    display: block;
    text-decoration: none;
  }

  /* Image zone */
  .ips-card-img-wrap {
    width: 100%;
    height: clamp(110px, 12vw, 130px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 20px 16px;
    flex-shrink: 0;
  }

  .ips-card-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center bottom;
    display: block;
  }

  /* White body */
  .ips-card-body {
    padding: clamp(16px, 2vw, 20px) clamp(16px, 2vw, 22px) clamp(20px, 2.5vw, 26px);
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    background: #fff;
  }

  .ips-card-title {
    font-size: clamp(15px, 1.4vw, 19px);
    font-weight: 700;
    color: #111827;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .ips-card-desc {
    font-size: clamp(12.5px, 1.05vw, 14.5px);
    color: #6B7280;
    line-height: 1.72;
    margin: 0;
    flex: 1;
  }

  .ips-card-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 700;
    color: #F4622A;
    text-decoration: none;
    margin-top: 6px;
    transition: gap 0.2s ease;
  }

  .ips-card-cta:hover { gap: 10px; }

  /* ── Skeleton (loading) cards ── */
  .ips-skel {
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 260px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  }

  .ips-skel-img {
    height: clamp(110px, 12vw, 130px);
    background: #eef1f5;
    flex-shrink: 0;
  }

  .ips-skel-body {
    padding: 20px 22px 26px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }

  .ips-skel-line {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, #eef1f5 25%, #e2e7ee 37%, #eef1f5 63%);
    background-size: 400% 100%;
    animation: ips-shimmer 1.4s ease infinite;
  }

  .ips-skel-line.title { height: 18px; width: 60%; }
  .ips-skel-line.short { width: 80%; }
  .ips-skel-line.cta   { width: 40%; margin-top: auto; }

  @keyframes ips-shimmer {
    0%   { background-position: 100% 0; }
    100% { background-position: 0 0; }
  }

  /* ── Trust Banner ── */
  .ips-banner {
    background: linear-gradient(135deg, #EBF5FF 0%, #EEF8FF 100%);
    border-radius: 20px;
    padding: clamp(20px, 3vw, 36px) clamp(20px, 4vw, 44px);
    display: flex;
    align-items: center;
    gap: clamp(16px, 3vw, 40px);
    flex-wrap: wrap;
    box-shadow: 0 2px 20px rgba(0,0,0,0.05);
  }

  /* Left: shield + text */
  .ips-banner-left {
    display: flex;
    align-items: center;
    gap: 18px;
    flex: 1;
    min-width: 220px;
  }

  .ips-banner-shield {
    width: clamp(52px, 7vw, 90px);
    height: auto;
    flex-shrink: 0;
    object-fit: contain;
  }

  .ips-banner-title {
    font-size: clamp(14px, 1.5vw, 19px);
    font-weight: 800;
    color: #0B2563;
    line-height: 1.3;
    margin: 0 0 8px;
  }

  .ips-banner-desc {
    font-size: clamp(12px, 0.95vw, 13.5px);
    color: #6B7280;
    line-height: 1.65;
    margin: 0;
  }

  /* Vertical divider */
  .ips-banner-divider {
    width: 1px;
    height: 72px;
    background: rgba(0,0,0,0.1);
    flex-shrink: 0;
    align-self: center;
  }

  @media(max-width: 720px) { .ips-banner-divider { display: none; } }

  /* Right: stats with image icons */
  .ips-banner-stats {
    display: flex;
    gap: clamp(12px, 3.5vw, 44px);
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .ips-banner-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
    min-width: 60px;
  }

  /* Circular icon container */
  .ips-stat-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #fff;            /* overridden per-item via inline style */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ips-stat-icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
    display: block;
  }

  .ips-stat-label {
    font-size: 12.5px;
    font-weight: 700;
    color: #374151;
    line-height: 1.45;
  }

  /* ──────────────────────────────────────────────────────────────────────
     MOBILE BANNER  (≤ 640px)
     Shield centered on top → heading/desc → each stat stacked vertically
     with a thin divider line between them (matches the mobile mockup).
     ────────────────────────────────────────────────────────────────────── */
  @media(max-width: 640px) {
    .ips-banner {
      flex-direction: column;
      align-items: stretch;
      gap: 18px;
      padding: 28px 22px;
    }

    /* shield on top (centered), text below (left-aligned) */
    .ips-banner-left {
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 14px;
      min-width: 0;
    }

    .ips-banner-shield {
      width: 120px;
    }

    .ips-banner-text {
      width: 100%;
      text-align: left;
    }

    /* stats become a vertical list */
    .ips-banner-stats {
      flex-direction: column;
      width: 100%;
      gap: 0;
      flex-wrap: nowrap;
    }

    .ips-banner-stat {
      width: 100%;
      padding: 22px 0;
      border-top: 1px solid rgba(0,0,0,0.08);
    }
  }

  /* ── Scroll animation ── */
  .fade-up {
    opacity: 0;
    transform: translateY(24px);
    animation: ips-fadein 0.6s cubic-bezier(0.22,1,0.36,1) var(--d, 0s) forwards;
    animation-play-state: paused;
  }

  @keyframes ips-fadein {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Reduced motion ── */
  @media(prefers-reduced-motion: reduce) {
    .fade-up {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
`;