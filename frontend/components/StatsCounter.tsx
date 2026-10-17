"use client";

import React, { useEffect, useState, useRef } from "react";

/* ─── Brand Colors ─────────────────────────────────────────────────────────── */
const NAVY = "#001A5A";
const TEAL = "#20BEC6";
const TEXT_MUTED = "#4A659D";

/* ─── Icon Prop & Box Helpers ──────────────────────────────────────────────── */
export type IconProps = { size?: number; color?: string; stroke?: number };

const box = (size: number) => ({
  width: size,
  height: size,
  display: "block" as const,
});

/* ─── Standard Stat Icons ──────────────────────────────────────────────────── */
export function ShieldCheckIcon({ size = 20, color = TEAL, stroke = 1.7 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={box(size)}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 4.8 5.6v5.6c0 4.3 3 8 7.2 9 4.2-1 7.2-4.7 7.2-9V5.6Z" />
      <path d="m9.2 12 2 2.1 3.6-4" />
    </svg>
  );
}

export function UsersIcon({ size = 20, color = TEAL, stroke = 1.7 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={box(size)}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9.4" cy="8.4" r="3" />
      <path d="M3.6 19a5.8 5.8 0 0 1 11.6 0" />
      <path d="M16 6.2a3 3 0 0 1 0 5.8M17.4 19a5.4 5.4 0 0 0-2-4.2" />
    </svg>
  );
}

export function CheckBadgeIcon({ size = 20, color = TEAL, stroke = 1.7 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={box(size)}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8.6" />
      <path d="m8.2 12.4 2.6 2.6 5-5.4" />
    </svg>
  );
}

export function ClockIcon({ size = 20, color = TEAL, stroke = 1.7 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={box(size)}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.4V12l3 1.8" />
    </svg>
  );
}

/* ─── Animated Number Component ────────────────────────────────────────────── */
export interface AnimatedNumberProps {
  target: number;
  prefix?: string;
  suffix?: string;
  hasComma?: boolean;
  duration?: number;
  animate?: boolean;
}

export function AnimatedNumber({
  target,
  prefix = "",
  suffix = "",
  hasComma = false,
  duration = 2200,
  animate = true,
}: AnimatedNumberProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) {
      setCount(0);
      return;
    }
    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // smooth easeOutCubic curve
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, animate]);

  const formatted = hasComma ? count.toLocaleString("en-IN") : count.toString();

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}

/* ─── Default Stat Definitions ─────────────────────────────────────────────── */
export type StatItem = {
  target: number;
  prefix?: string;
  suffix?: string;
  hasComma?: boolean;
  label: string;
  Icon: (props: IconProps) => React.ReactElement;
};

export const DEFAULT_STATS: StatItem[] = [
  { target: 20000, suffix: "+", hasComma: true, label: "Policies Sold", Icon: ShieldCheckIcon },
  { target: 8000, suffix: "+", hasComma: true, label: "Happy Clients", Icon: UsersIcon },
  { target: 20, prefix: "₹", suffix: "Cr+", hasComma: false, label: "Claim Settled", Icon: CheckBadgeIcon },
  { target: 10, suffix: "+", hasComma: false, label: "Years of Trust", Icon: ClockIcon },
];

/* ─── Main StatsCounter / StatsRow Component ───────────────────────────────── */
export interface StatsCounterProps {
  stats?: StatItem[];
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Force animation to start immediately or stay controlled externally */
  animate?: boolean;
  /** Use custom chip background / border colors */
  chipBg?: string;
  chipBorder?: string;
  /** Custom text colors */
  valueColor?: string;
  labelColor?: string;
}

export default function StatsCounter({
  stats = DEFAULT_STATS,
  duration = 2200,
  className = "",
  style,
  animate: controlledAnimate,
  chipBg,
  chipBorder,
  valueColor,
  labelColor,
}: StatsCounterProps) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlledAnimate !== undefined) {
      setInView(controlledAnimate);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let observer: MutationObserver | null = null;
    let io: IntersectionObserver | null = null;

    const triggerAnimation = () => {
      timer = setTimeout(() => {
        setInView(true);
      }, 350);
    };

    // Check if the page-level Preloader overlay is present in the DOM
    const preloaderEl = typeof document !== "undefined" ? document.querySelector(".ti-pre") : null;

    if (preloaderEl) {
      // Preloader is active: wait until it starts fading or unmounts before counting
      observer = new MutationObserver(() => {
        const activePreloader = document.querySelector(".ti-pre:not(.is-fading)");
        if (!activePreloader) {
          if (observer) observer.disconnect();
          timer = setTimeout(() => {
            setInView(true);
          }, 400);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
      });

      // Fallback timer if mutation doesn't fire (Preloader duration is ~3150ms)
      const fallbackTimer = setTimeout(() => {
        if (observer) observer.disconnect();
        setInView(true);
      }, 3400);

      return () => {
        if (observer) observer.disconnect();
        clearTimeout(fallbackTimer);
        if (timer) clearTimeout(timer);
      };
    } else {
      // No preloader present (or already unmounted)
      if (typeof IntersectionObserver === "undefined") {
        triggerAnimation();
        return;
      }

      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            triggerAnimation();
            if (io) io.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      io.observe(el);

      return () => {
        if (io) io.disconnect();
        if (timer) clearTimeout(timer);
      };
    }
  }, [controlledAnimate]);

  const shouldAnimate = controlledAnimate !== undefined ? controlledAnimate : inView;

  return (
    <>
      <style>{CSS}</style>
      <div
        className={`ti-stats-counter hero-stats ${className}`}
        ref={ref}
        style={style}
      >
        {stats.map(({ target, prefix, suffix, hasComma, label, Icon }) => (
          <div className="ti-stat-item hero-stat" key={label}>
            <span
              className="ti-stat-chip hero-stat-chip"
              style={{
                backgroundColor: chipBg,
                borderColor: chipBorder,
              }}
            >
              <Icon size={18} />
            </span>
            <span className="ti-stat-text">
              <span
                className="ti-stat-value hero-stat-value"
                style={{ color: valueColor }}
              >
                <AnimatedNumber
                  target={target}
                  prefix={prefix}
                  suffix={suffix}
                  hasComma={hasComma}
                  animate={shouldAnimate}
                  duration={duration}
                />
              </span>
              <span
                className="ti-stat-label hero-stat-label"
                style={{ color: labelColor }}
              >
                {label}
              </span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

// Named alias so it can be imported as either StatsCounter or StatsRow
export { StatsCounter, StatsCounter as StatsRow };

const CSS = `
  .ti-stats-counter {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 0;
    box-sizing: border-box;
  }

  .ti-stat-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 20px;
    border-left: 1px solid #CBD5E1;
    box-sizing: border-box;
  }

  .ti-stat-item:first-child {
    padding-left: 0;
    border-left: none;
  }

  .ti-stat-chip {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    flex: 0 0 auto;
    background: rgba(32, 190, 198, 0.12);
    border: 1px solid rgba(32, 190, 198, 0.28);
  }

  .ti-stat-text {
    display: flex;
    flex-direction: column;
  }

  .ti-stat-value {
    display: block;
    font-size: 19px;
    font-weight: 800;
    color: ${NAVY};
    line-height: 1.15;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    font-family: inherit;
  }

  .ti-stat-label {
    display: block;
    font-size: 11.5px;
    color: ${TEXT_MUTED};
    margin-top: 2px;
    white-space: nowrap;
    font-family: inherit;
  }

  /* ── Responsive rules ── */
  @media (max-width: 900px) {
    .ti-stats-counter {
      flex-wrap: wrap;
      gap: 16px 0;
    }
    .ti-stat-item {
      padding: 0 16px;
    }
  }

  @media (max-width: 600px) {
    .ti-stats-counter {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 18px 10px !important;
    }
    .ti-stat-item {
      padding: 0 !important;
      border-left: none !important;
    }
  }
`;
