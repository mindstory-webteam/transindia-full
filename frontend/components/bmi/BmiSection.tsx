"use client";

import Link from "next/link";

// ── Types ───────────────────────────────────────────────────────────────────

interface Feature {
  label: string;
  iconBg: string;
  icon: React.ReactNode;
}

// ── Small inline icons ──────────────────────────────────────────────────────

const RunIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13" cy="4" r="1.6" />
    <path d="M4 17l4-1 2-4 4 2 1 4" />
    <path d="M10 12l-2-3 4-2 3 3 3 1" />
    <path d="M14 19l3 2" />
  </svg>
);

const HeartPulseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.5 12.6 12 20l-7.5-7.4a4.7 4.7 0 0 1 6.6-6.6L12 6.5l.9-.5a4.7 4.7 0 0 1 6.6 6.6Z" />
    <path d="M3.5 12.5h4l1.5-3 2 5 1.5-2.5h4.5" />
  </svg>
);

const AppleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22A36A"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 7c-1.6-1.6-4.2-1.6-5.6 0C5 8.4 5 11 6 13.4 7 15.8 9 18 12 19c3-1 5-3.2 6-5.6 1-2.4 1-5-.4-6.4-1.4-1.6-4-1.6-5.6 0Z" />
    <path d="M12 7c0-1.5.6-2.8 2-3.5" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C5CE6"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="20" x2="6" y2="13" />
    <line x1="12" y1="20" x2="12" y2="8" />
    <line x1="18" y1="20" x2="18" y2="11" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#1F5FE0"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────────────────

const features: Feature[] = [
  { label: "Helps track\nfitness progress",        iconBg: "#E8EEFE", icon: <RunIcon /> },
  { label: "Identifies potential\nhealth risks",     iconBg: "#FDECEC", icon: <HeartPulseIcon /> },
  { label: "Support healthy\nlifestyle decisions",   iconBg: "#E6F6EC", icon: <AppleIcon /> },
  { label: "Provides a quick\nhealth assessment",    iconBg: "#EFEAFB", icon: <BarChartIcon /> },
];

// ── Main export ───────────────────────────────────────────────────────────────

export default function BmiSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .bmi-section {
          background: #FFFFFF;
          padding: clamp(48px, 8vw, 80px) clamp(16px, 5vw, 24px);
          font-family: 'DM Sans', sans-serif;
        }

        .bmi-wrap {
          max-width: 1180px;
          margin: 0 auto;
        }

        /* ── Hero: text left, image right ── */
        .bmi-hero {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          align-items: center;
          gap: clamp(32px, 5vw, 64px);
        }

        .bmi-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0E9AA7;
          background: #E2F4F4;
          padding: 7px 14px;
          border-radius: 999px;
          margin-bottom: 22px;
        }

        .bmi-hero h2 {
          font-size: clamp(30px, 4vw, 40px);
          font-weight: 800;
          color: #1A1A2E;
          margin: 0 0 18px 0;
          line-height: 1.18;
          letter-spacing: -0.03em;
        }

        .bmi-hero p {
          font-size: 16px;
          line-height: 1.7;
          color: #535862;
          margin: 0 0 30px 0;
          max-width: 520px;
          font-weight: 400;
        }

        .bmi-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #EF4B2B;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.01em;
          border: none;
          border-radius: 12px;
          padding: 15px 26px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(239,75,43,0.28);
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .bmi-cta:hover {
          background: #E03D1E;
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(239,75,43,0.34);
        }
        .bmi-cta:focus-visible {
          outline: 3px solid #FBC0B0;
          outline-offset: 2px;
        }

        /* ── Image area (drop your illustration here) ── */
        .bmi-figure {
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bmi-figure img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        /* Visible placeholder until you swap in the real asset */
        .bmi-figure .bmi-figure-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(120% 90% at 50% 0%, #F2F7FF 0%, #FFFFFF 70%);
          color: #9AA4B2;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.01em;
          border: 1px dashed #D8E0EC;
          border-radius: 20px;
        }

        /* ── Why BMI matters ── */
        .bmi-why {
          margin-top: clamp(48px, 7vw, 72px);
        }
        .bmi-why-head {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }
        .bmi-why-head span {
          font-size: 17px;
          font-weight: 700;
          color: #1A1A2E;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }
        .bmi-why-head .rule {
          flex: 1;
          height: 1px;
          background: #ECECEF;
        }

        .bmi-features {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .bmi-feature {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .bmi-feature .ico {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bmi-feature .txt {
          font-size: 15px;
          font-weight: 600;
          color: #1A1A2E;
          line-height: 1.35;
          letter-spacing: -0.01em;
          white-space: pre-line;
        }

        /* ── Bottom info card ── */
        .bmi-info {
          margin-top: clamp(32px, 5vw, 44px);
          background: #EEF4FE;
          border-radius: 18px;
          padding: clamp(22px, 3vw, 30px) clamp(24px, 4vw, 40px);
          display: grid;
          grid-template-columns: 1.15fr 1px 1fr auto;
          align-items: center;
          gap: clamp(24px, 4vw, 44px);
        }
        .bmi-info .divider {
          width: 1px;
          height: 64px;
          background: #D5E1F6;
        }
        .bmi-know {
          display: flex;
          gap: 18px;
          align-items: flex-start;
        }
        .bmi-know .shield { flex-shrink: 0; margin-top: 2px; }
        .bmi-know h4 {
          font-size: 17px;
          font-weight: 700;
          color: #1F5FE0;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
        }
        .bmi-know p,
        .bmi-discover p {
          font-size: 14px;
          line-height: 1.55;
          color: #4B5563;
          margin: 0;
          font-weight: 400;
        }
        .bmi-discover h4 {
          font-size: 17px;
          font-weight: 700;
          color: #1A1A2E;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
        }
        .bmi-learn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1F5FE0;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.01em;
          border: none;
          border-radius: 10px;
          padding: 12px 20px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .bmi-learn:hover { background: #174FBF; transform: translateY(-1px); }
        .bmi-learn:focus-visible { outline: 3px solid #B7CDF6; outline-offset: 2px; }

        /* ── Tablet ── */
        @media (max-width: 980px) {
          .bmi-hero { grid-template-columns: 1fr; }
          .bmi-figure { order: -1; max-width: 560px; margin: 0 auto; }
          .bmi-features { grid-template-columns: repeat(2, 1fr); gap: 22px 28px; }
          .bmi-info {
            grid-template-columns: 1fr;
            gap: 22px;
          }
          .bmi-info .divider { display: none; }
        }

        /* ── Mobile ── */
        @media (max-width: 560px) {
          .bmi-features { grid-template-columns: 1fr; }
          .bmi-cta { width: 100%; justify-content: center; }
          .bmi-learn { width: 100%; justify-content: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bmi-cta, .bmi-learn { transition: none !important; }
        }
      `}</style>

      <section className="bmi-section">
        <div className="bmi-wrap">

          {/* ── HERO ── */}
          <div className="bmi-hero">
            {/* Left: copy */}
            <div>
              <span className="bmi-badge">Free Health Tool</span>
              <h2>Check your Body<br />Mass Index (BMI)</h2>
              <p>
                BMI is a simple number, calculated from your height and weight,
                that tells you whether you&apos;re in a healthy weight range.
                Insurers also use BMI to assess health risk and decide your
                premium — so knowing your number helps you understand your
                policy better and take charge of your health.
              </p>
             

<Link href="/bmi-calculator">
  <button className="bmi-cta" type="button">
    Calculate your BMI
  </button>
</Link>
            </div>

            {/* Right: IMAGE AREA — replace src with your illustration */}
            <div className="bmi-figure">
              <img
                src="/images/home/image 57.png"
                alt="BMI range chart from underweight to obesity, highlighting the healthy range 18.5 – 24.9"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.style.display = "none";
                  const fb = img.nextElementSibling as HTMLElement | null;
                  if (fb) fb.style.display = "flex";
                }}
              />
              <div className="bmi-figure-fallback" style={{ display: "none" }}>
                Your BMI illustration goes here
              </div>
            </div>
          </div>

          {/* ── WHY BMI MATTERS ── */}
          <div className="bmi-why">
            <div className="bmi-why-head">
              <span>Why BMI Matters</span>
              <div className="rule" />
            </div>

            <div className="bmi-features">
              {features.map((f) => (
                <div className="bmi-feature" key={f.label}>
                  <div className="ico" style={{ background: f.iconBg }}>
                    {f.icon}
                  </div>
                  <div className="txt">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── INFO CARD ── */}
          <div className="bmi-info">
            <div className="bmi-know">
              <span className="shield"><ShieldCheckIcon /></span>
              <div>
                <h4>Did you know ?</h4>
                <p>
                  Maintaining a healthy BMI can reduce the risk of heart
                  diseases, diabetes, high blood pressure, and other
                  lifestyle-related conditions.
                </p>
              </div>
            </div>

            <div className="divider" />

            <div className="bmi-discover">
              <h4>Discover your BMI &amp; Health Insights</h4>
              <p>
                Get a complete breakdown of BMI ranges, health recommendations,
                weight management tips and wellness guidance
              </p>
            </div>

            <Link href="/bmi" className="bmi-learn">
              Learn more <ArrowRightIcon />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}