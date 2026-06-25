"use client"

import React, {
  useEffect,
  useRef,
  useState
} from 'react';

const checkItems = [
  { id: 1, text: "IRDAI-licensed for both Life & General insurance broking" },
  { id: 2, text: "Incorporated July 2006 — over 18 years of trusted service" },
  { id: 3, text: "100% independent broker — we work for you, not insurers" },
  { id: 4, text: "Dedicated claims assistance at no extra cost" },
];

export default function OurStory() {
  return (
    <>
      <style>{CSS}</style>
      <section className="our-story-section">
        <div className="our-story-container">
          {/* Badge */}
          <div className="our-story-badge">Our Story</div>

          {/* Heading */}
          <h2 className="our-story-heading">
            <span className="heading-dark">Risk Management,</span>
            <span className="heading-primary">Done Right</span>
          </h2>

          {/* Body paragraphs */}
          <div className="our-story-body">
            <p>
              Risk Management, which is very much in practice in Western
              countries, was seriously felt in the Indian Insurance Market during
              early 2000. When the Government of India announced privatization in
              the Insurance Industry, it formed the Insurance Regulatory and
              Development Authority of India (IRDAI) to address negligible
              insurance penetration among the public.
            </p>
            <p>
              Insurance products are intangible and legalistic. Insurance
              Companies were eager to accept policies without proper Risk
              Assessment — leading to inordinate claim delays and refusals on
              technical grounds. This is precisely the gap TransIndia was built
              to bridge.
            </p>
            <p>
              IRDAI introduced the concept of Broking in 2002, as practiced in
              Western countries.{" "}
              <strong>Transindia Insurance Brokers (India) Pvt. Ltd.</strong>,
              incorporated in July 2006, has since been a licensed insurance
              intermediary — fully concerned about the risks and wellbeing of
              all patrons, associates, and well-wishers.
            </p>
          </div>

          {/* Check items grid */}
          <div className="check-items-grid">
            {checkItems.map((item) => (
              <div key={item.id} className="check-item">
                <span className="check-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9.5L7 13.5L15 5" stroke="#00b8c4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="check-text">{item.text}</span>
              </div>
            ))}
          </div>

          <CoreValuesSection />
        </div>
      </section>
    </>
  );
}

const CSS = `
  .our-story-section {
    background-color: #F8FAFF;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 20px 90px 80px;
    font-family: 'matterregular', sans-serif;
  }

  .our-story-container {
    width: 100%;
    max-width: 1500px;
    padding: 0 80px;
    box-sizing: border-box;
  }

  .our-story-badge {
    display: inline-block;
    background-color: #e0f4f4;
    color: #00b8c4;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 20px;
    margin-bottom: 28px;
  }

  .our-story-heading {
    margin: 0 0 48px 0;
    font-family: var(--font-sora), "Sora", sans-serif;
    line-height: 1.1;
  }

  .heading-dark {
    display: block;
    font-size: 38px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -1px;
  }

  .heading-primary {
    display: block;
    font-size: 38px;
    font-weight: 800;
    color: #00b8c4;
    letter-spacing: -1px;
  }

  .our-story-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 52px;
    max-width: 1400px;
  }

  .our-story-body p {
    margin: 0;
    font-size: 16px;
    line-height: 1.75;
    color: #374151;
  }

  .our-story-body strong {
    font-weight: 700;
    color: #111827;
  }

  .check-items-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 80px;
    max-width: 900px;
    margin-bottom: 60px;
  }

  .check-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    animation: slideInLeft 0.6s ease-out forwards;
    opacity: 0;
  }

  .check-item:nth-child(1) { animation-delay: 0.1s; }
  .check-item:nth-child(2) { animation-delay: 0.2s; }
  .check-item:nth-child(3) { animation-delay: 0.3s; }
  .check-item:nth-child(4) { animation-delay: 0.4s; }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .check-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 1px;
  }

  .check-text {
    font-size: 15px;
    line-height: 1.6;
    color: #374151;
  }

  /* ════════════════════════════════════════════════════════════════ */
  /* CORE VALUES SECTION                                              */
  /* ════════════════════════════════════════════════════════════════ */

  .core-values-section {
    margin-top: 80px;
    padding: 80px 0;
   background: linear-gradient(109deg, #FFE9E5 0%, #B2F6FF 150%);
    border-radius: 24px;
    position: relative;
    overflow: hidden;
  }

  .core-values-section::before {
    content: '';
    position: absolute;
    inset: 0;
 
    pointer-events: none;
  }

  .core-values-content {
    position: relative;
    z-index: 1;
    padding: 0 60px;
  }

  .core-values-badge {
    display: inline-block;
    background: #e0f4f4;
    color: #00b8c4;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 20px;
    margin-bottom: 20px;
  }

  .core-values-heading {
    font-family: var(--font-sora), "Sora", sans-serif;
    font-size: 38px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -1px;
    margin: 0 0 8px;
    line-height: 1.15;
  }

  .core-values-heading span {
    color: #00b8c4;
  }

  .core-values-heading::after {
    content: '';
    display: block;
    width: 52px;
    height: 4px;
    background: linear-gradient(90deg, #00b8c4, #0D47A1);
    border-radius: 2px;
    margin-top: 16px;
  }

  .core-values-subtitle {
    font-size: 15px;
    color: #6B7280;
    margin: 20px 0 52px;
    max-width: 520px;
    line-height: 1.7;
    font-family: 'matterregular', sans-serif;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }

  .value-card {
    background: #ffffff;
    border: 1px solid #E5E9F7;
    border-radius: 18px;
    padding: 30px 28px;
    transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .value-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00b8c4, #0D47A1);
    opacity: 0;
    transition: opacity 0.25s ease;
    border-radius: 18px 18px 0 0;
  }

  .value-card:hover {

    transform: translateY(-3px);
  
  }

  .value-card:hover::before {
    opacity: 1;
  }

  .value-card-content {
    position: relative;
    z-index: 1;
  }

  .value-card-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }

  .value-icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #e0f4f4 0%, #e8eeff 100%);
    border: 1.5px solid #c2eef0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.25s ease, border-color 0.25s ease;
  }

  .value-card:hover .value-icon {

    
  }

  .value-icon svg {
    width: 22px;
    height: 22px;
    stroke: #00b8c4;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke 0.25s ease;
  }

  .value-card:hover .value-icon svg {
    stroke: #0D47A1;
  }

  .value-title {
    font-family: var(--font-sora), "Sora", sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    line-height: 1.35;
    letter-spacing: -0.2px;
  }

  .value-description {
    font-size: 14px;
    line-height: 1.75;
    color: #4B5563;
    margin: 0;
    font-family: 'matterregular', sans-serif;
  }

  /* 5th card — centered row */
  .values-center-row {
    display: flex;
    justify-content: center;
  }

  .value-card-center {
    width: calc(50% - 10px);
  }

  /* Responsive */
  @media (max-width: 1366px) {
    .our-story-section {
      padding: 120px 40px 90px 40px;
    }
    .our-story-container {
      padding: 0 40px;
    }
    .core-values-content {
      padding: 0 40px;
    }
    .core-values-heading {
      font-size: 32px;
    }
  }

  @media (max-width: 1024px) {
    .our-story-section {
      padding: 120px 30px 90px 30px;
    }
    .our-story-container {
      padding: 0 30px;
    }
    .core-values-section {
      padding: 60px 0;
      border-radius: 16px;
    }
    .core-values-content {
      padding: 0 32px;
    }
    .core-values-heading {
      font-size: 28px;
    }
    .heading-dark, .heading-primary {
      font-size: 32px;
    }
    .values-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .value-card {
      padding: 24px 22px;
    }
    .value-title {
      font-size: 16px;
    }
    .value-description {
      font-size: 13px;
    }
    .value-card-center {
      width: calc(50% - 10px);
    }
  }

  @media (max-width: 768px) {
    .our-story-section {
      padding: 80px 20px 60px 20px;
    }
    .our-story-container {
      padding: 0 20px;
    }
    .core-values-section {
      margin-top: 60px;
      padding: 50px 0;
      border-radius: 12px;
    }
    .core-values-content {
      padding: 0 24px;
    }
    .core-values-heading {
      font-size: 24px;
    }
    .core-values-subtitle {
      font-size: 14px;
      margin-bottom: 36px;
    }
    .heading-dark, .heading-primary {
      font-size: 26px;
    }
    .check-items-grid {
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 40px;
    }
    .values-grid {
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    .value-card {
      padding: 20px 18px;
    }
    .value-card-center {
      width: 100%;
    }
    .value-title {
      font-size: 15px;
    }
    .value-description {
      font-size: 13px;
    }
    .value-icon {
      width: 42px;
      height: 42px;
      min-width: 42px;
    }
    .value-icon svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 480px) {
    .our-story-section {
      padding: 60px 16px 40px 16px;
    }
    .our-story-container {
      padding: 0 16px;
    }
    .core-values-section {
      margin-top: 40px;
      padding: 40px 0;
    }
    .core-values-content {
      padding: 0 16px;
    }
    .core-values-heading {
      font-size: 22px;
    }
    .core-values-subtitle {
      font-size: 13px;
      margin-bottom: 28px;
    }
    .value-card {
      padding: 18px 16px;
      border-radius: 14px;
    }
    .value-card-header {
      gap: 10px;
      margin-bottom: 12px;
    }
    .value-title {
      font-size: 14px;
    }
    .value-description {
      font-size: 12px;
    }
    .value-icon {
      width: 38px;
      height: 38px;
      min-width: 38px;
      border-radius: 10px;
    }
    .value-icon svg {
      width: 18px;
      height: 18px;
    }
  }
`;

interface CoreValue {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const coreValues: CoreValue[] = [
  {
    id: 1,
    title: "Performing Beyond Excellence",
    description:
      "We believe that achieving excellence is just a milestone in the journey. We strive to surpass excellence in every endeavor we undertake, pushing boundaries and setting new standards.",
    icon: "target"
  },
  {
    id: 2,
    title: "Building Trust & Transparency",
    description:
      "We operate with absolute transparency and business ethics. Trust and transparency are the cornerstone of every relationship we build with our customers and stakeholders.",
    icon: "shield"
  },
  {
    id: 3,
    title: "Prioritising Our Customers",
    description:
      "Our customers are the foundation of our business. We design every service with the customer first approach, constantly innovating to exceed expectations.",
    icon: "users"
  },
  {
    id: 4,
    title: "Becoming the Preferred Employer",
    description:
      "We create an employee-friendly culture that attracts talent, encourages innovation, and provides ample growth opportunities for professional development.",
    icon: "briefcase"
  },
  {
    id: 5,
    title: "Committed to Social Advancement",
    description:
      "Our responsibility towards society is paramount. We conduct business with integrity, supporting our customers, employees, and communities with moral and ethical standards.",
    icon: "heart"
  }
];

function IconComponent({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    target: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="12" cy="12" r="5"></circle>
        <circle cx="12" cy="12" r="9"></circle>
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    briefcase: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    )
  };

  return icons[type] || icons.target;
}

function CoreValuesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="core-values-section" ref={containerRef}>
      <div className="core-values-content">
        {/* Badge */}
        <div className="core-values-badge">Our Values</div>

        {/* Heading */}
        <h2 className="core-values-heading">
          What We Stand <span>For</span>
        </h2>

        {/* Subtitle */}
        <p className="core-values-subtitle">
          The principles that guide our decisions, shape our culture, and define our commitment to excellence
        </p>

        {/* 2×2 grid — first 4 values */}
        <div className="values-grid">
          {coreValues.slice(0, 4).map((value) => (
            <div key={value.id} className="value-card">
              <div className="value-card-content">
                <div className="value-card-header">
                  <div className="value-icon">
                    <IconComponent type={value.icon} />
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                </div>
                <p className="value-description">{value.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 5th card — centered below the grid */}
        <div className="values-center-row">
          <div className="value-card value-card-center">
            <div className="value-card-content">
              <div className="value-card-header">
                <div className="value-icon">
                  <IconComponent type={coreValues[4].icon} />
                </div>
                <h3 className="value-title">{coreValues[4].title}</h3>
              </div>
              <p className="value-description">{coreValues[4].description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}