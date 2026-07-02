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
             Transindia Insurance Broking and Risk Management Pvt. Ltd. is a trusted insurance broking and risk management company committed to helping businesses identify, manage, and mitigate their risks through comprehensive insurance solutions.
            </p>
            <p>
             With the evolution of the Indian insurance industry and the introduction of insurance broking by IRDAI, Transindia was established in July 2006 with a vision to bridge the gap between insurance products and effective risk management practices. Recognizing the need for proper risk assessment, structured insurance planning, and customer-focused advisory, Transindia was built to ensure that clients receive the right coverage, seamless service, and long-term protection.
            </p>
            <p>
             We specialize in Retail and Corporate Insurance, Risk Advisory, and Claims Management, providing end-to-end solutions tailored to the unique requirements of organizations across industries. Our experienced team works closely with clients to design efficient insurance programs, optimize coverage, support policy administration, and ensure smooth claims settlement.
            </p>
            <p>
              
              At Transindia, we believe insurance is not just about policies but about protecting businesses, people, and assets. Through our expertise, industry relationships, and service-driven approach, we continue to deliver transparent, reliable, and value-based risk management solutions to our clients and partners.
            </p>
          </div>

          {/* Check items grid */}
          {/* <div className="check-items-grid">
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
          </div> */}

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
  /* CORE VALUES SECTION — full-width heading + full-width value list */
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

  /* ── Top intro block, full width ── */
  .core-values-intro {
    max-width: 720px;
    margin-bottom: 56px;
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
    margin: 20px 0 0;
    max-width: 520px;
    line-height: 1.7;
    font-family: 'matterregular', sans-serif;
  }

  /* ── Value list, full width below heading ── */
  .values-list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .value-row {
    display: grid;
    grid-template-columns: 64px 56px 1fr;
    align-items: flex-start;
    gap: 24px;
    padding: 28px 20px;
    border-top: 1px solid rgba(17, 24, 39, 0.08);
    position: relative;
    transition: background 0.25s ease, padding-left 0.25s ease;
    border-radius: 12px;
  }

  .values-list .value-row:last-child {
    border-bottom: 1px solid rgba(17, 24, 39, 0.08);
  }

  .value-row::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 3px;
    border-radius: 2px;
    background: linear-gradient(180deg, #00b8c4, #0D47A1);
    transform: scaleY(0);
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  .value-row:hover {
    background: rgba(255, 255, 255, 0.55);
    padding-left: 28px;
  }

  .value-row:hover::before {
    transform: scaleY(1);
  }

  .value-index {
    font-family: var(--font-sora), "Sora", sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: rgba(17, 24, 39, 0.14);
    line-height: 1;
    transition: color 0.25s ease;
  }

  .value-row:hover .value-index {
    color: rgba(0, 184, 196, 0.35);
  }

  .value-icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 12px;
    background: #ffffff;
    border: 1.5px solid #c2eef0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
  }

  .value-row:hover .value-icon {
    background: linear-gradient(135deg, #00b8c4, #0D47A1);
    border-color: transparent;
    transform: scale(1.06);
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

  .value-row:hover .value-icon svg {
    stroke: #ffffff;
  }

  .value-text {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .value-title {
    font-family: var(--font-sora), "Sora", sans-serif;
    font-size: 18px;
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
    max-width: 780px;
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
    .core-values-intro {
      margin-bottom: 40px;
    }
    .core-values-heading {
      font-size: 28px;
    }
    .heading-dark, .heading-primary {
      font-size: 32px;
    }
    .value-row {
      grid-template-columns: 44px 48px 1fr;
      gap: 16px;
      padding: 22px 16px;
    }
    .value-index {
      font-size: 26px;
    }
    .value-title {
      font-size: 16px;
    }
    .value-description {
      font-size: 13px;
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
    .core-values-intro {
      margin-bottom: 32px;
    }
    .core-values-heading {
      font-size: 24px;
    }
    .core-values-subtitle {
      font-size: 14px;
    }
    .heading-dark, .heading-primary {
      font-size: 26px;
    }
    .check-items-grid {
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 40px;
    }
    .value-row {
      grid-template-columns: 1fr;
      gap: 10px;
      padding: 20px 14px;
    }
    .value-index {
      font-size: 22px;
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
    .value-title {
      font-size: 15px;
    }
    .value-description {
      font-size: 13px;
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
    .core-values-intro {
      margin-bottom: 28px;
    }
    .core-values-heading {
      font-size: 22px;
    }
    .core-values-subtitle {
      font-size: 13px;
    }
    .value-row {
      padding: 18px 12px;
      border-radius: 10px;
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
    .value-title {
      font-size: 14px;
    }
    .value-description {
      font-size: 12px;
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

        {/* ── Top: full-width intro ── */}
        <div className="core-values-intro">
          <div className="core-values-badge">Our Values</div>

          <h2 className="core-values-heading">
            What We Stand <span>For</span>
          </h2>

          <p className="core-values-subtitle">
            The principles that guide our decisions, shape our culture, and define our commitment to excellence.
          </p>
        </div>

        {/* ── Below: full-width numbered value list ── */}
        <div className="values-list">
          {coreValues.map((value, i) => (
            <div key={value.id} className="value-row">
              <span className="value-index">{String(i + 1).padStart(2, "0")}</span>
              <div className="value-icon">
                <IconComponent type={value.icon} />
              </div>
              <div className="value-text">
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}