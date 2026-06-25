"use client"
import { useState } from "react";
import Link from "next/link";

// ─── Icons ───────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="10" cy="10" r="10" fill="#22C55E" opacity="0.18" />
    <path d="M6 10.5l2.8 2.8 5-5.6" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="#FBBF24">
    <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z" />
  </svg>
);

// ─── IMAGE SLOTS ─────────────────────────────────────────────────────────────
const STEP_ICONS = [
  "/images/section-4/Test.svg",
  "/images/section-4/Test Account.svg",
  "/images/section-4/Future.svg",
];
const BADGE_ICON_SRC        = "/images/section-4/Glowing Star.svg";
const CLAIM_FIGURE_SRC      = "/images/home/HOME/INSURANCE ADVISOR AVATAR.png";
const BANNER_PEOPLE_SRC     = "/images/home/HOME/Life Insurance.png";
const SATISFACTION_ICON_SRC = "/images/section-4/Beaming face with smiling eyes emoji.svg";
const MORE_TILE_FIGURE_SRC  = "/images/section-4/network/hands holding heart.svg";

const insurerLogos = [
  { name: "HDFC ERGO",     logoSrc: "/images/section-4/network/image 34.svg" },
  { name: "ICICI Lombard", logoSrc: "/images/section-4/network/image 35.svg" },
  { name: "TATA AIA",      logoSrc: "/images/section-4/network/image 36.svg" },
  { name: "SBI Life",      logoSrc: "/images/section-4/network/image 37.svg" },
  { name: "Star Health",   logoSrc: "/images/section-4/network/image 38.svg" },
  { name: "HDFC Life",     logoSrc: "/images/section-4/network/image 39.svg" },
  { name: "Niva Bupa",     logoSrc: "/images/section-4/network/image 40.svg" },
];

// ─── Data ────────────────────────────────────────────────────────────────────
const claimSteps = [
  { title: "Raise a Claim Online",  desc: "File from our app or website in under 2 minutes, anytime 24/7." },
  { title: "Advisor Takes Over",    desc: "Your dedicated advisor handles all insurer communication on your behalf." },
  { title: "Claim Settled Fast",    desc: "Most claims resolved within 24–48 hours.  You get the payout directly." },
];

const advisorBullets = [
  { bold: "24/7 claims assistance", rest: " — reach us any time via call, app, or WhatsApp" },
  { bold: "Genuine comparison across 20+ insurers", rest: " — not just the ones we profit most from" },
  { bold: "Annual policy review", rest: " — we revisit your cover as your life changes" },
];

const expertBullets = [
  { bold: "Free consultation", rest: " — no obligation to buy after speaking to us" },
  { bold: "Genuine comparison across 20+ insurers", rest: " — not just the ones we profit most from" },
  { bold: "Annual policy review", rest: " — we revisit your cover as your life changes" },
];

const partnerBullets = [
  { bold: "Independent broker", rest: " — we work for you, not any single insurance company" },
  { bold: "Real comparison", rest: " — premiums, claim ratios, and exclusions side by side" },
  { bold: "IRDAI licensed", rest: " — all recommendations fully compliant and regulated" },
];

// ─── Shared bullet list ───────────────────────────────────────────────────────
function BulletList({ items }: { items: { bold: string; rest: string }[] }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((b, i) => (
        <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "#64748B", lineHeight: 1.6 }}>
          <CheckIcon />
          <span>
            <span style={{ color: "#1E293B", fontWeight: 600 }}>{b.bold}</span>
            {b.rest}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ height: 1, background: "#E2E8F0", width: "100%", maxWidth: 1280, margin: "0 auto" }} />
);

// ─── Section 1: Claim Process ─────────────────────────────────────────────────
function ClaimSection() {
  return (
    <section className="is-section">
      <div className="is-inner">

        {/* LEFT CARD */}
        <div style={{ ...s.card, position: "relative", overflow: "hidden", minHeight: 400 }}>
          <p style={s.cardHeading}>How our claim process works</p>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {claimSteps.map((step, i) => {
              const isLast = i === claimSteps.length - 1;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 16 }}>
                    <div style={s.stepIconWrap}>
                      <img src={STEP_ICONS[i]} alt={step.title} width={26} height={26} style={{ objectFit: "contain", display: "block" }} />
                    </div>
                    {!isLast && <div style={s.connector} />}
                  </div>
                  {/* The last step sits next to the absolute advisor figure, so its
                      text needs room on the right to wrap instead of running under it.
                      `.is-step-last` adds that right padding (removed on mobile, where
                      the figure is hidden). */}
                  <div
                    className={isLast ? "is-step-last" : undefined}
                    style={{ paddingBottom: isLast ? 0 : 24, paddingTop: 6 }}
                  >
                    <p style={s.stepTitle}>{step.title}</p>
                    <p style={s.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Settlement badge */}
          <div style={s.settleBadge}>
            <img src={BADGE_ICON_SRC} alt="badge" width={30} height={30} style={{ objectFit: "contain", flexShrink: 0 }} />
            <div>
              <p style={s.settlePct}>97% Claim Settlement Rate</p>
              <p style={s.settleSubtext}>Across all insurance categories in 2024</p>
            </div>
          </div>

          {/* 3D advisor figure — bottom-right of card */}
          <img
            src={CLAIM_FIGURE_SRC}
            alt="advisor"
            className="is-claim-figure"
            style={{ position: "absolute", bottom: 0, right: 12, width: 200, objectFit: "contain", pointerEvents: "none" }}
          />
        </div>

        {/* RIGHT TEXT */}
        <div style={s.textBlock}>
          <span style={s.pillOrange}>FAST CLAIM SUPPORT</span>
          <h2 style={s.heading}>
            We stand by you<br />
            when it <span style={s.accentOrange}>matters most</span>
          </h2>
          <p style={s.body}>
            Filing an insurance claim is stressful enough. That's why we assign a dedicated advisor
            who handles every step — from paperwork to follow-up — so you don't have to battle the insurer alone.
          </p>
          <BulletList items={advisorBullets} />
          <div>
            <Link href="/claims">
              <button style={s.btnOrange}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >Make a claim</button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Section 2: Advisors ──────────────────────────────────────────────────────
function AdvisorSection() {
  return (
    <section className="is-section" style={{ background: "#F8FAFC" }}>
      <div className="is-inner is-inner--reverse">

        {/* LEFT TEXT */}
        <div style={s.textBlock}>
          <span style={s.pillGray}>EXPERT ADVICE , FREE</span>
          <h2 style={s.heading} >
            Advisors who listen<br />
            first, <span style={s.accentBlue}>sell second</span>
          </h2>
          <p style={s.body}>
            Our IRDAI-certified advisors will review your exact situation, compare what's available
            across all our insurer partners, and recommend what's genuinely best for you — not what
            earns the biggest commission
          </p>
          <BulletList items={expertBullets} />
          <div>
            <Link href="/contact-us">
              <button
                style={{ ...s.btnOrange, background: "#00BCD4" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >Speak to an expert</button>
            </Link>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div style={{ ...s.card, gap: 0, overflow: "visible" }}>
          <p style={{ ...s.cardHeading, padding: "24px 24px 0" }}>Our coverage quality scores</p>

          <div style={{ position: "relative", margin: "16px 0 0", overflow: "visible" }}>
            <div style={{ ...s.heroBanner, overflow: "hidden", borderRadius: "20px" }}>
              <div style={{ flex: 1 }}>
                <p style={s.heroStat}>50K+</p>
                <p style={s.heroSubtext}>
                  Delivering reliable insurance coverage<br />
                  and peace of mind for every stage of life.
                </p>
              </div>
              <div style={{ width: 148, flexShrink: 0 }} />
            </div>

            <img
              src={BANNER_PEOPLE_SRC}
              alt="people"
              style={{
                position: "absolute",
                bottom: 0,
                right: -58,
                width: 360,
                objectFit: "contain",
                objectPosition: "bottom",
                height: "300px",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Satisfaction */}
          <div style={{ padding: "20px 24px 0" }}>
            <div style={s.satisfRow}>
              <img src={SATISFACTION_ICON_SRC} alt="satisfied" width={24} height={24} style={{ objectFit: "contain", flexShrink: 0 }} />
              <span style={{ flex: 1, fontWeight: 600, color: "#1E293B", fontSize: 14 }}>Clients Satisfaction</span>
              <span style={{ fontWeight: 700, color: "#0EA5E9", fontSize: 16 }}>4.8/5</span>
            </div>
            <div style={{ ...s.progressBg, marginTop: 12 }}>
              <div style={{ ...s.progressFill, width: "88%" }} />
            </div>
          </div>

          {/* Stats */}
          <div style={{ ...s.statsGrid, margin: "20px 0 0" }}>
            <div style={s.statBox}>
              <p style={{...s.statNum , color:"#0D2B5E" }}>15+</p>
              <p style={s.statLabel}>Years of experience</p>
            </div>
            <div style={{ ...s.statBox, borderLeft: "1px solid #E2E8F0" }}>
              <p style={{ ...s.statNum, color: "#F5A623" }}>20+</p>
              <p style={s.statLabel}>Insurer Partners</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Section 3: Insurer Network ───────────────────────────────────────────────
function InsurerSection() {
  return (
    <section className="is-section" style={{ background: "#FFFFFF" }}>
      <div className="is-inner">

        <div style={{ ...s.card, padding: "24px 24px 24px", overflow: "hidden" }}>
          <p style={{ ...s.cardHeading, marginBottom: 4 }}>Our insurer network</p>

          <div style={s.logoGrid}>
            {insurerLogos.map((l, i) => (
              <div key={i} style={s.logoBox}>
                <img
                  src={l.logoSrc}
                  alt={l.name}
                  style={{ maxWidth: "100%", maxHeight: 52, objectFit: "contain" }}
                />
              </div>
            ))}

            <div style={s.moreTile}>
              <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
                <img
                  src={MORE_TILE_FIGURE_SRC}
                  alt="15+ more insurers"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                    borderRadius: 10,
                  }}
                />
                <span style={s.moreLabel}>15+ more</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT TEXT */}
        <div style={s.textBlock}>
          <span style={s.pillGray}>WIDE PARTNER NETWORK</span>

          <h2 style={s.heading}>
            20+ insurers.<br />
            <span style={s.accentOrange}>One trusted </span>
            <span>partner.</span>
          </h2>

          <p style={s.body}>
            We're not tied to any single insurer. Our independence means we genuinely compare plans
            from across the market and find you the right balance of cover, exclusions, and price.
          </p>

          <BulletList items={partnerBullets} />

          <div>
            <button
              style={s.btnDark}
              onMouseEnter={e => (e.currentTarget.style.background = "#334155")}
              onMouseLeave={e => (e.currentTarget.style.background = "#1E293B")}
            >Compare all insurers</button>
          </div>
        </div>

      </div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function InsuranceSections() {
  return (
    <>
      <style>{RESPONSIVE_CSS}</style>
      <main style={{
        fontFamily: "'Sora', sans-serif",
        color: "#1E293B",
        background: "#FFFFFF",
        width: "100%",
      }}>
        <ClaimSection />
        <Divider />
        <AdvisorSection />
        <Divider />
        <InsurerSection />
      </main>
    </>
  );
}

// ─── Responsive CSS ───────────────────────────────────────────────────────────
const RESPONSIVE_CSS = `
  .is-section {
    width: 100%;
    padding: clamp(48px, 8vw, 96px) clamp(16px, 5vw, 48px);
    box-sizing: border-box;
    background: #fff;
  }

  .is-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(32px, 5vw, 72px);
    align-items: center;
  }

  /* Keep the last claim step clear of the advisor figure (130px wide, offset 12px
     from the card edge) so its text wraps onto two lines instead of sliding under
     the image. */
  .is-step-last {
    padding-right: 140px;
  }

  /* On tablet/mobile, stack to single column */
  @media (max-width: 860px) {
    .is-inner {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    /* AdvisorSection: text is first in DOM but visually second on desktop.
       On mobile keep natural DOM order (text first, card second). */
    .is-inner--reverse {
      direction: ltr;
    }
  }

  /* Hide decorative figure on small cards to prevent overflow clipping issues.
     With the figure gone, the last step no longer needs the right padding. */
  @media (max-width: 560px) {
    .is-claim-figure {
      display: none !important;
    }
    .is-step-last {
      padding-right: 0;
    }
  }

  /* Touch: disable hover opacity flicker on buttons */
  @media (hover: none) {
    button:hover { opacity: 1 !important; background: inherit; }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; }
  }
`;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  // ── Card ──
  card: {
    background: "#FFFFFF",
    borderRadius: 24,
    padding: "28px 24px",
    boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    border: "1px solid #F1F5F9",
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1E293B",
    margin: 0,
  },

  // ── Claim steps ──
  stepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 28,
    background: "linear-gradient(to bottom, #CBD5E1, transparent)",
    margin: "4px 0",
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1E293B",
    margin: "0 0 3px",
  },
  stepDesc: {
    fontSize: 13,
    color: "#64748B",
    margin: 0,
    lineHeight: 1.6,
  },

  // ── Settlement badge ──
  settleBadge: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    background: "#FFFBEB",
    borderRadius: 14,
    padding: "14px 18px",
  },
  settlePct: {
    fontSize: 13,
    fontWeight: 700,
    color: "#92400E",
    margin: 0,
  },
  settleSubtext: {
    fontSize: 11,
    color: "#B45309",
    margin: 0,
  },

  // ── Text block ──
  textBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  // Pills
  pillOrange: {
    display: "inline-block",
    background: "#FEF0ED",
    color: "#B74E3B",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    padding: "6px 16px",
    borderRadius: 99,
    width: "fit-content",
    border: "1px solid #FED7AA",
  },
  pillGray: {
    display: "inline-block",
    background: "#E0F7FA",
    color: "#158693",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    padding: "6px 16px",
    borderRadius: 99,
    width: "fit-content",
    border: "1px solid #E2E8F0",
  },

  heading: {
    fontSize: 38,
    fontWeight: 800,
    lineHeight: 1.15,
    color: "#1E293B",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  accentOrange: { color: "#F15A3E" },
  accentBlue:   { color: "#00BCD4" },
  body: {
    fontSize: 18,
    color: "#535862",
    lineHeight: 1.78,
    margin: 0,
  },
  btnOrange: {
    display: "inline-block",
    background: "#EC4F34",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    padding: "13px 32px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },

  // ── Advisor card internals ──
  heroBanner: {
    background: "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)",
    padding: "22px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    minHeight: 140,
  },
  heroStat: {
    fontSize: 40,
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 10px",
    letterSpacing: "-0.03em",
  },
  heroSubtext: {
    fontSize: 12,
    color: "rgba(255,255,255,0.78)",
    margin: 0,
    lineHeight: 1.65,
  },
  satisfRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  progressBg: {
    height: 8,
    background: "#E2E8F0",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #0EA5E9, #38BDF8)",
    borderRadius: 99,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    borderTop: "1px solid #E2E8F0",
    paddingTop: 20,
    paddingBottom: 20,
  },
  statBox: {
    textAlign: "center",
    padding: "8px 0",
  },
  statNum: {
    fontSize: 30,
    fontWeight: 800,
    color: "#1E293B",
    margin: "0 0 4px",
    letterSpacing: "-0.02em",
  },
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
    margin: 0,
  },

  // ── Insurer logo grid ──
  logoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridAutoRows: "110px",
    gap: 10,
  },
  logoBox: {
    borderRadius: 14,
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFFFFF",
    border: "1px solid #E8ECF0",
  },
  moreTile: {
    position: "relative",
    borderRadius: 14,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    overflow: "hidden",
    background: "#CCFBF1",
    border: "1px solid #99F6E4",
    padding: 0,
  },
  moreLabel: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: 20,
    lineHeight: 1,
    zIndex: 2,
    whiteSpace: "nowrap",
    textShadow: "0 1px 6px rgba(0,0,0,0.4)",
  },

  btnDark: {
    display: "inline-block",
    background: "#1E293B",
    color: "#F1F5F9",
    fontWeight: 700,
    fontSize: 15,
    padding: "13px 32px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    cursor: "pointer",
    transition: "background 0.15s",
  },
};