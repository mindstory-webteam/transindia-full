"use client"

import { useState } from "react";

// ── Types ───────────────────────────────────────────────────────────────────

interface CalculatorItem {
  label: string;
  imgSrc: string;
}

interface Category {
  title: string;
  badgeImg: string;
  badgeBg: string;
  headerBg: string;
  iconBg: string;
  items: CalculatorItem[];
}

// ── Data ─────────────────────────────────────────────────────────────────────

const categories: Category[] = [
  {
    title: "Home & Property\ncalculators",
    badgeImg: "/images/section-3/home security concept with smart house icon.svg",
    badgeBg: "#FFBE8C",
    headerBg: "#FFF3E8",
    iconBg: "#FFF3E8",
    items: [
      { label: "Home Loan Calculator",   imgSrc: "/images/section-3/home-13.svg" },
      { label: "EMI Calculator",         imgSrc: "/images/section-3/calculate.svg" },
      { label: "Stamp Duty Calculator",  imgSrc: "/images/section-3/google-doc.svg" },
      { label: "Rent vs Buy Calculator", imgSrc: "/images/section-3/balance-scale.svg" },
    ],
  },
  {
    title: "Money & Finance\nCalculators",
    badgeImg: "/images/section-3/coins.svg",
    badgeBg: "#A8F0C6",
    headerBg: "#EDFDF4",
    iconBg: "#EDFDF4",
    items: [
      { label: "Compound Interest Calculator", imgSrc: "/images/section-3/chart-histogram.svg" },
      { label: "Saving Goal Calculator",       imgSrc: "/images/section-3/target-02.svg" },
      { label: "Inflation Calculator",         imgSrc: "/images/section-3/auto-conversations.svg" },
      { label: "Loan Eligibility Calculator",  imgSrc: "/images/section-3/coins-01.svg" },
    ],
  },
  {
    title: "Daily Life\nCalculators",
    badgeImg: "/images/section-3/budget management with financial calculator and money coins.svg",
    badgeBg: "#C4A8F5",
    headerBg: "#F3EFFE",
    iconBg: "#F3EFFE",
    items: [
      { label: "Age calculator",           imgSrc: "/images/section-3/user-circle.svg" },
      { label: "Date Duration Calculator", imgSrc: "/images/section-3/calendar-03.svg" },
      { label: "Time Zone Converted",      imgSrc: "/images/section-3/internet.svg" },
      { label: "Percentage Calculator",    imgSrc: "/images/section-3/percent.svg" },
    ],
  },
];

// ── ChevronRight ──────────────────────────────────────────────────────────────

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── CalculatorRow ─────────────────────────────────────────────────────────────

function CalculatorRow({
  item,
  iconBg,
  isLast,
}: {
  item: CalculatorItem;
  iconBg: string;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 20px",
        borderBottom: isLast ? "none" : "1px solid #F3F4F6",
        cursor: "pointer",
        transition: "background 0.15s",
        background: hovered ? "#FAFAFA" : "transparent",
        borderRadius: isLast ? "0 0 16px 16px" : 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: iconBg,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={item.imgSrc}
            alt={item.label}
            style={{
              width: 20,
              height: 20,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: "#1A1A2E",
            letterSpacing: "-0.01em",
          }}
        >
          {item.label}
        </span>
      </div>

      <span style={{ color: "#9CA3AF", flexShrink: 0 }}>
        <ChevronRight />
      </span>
    </div>
  );
}

// ── CategoryCard ──────────────────────────────────────────────────────────────

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <div className="et-card">
      {/* ── HEADER ── */}
      <div
        style={{
          background: cat.headerBg,
          padding: "20px 22px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            background: cat.badgeBg,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={cat.badgeImg}
            alt={cat.title}
            style={{
              width: 40,
              height: 40,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <h3
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 17,
            fontWeight: 700,
            color: "#1A1A2E",
            margin: 0,
            lineHeight: 1.35,
            whiteSpace: "pre-line",
            letterSpacing: "-0.02em",
          }}
        >
          {cat.title}
        </h3>
      </div>

      {/* ── ROWS ── */}
      <div>
        {cat.items.map((item, i) => (
          <CalculatorRow
            key={item.label}
            item={item}
            iconBg={cat.iconBg}
            isLast={i === cat.items.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  total,
  active,
  onPrev,
  onNext,
  onDot,
}: {
  total: number;
  active: number;
  onPrev: () => void;
  onNext: () => void;
  onDot: (i: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        justifyContent: "center",
        marginTop: 36,
      }}
    >
      <button
        onClick={onPrev}
        style={{
          width: 34, height: 34, borderRadius: "50%",
          border: "1.5px solid #E5E7EB", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#6B7280",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDot(i)}
          style={{
            width: i === active ? 22 : 10,
            height: 10,
            borderRadius: 5,
            border: "none",
            background: i === active ? "#3B82F6" : "#E5E7EB",
            cursor: "pointer",
            padding: 0,
            transition: "all 0.25s",
          }}
        />
      ))}

      <button
        onClick={onNext}
        style={{
          width: 34, height: 34, borderRadius: "50%",
          border: "1.5px solid #E5E7EB", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "#6B7280",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ExploreToolsSection() {
  const [page, setPage] = useState(0);
  const totalPages = 2;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .et-section {
          background: #FFFFFF;
          padding: clamp(48px, 8vw, 72px) clamp(16px, 5vw, 24px);
          font-family: 'matterregular', sans-serif;
        }

        .et-heading {
          text-align: center;
          margin-bottom: clamp(32px, 5vw, 48px);
        }

        .et-heading h2 {
          font-size: 38px;
          font-weight: 800;
          color: #1A1A2E;
          margin: 0 0 14px 0;
          letter-spacing: -0.03em;
          line-height: 1.15;
        }

        .et-heading p {
          font-size:18px;
          color: #535862;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.65;
          font-weight: 400;
        }

        /* Cards grid — 3 columns desktop */
        .et-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1140px;
          margin: 0 auto;
        }

        /* Tablet: 2 columns */
        @media (max-width: 900px) {
          .et-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile: 1 column */
        @media (max-width: 560px) {
          .et-grid {
            grid-template-columns: 1fr;
            max-width: 440px;
          }
        }

        /* Card shell */
        .et-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #F0F0F0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* Disable hover lift on touch */
        @media (hover: none) {
          .et-card:hover {
            transform: none !important;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .et-card * {
            transition: none !important;
          }
        }
      `}</style>

      <section className="et-section">
        {/* Heading */}
        <div className="et-heading">
          <h2>
            Explore{" "}
            <span style={{ color: "#F97316" }}>useful</span>
            {" "}tools
          </h2>
          <p>
            Simplify everyday calculations with our easy-to-use tools.
            <br />Browse by category and find the right tool for you.
          </p>
        </div>

        {/* Cards grid */}
        <div className="et-grid">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} cat={cat} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          total={totalPages}
          active={page}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          onDot={(i) => setPage(i)}
        />
      </section>
    </>
  );
}