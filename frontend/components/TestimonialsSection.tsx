"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const testimonials = [
  {
    stars: 5,
    quote:
      "Renjith made the entire process completely stress-free. He explained every clause, compared five different plans, and found us something significantly better than what we had before — at a lower premium.",
    name: "Irfan Mohammed",
    role: "Business Owner, Kochi",
    initials: "IM",
    avatarBg: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
  },
  {
    stars: 5,
    quote:
      "When my father required urgent hospitalization, TransIndia's claim assistance team was available immediately. Cashless approval came through in under 45 minutes with zero out-of-pocket stress.",
    name: "Ananya Nair",
    role: "Senior Tech Lead, Kakkanad",
    initials: "AN",
    avatarBg: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
  },
  {
    stars: 5,
    quote:
      "Managing marine and transit insurance for our export consignments used to be an administrative headache. TransIndia restructured our commercial policies, giving us broader protection at transparent rates.",
    name: "Mathew Varghese",
    role: "Logistics Director, Ernakulam",
    initials: "MV",
    avatarBg: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
  },
  {
    stars: 5,
    quote:
      "Finding an advisor who doesn't simply push high-commission plans is rare. Their team patiently walked me through critical illness riders and term policies tailored precisely to my family's needs.",
    name: "Dr. Priya S. Menon",
    role: "Consultant Physician, Thrissur",
    initials: "PM",
    avatarBg: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
  },
  {
    stars: 5,
    quote:
      "Renewing our family health policy was completely seamless. They audited our previous coverage, highlighted newly introduced wellness perks, and upgraded our sum insured with minimal cost difference.",
    name: "Rajesh Kumar",
    role: "Chartered Accountant, Kozhikode",
    initials: "RK",
    avatarBg: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
  },
  {
    stars: 5,
    quote:
      "We onboarded our 50-member team onto TransIndia's group medical insurance. The setup was swift, employee onboarding was smooth, and the dedicated claims manager has been exceptional.",
    name: "Siddharth Pillai",
    role: "Startup Founder, Thiruvananthapuram",
    initials: "SP",
    avatarBg: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
  },
];

// ─── Star Row ─────────────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 18 18" fill="#FBBF24">
          <path d="M9 1.5l2.06 4.18 4.61.67-3.34 3.25.79 4.6L9 11.77l-4.12 2.43.79-4.6L2.33 6.35l4.61-.67L9 1.5z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({
  stars,
  quote,
  name,
  role,
  initials,
  avatarBg,
}: (typeof testimonials)[0]) {
  return (
    <div className="tm-card">
      <Stars count={stars} />
      <span className="tm-quotemark">“</span>
      <p className="tm-quotetext">{quote}</p>
      <div className="tm-author">
        <div className="tm-avatar" style={{ background: avatarBg }}>
          {initials}
        </div>
        <div className="tm-author-info">
          <div className="tm-author-name-row">
            <p className="tm-author-name">{name}</p>
            <svg
              className="tm-verified-badge"
              viewBox="0 0 16 16"
              fill="none"
              width="14"
              height="14"
              title="Verified Client"
            >
              <circle cx="8" cy="8" r="8" fill="#E0F2FE" />
              <path
                d="M5 8.2L7 10.2L11.5 5.8"
                stroke="#0284C7"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="tm-author-role">{role}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Measure viewport to decide items per slide
  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  // Keep index within bounds on resize
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto carousel timer (4 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        nextSlide();
      } else if (diff < -45) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  return (
    <>
      <style>{RESPONSIVE_CSS}</style>
      <section className="tm-section">
        {/* Header */}
        <div className="tm-header">
          <div className="tm-badge-pill">CLIENT EXPERIENCES</div>
          <h2 className="tm-heading">
            <span style={{ color: "#1E293B" }}>Real people. </span>
            <span style={{ color: "#F15A3E" }}>Real peace of mind</span>
          </h2>
          <p className="tm-subheading">
            Hear from clients who found the right cover — and the right
            <br className="tm-br" />
            support when it mattered most.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="tm-carousel-wrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="tm-carousel-viewport">
            <div
              className="tm-carousel-track"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="tm-slide"
                  style={{
                    flex: `0 0 ${100 / visibleCount}%`,
                  }}
                >
                  <TestimonialCard {...t} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Responsive CSS ───────────────────────────────────────────────────────────
const RESPONSIVE_CSS = `
  .tm-section {
    width: 100%;
    padding: clamp(48px, 7vw, 84px) clamp(16px, 4vw, 40px);
    box-sizing: border-box;
    background: #FFFFFF;
    font-family: var(--font-sora), "Sora", sans-serif;
  }

  .tm-header {
    text-align: center;
    margin-bottom: clamp(32px, 5vw, 52px);
  }

  .tm-badge-pill {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(241, 90, 62, 0.08);
    color: #F15A3E;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 14px;
  }

  .tm-heading {
    font-size: clamp(28px, 4vw, 38px);
    font-weight: 800;
    line-height: 1.18;
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }

  .tm-subheading {
    font-size: 16.5px;
    color: #535862;
    line-height: 1.65;
    margin: 0;
  }

  .tm-br { display: none; }
  @media (min-width: 640px) { .tm-br { display: inline; } }

  .tm-carousel-wrap {
    max-width: 1220px;
    margin: 0 auto;
    position: relative;
  }

  .tm-carousel-viewport {
    overflow: hidden;
    width: 100%;
    padding: 12px 0 16px;
  }

  .tm-carousel-track {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    will-change: transform;
  }

  .tm-slide {
    padding: 0 12px;
    box-sizing: border-box;
    display: flex;
  }

  .tm-card {
    background: #F8FAFC;
    border-radius: 20px;
    padding: 30px 26px;
    display: flex;
    flex-direction: column;
    border: 1.5px solid #F1F5F9;
    box-sizing: border-box;
    width: 100%;
  }



  .tm-quotemark {
    display: block;
    font-size: 34px;
    font-weight: 800;
    color: #CBD5E1;
    line-height: 1;
    margin-top: 10px;
    margin-bottom: 4px;
    font-family: Georgia, serif;
  }

  .tm-quotetext {
    font-size: 14.5px;
    color: #334155;
    line-height: 1.72;
    font-style: italic;
    margin: 0 0 24px;
    flex: 1;
  }

  .tm-author {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: auto;
  }

  .tm-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 14px;
    flex-shrink: 0;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }

  .tm-author-info {
    min-width: 0;
  }

  .tm-author-name-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }

  .tm-author-name {
    font-size: 14.5px;
    font-weight: 700;
    color: #1E293B;
    margin: 0;
  }

  .tm-verified-badge {
    flex-shrink: 0;
  }

  .tm-author-role {
    font-size: 12px;
    color: #64748B;
    margin: 0;
    font-weight: 500;
  }

  @media (prefers-reduced-motion: reduce) {
    .tm-carousel-track { transition: none !important; }
    .tm-card { transition: none !important; }
  }
`;
