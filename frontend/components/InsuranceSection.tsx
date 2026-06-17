"use client";

import { useEffect, useRef } from "react";

const cards = [
  {
    bg: "#FFF0C2",
    accent: "#F5490A",
    label: "Tailored Coverage",
    desc: "We map your risk profile against 20+ top insurers to find the product that fits your life not a generic off-the-shelf policy.",
    cta: "Talk to an expert",
    href: "#",
    imageSrc: "/images/home-insc/Real estate and car insurance.png",
    imageAlt: "Tailored Coverage illustration",
  },
  {
    bg: "#C8F0F8",
    accent: "#00B8C4",
    label: "Fast Claims Support",
    desc: "Our dedicated claims team works alongside you to ensure faster settlements, end-to-end. Most claims resolved in 24–48 hours.",
    cta: "Make a claim",
    href: "#",
    imageSrc: "/images/home-insc/Insurance agent offering insurance services.png",
    imageAlt: "Fast Claims Support illustration",
  },
  {
    bg: "#CFFAD8",
    accent: "#1BAD5B",
    label: "Expert Consultation",
    desc: "Speak to a certified advisor who listens first. Our consultation process regularly results in better coverage at lower premiums.",
    cta: "Talk to an expert",
    href: "#",
    imageSrc: "/images/home-insc/Tech support call on the computer.png",
    imageAlt: "Expert Consultation illustration",
  },
];

export default function InsuranceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>(".animate-in");
    if (!els) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section className="ins-section" ref={sectionRef}>
        <div className="ins-container">

          {/* ── Heading ── */}
          <div className="ins-heading animate-in" style={{ "--delay": "0s" } as React.CSSProperties}>
            <h2 className="ins-title">
              Insurance Made
              <br />
              <span style={{ color: "#F15A3E",}}>Simple</span>
              <span className="ins-amp"> &amp; </span>
              <span style={{ color: "#00BCD4", }}>Transparent</span>
            </h2>
            <p className="ins-subtitle">
              We cut through the complexity so you always know exactly what
              <br className="ins-br" />
              you're covered for — and how to use it.
            </p>
          </div>

          {/* ── Cards ── */}
          <div className="ins-cards">
            {cards.map((card, i) => (
              <div
                key={i}
                className="ins-card animate-in"
                style={
                  {
                    "--delay": `${0.12 + i * 0.12}s`,
                    "--accent": card.accent,
                    "--card-bg": card.bg,
                  } as React.CSSProperties
                }
              >
                {/* ── Colored top zone ── */}
                <div className="ins-card-colorzone">
                  <img
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    className="ins-card-img"
                  />
                </div>

                {/* ── White body ── */}
                <div className="ins-card-body">
                  <h3 className="ins-card-title">{card.label}</h3>
                  <p className="ins-card-desc">{card.desc}</p>
                  <a href={card.href} className="ins-card-cta">
                    {card.cta}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ins-cta-arrow">
                      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
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
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700;1,800&display=swap');

  .ins-section {
    background: #F3F7FF;
    padding: 160px 0 clamp(72px, 10vw, 120px);
    font-family: var(--font-sora), "Sora", sans-serif;
  }

  .ins-container {
    max-width: 1480px;
    margin: 0 auto;
    padding: 0 clamp(20px, 5vw, 48px);
  }

  /* ── Heading ── */
  .ins-heading {
    text-align: center;
    margin-bottom: clamp(48px, 7vw, 80px);
  }

  .ins-title {
    font-size:38px;
    font-weight: 800;
    line-height: 1.15;
    color: #1A1A1A;
    margin: 0 0 18px;
    letter-spacing: -0.03em;
  }

  .ins-amp {
    color: #1A1A1A;
    font-style: normal;
  }

  .ins-subtitle {
    font-size: 18px;
    color: #535862;
    font-weight: 400;
    line-height: 1.7;
    margin: 0;
    padding: 0 clamp(0px, 2vw, 20px);
  }

  .ins-br { display: none; }
  @media (min-width: 640px) { .ins-br { display: inline; } }

  /* ── Cards grid ── */
  .ins-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(16px, 2vw, 24px);
    align-items: stretch;
  }

  /* ── Tablet: 2 columns ── */
  @media (min-width: 560px) and (max-width: 900px) {
    .ins-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* ── Mobile: 1 column, constrained width ── */
  @media (max-width: 559px) {
    .ins-cards {
      grid-template-columns: 1fr;
      max-width: 420px;
      margin: 0 auto;
    }
  }

  /* ── Card shell ── */
  .ins-card {
    background: var(--card-bg);
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 4px 28px rgba(0,0,0,0.08);
    transition: transform 0.28s ease, box-shadow 0.28s ease;
    position: relative;
  }

  .ins-card:hover {
    transform: translateY(-7px);
    box-shadow: 0 22px 56px rgba(0,0,0,0.13);
  }

  /* Disable hover lift on touch devices */
  @media (hover: none) {
    .ins-card:hover {
      transform: none;
      box-shadow: 0 4px 28px rgba(0,0,0,0.08);
    }
  }

  /* ── Colored top zone ── */
  .ins-card-colorzone {
    width: 100%;
    height: clamp(130px, 14vw, 160px);
    flex-shrink: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0 20px;
    position: relative;
  }

  .ins-card-img {
    width: 88%;
    max-width: 180px;
    height: auto;
    max-height: 240px;
    object-fit: contain;
    object-position: bottom center;
    display: block;
    position: relative;
    z-index: 2;
  }

  /* ── White body ── */
  .ins-card-body {
    background: white;
    border-radius: 22px 22px 0 0;
    margin-top: -22px;
    padding: clamp(20px, 3vw, 28px) clamp(20px, 3vw, 28px) clamp(24px, 3vw, 32px);
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
    position: relative;
    z-index: 3;
  }

  .ins-card-title {
    font-family: 'matterregular', sans-serif;
    font-size: clamp(16px, 1.5vw, 20px);
    font-weight: 700;
    color: #111827;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .ins-card-desc {
    font-size: clamp(13px, 1.1vw, 15px);
    color: #6B7280;
    line-height: 1.75;
    margin: 0;
    flex: 1;
  }

  /* ── CTA pinned to bottom ── */
  .ins-card-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14.5px;
    font-weight: 700;
    color: var(--accent);
    text-decoration: none;
    margin-top: auto;
    padding-top: 8px;
    transition: gap 0.22s ease;
  }

  .ins-card-cta:hover { gap: 12px; }

  .ins-cta-arrow {
    flex-shrink: 0;
    transition: transform 0.22s ease;
  }

  .ins-card-cta:hover .ins-cta-arrow {
    transform: translateX(4px);
  }

  /* ── Scroll animation ── */
  .animate-in {
    opacity: 0;
    transform: translateY(28px);
    animation: ins-fadein 0.65s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0s) forwards;
    animation-play-state: paused;
  }

  @keyframes ins-fadein {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .animate-in {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
`;
