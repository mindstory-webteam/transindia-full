"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SERVICE_CARDS } from "../app/our-services/insuranceData";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SERVICE_DETAIL_BASE = "/our-services";
const CARD_TINTS = ["#FFF0F0", "#F0F8FF", "#F5F0FF", "#FFFBF0"];

// Carousel settings
const CAROUSEL_SETTINGS = {
  autoPlayInterval: 5000,
  transitionDuration: 0.6,
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Plan = {
  label: string;
  desc: string;
  cta: string;
  href: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  imageBg: string;
};

// ─── MANUAL PLANS (mapped from SERVICE_CARDS) ─────────────────────────────────
const PLANS: Plan[] = SERVICE_CARDS.map((s, i) => ({
  label:    s.title,
  desc:     s.description,
  cta:      "Know more",
  slug:     s.slug,
  href:     `${SERVICE_DETAIL_BASE}/${s.slug}`,
  imageSrc: s.image,
  imageAlt: `${s.title} illustration`,
  imageBg:  CARD_TINTS[i % CARD_TINTS.length],
}));

// ─── TRUST ITEMS ──────────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  {
    label:    "24/7\nClaim Assistance",
    imageSrc: "/images/section-3/customer-support.svg",
    imageAlt: "24/7 Claim Assistance",
    iconBg:   "#E6F2FB",
  },
  {
    label:    "Trusted\nCoverage",
    imageSrc: "/images/section-3/knight-shield.svg",
    imageAlt: "Trusted Coverage",
    iconBg:   "#E7F6EC",
  },
  {
    label:    "Fast\nApprovals",
    imageSrc: "/images/section-3/timer-02.svg",
    imageAlt: "Fast Approvals",
    iconBg:   "#ECE9FB",
  },
  {
    label:    "Personalized\nPlans",
    imageSrc: "/images/section-3/user.svg",
    imageAlt: "Personalized Plans",
    iconBg:   "#FCEEE4",
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function InsurancePlansSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const plans = PLANS;
  const cardsPerRow = 4;
  const totalSlides = Math.ceil(plans.length / cardsPerRow);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || plans.length === 0) return;

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, CAROUSEL_SETTINGS.autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlay, plans.length, totalSlides]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);
  };

  const handleMouseEnter = () => {
    setIsAutoPlay(false);
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  return (
    <>
      <style>{CSS}</style>
      <section className="ips-section" ref={sectionRef}>
        <div className="ips-container">

          {/* ── TOP ROW: heading + button ── */}
          <div className="ips-toprow fade-up">
            <div className="ips-heading">
              <h2 className="ips-title">
                Every risk, <span className="ips-orange">covered.</span><br />
                Every life, <span className="ips-teal">protected.</span>
              </h2>
              <p className="ips-subtitle">
                Comprehensive protection across every aspect of<br className="ips-br" />
                your life and business.
              </p>
            </div>
            <Link href={SERVICE_DETAIL_BASE} className="ips-view-all">View all</Link>
          </div>

          {/* ── CAROUSEL ── */}
          <div
            className="ips-carousel-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="ips-carousel-track"
              ref={carouselRef}
              style={{ transform: `translateX(calc(-${currentSlide * 100}%))` }}
            >
              {plans.map((plan, i) => (
                <div key={plan.slug || i} className="ips-carousel-item">
                  <div className="ips-card fade-in">
                    <Link
                      href={plan.href}
                      className="ips-card-img-link"
                      aria-label={`Explore ${plan.label} plans`}
                    >
                      <div className="ips-card-img-wrap" style={{ background: plan.imageBg }}>
                        {plan.imageSrc ? (
                          <img
                            src={plan.imageSrc}
                            alt={plan.imageAlt}
                            className="ips-card-img"
                          />
                        ) : null}
                      </div>
                    </Link>

                    <div className="ips-card-body">
                      <h3 className="ips-card-title">{plan.label}</h3>
                      <p className="ips-card-desc">{plan.desc}</p>
                      <Link href={plan.href} className="ips-card-cta">
                        {plan.cta}
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M3.5 9H14.5M14.5 9L10 4.5M14.5 9L10 13.5"
                            stroke="currentColor" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── NAVIGATION DOTS ── */}
            {totalSlides > 1 && (
              <div className="ips-carousel-dots">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    className={`ips-dot ${currentSlide === index ? "active" : ""}`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Go to row ${index + 1}`}
                    aria-current={currentSlide === index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── TRUST BANNER ── */}
          <div className="ips-banner fade-up">
            <div className="ips-banner-left">
              <img
                src="/images/section-3/magnific_create-a-clean-3d-shield-_cDOaj6u0eP.png"
                alt="Protection shield"
                className="ips-banner-shield"
              />
              <div className="ips-banner-text">
                <p className="ips-banner-title">
                  Protection that stays with you,<br />
                  <span className="ips-teal">every step of the way.</span>
                </p>
                <p className="ips-banner-desc">
                  Reliable coverage, expert support, and quick claim assistance
                  whenever you need it.
                </p>
              </div>
            </div>

            <div className="ips-banner-divider" />

            <div className="ips-banner-stats">
              {TRUST_ITEMS.map((item, i) => (
                <div key={i} className="ips-banner-stat">
                  <div className="ips-stat-icon-wrap" style={{ background: item.iconBg }}>
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="ips-stat-icon"
                    />
                  </div>
                  <span className="ips-stat-label">
                    {item.label.split("\n").map((line, j) => (
                      <span key={j}>{line}{j === 0 && <br />}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,800&display=swap');

  .ips-section {
    background: linear-gradient(109deg, #FFE9E5 0%, #B2F6FF 150%);
    padding: clamp(60px, 8vw, 100px) 0 clamp(64px, 9vw, 108px);
    font-family: var(--font-sora), "Sora", sans-serif;
  }

  .ips-container {
    max-width: 1500px;
    margin: 0 auto;
    padding: 0 clamp(20px, 5vw, 88px);
  }

  /* ── Top row ── */
  .ips-toprow {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: clamp(36px, 5vw, 56px);
    flex-wrap: wrap;
  }

  .ips-heading { flex: 1; min-width: 260px; }

  .ips-title {
    font-size: 38px;
    font-weight: 900;
    color: #111827;
    line-height: 1.15;
    margin: 0 0 14px;
    letter-spacing: -0.03em;
  }

  .ips-orange { color: #F15A3E; }
  .ips-teal   { color: #00BCD4; }

  .ips-subtitle {
    font-size: 18px;
    color: #535862;
    line-height: 1.7;
    margin: 0;
    font-weight: 400;
  }

  .ips-br { display: none; }
  @media(min-width:640px){ .ips-br { display: inline; } }

  .ips-view-all {
    flex-shrink: 0;
    padding: 13px 28px;
    border: 2px solid #1A1A2E;
    border-radius: 12px;
    color: #1A1A2E;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    background: transparent;
    transition: background 0.2s, color 0.2s;
    align-self: flex-start;
    margin-top: 4px;
    cursor: pointer;
  }

  .ips-view-all:hover {
    background: #1A1A2E;
    color: #fff;
  }

  @media(max-width: 540px) {
    .ips-toprow {
      flex-direction: column;
      align-items: flex-start;
    }
    .ips-view-all {
      width: 100%;
      text-align: center;
    }
  }

  /* ── CAROUSEL ── */
  .ips-carousel-wrapper {
    position: relative;
    margin-bottom: clamp(36px, 5vw, 56px);
    overflow: hidden;
  }

  .ips-carousel-track {
    display: flex;
    gap: clamp(12px, 1.8vw, 20px);
    transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }

  .ips-carousel-item {
    flex: 0 0 calc(25% - clamp(9px, 1.35vw, 15px));
    min-width: calc(25% - clamp(9px, 1.35vw, 15px));
  }

  /* Tablet: 2 columns */
  @media(max-width: 960px) {
    .ips-carousel-item {
      flex: 0 0 calc(50% - clamp(6px, 0.9vw, 10px));
      min-width: calc(50% - clamp(6px, 0.9vw, 10px));
    }
  }

  /* Mobile: 1 column */
  @media(max-width: 520px) {
    .ips-carousel-item {
      flex: 0 0 100%;
      min-width: 100%;
    }
  }

  /* Single card */
  .ips-card {
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    transition: transform 0.26s ease, box-shadow 0.26s ease;
  }

  .ips-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.11);
  }

  @media(hover: none) {
    .ips-card:hover {
      transform: none;
      box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    }
  }

  .ips-card-img-link {
    display: block;
    text-decoration: none;
  }

  .ips-card-img-wrap {
    width: 100%;
    height: clamp(110px, 12vw, 130px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 20px 16px;
    flex-shrink: 0;
  }

  .ips-card-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center bottom;
    display: block;
  }

  .ips-card-body {
    padding: clamp(16px, 2vw, 20px) clamp(16px, 2vw, 22px) clamp(20px, 2.5vw, 26px);
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    background: #fff;
  }

  .ips-card-title {
    font-size: clamp(15px, 1.4vw, 19px);
    font-weight: 700;
    color: #111827;
    margin: 0;
    letter-spacing: -0.01em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ips-card-desc {
    font-size: clamp(12.5px, 1.05vw, 14.5px);
    color: #6B7280;
    line-height: 1.72;
    margin: 0;
    flex: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ips-card-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 700;
    color: #F4622A;
    text-decoration: none;
    margin-top: 6px;
    transition: gap 0.2s ease;
  }

  .ips-card-cta:hover { gap: 10px; }

  /* ── NAVIGATION DOTS ── */
  .ips-carousel-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: clamp(20px, 3vw, 32px);
  }

  .ips-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(17, 24, 39, 0.2);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
  }

  .ips-dot:hover {
    background: rgba(17, 24, 39, 0.4);
    transform: scale(1.15);
  }

  .ips-dot.active {
    background: #F15A3E;
    width: 28px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(241, 90, 62, 0.3);
  }

  /* ── Trust Banner ── */
  .ips-banner {
    background: linear-gradient(135deg, #EBF5FF 0%, #EEF8FF 100%);
    border-radius: 20px;
    padding: clamp(20px, 3vw, 36px) clamp(20px, 4vw, 44px);
    display: flex;
    align-items: center;
    gap: clamp(16px, 3vw, 40px);
    flex-wrap: wrap;
    box-shadow: 0 2px 20px rgba(0,0,0,0.05);
  }

  .ips-banner-left {
    display: flex;
    align-items: center;
    gap: 18px;
    flex: 1;
    min-width: 220px;
  }

  .ips-banner-shield {
    width: clamp(52px, 7vw, 90px);
    height: auto;
    flex-shrink: 0;
    object-fit: contain;
  }

  .ips-banner-title {
    font-size: clamp(14px, 1.5vw, 19px);
    font-weight: 800;
    color: #0B2563;
    line-height: 1.3;
    margin: 0 0 8px;
  }

  .ips-banner-desc {
    font-size: clamp(12px, 0.95vw, 13.5px);
    color: #6B7280;
    line-height: 1.65;
    margin: 0;
  }

  .ips-banner-divider {
    width: 1px;
    height: 72px;
    background: rgba(0,0,0,0.1);
    flex-shrink: 0;
    align-self: center;
  }

  @media(max-width: 720px) { .ips-banner-divider { display: none; } }

  .ips-banner-stats {
    display: flex;
    gap: clamp(12px, 3.5vw, 44px);
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .ips-banner-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
    min-width: 60px;
  }

  .ips-stat-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ips-stat-icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
    display: block;
  }

  .ips-stat-label {
    font-size: 12.5px;
    font-weight: 700;
    color: #374151;
    line-height: 1.45;
  }

  @media(max-width: 640px) {
    .ips-banner {
      flex-direction: column;
      align-items: stretch;
      gap: 18px;
      padding: 28px 22px;
    }

    .ips-banner-left {
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 14px;
      min-width: 0;
    }

    .ips-banner-shield {
      width: 120px;
    }

    .ips-banner-text {
      width: 100%;
      text-align: left;
    }

    .ips-banner-stats {
      flex-direction: column;
      width: 100%;
      gap: 0;
      flex-wrap: nowrap;
    }

    .ips-banner-stat {
      width: 100%;
      padding: 22px 0;
      border-top: 1px solid rgba(0,0,0,0.08);
    }
  }

  /* ── Animations ── */
  .fade-up {
    opacity: 0;
    transform: translateY(24px);
    animation: ips-fadein 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  .fade-in {
    opacity: 1;
    animation: none;
  }

  @keyframes ips-fadein {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media(prefers-reduced-motion: reduce) {
    .fade-up {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
`;