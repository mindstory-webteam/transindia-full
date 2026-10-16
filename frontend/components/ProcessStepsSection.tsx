"use client";

import React from "react";

/* ─── Inline SVG Icons ─────────────────────────────────────────────────────── */
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

interface ProcessStepsSectionProps {
  showRenew?: boolean;
}

export default function ProcessStepsSection({ showRenew = true }: ProcessStepsSectionProps) {
  const steps = [
    {
      num: "01",
      title: "Understand",
      desc: "We listen to your requirements, risks and budget.",
      icon: <BulbIcon size={18} color="#0284C7" />,
      circleColor: "#E0F2FE",
    },
    {
      num: "02",
      title: "Compare",
      desc: "We explore suitable insurance options based on your needs.",
      icon: <SearchIcon size={18} color="#16A34A" />,
      circleColor: "#DCFCE7",
    },
    {
      num: "03",
      title: "Choose",
      desc: "We explain the important details so you can make an informed decision.",
      icon: <ShieldCheckIcon size={18} color="#9333EA" />,
      circleColor: "#F3E8FF",
    },
    {
      num: "04",
      title: "Manage",
      desc: showRenew
        ? "From servicing and endorsements to policy updates, we're here."
        : "From servicing and endorsements to renewals, we're here.",
      icon: <GearIcon size={18} color="#0284C7" />,
      circleColor: "#E0F2FE",
    },
    ...(showRenew
      ? [
          {
            num: "05",
            title: "Renew",
            desc: "Timely reminders and seamless renewals at optimal terms.",
            icon: <RefreshCwIcon size={18} color="#EA580C" />,
            circleColor: "#FFEDD5",
          },
        ]
      : []),
    {
      num: showRenew ? "06" : "05",
      title: "Claim",
      desc: "We help you navigate the claims process and coordinate with the insurer.",
      icon: <AwardIcon size={18} color="#0D9488" />,
      circleColor: "#CCFBF1",
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="process-steps-section">
        <h3 className="process-steps-title">
          From Your First Question to Your Next Claim
        </h3>

        <div className="process-steps-container">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="process-step-card">
                <div className="process-step-header">
                  <span className="process-step-badge">{step.num}</span>
                  <div
                    className="process-step-icon"
                    style={{ background: step.circleColor }}
                  >
                    {step.icon}
                  </div>
                </div>

                <h4 className="process-step-name">{step.title}</h4>
                <p className="process-step-desc">{step.desc}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="process-step-arrow" aria-hidden="true">
                  &rarr;
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

const CSS = `
  .process-steps-section {
    width: 100%;
    margin-top: 36px;
  }

  .process-steps-title {
    color: #001A5A;
    font-size: clamp(19px, 2vw, 22px);
    font-weight: 800;
    margin-bottom: 24px;
    letter-spacing: -0.015em;
  }

  .process-steps-container {
    display: flex;
    align-items: stretch;
    gap: 8px;
    justify-content: space-between;
  }

  .process-step-card {
    flex: 1;
    min-width: 0;
    background: #FFFFFF;
    border-radius: 14px;
    padding: 18px 14px;
    border: 1px solid #D8EBF8;
    box-shadow: 0 2px 8px rgba(0, 26, 90, 0.03);
    display: flex;
    flex-direction: column;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .process-step-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 26, 90, 0.08);
    border-color: #BAE6FD;
  }

  .process-step-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .process-step-badge {
    background: #F1F5F9;
    color: #64748B;
    font-size: 10.5px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    letter-spacing: 0.02em;
  }

  .process-step-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .process-step-name {
    color: #001A5A;
    font-size: 13.5px;
    font-weight: 700;
    margin: 0 0 6px;
    line-height: 1.25;
  }

  .process-step-desc {
    color: #64748B;
    font-size: 11.5px;
    line-height: 1.5;
    margin: 0;
  }

  .process-step-arrow {
    color: #94A3B8;
    font-size: 18px;
    font-weight: 300;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0 2px;
    user-select: none;
  }

  @media (max-width: 1080px) {
    .process-steps-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .process-step-arrow {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .process-steps-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .process-step-card {
      padding: 14px 12px;
    }
  }

  @media (max-width: 420px) {
    .process-steps-container {
      grid-template-columns: 1fr;
    }
  }
`;
