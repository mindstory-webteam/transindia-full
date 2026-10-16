"use client";

import React from "react";
import Link from "next/link";

/* ─── Inline SVG Icons ─────────────────────────────────────────────────────── */
const ProfessionalsIcon = ({ size = 20, color = "#0284C7" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const GuidanceIcon = ({ size = 20, color = "#0284C7" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
    <path d="m16 11 2 2 4-4" />
  </svg>
);

const SupportIcon = ({ size = 20, color = "#0284C7" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ClaimIntimationIcon = ({ size = 20, color = "#0284C7" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="11" x2="12" y2="15" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const DocumentationIcon = ({ size = 20, color = "#0284C7" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m9 15 2 2 4-4" />
  </svg>
);

const InsurerCoordinationIcon = ({ size = 20, color = "#0284C7" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const FollowUpSupportIcon = ({ size = 20, color = "#0284C7" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

export default function TeamSection() {
  const points = [
    {
      title: "Experienced Professionals",
      desc: "Insurance knowledge backed by practical experience.",
      icon: <ProfessionalsIcon size={20} color="#0284C7" />,
    },
    {
      title: "Personalised Guidance",
      desc: "Solutions based on your requirements.",
      icon: <GuidanceIcon size={20} color="#0284C7" />,
    },
    {
      title: "Continued Support",
      desc: "We're available beyond the point of purchase.",
      icon: <SupportIcon size={20} color="#0284C7" />,
    },
  ];

  const claimSteps = [
    {
      title: "Claim Intimation",
      desc: "Guidance on initiating the claim process.",
      icon: <ClaimIntimationIcon size={19} color="#0284C7" />,
    },
    {
      title: "Documentation",
      desc: "Help with required documents and information.",
      icon: <DocumentationIcon size={19} color="#0284C7" />,
    },
    {
      title: "Insurer Coordination",
      desc: "We assist with communication and follow-up.",
      icon: <InsurerCoordinationIcon size={19} color="#0284C7" />,
    },
    {
      title: "Follow-Up Support",
      desc: "We keep you informed at every step.",
      icon: <FollowUpSupportIcon size={19} color="#0284C7" />,
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <section className="team-section-wrap">
        {/* ── Top Row: Main Team Card + 3 Points Card ── */}
        <div className="team-section-container">
          
          {/* ── Left Main Card: Content + Team Image ── */}
          <div className="team-main-card">
            <div className="team-text-col">
              <h2 className="team-title">
                Real People. Professional Advice. Personalised Service.
              </h2>
              <h3 className="team-subtitle">
                A Team That Stays With You.
              </h3>
              <p className="team-desc">
                Insurance shouldn&apos;t feel like dealing with a faceless website. Our
                trained professionals are here to understand your requirements,
                explain your options and support you throughout your insurance
                journey.
              </p>
              <div>
                <Link href="/about" className="team-btn">
                  Meet Our Team <ArrowRightIcon />
                </Link>
              </div>
            </div>

            <div className="team-image-col">
              <img
                src="/images/3-people-img.png"
                alt="TransIndia Insurance Professionals"
                className="team-photo"
              />
              <div className="team-image-fade" aria-hidden="true" />
            </div>
          </div>

          {/* ── Right Side Card: 3 Feature Rows ── */}
          <div className="team-side-card">
            {points.map((pt, i) => (
              <div key={i} className="team-point-row">
                <div className="team-point-badge">
                  {pt.icon}
                </div>
                <div className="team-point-content">
                  <h4 className="team-point-title">{pt.title}</h4>
                  <p className="team-point-desc">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ── Bottom Row: Claims Support Banner (Matching Image UI) ── */}
        <div className="claim-support-row">
          
          {/* Left Card: When You Need Your Insurance... */}
          <div className="claim-hero-card">
            <div className="claim-dummy-img-wrap">
              <img
                src="/images/home/HOME/INSURANCE ADVISOR AVATAR.png"
                alt="Claims Advisor Dummy"
                className="claim-dummy-img"
              />
            </div>
            <div className="claim-hero-content">
              <h3 className="claim-hero-title">
                When You Need Your Insurance,<br />
                You Don&apos;t Have to Face It Alone.
              </h3>
              <p className="claim-hero-subtitle">
                A claim can be stressful. Our team is here to help.
              </p>
              <div>
                <Link href="/claims" className="claim-hero-btn">
                  Need Claim Assistance? <span className="claim-btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Card: Our Claims Support (4 Steps Breakdown) */}
          <div className="claim-support-card">
            <h4 className="claim-support-title">Our Claims Support</h4>
            <div className="claim-support-grid">
              {claimSteps.map((step, idx) => (
                <div key={idx} className="claim-step-item">
                  <div className="claim-step-icon-wrap">
                    {step.icon}
                  </div>
                  <h5 className="claim-step-name">{step.title}</h5>
                  <p className="claim-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

const CSS = `
  .team-section-wrap {
    width: 100%;
    background: transparent;
    padding: clamp(16px, 2.5vw, 32px) 0;
    font-family: var(--font-sora), "Sora", sans-serif;
  }

  .team-section-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 clamp(16px, 2.5vw, 28px);
    display: grid;
    grid-template-columns: 3.1fr 1fr;
    gap: 14px;
    align-items: stretch;
  }

  /* ── Main Left Card ── */
  .team-main-card {
    background: linear-gradient(135deg, #F0F8FD 0%, #F6FBFE 55%, #EDF7FD 100%);
    border: 1.5px solid #D8EBF8;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 26, 90, 0.04);
    display: flex;
    position: relative;
    overflow: hidden;
    min-height: 290px;
  }

  .team-text-col {
    flex: 1 1 47%;
    padding: clamp(24px, 2.5vw, 36px) clamp(22px, 2.5vw, 36px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  .team-title {
    color: #001A5A;
    font-size: clamp(18px, 1.6vw, 22px);
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.015em;
    margin: 0 0 6px 0;
  }

  .team-subtitle {
    color: #001A5A;
    font-size: clamp(15px, 1.3vw, 17.5px);
    font-weight: 700;
    line-height: 1.3;
    margin: 0 0 12px 0;
    letter-spacing: -0.01em;
  }

  .team-desc {
    color: #475569;
    font-size: clamp(12px, 0.9vw, 13px);
    line-height: 1.6;
    margin: 0 0 20px 0;
    max-width: 480px;
  }

  .team-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #001A5A;
    color: #FFFFFF;
    font-size: 13.5px;
    font-weight: 700;
    padding: 10px 24px;
    border-radius: 9999px;
    text-decoration: none;
    box-shadow: 0 3px 12px rgba(0, 26, 90, 0.2);
    transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
    width: fit-content;
  }

  .team-btn:hover {
    background: #0B2563;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 26, 90, 0.28);
  }

  .team-image-col {
    flex: 1 1 53%;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
  }

  .team-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 12%;
    display: block;
  }

  .team-image-fade {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 50px;
    background: linear-gradient(to right, #F0F8FD, rgba(240, 248, 253, 0));
    pointer-events: none;
  }

  /* ── Right Side Card ── */
  .team-side-card {
    background: linear-gradient(135deg, #F0F8FD 0%, #F6FBFE 55%, #EDF7FD 100%);
    border: 1.5px solid #D8EBF8;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 26, 90, 0.04);
    padding: clamp(20px, 2vw, 28px) clamp(18px, 1.8vw, 24px);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 16px;
  }

  .team-point-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .team-point-badge {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #E0F2FE;
    border: 1.5px solid #BAE6FD;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.12);
  }

  .team-point-content {
    flex: 1;
  }

  .team-point-title {
    color: #001A5A;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
    margin: 0 0 4px 0;
    letter-spacing: -0.01em;
  }

  .team-point-desc {
    color: #64748B;
    font-size: 12px;
    line-height: 1.5;
    margin: 0;
  }

  /* ── Bottom Claims Assistance Row ── */
  .claim-support-row {
    max-width: 1440px;
    margin: 14px auto 0;
    padding: 0 clamp(16px, 2.5vw, 28px);
    display: grid;
    grid-template-columns: 1fr 1.18fr;
    gap: 14px;
    align-items: stretch;
  }

  /* Left Card: Hero Claim Assistance */
  .claim-hero-card {
    background: linear-gradient(135deg, #F0F8FD 0%, #F6FBFE 55%, #EDF7FD 100%);
    border: 1.5px solid #D8EBF8;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 26, 90, 0.04);
    padding: clamp(14px, 1.8vw, 22px) clamp(16px, 2vw, 24px);
    display: flex;
    align-items: center;
    gap: clamp(12px, 1.8vw, 20px);
    position: relative;
    overflow: hidden;
  }

  .claim-dummy-img-wrap {
    flex: 0 0 clamp(85px, 10vw, 125px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .claim-dummy-img {
    width: 100%;
    max-height: 140px;
    object-fit: contain;
    filter: drop-shadow(0 6px 14px rgba(0, 26, 90, 0.12));
    transition: transform 0.25s ease;
  }

  .claim-hero-card:hover .claim-dummy-img {
    transform: translateY(-3px) scale(1.02);
  }

  .claim-hero-content {
    flex: 1;
    min-width: 0;
  }

  .claim-hero-title {
    color: #001A5A;
    font-size: clamp(14.5px, 1.3vw, 17.5px);
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.015em;
    margin: 0 0 6px 0;
  }

  .claim-hero-subtitle {
    color: #0284C7;
    font-size: clamp(11.5px, 0.9vw, 13px);
    font-weight: 500;
    line-height: 1.45;
    margin: 0 0 14px 0;
  }

  .claim-hero-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(90deg, #0284C7 0%, #00B4D8 100%);
    color: #FFFFFF;
    font-size: 13px;
    font-weight: 700;
    padding: 8px 22px;
    border-radius: 9999px;
    text-decoration: none;
    box-shadow: 0 3px 12px rgba(2, 132, 199, 0.28);
    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
    width: fit-content;
  }

  .claim-hero-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.06);
    box-shadow: 0 6px 18px rgba(2, 132, 199, 0.36);
  }

  .claim-btn-arrow {
    display: inline-block;
    transition: transform 0.18s ease;
  }

  .claim-hero-btn:hover .claim-btn-arrow {
    transform: translateX(3px);
  }

  /* Right Card: Our Claims Support */
  .claim-support-card {
    background: linear-gradient(135deg, #F0F8FD 0%, #F6FBFE 55%, #EDF7FD 100%);
    border: 1.5px solid #D8EBF8;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 26, 90, 0.04);
    padding: clamp(14px, 1.6vw, 20px) clamp(16px, 1.8vw, 22px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .claim-support-title {
    color: #001A5A;
    font-size: clamp(14px, 1.2vw, 16px);
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 12px 0;
    letter-spacing: -0.01em;
  }

  .claim-support-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: flex-start;
    gap: 0;
  }

  .claim-step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 clamp(6px, 0.8vw, 12px);
    position: relative;
  }

  .claim-step-item:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: #D8EBF8;
  }

  .claim-step-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #E0F2FE;
    border: 1.5px solid #BAE6FD;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.12);
    transition: transform 0.18s ease;
  }

  .claim-step-item:hover .claim-step-icon-wrap {
    transform: translateY(-2px);
  }

  .claim-step-name {
    color: #001A5A;
    font-size: clamp(11.5px, 0.88vw, 12.5px);
    font-weight: 700;
    line-height: 1.25;
    margin: 0 0 4px 0;
    letter-spacing: -0.01em;
  }

  .claim-step-desc {
    color: #64748B;
    font-size: clamp(10px, 0.76vw, 11px);
    line-height: 1.35;
    margin: 0;
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .team-section-container {
      grid-template-columns: 1fr;
    }
    .team-main-card {
      min-height: auto;
    }
    .claim-support-row {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .team-main-card {
      flex-direction: column;
    }
    .team-image-col {
      height: 240px;
      order: -1;
    }
    .team-image-fade {
      display: none;
    }
    .team-text-col {
      padding: 24px 20px;
    }
    .claim-hero-card {
      flex-direction: column;
      text-align: center;
    }
    .claim-dummy-img-wrap {
      flex: 0 0 90px;
    }
    .claim-hero-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .claim-support-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px 8px;
    }
    .claim-step-item:not(:last-child)::after {
      display: none;
    }
  }
`;
