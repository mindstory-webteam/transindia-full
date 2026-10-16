"use client";

import React from "react";

/* ─── Brand Colors ─────────────────────────────────────────────────────────── */
const NAVY = "#001A5A";
const BORDER_COLOR = "#D8EBF8";
const TEXT_MUTED = "#64748B";

/* ─── Inline SVG Icons ─────────────────────────────────────────────────────── */
const HeadsetIcon = ({ size = 22, color = "#0284C7" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const SearchIcon = ({ size = 22, color = "#16A34A" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UserGroupIcon = ({ size = 22, color = "#9333EA" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ShieldCheckIcon = ({ size = 22, color = "#EA580C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

export default function PartnerFeatureCards() {
  const cards = [
    {
      title: "Understand Your Needs",
      desc: "Every customer and business has different risks. We take the time to understand what matters to you.",
      bgCircle: "#E0F2FE",
      icon: <HeadsetIcon size={22} color="#0284C7" />,
    },
    {
      title: "Find the Right Coverage",
      desc: "Our team evaluates suitable options and helps you understand coverage, benefits, exclusions and important conditions.",
      bgCircle: "#DCFCE7",
      icon: <SearchIcon size={22} color="#16A34A" />,
    },
    {
      title: "Stay With You",
      desc: "Our relationship doesn't end when your policy is issued. We remain available for servicing, renewals and queries.",
      bgCircle: "#F3E8FF",
      icon: <UserGroupIcon size={22} color="#9333EA" />,
    },
    {
      title: "Support When It Matters",
      desc: "When you need to make a claim, our team helps you navigate the process and follow up with the insurer.",
      bgCircle: "#FFEDD5",
      icon: <ShieldCheckIcon size={22} color="#EA580C" />,
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="partner-features-wrap">
        <h3 className="partner-features-title">
          More Than a Policy. A Partner You Can Rely On.
        </h3>

        <div className="partner-features-grid">
          {cards.map((card, i) => (
            <div key={i} className="partner-feature-card">
              <div
                className="partner-feature-icon-circle"
                style={{ background: card.bgCircle }}
              >
                {card.icon}
              </div>
              <h4 className="partner-feature-card-title">{card.title}</h4>
              <p className="partner-feature-card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const CSS = `
  .partner-features-wrap {
    width: 100%;
    margin-bottom: 40px;
  }

  .partner-features-title {
    text-align: left;
    color: #001A5A;
    font-size: clamp(17px, 1.6vw, 19px);
    font-weight: 700;
    margin-bottom: 20px;
    letter-spacing: -0.01em;
  }

  .partner-features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .partner-feature-card {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 24px 20px;
    border: 1px solid #D8EBF8;
    box-shadow: 0 2px 8px rgba(0, 26, 90, 0.03);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .partner-feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 24px rgba(0, 26, 90, 0.08);
    border-color: #BAE6FD;
  }

  .partner-feature-icon-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .partner-feature-card-title {
    color: #001A5A;
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 8px;
    line-height: 1.3;
  }

  .partner-feature-card-desc {
    color: #64748B;
    font-size: 12.5px;
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: 1080px) {
    .partner-features-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }

  @media (max-width: 580px) {
    .partner-features-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }
    .partner-feature-card {
      padding: 20px 16px;
    }
  }
`;
