"use client";
import {useState} from "react";
import Link from "next/link";
import {BiBulb} from "react-icons/bi";

// ─── Icons ───────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    style={{flexShrink: 0, marginTop: 1}}
  >
    <circle cx="10" cy="10" r="10" fill="#22C55E" opacity="0.18" />
    <path
      d="M6 10.5l2.8 2.8 5-5.6"
      stroke="#22C55E"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
const BADGE_ICON_SRC = "/images/section-4/Glowing Star.svg";
const CLAIM_FIGURE_SRC = "/images/home/HOME/INSURANCE ADVISOR AVATAR.png";
const BANNER_PEOPLE_SRC = "/images/home/HOME/Life Insurance.png";
const SATISFACTION_ICON_SRC =
  "/images/section-4/Beaming face with smiling eyes emoji.svg";
const MORE_TILE_FIGURE_SRC =
  "/images/section-4/network/hands holding heart.svg";
const MASCOT_IMG_SRC = "/images/home/insurance-mascot.png";

// ─── Relationship Stepper Icons (inline SVG, 24x24 grid) ─────────────────────
const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Understand — BiBulb from react-icons
const UnderstandIcon = () => <BiBulb size={18} color="#10B981" />;

// Compare — clipboard with two columns
const CompareIcon = () => (
  <svg {...iconProps} stroke="#0284C7">
    <rect x="4.5" y="4" width="15" height="17.5" rx="2.5" />
    <path d="M9 4v-.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V4" />
    <path d="M12 9v9" />
    <path d="M7.5 11.5h2.5" />
    <path d="M7.5 15h2.5" />
    <path d="M14 11.5h2.5" />
    <path d="M14 15h2.5" />
  </svg>
);

// Choose — shield with check
const ChooseIcon = () => (
  <svg {...iconProps} stroke="#2563EB">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// Manage — gear
const ManageIcon = () => (
  <svg {...iconProps} stroke="#0F3A60">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// Renew — circular arrows
const RenewIcon = () => (
  <svg {...iconProps} stroke="#6366F1">
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
    <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// Claim — award medal
const ClaimIcon = () => (
  <svg {...iconProps} stroke="#9333EA">
    <circle cx="12" cy="8" r="6" />
    <path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.12" />
  </svg>
);

const insurerLogos = [
  {name: "HDFC ERGO", logoSrc: "/images/section-4/network/image 34.svg"},
  {name: "ICICI Lombard", logoSrc: "/images/section-4/network/image 35.svg"},
  {name: "TATA AIA", logoSrc: "/images/section-4/network/image 36.svg"},
  {name: "SBI Life", logoSrc: "/images/section-4/network/image 37.svg"},
  {name: "Star Health", logoSrc: "/images/section-4/network/image 38.svg"},
  {name: "HDFC Life", logoSrc: "/images/section-4/network/image 39.svg"},
  {name: "Niva Bupa", logoSrc: "/images/section-4/network/image 40.svg"},
];

// ─── Data ────────────────────────────────────────────────────────────────────
const claimSteps = [
  {
    title: "Raise a Claim Online",
    desc: "File from our app or website in under 2 minutes, anytime 24/7.",
  },
  {
    title: "Advisor Takes Over",
    desc: "Your dedicated advisor handles all insurer communication on your behalf.",
  },
  {
    title: "Claim Settled Fast",
    desc: "Most claims resolved within 24–48 hours.  You get the payout directly.",
  },
];

const advisorBullets = [
  {
    bold: "24/7 claims assistance",
    rest: " — reach us any time via call, app, or WhatsApp",
  },
  {
    bold: "Genuine comparison across 20+ insurers",
    rest: " — not just the ones we profit most from",
  },
  {
    bold: "Annual policy review",
    rest: " — we revisit your cover as your life changes",
  },
];

const expertBullets = [
  {
    bold: "Free consultation",
    rest: " — no obligation to buy after speaking to us",
  },
  {
    bold: "Genuine comparison across 20+ insurers",
    rest: " — not just the ones we profit most from",
  },
  {
    bold: "Annual policy review",
    rest: " — we revisit your cover as your life changes",
  },
];

const partnerBullets = [
  {
    bold: "Independent broker",
    rest: " — we work for you, not any single insurance company",
  },
  {
    bold: "Real comparison",
    rest: " — premiums, claim ratios, and exclusions side by side",
  },
  {
    bold: "IRDAI licensed",
    rest: " — all recommendations fully compliant and regulated",
  },
];

// ─── Shared bullet list ───────────────────────────────────────────────────────
function BulletList({items}: {items: {bold: string; rest: string}[]}) {
  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {items.map((b, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            fontSize: 15,
            color: "#64748B",
            lineHeight: 1.6,
          }}
        >
          <CheckIcon />
          <span>
            <span style={{color: "#1E293B", fontWeight: 600}}>{b.bold}</span>
            {b.rest}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
const Divider = () => (
  <div
    style={{
      height: 1,
      background: "#E2E8F0",
      width: "100%",
      maxWidth: 1280,
      margin: "0 auto",
    }}
  />
);

// ─── Section 1: Claim Process ─────────────────────────────────────────────────
function ClaimSection() {
  return (
    <section className="is-section">
      <div className="is-inner">
        {/* LEFT CARD */}
        <div
          style={{
            ...s.card,
            position: "relative",
            overflow: "hidden",
            minHeight: 400,
          }}
        >
          <p style={s.cardHeading}>How our claim process works</p>

          <div style={{display: "flex", flexDirection: "column"}}>
            {claimSteps.map((step, i) => {
              const isLast = i === claimSteps.length - 1;
              return (
                <div
                  key={i}
                  style={{display: "flex", alignItems: "flex-start"}}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginRight: 16,
                    }}
                  >
                    <div style={s.stepIconWrap}>
                      <img
                        src={STEP_ICONS[i]}
                        alt={step.title}
                        width={26}
                        height={26}
                        style={{objectFit: "contain", display: "block"}}
                      />
                    </div>
                    {!isLast && <div style={s.connector} />}
                  </div>
                  {/* The last step sits next to the absolute advisor figure, so its
                      text needs room on the right to wrap instead of running under it.
                      `.is-step-last` adds that right padding (removed on mobile, where
                      the figure is hidden). */}
                  <div
                    className={isLast ? "is-step-last" : undefined}
                    style={{paddingBottom: isLast ? 0 : 24, paddingTop: 6}}
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
            <img
              src={BADGE_ICON_SRC}
              alt="badge"
              width={30}
              height={30}
              style={{objectFit: "contain", flexShrink: 0}}
            />
            <div>
              <p style={s.settlePct}>97% Claim Settlement Rate</p>
              <p style={s.settleSubtext}>
                Across all insurance categories in 2024
              </p>
            </div>
          </div>

          {/* 3D advisor figure — bottom-right of card */}
          <img
            src={CLAIM_FIGURE_SRC}
            alt="advisor"
            className="is-claim-figure"
            style={{
              position: "absolute",
              bottom: 0,
              right: 12,
              width: 200,
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* RIGHT TEXT */}
        <div style={s.textBlock}>
          <span style={s.pillOrange}>FAST CLAIM SUPPORT</span>
          <h2 style={s.heading}>
            We stand by you
            <br />
            when it <span style={s.accentOrange}>matters most</span>
          </h2>
          <p style={s.body}>
            Filing an insurance claim is stressful enough. That's why we assign
            a dedicated advisor who handles every step — from paperwork to
            follow-up — so you don't have to battle the insurer alone.
          </p>
          <BulletList items={advisorBullets} />
          <div>
            <Link href="/claims">
              <button
                style={s.btnOrange}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Make a claim
              </button>
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
    <section className="is-section" style={{background: "#F8FAFC"}}>
      <div className="is-inner is-inner--reverse">
        {/* LEFT TEXT */}
        <div style={s.textBlock}>
          <span style={s.pillGray}>EXPERT ADVICE , FREE</span>
          <h2 style={s.heading}>
            Advisors who listen
            <br />
            first, <span style={s.accentBlue}>sell second</span>
          </h2>
          <p style={s.body}>
            Our IRDAI-certified advisors will review your exact situation,
            compare what's available across all our insurer partners, and
            recommend what's genuinely best for you — not what earns the biggest
            commission
          </p>
          <BulletList items={expertBullets} />
          <div>
            <Link href="/contact-us">
              <button
                style={{...s.btnOrange, background: "#00BCD4"}}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Speak to an expert
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div style={{...s.card, gap: 0, overflow: "visible"}}>
          <p style={{...s.cardHeading, padding: "24px 24px 0"}}>
            Our coverage quality scores
          </p>

          <div
            style={{
              position: "relative",
              margin: "16px 0 0",
              overflow: "visible",
            }}
          >
            <div
              style={{
                ...s.heroBanner,
                overflow: "hidden",
                borderRadius: "20px",
              }}
            >
              <div style={{flex: 1}}>
                <p style={s.heroStat}>50K+</p>
                <p style={s.heroSubtext}>
                  Delivering reliable insurance coverage
                  <br />
                  and peace of mind for every stage of life.
                </p>
              </div>
              <div style={{width: 148, flexShrink: 0}} />
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
          <div style={{padding: "20px 24px 0"}}>
            <div style={s.satisfRow}>
              <img
                src={SATISFACTION_ICON_SRC}
                alt="satisfied"
                width={24}
                height={24}
                style={{objectFit: "contain", flexShrink: 0}}
              />
              <span
                style={{
                  flex: 1,
                  fontWeight: 600,
                  color: "#1E293B",
                  fontSize: 14,
                }}
              >
                Clients Satisfaction
              </span>
              <span style={{fontWeight: 700, color: "#0EA5E9", fontSize: 16}}>
                4.8/5
              </span>
            </div>
            <div style={{...s.progressBg, marginTop: 12}}>
              <div style={{...s.progressFill, width: "88%"}} />
            </div>
          </div>

          {/* Stats */}
          <div style={{...s.statsGrid, margin: "20px 0 0"}}>
            <div style={s.statBox}>
              <p style={{...s.statNum, color: "#0D2B5E"}}>10+</p>
              <p style={s.statLabel}>Years of experience</p>
            </div>
            <div style={{...s.statBox, borderLeft: "1px solid #E2E8F0"}}>
              <p style={{...s.statNum, color: "#F5A623"}}>20+</p>
              <p style={s.statLabel}>Insurer Partners</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Relationship Journey Banner (Bottom of AdvisorSection) ─── */}
      <div style={{maxWidth: 1200, margin: "56px auto 0", width: "100%"}}>
        <RelationshipBanner />
      </div>
    </section>
  );
}

// ─── Relationship Journey Banner Component ────────────────────────────────────
function RelationshipBanner() {
  const steps = [
    {
      title: "Understand",
      color: "#10B981",
      bg: "#ECFDF5",
      border: "#A7F3D0",
      icon: <UnderstandIcon />,
    },
    {
      title: "Compare",
      color: "#0284C7",
      bg: "#F0F9FF",
      border: "#BAE6FD",
      icon: <CompareIcon />,
    },
    {
      title: "Choose",
      color: "#2563EB",
      bg: "#EFF6FF",
      border: "#BFDBFE",
      icon: <ChooseIcon />,
    },
    {
      title: "Manage",
      color: "#0F3A60",
      bg: "#EAF2FA",
      border: "#B8D2EA",
      icon: <ManageIcon />,
    },
    {
      title: "Renew",
      color: "#6366F1",
      bg: "#EEF2FF",
      border: "#C7D2FE",
      icon: <RenewIcon />,
    },
    {
      title: "Claim",
      color: "#9333EA",
      bg: "#FAF5FF",
      border: "#E9D5FF",
      icon: <ClaimIcon />,
    },
  ];

  // ── Arc geometry ──
  // A circular arc that bulges to the right. The 6 step nodes sit on the arc, so the
  // middle items (Choose / Manage) are pushed furthest right, and the first / last
  // items (Understand / Claim) sit closest to the left edge — same as the reference.
  const ARC_R = 200; // radius of the arc circle
  const ARC_H = 280; // total height of the stepper
  const ARC_X0 = 8; // x position of the arc's top / bottom end points
  const ARC_W = 200; // total width of the stepper block
  const ROW_GAP = 48; // vertical distance between nodes
  const FIRST_Y = 20; // y of the first node
  const ICON = 36; // icon circle size
  const ICON_OFFSET = 18; // gap between the arc node and the icon circle

  const edge = Math.sqrt(ARC_R * ARC_R - (ARC_H / 2) * (ARC_H / 2));
  const nodeY = (i: number) => FIRST_Y + i * ROW_GAP;
  const nodeX = (y: number) =>
    ARC_X0 +
    Math.sqrt(ARC_R * ARC_R - (y - ARC_H / 2) * (y - ARC_H / 2)) -
    edge;

  const arcPath = `M ${ARC_X0} 0 A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_X0} ${ARC_H}`;

  return (
    <div className="rb-banner">
      {/* Decorative ambient background glows */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: "22%",
          width: 380,
          height: 220,
          background:
            "radial-gradient(circle, rgba(186, 230, 253, 0.45) 0%, rgba(235, 248, 255, 0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: 60,
          width: 300,
          height: 180,
          background:
            "radial-gradient(circle, rgba(224, 242, 254, 0.5) 0%, rgba(240, 249, 255, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* TOP ROW: Mascot + Center Copy + Arc Stepper */}
      <div className="rb-banner-top">
        {/* LEFT: Mascot */}
        <div className="rb-mascot-col">
          <img
            src={MASCOT_IMG_SRC}
            alt="Transindia Insurance Mascot"
            className="rb-mascot-img"
          />
        </div>

        {/* CENTER: Main Copy & CTA */}
        <div className="rb-center-col">
          <h3
            style={{
              fontSize: "clamp(20px, 2.2vw, 26px)",
              fontWeight: 800,
              color: "#0B3C68",
              lineHeight: 1.24,
              margin: 0,
              letterSpacing: "-0.02em",
              fontFamily: "'Sora', sans-serif",
            }}
          >
          Insurance Doesn&apos;t End When
          <br />
          You Buy the Policy.
        </h3>

        <h4
          style={{
            fontSize: "clamp(17px, 1.9vw, 22px)",
            fontWeight: 800,
            color: "#009BB9",
            lineHeight: 1.25,
            margin: "8px 0 0",
            letterSpacing: "-0.015em",
            fontFamily: "'Sora', sans-serif",
          }}
        >
          That&apos;s Where Our Relationship Begins.
        </h4>

        <p
          style={{
            fontSize: "clamp(12px, 1.05vw, 13.5px)",
            color: "#475569",
            lineHeight: 1.65,
            margin: "14px 0 20px",
            maxWidth: 520,
          }}
        >
          At Transindia, we believe insurance is about more than a policy
          document. It is about having the right people beside you throughout
          your journey. Whether you&apos;re protecting your family, health,
          vehicle, business or employees, our trained professionals are here to
          help you understand, choose, manage and claim with confidence.
        </p>

        <div>
          <Link href="/contact-us" style={{textDecoration: "none"}}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#034E7B",
                color: "#FFFFFF",
                padding: "11px 26px",
                borderRadius: 9999,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.01em",
                boxShadow: "0 4px 14px rgba(3, 78, 123, 0.25)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#02395A";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#034E7B";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              One Partner. One Team. End-to-End Support.
            </span>
          </Link>
        </div>
      </div>

      {/* RIGHT: Curved Arc Stepper */}
      <div className="rb-stepper-col">
        <div
          style={{
            position: "relative",
            width: ARC_W,
            height: ARC_H,
            flexShrink: 0,
          }}
        >
          {/* Arc line + node dots */}
          <svg
            width={ARC_W}
            height={ARC_H}
            viewBox={`0 0 ${ARC_W} ${ARC_H}`}
            fill="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "visible",
              pointerEvents: "none",
            }}
          >
            {/* Soft glow under the line */}
            <path
              d={arcPath}
              stroke="#BAE6FD"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.7"
            />
            {/* Main sharp line */}
            <path
              d={arcPath}
              stroke="#0284C7"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {steps.map((st, i) => {
              const y = nodeY(i);
              const x = nodeX(y);
              return (
                <g key={i}>
                  {/* short connector from the arc to the icon */}
                  <line
                    x1={x + 4}
                    y1={y}
                    x2={x + ICON_OFFSET}
                    y2={y}
                    stroke={st.border}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx={x} cy={y} r="6" fill="#38BDF8" opacity="0.3" />
                  <circle
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#0284C7"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </svg>

          {/* 6 step items — each sits on its own point of the arc */}
          {steps.map((st, i) => {
            const y = nodeY(i);
            const x = nodeX(y);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x + ICON_OFFSET,
                  top: y - ICON / 2,
                  height: ICON,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "default",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateX(3px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateX(0)")
                }
              >
                <div
                  style={{
                    width: ICON,
                    height: ICON,
                    borderRadius: "50%",
                    background: st.bg,
                    border: `1.5px solid ${st.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 0 4px ${st.color}12, 0 3px 8px ${st.color}22`,
                    flexShrink: 0,
                  }}
                >
                  {st.icon}
                </div>

                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0F3A60",
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {st.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      {/* ─── Bottom Section Inside Banner: From Your First Question to Your Next Claim ─── */}
      <div className="rb-bottom-journey">
        <JourneyStrip />
      </div>
    </div>
  );
}

// ─── Journey Strip: "From Your First Question to Your Next Claim" ─────────────
const jnIconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// 01 Understand — listening ear
const JnEarIcon = () => (
  <svg {...jnIconProps} stroke="#0284C7">
    <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" />
    <path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" />
  </svg>
);

// 02 Compare — magnifier
const JnSearchIcon = () => (
  <svg {...jnIconProps} stroke="#16A34A" strokeWidth={2.4}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20.5 20.5l-4.9-4.9" />
    <path d="M8.5 11h5" />
  </svg>
);

// 03 Choose — check mark
const JnCheckIcon = () => (
  <svg {...jnIconProps} stroke="#7C3AED" strokeWidth={3}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

// 04 Manage — gear (white on solid blue)
const JnGearIcon = () => (
  <svg {...jnIconProps} width={26} height={26} stroke="#FFFFFF">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// 05 Claim — shield with check
const JnShieldIcon = () => (
  <svg {...jnIconProps} stroke="#1D4ED8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </svg>
);

const journeySteps = [
  {
    num: "01",
    title: "Understand",
    desc: "We listen to your requirements, risks and budget.",
    icon: <BiBulb />,
    bg: "#E0F2FE",
    border: "#BAE6FD",
  },
  {
    num: "02",
    title: "Compare",
    desc: "We explore suitable insurance options based on your needs.",
    icon: <JnSearchIcon />,
    bg: "#DCFCE7",
    border: "#BBF7D0",
  },
  {
    num: "03",
    title: "Choose",
    desc: "We explain the important details so you can make an informed decision.",
    icon: <JnCheckIcon />,
    bg: "#EDE9FE",
    border: "#DDD6FE",
  },
  {
    num: "04",
    title: "Manage",
    desc: "From servicing and endorsements to renewals, we're here.",
    icon: <JnGearIcon />,
    bg: "#2563EB",
    border: "#BFDBFE",
  },
  {
    num: "05",
    title: "Claim",
    desc: "We help you navigate the claims process and coordinate with the insurer.",
    icon: <JnShieldIcon />,
    bg: "#E0ECFF",
    border: "#BFDBFE",
  },
];

const JOURNEY_CSS = `
  .jn-wrap {
    width: 100%;
    box-sizing: border-box;
  }

  .jn-heading {
    font-family: 'Sora', sans-serif;
    font-size: clamp(16px, 1.8vw, 20px);
    font-weight: 800;
    color: #0B3C68;
    letter-spacing: -0.01em;
    margin: 0 0 16px;
  }

  .jn-track {
    --jn-gap: clamp(28px, 3vw, 40px);
    display: flex;
    align-items: stretch;
    gap: var(--jn-gap);
  }

  .jn-item {
    position: relative;
    display: flex;
    flex: 1 1 0;
    min-width: 0;
  }

  .jn-card {
    position: relative;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    padding: 28px 16px 22px;
    background: linear-gradient(180deg, #FFFFFF 0%, #F3FBFD 100%);
    border: 1.5px solid #CFEFF5;
    border-radius: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

 
  .jn-num {
    position: absolute;
    top: 12px;
    left: 12px;
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    color: #475569;
    background: #FFFFFF;
    border: 1px solid #BAE6FD;
    border-radius: 6px;
    padding: 4px 7px;
  }

  .jn-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.18);
  }

  .jn-title {
    font-size: 15px;
    font-weight: 800;
    color: #0B3C68;
    margin: 4px 0 0;
  }

  .jn-desc {
    font-size: 13px;
    line-height: 1.55;
    color: #475569;
    margin: 0;
  }

  /* Arrow sits in the gap, to the right of every card except the last */
  .jn-arrow {
    position: absolute;
    top: 50%;
    right: calc(var(--jn-gap) / -2 - 8px);
    width: 16px;
    height: 16px;
    transform: translateY(-50%);
    display: block;
    pointer-events: none;
  }

  /* Tablet: wrap to 3 per row, centre the last row, hide arrows */
  @media (max-width: 1024px) {
    .jn-track {
      --jn-gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .jn-item {
      flex: 0 1 calc((100% - 32px) / 3);
    }
    .jn-arrow {
      display: none;
    }
  }

  /* Small tablet / large phone: 2 per row */
  @media (max-width: 700px) {
    .jn-heading {
      text-align: center;
    }
    .jn-item {
      flex: 0 1 calc((100% - 16px) / 2);
    }
  }

  /* Phone: 1 per row, arrows point down between cards */
  @media (max-width: 480px) {
    .jn-track {
      --jn-gap: 28px;
    }
    .jn-item {
      flex: 0 1 100%;
    }
    .jn-arrow {
      display: block;
      top: auto;
      right: auto;
      left: 50%;
      bottom: calc(var(--jn-gap) / -2 - 8px);
      transform: translateX(-50%) rotate(90deg);
    }
  }
`;

function JourneyStrip() {
  return (
    <div className="jn-wrap">
      <style>{JOURNEY_CSS}</style>

      <h3 className="jn-heading">
        From Your First Question to Your Next Claim
      </h3>

      <div className="jn-track">
        {journeySteps.map((st, i) => (
          <div className="jn-item" key={st.num}>
            <div className="jn-card">
              <span className="jn-num">{st.num}</span>

              <div
                className="jn-icon"
                style={{background: st.bg, border: `1.5px solid ${st.border}`}}
              >
                {st.icon}
              </div>

              <p className="jn-title">{st.title}</p>
              <p className="jn-desc">{st.desc}</p>
            </div>

            {i < journeySteps.length - 1 && (
              <svg
                className="jn-arrow"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.5 8h11M9.5 4l4 4-4 4"
                  stroke="#38BDF8"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 3: Insurer Network ───────────────────────────────────────────────
function InsurerSection() {
  return (
    <section className="is-section" style={{background: "#FFFFFF"}}>
      <div className="is-inner">
        <div style={{...s.card, padding: "24px 24px 24px", overflow: "hidden"}}>
          <p style={{...s.cardHeading, marginBottom: 4}}>Our insurer network</p>

          <div style={s.logoGrid}>
            {insurerLogos.map((l, i) => (
              <div key={i} style={s.logoBox}>
                <img
                  src={l.logoSrc}
                  alt={l.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: 52,
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}

            <div style={s.moreTile}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
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
            20+ insurers.
            <br />
            <span style={s.accentOrange}>One trusted </span>
            <span>partner.</span>
          </h2>

          <p style={s.body}>
            We're not tied to any single insurer. Our independence means we
            genuinely compare plans from across the market and find you the
            right balance of cover, exclusions, and price.
          </p>

          <BulletList items={partnerBullets} />

          <div>
            {/* <button
              style={s.btnDark}
              onMouseEnter={e => (e.currentTarget.style.background = "#334155")}
              onMouseLeave={e => (e.currentTarget.style.background = "#1E293B")}
            >Compare all insurers</button> */}
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
      <main
        style={{
          fontFamily: "'Sora', sans-serif",
          color: "#1E293B",
          background: "#FFFFFF",
          width: "100%",
        }}
      >
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

  /* ── Relationship Journey Banner ── */
  .rb-banner {
    width: 100%;
    box-sizing: border-box;
    background: linear-gradient(180deg, #FFFFFF 0%, #F3FBFD 100%);
    border: 1.5px solid #CFEFF5;
    border-radius: 28px;
    padding: clamp(24px, 4vw, 36px) clamp(20px, 3.5vw, 40px);
    display: flex;
    flex-direction: column;
    gap: 36px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 12px 36px -8px rgba(2, 132, 199, 0.12), 0 2px 10px rgba(0, 0, 0, 0.02);
  }

  .rb-banner-top {
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: clamp(24px, 3.5vw, 44px);
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .rb-mascot-col {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
  }

  .rb-mascot-img {
    width: 400px;
    height: 400px;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 10px 20px rgba(2, 132, 199, 0.15));
    transition: transform 0.3s ease;
  }

  .rb-speech-bubble {
    position: absolute;
    top: 6px;
    right: -42px;
    background: #FFFFFF;
    border: 1.5px solid #0099C4;
    border-radius: 20px;
    padding: 8px 14px;
    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.12);
    z-index: 3;
    animation: rbFloat 3s ease-in-out infinite alternate;
  }

  @keyframes rbFloat {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-4px); }
  }

  .rb-center-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .rb-stepper-col {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .rb-bottom-journey {
    width: 100%;
    border-top: 1px dashed #CFEFF5;
    padding-top: 28px;
    position: relative;
    z-index: 1;
  }

  /* ── Tablet / Mid Screens (iPad Pro & iPad Mini: 641px to 1080px) ── */
  @media (max-width: 1080px) and (min-width: 641px) {
    .rb-banner {
      padding: 32px 28px;
      gap: 32px;
    }
    .rb-banner-top {
      grid-template-columns: 1fr;
      gap: 28px;
      align-items: center;
    }
    .rb-mascot-col {
      justify-content: center;
      order: 0;
    }
    .rb-mascot-img {
      width: clamp(200px, 28vw, 300px);
      height: auto;
    }
    .rb-center-col {
      order: 1;
      text-align: center;
      align-items: center;
    }
    .rb-stepper-col {
      display: none !important;
    }
  }

  /* ── Mobile (≤640px) ── */
  @media (max-width: 640px) {
    .rb-banner {
      padding: 24px 16px;
      gap: 24px;
      border-radius: 20px;
    }
    .rb-banner-top {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 20px;
    }
    .rb-mascot-col {
      order: 0;
      justify-content: center;
    }
    .rb-mascot-img {
      width: clamp(180px, 55vw, 240px) !important;
      height: auto !important;
    }
    .rb-center-col {
      order: 1;
      align-items: center;
      text-align: center;
    }
    .rb-stepper-col {
      display: none !important;
    }
    .rb-bottom-journey {
      padding-top: 20px;
    }
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
  accentOrange: {color: "#F15A3E"},
  accentBlue: {color: "#00BCD4"},
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
