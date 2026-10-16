"use client";

import React from "react";
import Link from "next/link";

/* ─── Brand Colors ─────────────────────────────────────────────────────────── */
const NAVY = "#001A5A";
const BORDER_COLOR = "#D8EBF8";

/* ─── Inline SVG Icons ─────────────────────────────────────────────────────── */
const ShieldCheckIcon = ({ size = 18, color = "#20BEC6" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const BulbIcon = ({ size = 20, color = "#20BEC6" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const GearIcon = ({ size = 20, color = "#20BEC6" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const AwardIcon = ({ size = 20, color = "#20BEC6" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.12" />
  </svg>
);

const FileTextIcon = ({ size = 20, color = "#20BEC6" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default function RelationshipSection() {
  const steps = [
    { label: "Understand", icon: <BulbIcon size={15} color="#16A34A" />, bg: "#F0FDF4", border: "#BBF7D0", color: "#16A34A" },
    { label: "Compare", icon: <FileTextIcon size={15} color="#0284C7" />, bg: "#F0F9FF", border: "#BAE6FD", color: "#0284C7" },
    { label: "Choose", icon: <ShieldCheckIcon size={15} color="#001A5A" />, bg: "#EFF6FF", border: "#BFDBFE", color: "#001A5A" },
    { label: "Manage", icon: <GearIcon size={15} color="#0284C7" />, bg: "#EAF2FA", border: "#B8D2EA", color: "#0284C7" },
    { label: "Renew", icon: <AwardIcon size={15} color="#9333EA" />, bg: "#EEF2FF", border: "#C7D2FE", color: "#9333EA" },
    { label: "Claim", icon: <ShieldCheckIcon size={15} color="#9333EA" />, bg: "#FAF5FF", border: "#E9D5FF", color: "#9333EA" },
  ];

  const ARC_H = 390;
  const ARC_W = 230;
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
    <section
      style={{
        background: "linear-gradient(180deg, #F0F8FD 0%, #E6F3FA 100%)",
        borderTop: `1px solid ${BORDER_COLOR}`,
        borderBottom: `1px solid ${BORDER_COLOR}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative ambient atmospheric glows */}
      <div
        style={{
          position: "absolute",
          top: -20,
          left: "20%",
          width: 380,
          height: "100%",
          background: "radial-gradient(ellipse at center, rgba(224, 242, 254, 0.7) 0%, rgba(240, 249, 255, 0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -20,
          right: "15%",
          width: 360,
          height: "100%",
          background: "radial-gradient(ellipse at center, rgba(186, 230, 253, 0.5) 0%, rgba(240, 249, 255, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1260,
          margin: "0 auto",
          padding: "0 24px",
          height: ARC_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Mascot — larger scale, filling container height */}
        <div
          style={{
            flex: "0 0 460px",
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            position: "relative",
          }}
        >
          <img
            src="/images/home/insurance-mascot.png"
            alt="TransIndia Mascot with shield"
            style={{
              width: "100%",
              maxWidth: 490,
              height: "100%",
              maxHeight: ARC_H,
              objectFit: "contain",
              objectPosition: "bottom left",
              filter: "drop-shadow(0 8px 18px rgba(2, 132, 199, 0.12))",
            }}
          />
        </div>

        {/* Center Content */}
        <div style={{ flex: "1 1 420px", maxWidth: 510, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2
            style={{
              color: NAVY,
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1.24,
              margin: "0 0 12px",
              letterSpacing: "-0.015em",
            }}
          >
            Insurance Doesn&apos;t End When
            <br />
            You Buy the Policy.
            <br />
            <span style={{ color: "#009BB9" }}>That&apos;s Where Our Relationship Begins.</span>
          </h2>

          <p
            style={{
              color: "#475569",
              fontSize: 12.5,
              lineHeight: 1.65,
              margin: "0 0 18px",
              maxWidth: 490,
            }}
          >
            At TransIndia, we believe insurance is about more than a policy
            document. It is about having the right people beside you throughout
            your journey. Whether you&apos;re protecting your family, health,
            vehicle, business or employees, our trained professionals are here to
            help you understand, choose, manage and claim with confidence.
          </p>

          <div>
            <Link
              href="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#034E7B",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 12.5,
                padding: "10px 24px",
                borderRadius: 9999,
                textDecoration: "none",
                boxShadow: "0 3px 12px rgba(3, 78, 123, 0.22)",
                transition: "all 0.2s ease",
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
            </Link>
          </div>
        </div>

        {/* Right Stepper with curved arc touching top and bottom of div */}
        <div
          style={{
            position: "relative",
            width: ARC_W,
            height: ARC_H,
            flexShrink: 0,
          }}
        >
          {/* Arc line starting at y=0 and ending at y=ARC_H (390) with straight vertical ends */}
          <svg
            width="64"
            height={ARC_H}
            viewBox="0 0 64 390"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              overflow: "visible",
              pointerEvents: "none",
            }}
          >
            {/* Soft atmospheric glow */}
            <path
              d={arcPath}
              stroke="#BAE6FD"
              strokeWidth="9"
              strokeLinecap="round"
              opacity="0.45"
            />
            {/* Main curved line with straight ends */}
            <path
              d={arcPath}
              stroke="#64A9ED"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {steps.map((st, i) => {
              const node = stepNodes[i];
              return (
                <g key={i}>
                  <line
                    x1={node.x + 3}
                    y1={node.y}
                    x2={node.x + ICON_OFFSET}
                    y2={node.y}
                    stroke="#BAE6FD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="4.5"
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
                style={{
                  position: "absolute",
                  left: node.x + ICON_OFFSET,
                  top: node.y - ICON / 2,
                  height: ICON,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "default",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(3px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
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
                    boxShadow: `0 0 0 2.5px ${st.color}15, 0 2px 8px ${st.color}20`,
                    flexShrink: 0,
                  }}
                >
                  {st.icon}
                </div>
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: NAVY,
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { RelationshipSection };
