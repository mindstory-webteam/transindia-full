"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrum from "@/components/Breadcrum";

/* ── Stats data ── */
const STATS = [
  { end: 20000, prefix: "", suffix: "+", label: "Policies Sold", icon: "shield" },
  { end: 8000, prefix: "", suffix: "+", label: "Happy Clients", icon: "users" },
  { end: 20, prefix: "₹", suffix: "Cr+", label: "Claim Settled", icon: "check" },
  { end: 10, prefix: "", suffix: "+", label: "Years of Trust", icon: "clock" },
];

/* ── Icons ── */
function StatIcon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    default:
      return null;
  }
}

/* ── Animated counter ── */
function Counter({ end, prefix = "", suffix = "", start, duration = 1800 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(end * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, end, duration]);

  return (
    <>
      {prefix}
      {value.toLocaleString("en-IN")}
      <span>{suffix}</span>
    </>
  );
}

export default function AboutHero() {
  const statsRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); // animate once
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section
        className="about-hero"
        style={{ background: "linear-gradient(180deg, #F0F8FD 0%, #E6F3FA 100%)" }}
      >
        <div className="about-inner">
          <div className="about-trail-wrapper">
            <Breadcrum crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
          </div>

          <div className="about-content">
            <h1 className="about-title">
              India&apos;s Most Trusted
              <br />
              <span style={{ color: "#F15A40" }}>Insurance</span>{" "}
              <span style={{ color: "#20BEC6" }}>Marketplace.</span>
            </h1>
            <p className="about-desc">
              We exist to make insurance simple, honest, and accessible for every Indian family — whether you&apos;re planning for tomorrow or protecting what you&apos;ve built today.
            </p>

            <div className="about-btns">
              <Link href="/contact-us" className="about-btn-orange">Talk to an Expert</Link>
              <Link href="/careers" className="about-btn-ghost">Join Our Team</Link>
            </div>
          </div>

          <div className="about-mobile-visual">
            <Image
              src="/images/about/ABOUT/About-banner-2.png"
              alt="About TransIndia"
              width={1200}
              height={896}
              sizes="(max-width: 600px) 80vw, 45vw"
              priority
            />
          </div>

          <div className="about-lg-banner">
            <Image
              src="/images/about/ABOUT/About-banner-1.png"
              alt="About TransIndia Banner"
              width={1400}
              height={996}
              sizes="(max-width: 1450px) 42vw, 600px"
              priority
            />
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="about-stats-bar" ref={statsRef}>
          <div className="about-stats-inner">
            {STATS.map((s) => (
              <div key={s.label} className="about-stat">
                <div className="about-stat-icon">
                  <StatIcon name={s.icon} />
                </div>
                <div className="about-stat-text">
                  <p className="about-stat-value">
                    <Counter end={s.end} prefix={s.prefix} suffix={s.suffix} start={inView} />
                  </p>
                  <p className="about-stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const CSS = `
  .about-hero {
    background: linear-gradient(180deg, #F0F8FD 0%, #E6F3FA 100%);
    position: relative;
    overflow: visible;
    padding-top: 150px;
    padding-bottom: 75px;
    font-family: 'matterregular', sans-serif;
  }

  .about-inner {
    max-width: 1350px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    min-height: 535px;
    position: relative;
    z-index: 2;
  }

  .about-trail-wrapper {
    position: absolute;
    top: 40px;
    left: 32px;
  }

  .about-trail-wrapper .bc-link { color: #001250 !important; }
  .about-trail-wrapper .bc-link:hover { color: #001250 !important; opacity: 0.8; }
  .about-trail-wrapper .bc-sep { color: #001250 !important; opacity: 0.5; }
  .about-trail-wrapper .bc-current { color: #001250 !important; font-weight: 600; }

  .about-content {
    position: relative;
    z-index: 10;
    flex: 0 0 52%;
    padding-bottom: 48px;
  }

  .about-title {
    font-size: 55px;
    font-weight: 800;
    color: #001250;
    line-height: 1.15;
    margin: 0 0 14px 0;
    letter-spacing: -0.5px;
  }

  .about-desc {
    font-size: 15px;
    color: #001250;
    line-height: 1.72;
    max-width: 540px;
    margin: 0 0 32px 0;
  }

  .about-btns {
    display: flex;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
  }

  .about-btn-orange {
    background: #e84b2a;
    color: #fff;
    text-decoration: none;
    padding: 12px 26px;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 700;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    display: inline-flex;
    align-items: center;
  }

  .about-btn-ghost {
    background: transparent;
    color: #001250;
    border: 2px solid #001250;
    text-decoration: none;
    padding: 11px 24px;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 700;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
    display: inline-flex;
    align-items: center;
  }

  .about-btn-ghost:hover {
    background: #F0F7FF;
    color: #001250;
    border-color: #001250;
  }

  .about-mobile-visual {
    display: none;
  }

  .about-lg-banner {
    position: absolute;
    right: 32px;
    bottom: -40px;
    width: 42%;
    max-width: 600px;
    z-index: 1;
    pointer-events: none;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }

  .about-lg-banner img {
    width: 100%;
    height: auto;
    max-height: 560px;
    display: block;
    object-fit: contain;
    object-position: bottom right;
  }

  @media (max-width: 1450px) {
    .about-lg-banner { right: 24px; width: 40%; }
    .about-lg-banner img { max-height: 520px; }
  }

  @media (max-width: 1280px) {
    .about-lg-banner { width: 38%; }
    .about-lg-banner img { max-height: 470px; }
  }

  /* ── Stats bar ── */
  .about-stats-bar {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    width: calc(100% - 64px);
    max-width: 1300px;
    z-index: 20;
  }

  .about-stats-inner {
    width: 100%;
    padding: 26px 36px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    background: #fff;
    border-radius: 16px;
    box-shadow:
      0 8px 32px rgba(10, 31, 110, 0.13),
      0 2px 8px rgba(0, 0, 0, 0.07);
  }

  .about-stat {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .about-stat + .about-stat {
    border-left: 1px solid #e3e8f0;
  }

  .about-stat-icon {
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 10px;
    background: #E4F6F8;
    border: 1px solid #C6ECEF;
    color: #20BEC6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .about-stat-text { text-align: left; }

  .about-stat-value {
    font-size: 28px;
    font-weight: 800;
    color: #001250;
    line-height: 1;
    margin: 0 0 6px 0;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .about-stat-value span { color: #001250; }

  .about-stat-label {
    font-size: 14px;
    color: #4a5a85;
    font-weight: 500;
    margin: 0;
  }

  /* ── ≤1200px ── */
  @media (max-width: 1200px) {
    .about-trail-wrapper { top: -10px; }
    .about-title { font-size: 46px; }
    .about-stats-inner { padding: 24px 24px; }
    .about-stat { gap: 12px; }
    .about-stat-value { font-size: 24px; }
    .about-stat-label { font-size: 13px; }
  }

  /* ── Tablets (≤1024px) ── */
  @media (max-width: 1024px) {
    .about-lg-banner { display: none; }
    .about-hero {
      padding-top: 110px;
      padding-bottom: 60px;
      overflow: visible;
    }
    .about-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      min-height: 400px;
      padding: 0 28px;
    }
    .about-trail-wrapper { display: none; }

    .about-content {
      flex: 0 0 52%;
      padding-bottom: 60px;
      text-align: left;
    }
    .about-title { font-size: 34px; }
    .about-desc { max-width: 100%; margin-bottom: 24px; margin-left: 0; }
    .about-btns { justify-content: flex-start; }

    .about-mobile-visual {
      display: block;
      flex: 0 0 44%;
      text-align: right;
      padding-bottom: 60px;
      margin-top: 0;
    }
    .about-mobile-visual img {
      display: inline-block;
      width: 100%;
      max-width: 360px;
      max-height: 380px;
      height: auto;
      object-fit: contain;
    }

    .about-stats-bar { width: calc(100% - 48px); }

    .about-stats-inner {
      grid-template-columns: repeat(2, 1fr);
      gap: 0;
      padding: 8px 20px;
    }
    .about-stat { justify-content: flex-start; padding: 18px 16px; }
    .about-stat + .about-stat { border-left: none; }
    .about-stat:nth-child(even) { border-left: 1px solid #e3e8f0; }
    .about-stat:nth-child(1), .about-stat:nth-child(2) { border-bottom: 1px solid #e3e8f0; }
  }

  /* ── Mobile (≤600px) ── */
  @media (max-width: 600px) {
    .about-hero { padding-top: 100px; }
    .about-inner {
      padding: 0 20px;
      min-height: auto;
      flex-direction: column;
      align-items: flex-start;
    }
    .about-trail-wrapper { display: none; }
    .about-content { padding-bottom: 20px; width: 100%; }
    .about-title { font-size: 26px; }

    .about-btns { flex-direction: column; width: 100%; }
    .about-btn-orange, .about-btn-ghost { width: 100%; justify-content: center; }

    .about-mobile-visual {
      display: block;
      width: 100%;
      text-align: center;
      margin-top: 20px;
      padding-bottom: 140px;
    }
    .about-mobile-visual img {
      width: 80%;
      max-width: 300px;
      max-height: 320px;
      height: auto;
      object-fit: contain;
    }

    .about-stats-bar { width: calc(100% - 32px); }
    .about-stats-inner { padding: 4px 12px; border-radius: 12px; }
    .about-stat { padding: 16px 8px; gap: 10px; }
    .about-stat-icon { width: 38px; height: 38px; border-radius: 8px; }
    .about-stat-icon svg { width: 18px; height: 18px; }
    .about-stat-value { font-size: 20px; }
    .about-stat-label { font-size: 12px; }
  }

  /* ── Small phones (≤420px): single column ── */
  @media (max-width: 420px) {
    .about-stats-inner { grid-template-columns: 1fr; }
    .about-stat { border-left: none !important; border-bottom: 1px solid #e3e8f0; }
    .about-stat:last-child { border-bottom: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .about-stat-value { transition: none; }
  }
`;