"use client"

import { useEffect, useState } from "react";
import { TransIndiaLogo } from "../components/TransIndiaLogo";

type Props = {
  /** Total visible duration before fade-out begins (ms) */
  duration?: number;
  /** Fade-out length (ms) */
  fadeDuration?: number;
};

/**
 * Full-screen branded preloader. Mounts on first paint, animates the
 * TransIndia logo, then fades away and unmounts itself.
 */
export function Preloader({ duration = 1800, fadeDuration = 600 }: Props) {
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const t1 = window.setTimeout(() => setFading(true), duration);
    const t2 = window.setTimeout(
      () => setMounted(false),
      duration + fadeDuration,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [duration, fadeDuration]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#041737",
        opacity: fading ? 0 : 1,
        transition: `opacity ${fadeDuration}ms ease`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes ti-pop {
          0%   { opacity: 0; transform: scale(0.92) translateY(6px); }
          60%  { opacity: 1; transform: scale(1.02) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ti-reveal {
          0%   { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @keyframes ti-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.15); opacity: 1; }
        }
        .ti-logo-wrap {
          animation: ti-pop 600ms cubic-bezier(.2,.8,.2,1) both;
        }
        .ti-logo {
          width: min(60vw, 360px);
          height: auto;
          animation: ti-reveal 1100ms cubic-bezier(.7,0,.3,1) 300ms both;
        }
        .ti-dots {
          margin-top: 18px;
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        .ti-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #20bec6;
          animation: ti-pulse 1s ease-in-out infinite;
        }
        .ti-dot:nth-child(1) { background: #f15b40; animation-delay: 0ms; }
        .ti-dot:nth-child(2) { background: #f15b40; animation-delay: 150ms; }
        .ti-dot:nth-child(3) { background: #20bec6; animation-delay: 300ms; }
        .ti-dot:nth-child(4) { background: #20bec6; animation-delay: 450ms; }
      `}</style>

      <div
        className="ti-logo-wrap"
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <TransIndiaLogo className="ti-logo" />
        {/* <div className="ti-dots">
          <span className="ti-dot" />
          <span className="ti-dot" />
          <span className="ti-dot" />
          <span className="ti-dot" />
        </div> */}
      </div>
    </div>
  );
}

export default Preloader;
