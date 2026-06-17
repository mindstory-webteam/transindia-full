"use client"

import React from "react";


const SHIELD_SRC  = "/images/Cta/Protection shield, System security, Verified access.svg";
const FAMILY_SRC  = "/images/Cta/couple walks with baby.svg";

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <path
      d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24
         c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3
         13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1
         0 01-.24 1.01l-2.21 2.21z"
      fill="#EF4444"
    />
  </svg>
);

export default function CtaSection() {
  return (
    <>
      <style>{`
        .cta-inner {
          max-width: 1280px;
          margin: 0 auto;
          min-height: 480px;
          display: grid;
          grid-template-columns: 52fr 48fr;
          align-items: center;
          padding: 0 64px;
          box-sizing: border-box;
        }

        .cta-text-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-right: 32px;
          padding-top: 72px;
          padding-bottom: 72px;
        }

        .cta-image-col {
          position: relative;
          height: 480px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .cta-btn {
          display: inline-block;
          align-self: flex-start;
          background: #F97316;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          padding: 12px 26px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background 0.15s;
          font-family: 'matterregular', sans-serif;
          letter-spacing: 0.01em;
        }

        /* ── Tablet (≤900px) ── */
        @media (max-width: 900px) {
          .cta-inner {
            grid-template-columns: 1fr;
            padding: 48px 40px 0;
            min-height: auto;
          }
          .cta-text-col {
            padding-right: 0;
            padding-top: 0;
            padding-bottom: 40px;
            text-align: center;
            align-items: center;
          }
          .cta-btn {
            align-self: center;
          }
          .cta-phone-row {
            justify-content: center;
          }
          .cta-image-col {
            height: 360px;
            width: 100%;
          }
        }

        /* ── Mobile (≤600px) ── */
        @media (max-width: 600px) {
          .cta-inner {
            padding: 40px 20px 0;
          }
          .cta-text-col {
            gap: 16px;
            padding-bottom: 32px;
          }
          .cta-image-col {
            height: 280px;
          }
          .cta-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <section style={s.section}>
        <div className="cta-inner">

          {/* ── LEFT: text ── */}
          <div className="cta-text-col">
            <h2 style={s.heading}>
              Finding the right insurance<br />
              shouldn't feel complicated.
            </h2>

            <p style={s.body}>
              Our advisors will assess your situation and find the right product for your
              life and budget. Free consultation, no pressure.
            </p>

            <button
              className="cta-btn"
              onMouseEnter={e => (e.currentTarget.style.background = "#EA580C")}
              onMouseLeave={e => (e.currentTarget.style.background = "#F97316")}
            >
              Get free advice
            </button>

            <div className="cta-phone-row" style={s.phoneRow}>
              <PhoneIcon />
              <span style={s.phoneText}>
                Or call us:&nbsp;
                <span style={s.phoneNumber}>1800 425 8084</span>
                &nbsp;(24/7 · Toll-free)
              </span>
            </div>
          </div>

          {/* ── RIGHT: composite illustration — shield behind family ── */}
          <div className="cta-image-col">
            <img
              src={SHIELD_SRC}
              alt=""
              aria-hidden="true"
              style={s.shieldImg}
            />
            <img
              src={FAMILY_SRC}
              alt="Family protected by insurance shield"
              style={s.familyImg}
            />
          </div>

        </div>
      </section>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {

  section: {
    width: "100%",
    minHeight: 480,
    position: "relative",
    overflow: "hidden",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "linear-gradient(110deg, #FFE8E3 0%, #FFF0EC 30%, #E8F8FF 65%, #C8F2FF 100%)",
    boxSizing: "border-box",
  },

  heading: {
    fontSize: "clamp(24px, 2.6vw, 40px)",
    fontWeight: 800,
    lineHeight: 1.18,
    color: "#1A1A2E",
    letterSpacing: "-0.025em",
    margin: 0,
  },

  body: {
    fontSize: 14.5,
    color: "#6B7280",
    lineHeight: 1.75,
    margin: 0,
    maxWidth: 460,
  },

  phoneRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },

  phoneText: {
    fontSize: 13,
    color: "#6B7280",
  },

  phoneNumber: {
    fontWeight: 700,
    color: "#374151",
  },

  shieldImg: {
    position: "absolute",
    top: "8%",
    left: "50%",
    transform: "translateX(-62%)",
    width: "68%",
    maxWidth: 300,
    height: "auto",
    objectFit: "contain",
    opacity: 0.88,
    pointerEvents: "none",
    userSelect: "none" as const,
    zIndex: 1,
    filter: "drop-shadow(0 12px 40px rgba(59,97,220,0.22))",
  },

  familyImg: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-44%)",
    height: "94%",
    maxHeight: 450,
    width: "auto",
    objectFit: "contain",
    objectPosition: "bottom center",
    pointerEvents: "none",
    userSelect: "none" as const,
    zIndex: 2,
  },

};