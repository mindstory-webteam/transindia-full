'use client';

import { useEffect, useRef, useState } from 'react';

export type PreloaderLine = {
  /** Neutral leading words, e.g. "For the" */
  lead: string;
  /** Coloured word that carries the meaning, e.g. "Insured" */
  accent: string;
};

type Props = {
  /** Path to the logo (put the file in /public). */
  logoSrc?: string;
  /** The three short lines shown to the right of the divider. */
  lines?: PreloaderLine[];
  /** Minimum time the preloader stays on screen, in ms. */
  duration?: number;
  /** Length of the final fade-out, in ms. */
  fadeDuration?: number;
  /** Also wait for window "load" before hiding. */
  waitForLoad?: boolean;
  /** Overlay background colour. */
  background?: string;
  /** Fires once the overlay has unmounted. */
  onComplete?: () => void;
};

/* Brand colours, sampled from the logo file. */
const ORANGE = '#f15a40';
const TEAL = '#20bec6';

const DEFAULT_LINES: PreloaderLine[] = [
  { lead: 'For the', accent: 'Insured' },
  { lead: 'Of the', accent: 'Insured' },
  { lead: 'By the', accent: 'Insured' },
];

/**
 * Full-screen preloader for transindia.
 *
 * Sequence:
 *  1. White overlay covers the page.
 *  2. The logo is revealed left-to-right by a clip wipe, with a coloured
 *     line riding the leading edge.
 *  3. The line lands at the logo's right edge, stretches tall and stays
 *     there as a divider.
 *  4. Three short lines fade in one after another beside the divider.
 *  5. A shimmer loops across the logo while loading continues, then the
 *     overlay fades out.
 *
 * No dependencies — pure CSS.
 */
export function Preloader({
  logoSrc = '/images/logo/transindia.png',
  lines = DEFAULT_LINES,
  duration = 2600,
  fadeDuration = 550,
  waitForLoad = false,
  background = '#ffffff',
  onComplete,
}: Props) {
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let hideTimer: number | undefined;
    let unmountTimer: number | undefined;

    const startExit = () => {
      setFading(true);
      unmountTimer = window.setTimeout(() => {
        setMounted(false);
        onCompleteRef.current?.();
      }, fadeDuration);
    };

    if (waitForLoad && document.readyState !== 'complete') {
      const started = Date.now();
      const onLoad = () => {
        const remaining = Math.max(0, duration - (Date.now() - started));
        hideTimer = window.setTimeout(startExit, remaining);
      };
      window.addEventListener('load', onLoad);
      return () => {
        window.removeEventListener('load', onLoad);
        clearTimeout(hideTimer);
        clearTimeout(unmountTimer);
      };
    }

    hideTimer = window.setTimeout(startExit, duration);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, [duration, fadeDuration, waitForLoad]);

  /* Stop the page behind from scrolling while the overlay is up. */
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  if (!mounted) return null;

  const shown = lines.slice(0, 3);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`ti-pre ${fading ? 'is-fading' : ''}`}
      style={{ background }}
    >
      <span className="ti-sr">Loading transindia</span>

      <div className="ti-stage">
        <div className="ti-logo">
          {/* Only this inner box is clipped, so the line can grow past it. */}
          <div className="ti-logo-clip">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="transindia" draggable={false} />
            <span
              className="ti-shine"
              style={{
                WebkitMaskImage: `url(${logoSrc})`,
                maskImage: `url(${logoSrc})`,
              }}
            />
          </div>
          {/* Rides the wipe, then parks at the right edge as the divider. */}
          <span className="ti-rule" aria-hidden="true" />
        </div>

        <ul className="ti-lines">
          {shown.map((line, i) => (
            <li
              key={`${line.lead}-${line.accent}-${i}`}
              style={{ animationDelay: `${1240 + i * 130}ms` }}
            >
              {line.lead} <b>{line.accent}</b>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .ti-pre {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          opacity: 1;
          transition: opacity ${fadeDuration}ms ease;
        }
        .ti-pre.is-fading {
          opacity: 0;
          pointer-events: none;
        }
        .ti-pre.is-fading .ti-stage {
          transform: scale(1.03);
          transition: transform ${fadeDuration}ms cubic-bezier(.4,0,.2,1);
        }

        .ti-sr {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }

        .ti-stage {
          /* Space between the logo and the divider. The stage gap is twice
             this, so the divider ends up centred in the gutter. */
          --ti-gap: 16px;
          position: relative;
          display: flex;
          align-items: center;
          gap: calc(var(--ti-gap) * 2);
        }

        /* ---- logo ---- */
        .ti-logo {
          position: relative;
          flex: 0 0 auto;
          width: min(230px, 44vw);
        }
        .ti-logo-clip {
          position: relative;
          clip-path: inset(0 100% 0 0);
          animation: ti-reveal 1000ms cubic-bezier(.65,0,.35,1) 180ms forwards;
        }
        .ti-logo-clip img {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
        }
        .ti-shine {
          position: absolute;
          inset: 0;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          background: linear-gradient(
            100deg,
            transparent 42%,
            rgba(255, 255, 255, 0.9) 50%,
            transparent 58%
          );
          background-size: 250% 100%;
          background-position: 130% 0;
          animation: ti-shine 1.9s ease-in-out 1600ms infinite;
        }

        /* ---- travelling line, then divider ---- */
        .ti-rule {
          position: absolute;
          left: 0;
          top: 34%;
          bottom: 34%;
          width: 2px;
          margin-left: -1px;
          border-radius: 2px;
          background: linear-gradient(180deg, ${ORANGE}, ${TEAL});
          opacity: 0;
          transform: translateX(0);
          animation: ti-rule 1240ms cubic-bezier(.65,0,.35,1) 180ms forwards;
        }

        /* ---- copy ---- */
        .ti-lines {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: clamp(12px, 1.6vw, 14px);
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #1d2b32;
          white-space: nowrap;
        }
        .ti-lines li {
          opacity: 0;
          transform: translateX(-6px);
          animation: ti-line 420ms cubic-bezier(.2,.7,.3,1) forwards;
        }
        .ti-lines b {
          color: ${ORANGE};
          font-weight: 700;
        }

        @keyframes ti-reveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0 0 0); }
        }
        @keyframes ti-rule {
          0%   { left: 0%;   top: 34%;  bottom: 34%;  opacity: 0; transform: translateX(0); }
          10%  { opacity: 1; }
          68%  { left: 100%; top: 34%;  bottom: 34%;  opacity: 1; transform: translateX(0); }
          100% { left: 100%; top: -52%; bottom: -52%; opacity: 1; transform: translateX(var(--ti-gap)); }
        }
        @keyframes ti-line {
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes ti-shine {
          0%   { background-position: 130% 0; }
          60%  { background-position: -60% 0; }
          100% { background-position: -60% 0; }
        }

        @media (max-width: 480px) {
          .ti-stage { --ti-gap: 11px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ti-logo-clip { clip-path: none; animation: none; }
          .ti-shine { display: none; }
          .ti-rule {
            opacity: 1; left: 100%; top: -52%; bottom: -52%;
            transform: translateX(var(--ti-gap)); animation: none;
          }
          .ti-lines li { opacity: 1; transform: none; animation: none; }
        }
      `}</style>
    </div>
  );
}

export default Preloader;