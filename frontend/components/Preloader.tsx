'use client';
import { useEffect, useState } from 'react';

type Props = {
  /** How long the dots stay visible before fade-out begins (ms) */
  duration?: number;
  /** Duration of the final fade-out (ms) */
  fadeDuration?: number;
  /** Called once the overlay has fully unmounted */
  onComplete?: () => void;
};

/**
 * Simple full-screen preloader — 4 bouncing dots.
 *
 * Sequence:
 *  1. Four dots bounce in a staggered wave.
 *  2. Overlay fades out after `duration` ms.
 *  3. Component unmounts and calls onComplete.
 *
 * No external dependencies — pure CSS animation.
 */
export function Preloader({
  duration = 1800,
  fadeDuration = 500,
  onComplete,
}: Props) {
  const [fading, setFading]   = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const t1 = window.setTimeout(() => setFading(true), duration);
    const t2 = window.setTimeout(() => {
      setMounted(false);
      onComplete?.();
    }, duration + fadeDuration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration, fadeDuration, onComplete]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        9999,
        display:       'flex',
        alignItems:    'center',
        justifyContent:'center',
        background:    '#ffffff',
        opacity:       fading ? 0 : 1,
        transition:    `opacity ${fadeDuration}ms ease`,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div className="ti-dots-wrap">
        <span className="ti-dot ti-dot-a" />
        <span className="ti-dot ti-dot-b" />
        <span className="ti-dot ti-dot-a" />
        <span className="ti-dot ti-dot-b" />
      </div>
      <style>{`
        .ti-dots-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .ti-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          animation: ti-bounce 1.2s ease-in-out infinite;
        }
        .ti-dot-a {
          background: #f25940;
        }
        .ti-dot-b {
          background: #20bec6;
        }
        .ti-dot:nth-child(1) { animation-delay: 0s; }
        .ti-dot:nth-child(2) { animation-delay: 0.15s; }
        .ti-dot:nth-child(3) { animation-delay: 0.3s; }
        .ti-dot:nth-child(4) { animation-delay: 0.45s; }
        @keyframes ti-bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          40% {
            transform: translateY(-18px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Preloader;