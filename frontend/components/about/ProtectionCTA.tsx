"use client";

import React from "react";
import Link from "next/link";

const SHIELD_SRC = "/images/home/HOME/FAMILY PROTECTION VISUAL.png";

/* ─── Icons (same style as AboutHero stat icons) ────────────────────────── */
const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function StepIcon({ name }: { name: string }) {
  switch (name) {
    case "chat":
      return (
        <svg {...iconProps}>
          <path d="M4 5h16v11H8l-4 4V5z" />
          <path d="M8 10h8M8 13h5" />
        </svg>
      );
    case "compare":
      return (
        <svg {...iconProps}>
          <rect x="3" y="4" width="7" height="16" rx="1.5" />
          <rect x="14" y="4" width="7" height="16" rx="1.5" />
        </svg>
      );
    case "shield":
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "headset":
      return (
        <svg {...iconProps}>
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <rect x="3" y="14" width="4" height="6" rx="1.5" />
          <rect x="17" y="14" width="4" height="6" rx="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.21 2.21z"
      fill="#F15A40"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Data ──────────────────────────────────────────────────────────────── */
const STEPS = [
  { icon: "chat", title: "Free Consultation", text: "Tell us what you need to protect." },
  { icon: "compare", title: "Compare Plans", text: "We compare options across insurers." },
  { icon: "shield", title: "Choose Your Cover", text: "Pick the plan that fits you best." },
  { icon: "headset", title: "Ongoing Support", text: "Help with renewals and claims." },
];

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function ProtectionCTA() {
  return (
    <>
      <style>{CSS}</style>

      <section className="pc-section">
        <div className="pc-card">
          {/* ── LEFT: CTA (hero gradient) ── */}
          <div className="pc-left">
            <img
              src={SHIELD_SRC}
              alt="Family protected by an insurance shield"
              className="pc-image"
            />

            <div className="pc-left-text">
              <h2 className="pc-heading">
                Whatever You&apos;re <span className="pc-orange">Protecting</span>,
                We&apos;re Here to <span className="pc-teal">Help.</span>
              </h2>

              <p className="pc-sub">
                Let&apos;s find the right insurance solution for you.
              </p>

              <div className="pc-actions">
                <Link href="/contact-us" className="pc-btn">
                  Get free advice <ArrowIcon />
                </Link>

                <a href="tel:18004258084" className="pc-phone">
                  <PhoneIcon />
                  <span>
                    <strong>1800 425 8084</strong>
                    <small>24/7 · Toll-free</small>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* ── RIGHT: steps ── */}
          <div className="pc-right">
            <h3 className="pc-right-title">How We Help You</h3>

            <div className="pc-steps">
              {STEPS.map((step) => (
                <div key={step.title} className="pc-step">
                  <span className="pc-step-icon">
                    <StepIcon name={step.icon} />
                  </span>
                  <p className="pc-step-title">{step.title}</p>
                  <p className="pc-step-text">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Styles (matched to AboutHero + stats bar) ─────────────────────────── */
const CSS = `
  /* Top padding clears the AboutHero stats bar,
     which hangs halfway below the banner. */
  .pc-section {
    background: #ffffff;
    padding: 100px 32px 40px;
    font-family: 'matterregular', sans-serif;
    box-sizing: border-box;
  }

  /* One card, same width / radius / shadow as the stats bar */
  .pc-card {
    max-width: 1300px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.15fr;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 8px 32px rgba(10, 31, 110, 0.13),
      0 2px 8px rgba(0, 0, 0, 0.07);
  }

  /* ── Left ── */
  .pc-left {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 32px 36px;
    background: linear-gradient(180deg, #F0F8FD 0%, #E6F3FA 100%);
  }

  .pc-image {
    width: 150px;
    flex-shrink: 0;
    height: auto;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
  }

  .pc-left-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .pc-heading {
    margin: 0;
    font-size: 26px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.5px;
    color: #001250;
  }
  .pc-orange { color: #F15A40; }
  .pc-teal { color: #20BEC6; }

  .pc-sub {
    margin: 0;
    font-size: 15px;
    line-height: 1.72;
    color: #001250;
  }

  .pc-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 18px;
    margin-top: 8px;
  }

  .pc-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    border-radius: 9px;
    background: #e84b2a;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .pc-btn:hover {
    background: #d63f20;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -8px rgba(232, 75, 42, 0.6);
  }
  .pc-btn svg { transition: transform 0.2s; }
  .pc-btn:hover svg { transform: translateX(3px); }
  .pc-btn:focus-visible {
    outline: 2px solid #001250;
    outline-offset: 3px;
  }

  .pc-phone {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  .pc-phone span {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
  }
  .pc-phone strong {
    font-size: 14px;
    font-weight: 700;
    color: #001250;
  }
  .pc-phone small {
    font-size: 12px;
    color: #4a5a85;
  }
  .pc-phone:hover strong { color: #20BEC6; }

  /* ── Right ── */
  .pc-right {
    padding: 32px 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .pc-right-title {
    margin: 0 0 24px;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.3px;
    color: #001250;
  }

  .pc-steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .pc-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    padding: 0 12px;
  }
  .pc-step + .pc-step { border-left: 1px solid #e3e8f0; }

  .pc-step-icon {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    background: #E4F6F8;
    border: 1px solid #C6ECEF;
    color: #20BEC6;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    transition: background 0.2s, color 0.2s, transform 0.2s;
  }
  .pc-step:hover .pc-step-icon {
    background: #20BEC6;
    color: #fff;
    transform: translateY(-2px);
  }

  .pc-step-title {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #001250;
  }

  .pc-step-text {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #4a5a85;
  }

  /* ── ≤1200px: stack left over right ── */
  @media (max-width: 1200px) {
    .pc-card { grid-template-columns: 1fr; }
    .pc-left { padding: 28px 32px; }
    .pc-image { width: 130px; }
  }

  /* ── Tablets (≤1024px): stats bar is 2×2 and taller ── */
  @media (max-width: 1024px) {
    .pc-section { padding: 150px 24px 32px; }
  }

  /* ── ≤768px ── */
  @media (max-width: 768px) {
    .pc-left {
      flex-direction: column;
      text-align: center;
      padding: 28px 22px;
    }
    .pc-left-text { align-items: center; }
    .pc-actions { justify-content: center; }
    .pc-phone span { text-align: left; }
    .pc-heading { font-size: 22px; }

    .pc-right { padding: 26px 20px; }
    .pc-right-title { text-align: center; font-size: 20px; }
    .pc-steps {
      grid-template-columns: 1fr 1fr;
      row-gap: 24px;
    }
    .pc-step:nth-child(3) { border-left: none; }
  }

  /* ── Mobile (≤600px) ── */
  @media (max-width: 600px) {
    .pc-section { padding: 130px 16px 24px; }
    .pc-card { border-radius: 12px; }
    .pc-heading { font-size: 20px; }
    .pc-actions { flex-direction: column; width: 100%; gap: 14px; }
    .pc-btn { width: 100%; justify-content: center; box-sizing: border-box; }
    .pc-step-icon { width: 38px; height: 38px; border-radius: 8px; }
    .pc-step-icon svg { width: 18px; height: 18px; }
  }

  /* ── Small phones (≤420px): stats bar is single column ── */
  @media (max-width: 420px) {
    .pc-section { padding-top: 200px; }
    .pc-steps { grid-template-columns: 1fr; }
    .pc-step + .pc-step {
      border-left: none;
      border-top: 1px solid #e3e8f0;
      padding-top: 20px;
    }
  }
`;