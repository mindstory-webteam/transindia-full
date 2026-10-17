"use client";

import React from "react";
import Link from "next/link";

/* ─── Brand Colors ─────────────────────────────────────────────────────────── */
const NAVY = "#001A5A";
const BORDER_COLOR = "#D8EBF8";

/* ─── Inline SVG Icons (Identical to ProcessStepsSection) ───────────────────── */
const BulbIcon = ({ size = 18, color = "#0284C7" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const SearchIcon = ({ size = 18, color = "#16A34A" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ShieldCheckIcon = ({ size = 18, color = "#9333EA" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const GearIcon = ({ size = 18, color = "#0284C7" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const RefreshCwIcon = ({ size = 18, color = "#EA580C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const AwardIcon = ({ size = 18, color = "#0D9488" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.12" />
  </svg>
);

export default function RelationshipSection() {
  const steps = [
    { label: "Understand", icon: <BulbIcon size={16} color="#0284C7" />, bg: "#F0F9FF", border: "#BAE6FD", color: "#0284C7" },
    { label: "Compare",    icon: <SearchIcon size={16} color="#16A34A" />, bg: "#F0FDF4", border: "#BBF7D0", color: "#16A34A" },
    { label: "Choose",     icon: <ShieldCheckIcon size={16} color="#9333EA" />, bg: "#FAF5FF", border: "#E9D5FF", color: "#9333EA" },
    { label: "Manage",     icon: <GearIcon size={16} color="#0284C7" />, bg: "#F0F9FF", border: "#BAE6FD", color: "#0284C7" },
    { label: "Renew",      icon: <RefreshCwIcon size={16} color="#EA580C" />, bg: "#FFF7ED", border: "#FED7AA", color: "#EA580C" },
    { label: "Claim",      icon: <AwardIcon size={16} color="#0D9488" />, bg: "#F0FDFA", border: "#99F6E4", color: "#0D9488" },
  ];

  const ARC_H = 390;
  const ICON = 32;
  const ICON_OFFSET = 18;

  // Nodes precisely positioned along d="M2.5 0V33.5608C47.0228 81.5232 109.355 212.243 2.5 351.424V390"
  const stepNodes = [
    { x: 11.95, y: 44.7 },
    { x: 45.15, y: 104.1 },
    { x: 60.18, y: 165.7 },
    { x: 58.55, y: 227.4 },
    { x: 40.06, y: 289.0 },
    { x: 10.43, y: 340.7 },
  ];

  const arcPath = "M2.5 0V33.5608C47.0228 81.5232 109.355 212.243 2.5 351.424V390";

  return (
    <>
      <style>{CSS}</style>
      <section className="rel-section">
        {/* Decorative ambient atmospheric glows */}
        <div className="rel-glow-1" />
        <div className="rel-glow-2" />

        <div className="rel-inner">
          {/* Left Mascot */}
          <div className="rel-mascot-col">
            <img
              src="/images/home/insurance-mascot.png"
              alt="TransIndia Mascot with shield"
              className="rel-mascot-img"
            />
          </div>

          {/* Center Content */}
          <div className="rel-content-col">
            <h2 className="rel-heading">
              Insurance Doesn&apos;t End When
              <br />
              You Buy the Policy.
              <br />
              <span style={{ color: "#009BB9" }}>That&apos;s Where Our Relationship Begins.</span>
            </h2>

            <p className="rel-desc">
              At TransIndia, we believe insurance is about more than a policy
              document. It is about having the right people beside you throughout
              your journey. Whether you&apos;re protecting your family, health,
              vehicle, business or employees, our trained professionals are here to
              help you understand, choose, manage and claim with confidence.
            </p>

            <div className="rel-btn-wrap">
              <Link href="/about" className="rel-btn">
                One Partner. One Team. End-to-End Support.
              </Link>
            </div>
          </div>

          {/* Right Stepper with curved arc touching top and bottom of div */}
          <div className="rel-stepper-col">
            <svg
              width="64"
              height={ARC_H}
              viewBox="0 0 64 390"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rel-stepper-svg"
            >
              {/* Soft atmospheric glow */}
              <path
                d={arcPath}
                stroke="#BAE6FD"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.35"
              />
              {/* Main curved line with straight ends */}
              <path
                d={arcPath}
                stroke="#64A9ED"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {steps.map((st, i) => {
                const node = stepNodes[i];
                return (
                  <g key={i}>
                    <line
                      x1={node.x + 2}
                      y1={node.y}
                      x2={node.x + ICON_OFFSET}
                      y2={node.y}
                      stroke="#BAE6FD"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="3.5"
                      fill="#003783ff"
                    />
                  </g>
                );
              })}
            </svg>

            {/* 6 step items following the arch curve */}
            {steps.map((st, i) => {
              const node = stepNodes[i];
              return (
                <div
                  key={i}
                  className="rel-step-item"
                  style={{
                    left: node.x + ICON_OFFSET,
                    top: node.y - ICON / 2,
                  }}
                >
                  <div
                    className="rel-step-icon"
                    style={{
                      background: st.bg,
                      border: `1.5px solid ${st.border}`,
                      boxShadow: `0 0 0 2.5px ${st.color}15, 0 2px 8px ${st.color}20`,
                    }}
                  >
                    {st.icon}
                  </div>
                  <span className="rel-step-label">
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

const CSS = `
  .rel-section {
    background: linear-gradient(180deg, #F0F8FD 0%, #E6F3FA 100%);
    border-top: 1px solid ${BORDER_COLOR};
    border-bottom: 1px solid ${BORDER_COLOR};
    position: relative;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  .rel-glow-1 {
    position: absolute;
    top: -20px;
    left: 20%;
    width: 380px;
    height: 100%;
    background: radial-gradient(ellipse at center, rgba(224, 242, 254, 0.7) 0%, rgba(240, 249, 255, 0) 70%);
    pointer-events: none;
  }

  .rel-glow-2 {
    position: absolute;
    bottom: -20px;
    right: 15%;
    width: 360px;
    height: 100%;
    background: radial-gradient(ellipse at center, rgba(186, 230, 253, 0.5) 0%, rgba(240, 249, 255, 0) 70%);
    pointer-events: none;
  }

  .rel-inner {
    max-width: 1260px;
    margin: 0 auto;
    padding: 0 24px;
    height: 390px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
  }

  .rel-mascot-col {
    flex: 0 0 440px;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    position: relative;
  }

  .rel-mascot-img {
    width: 100%;
    max-width: 480px;
    height: 100%;
    max-height: 390px;
    object-fit: contain;
    object-position: bottom left;
    filter: drop-shadow(0 8px 18px rgba(2, 132, 199, 0.12));
    display: block;
  }

  .rel-content-col {
    flex: 1 1 420px;
    max-width: 510px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .rel-heading {
    color: ${NAVY};
    font-size: 24px;
    font-weight: 800;
    line-height: 1.24;
    margin: 0 0 12px;
    letter-spacing: -0.015em;
    font-family: var(--font-sora), "Sora", sans-serif;
  }

  .rel-desc {
    color: #475569;
    font-size: 12.5px;
    line-height: 1.65;
    margin: 0 0 18px;
    max-width: 490px;
  }

  .rel-btn-wrap {
    display: block;
  }

  .rel-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #034E7B;
    color: #FFFFFF;
    font-weight: 700;
    font-size: 12.5px;
    padding: 10px 24px;
    border-radius: 9999px;
    text-decoration: none;
    box-shadow: 0 3px 12px rgba(3, 78, 123, 0.22);
    transition: all 0.2s ease;
  }

  .rel-btn:hover {
    background: #02395A;
    transform: translateY(-1px);
  }

  .rel-stepper-col {
    position: relative;
    width: 230px;
    height: 390px;
    flex-shrink: 0;
  }

  .rel-stepper-svg {
    position: absolute;
    top: 0;
    left: 0;
    overflow: visible;
    pointer-events: none;
  }

  .rel-step-item {
    position: absolute;
    height: 32px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: default;
    transition: transform 0.15s ease;
  }

  .rel-step-item:hover {
    transform: translateX(3px);
  }

  .rel-step-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rel-step-label {
    font-size: 13.5px;
    font-weight: 700;
    color: ${NAVY};
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  /* ── Breakpoints ── */

  /* Medium screens / Laptops (992px to 1199px) */
  @media (max-width: 1199px) {
    .rel-inner {
      gap: 16px;
      padding: 0 16px;
    }
    .rel-mascot-col {
      flex: 0 0 320px;
    }
    .rel-mascot-img {
      max-width: 340px;
    }
    .rel-heading {
      font-size: 21px;
    }
    .rel-desc {
      font-size: 12px;
    }
  }

  /* Tablet screens (769px to 991px) */
  @media (max-width: 991px) {
    .rel-inner {
      gap: 12px;
      padding: 0 12px;
    }
    .rel-mascot-col {
      flex: 0 0 240px;
    }
    .rel-mascot-img {
      max-width: 250px;
    }
    .rel-heading {
      font-size: 18px;
    }
    .rel-desc {
      font-size: 11.5px;
      line-height: 1.55;
      margin-bottom: 14px;
    }
    .rel-btn {
      font-size: 11.5px;
      padding: 8px 18px;
    }
    .rel-stepper-col {
      width: 195px;
    }
    .rel-step-label {
      font-size: 12px;
    }
  }

  /* Small screens (<= 768px): Hide SVG and 6 step labels, stack content & mascot */
  @media (max-width: 768px) {
    .rel-stepper-col {
      display: none !important;
    }

    .rel-inner {
      height: auto !important;
      flex-direction: column !important;
      padding: 36px 20px 0 20px !important;
      text-align: center;
      gap: 20px;
    }

    .rel-content-col {
      max-width: 100% !important;
      width: 100%;
      align-items: center;
      text-align: center;
      padding: 0 4px;
      order: 1;
    }

    .rel-heading {
      font-size: clamp(20px, 4.5vw, 24px);
      line-height: 1.3;
      margin-bottom: 12px;
    }

    .rel-desc {
      font-size: 13px;
      line-height: 1.6;
      margin: 0 auto 20px auto;
      max-width: 520px;
    }

    .rel-btn-wrap {
      margin: 0 auto;
    }

    .rel-btn {
      font-size: 12.5px;
      padding: 10px 22px;
    }

    .rel-mascot-col {
      flex: unset !important;
      width: 100% !important;
      max-width: 320px;
      height: auto !important;
      margin: 0 auto;
      justify-content: center;
      align-items: flex-end;
      order: 2;
    }

    .rel-mascot-img {
      max-width: 290px;
      max-height: 250px;
      object-position: bottom center;
      margin: 0 auto;
    }
  }

  /* Extra small screens (<= 480px) */
  @media (max-width: 480px) {
    .rel-inner {
      padding: 28px 16px 0 16px !important;
      gap: 16px;
    }

    .rel-heading {
      font-size: 18px;
      line-height: 1.32;
    }

    .rel-desc {
      font-size: 12px;
      line-height: 1.55;
      margin-bottom: 16px;
    }

    .rel-btn {
      font-size: 11px;
      padding: 9px 16px;
    }

    .rel-mascot-col {
      max-width: 250px;
    }

    .rel-mascot-img {
      max-height: 200px;
      max-width: 240px;
    }
  }
`;

export { RelationshipSection };
