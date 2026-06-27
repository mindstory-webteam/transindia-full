'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  /** How long the completed logo stays visible before fade-out begins (ms) */
  duration?: number;
  /** Duration of the final fade-out (ms) */
  fadeDuration?: number;
  /** Called once the overlay has fully unmounted */
  onComplete?: () => void;
};

/**
 * TransIndia full-screen preloader.
 *
 * Sequence:
 *  1. Real butterfly (uploaded artwork, color #20BEC6) glides in from the
 *     right along a smooth, monotonic cubic-bezier arc. The "transindi"
 *     text reveals left → right at the same time, timed so the wordmark
 *     finishes exactly as the butterfly reaches its landing spot.
 *  2. On landing, the butterfly cross-fades into the logo butterfly — the
 *     final "a" of the wordmark — which SPRINGS in with an overshoot pop,
 *     perfectly synced to the moment of arrival.
 *  3. Overlay fades out after `duration` ms.
 *
 * No external dependencies — pure SVG + rAF.
 */
export function Preloader({
  duration = 3400,
  fadeDuration = 600,
  onComplete,
}: Props) {
  const [fading, setFading]   = useState(false);
  const [mounted, setMounted] = useState(true);

  const bfSvgRef   = useRef<SVGSVGElement>(null);
  const bfGroupRef = useRef<SVGGElement>(null);
  const bfShapeRef = useRef<SVGGElement>(null);
  const logoTextRef= useRef<SVGGElement>(null);
  const logoBfRef  = useRef<SVGGElement>(null);
  const revRectRef = useRef<SVGRectElement>(null);
  const rafRef     = useRef<number>(0);
  const t0Ref      = useRef<number>(0);

  useEffect(() => {
    const bfSvg    = bfSvgRef.current;
    const bfGroup  = bfGroupRef.current;
    const bfShape  = bfShapeRef.current;
    const logoText = logoTextRef.current;
    const logoBf   = logoBfRef.current;
    const revRect  = revRectRef.current;
    if (!bfSvg || !bfGroup || !bfShape || !logoText || !logoBf || !revRect) return;

    // ── timing (ms) ──────────────────────────────────────────────────────────
    // Text reveals DURING the flight, finishing exactly as the butterfly lands.
    // The final letter ("a" = logo butterfly) then pops during the morph.
    const FLY_MS   = 2600;  // butterfly travels in + text reveals, in sync
    const MORPH_MS = 600;   // cross-fade real → logo butterfly + spring pop

    // ── easings ──────────────────────────────────────────────────────────────
    const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const eo  = (t: number) => 1 - (1 - t) ** 3;
    const lerp= (a: number, b: number, t: number) => a + (b - a) * t;

    // easeOutBack — gives the final "a" a lively overshoot/settle pop.
    const eback = (t: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    function bez(t: number, a: number, b: number, c: number, d: number) {
      const m = 1 - t;
      return m*m*m*a + 3*m*m*t*b + 3*m*t*t*c + t*t*t*d;
    }

    // ── layout constants ─────────────────────────────────────────────────────
    const W = 530, H = 150;

    // Where the butterfly lands (matches logo butterfly position in the wordmark)
    const LAND_X = 453;
    const LAND_Y = 72;
    const BASE_SCALE = 1.08;

    // ── helpers ──────────────────────────────────────────────────────────────
    function setOp(el: SVGElement, v: number) {
      el.setAttribute('opacity', String(Math.max(0, Math.min(1, v))));
    }

    function place(
      x: number, y: number, sc: number,
      flapScX: number, flapSkY: number,
    ) {
      const cx = 56.25, cy = 56.25;
      bfGroup.setAttribute(
        'transform',
        `translate(${x - cx * sc}, ${y - cy * sc}) scale(${sc})`,
      );
      bfShape.setAttribute(
        'transform',
        `translate(${cx},${cy}) scale(${-flapScX},1) skewY(${flapSkY}) translate(${-cx},${-cy})`,
      );
    }

    // Scale the final "a" (logo butterfly) about its own centre. transform-box
    // fill-box makes the CSS transform-origin the element's bounding-box centre,
    // so it grows/pops in place.
    function setLetterPop(scale: number) {
      logoBf.style.transformBox = 'fill-box';
      logoBf.style.transformOrigin = 'center';
      logoBf.style.transform = `scale(${scale})`;
    }

    function reset() {
      setOp(bfSvg,  1);
      setOp(logoText, 0);
      setOp(logoBf,   0);
      setLetterPop(0.4);            // final "a" starts shrunk, hidden
      revRect.setAttribute('width', '0');
      // start off-screen on the RIGHT
      place(W + 60, H * 0.5, BASE_SCALE * 0.7, 1, 0);
    }

    // ── main animation loop ───────────────────────────────────────────────────
    function tick(ts: number) {
      if (!t0Ref.current) t0Ref.current = ts;
      const el = ts - t0Ref.current;

      // ── Phase 1: fly in, text reveals in sync ───────────────────────────
      if (el < FLY_MS) {
        const t  = el / FLY_MS;
        const te = eio(t);

        const bx = bez(te, W + 60, 520, 480, LAND_X);
        const by = bez(te, H * 0.55, -15, H * 0.9, LAND_Y);

        const amp  = lerp(0.82, 0.12, eo(t));
        const open = Math.sin(t * Math.PI * 2 * 7) * 0.5 + 0.5; // 7 flap cycles
        const flapScX = 1 - amp * (1 - open);
        const flapSkY = (1 - open) * amp * 6;

        const sc = lerp(BASE_SCALE * 0.68, BASE_SCALE, eo(t));

        setOp(bfSvg, 1);
        place(bx, by, sc, flapScX, flapSkY);

        // Reveal "transindi" left → right, finishing right as it lands.
        setOp(logoText, 1);
        revRect.setAttribute('width', String(lerp(0, W, te)));

        // final "a" stays hidden/shrunk until the butterfly arrives
        setOp(logoBf, 0);
        setLetterPop(0.4);

      // ── Phase 2: morph + synced "a" pop ─────────────────────────────────
      } else if (el < FLY_MS + MORPH_MS) {
        const t  = (el - FLY_MS) / MORPH_MS;

        // wings settle to a calm, fully-open rest pose while fading out
        const settleFlapScX = 1 - 0.12 * (1 - (Math.sin(t * Math.PI * 3) * 0.5 + 0.5));
        place(LAND_X, LAND_Y, BASE_SCALE, lerp(settleFlapScX, 1, eo(t)), lerp(1, 0, eo(t)));

        // cross-fade: real butterfly out, logo "a" in (quick fade so the pop reads)
        setOp(bfSvg, 1 - eo(t));
        setOp(logoBf, Math.min(1, t * 2.2));

        // the synced pop: scale the final "a" with an overshoot, landing on 1
        setLetterPop(lerp(0.4, 1, eback(t)));

        setOp(logoText, 1);
        revRect.setAttribute('width', String(W));

      // ── Done ─────────────────────────────────────────────────────────────
      } else {
        setOp(bfSvg,   0);
        setOp(logoBf,  1);
        setOp(logoText,1);
        setLetterPop(1);
        revRect.setAttribute('width', String(W));
        return; // stop rAF
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    reset();
    t0Ref.current = 0;
    rafRef.current = requestAnimationFrame(tick);

    // Fade-out timers
    const t1 = window.setTimeout(() => setFading(true), duration);
    const t2 = window.setTimeout(() => {
      setMounted(false);
      onComplete?.();
    }, duration + fadeDuration);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration, fadeDuration, onComplete]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position:     'fixed',
        inset:        0,
        zIndex:       9999,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        background:   '#ffffff',
        opacity:      fading ? 0 : 1,
        transition:   `opacity ${fadeDuration}ms ease`,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          position:    'relative',
          width:       'min(88vw, 530px)',
          aspectRatio: '530 / 150',
        }}
      >
        {/* ── Flying butterfly ──────────────────────────────────────────── */}
        <svg
          ref={bfSvgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 530 150"
          style={{
            position: 'absolute',
            inset:    0,
            width:    '100%',
            height:   '100%',
            overflow: 'visible',
          }}
        >
          <g ref={bfGroupRef}>
            <g ref={bfShapeRef}>
              <path
                fill="#20BEC6"
                d="m58.917969 82.457031c-.035157-.101562-.105469-.167969-.207031-.203125-.097657-.035156-.195313-.023437-.285157.03125-7.175781 4.320313-22.105469 6.910156-27.140625-2.21875-2.339844-4.246094.546875-8.78125 4.078125-11.160156 4.039063-2.730469 8.460938-4.433594 13.261719-5.101562.082031-.011719.132812-.058594.144531-.140626.015625-.082031-.011719-.148437-.085937-.1875-10.238282-5.621093-15.96875-15.03125-17.472656-26.582031-.753907-5.820312 2.230468-9.964843 7.679687-11.585937 9.597656-2.847656 20.132813 6.101562 24.617187 13.917968.011719.03125.039063.042969.070313.039063.035156-.007813.054687-.027344.058594-.058594 1.203125-5 3.761719-8.667969 7.675781-11.007812 1.578125-.945313 4.097656-1.433594 5.902344-1.058594 6.980468 1.433594 6.414062 14.035156 5.601562 19.050781-.9375 5.816406-3.8125 11.863282-6.921875 17.007813-.035156.058593-.035156.117187.003907.175781.039062.058594.089843.082031.160156.070312l.628906-.089843c.085938-.011719.164062.011719.230469.070312.0625.058594.09375.132813.089843.222657-.261718 4.859374-2.234374 8.902343-5.171874 12.734374-2.617188 3.421876-6.140626 5.769532-9.898438 7.871094-2.25 1.253906-3.960938 2.816406-5.886719 4.355469-.125.101563-.265625.148437-.421875.144531-.160156 0-.300781-.054687-.417968-.160156-1.34375-1.160156 3.820312-5.851562 3.707031-6.136719zm-3.109375-.648437c2.878906-1.367188 11.050781-5.691406 11.75-8.960938 2.503906-11.675781.074218-25.121094-6.882813-35.09375-4.664062-6.679687-13.949219-13.609375-22.476562-10.511718-5.5 1.996093-5.929688 6.769531-4.925781 12.078124 1.609374 8.5 5.957031 15.898438 13.207031 20.886719.679687.46875 2.09375 1.363281 4.242187 2.6875.765625.472657 1.316406 1.28125.738282 2.078125-.085938.125-.210938.191406-.367188.203125-5.894531.414063-14.308594 3.074219-17.800781 7.996094-1.210938 1.707031-1.542969 3.453125-1 5.246094 1.125 3.675781 5.457031 5.554687 9.097656 5.914062 5.179687.511719 9.59375-.222656 14.417969-2.523437zm25.472656-45.941406c-.417969-2.960938-1.390625-7.398438-5.402344-7.199219-6.5.320312-10.445312 6.871093-10.902344 12.859375-.011718.125.011719.25.070313.363281 4.128906 8.429687 5.75 17.34375 4.855469 26.742187-.011719.101563.015625.113282.078125.035157 4.117187-5.054688 7.296875-10.613281 9.539062-16.671875 2.003907-5.417969 2.546875-10.5625 1.761719-16.128906zm-7.601562 31.058593c.382812-.308593.628906-.710937.738281-1.210937.011719-.074219-.019531-.121094-.089844-.144532-.070313-.019531-.121094 0-.15625.066407-.273437.65625-.699219 1.1875-1.28125 1.59375-.082031.058593-.105469.132812-.0625.226562.042969.089844.113281.125.210937.097657.207032-.050782.355469-.167969.453126-.347657.089843-.164062.152343-.257812.1875-.28125zm.324218 2.371094c.015625-.03125.035156-.097656.058594-.199219.015625-.078125-.011719-.136718-.082031-.167968-.074219-.035157-.132813-.023438-.183594.039062-2.042969 2.738281-4.210937 5.15625-6.511719 7.253906-2.613281 2.382813-4.441406 4.335938-6.625 6.582032-.054687.054687-.054687.113281-.007812.171874.046875.058594.101562.070313.167968.03125 2.757813-1.695312 6.292969-3.542968 8.230469-5.710937 1.660157-1.851563 3.285157-4.351563 4.882813-7.5.046875-.09375.066406-.210937.050781-.355469-.003906-.050781.003906-.097656.019531-.144531zm0 0"
              />
            </g>
          </g>
        </svg>

        {/* ── Logo SVG (text + logo butterfly) ─────────────────────────── */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 530 150"
          style={{
            position: 'absolute',
            inset:    0,
            width:    '100%',
            height:   '100%',
            overflow: 'visible',
          }}
        >
          <defs>
            {/* Expanding rect used to reveal the text left → right */}
            <clipPath id="ti-text-clip">
              <rect ref={revRectRef} x="0" y="0" width="0" height="150" />
            </clipPath>
          </defs>

          {/* "transindi" wordmark — revealed by clipPath (final "a" is the butterfly) */}
          <g ref={logoTextRef} opacity="0" clipPath="url(#ti-text-clip)">
            <g transform="scale(5.3) translate(0.3, 3.6)">
              {/* ── trans (orange) ── */}
              <path fill="#f15b40" d="M28.25,12.03c-.36.12-.92.48-1.4,1.22,0-.67-.55-1.22-1.22-1.22h-1.39v5.44c0-.06,0-.11,0-.17h0v-.08.08h0v3.78s0,0,0,0h2.6s0,0,0,0v-4.86c0-.91.77-1.64,1.69-1.59.85.05,1.49.8,1.49,1.65v4.8s0,0,0,0h2.6s0,0,0,0v-4.9c0-3.38-1.96-4.98-4.39-4.15Z"/>
              <path fill="#f15b40" d="M17.87,11.57c-2.63,0-4.76,2.13-4.76,4.76s2.13,4.76,4.76,4.76c.9,0,1.74-.25,2.46-.68.24.28.6.46.99.46h1.31v-4.54c0-2.63-2.13-4.76-4.76-4.76ZM17.87,18.47c-1.18,0-2.14-.96-2.14-2.14s.96-2.14,2.14-2.14,2.14.96,2.14,2.14-.96,2.14-2.14,2.14Z"/>
              <path fill="#f15b40" d="M39.7,15.62c-.32-.11-.68-.18-1.05-.26-1.37-.29-1.73-.25-1.78-.84,0-.07-.05-.42.2-.76.39-.54,1.22-.43,1.55.01.12.16.16.47.16.64h2.61c-.03-.99-.54-1.84-1.42-2.38-1.21-.74-2.93-.76-4.19-.06-.98.55-1.54,1.48-1.54,2.55,0,1.36.76,1.89,1.66,2.28.28.08.77.21,1.09.28,1.37.29,1.72.35,1.78.95,0,.07.05.42-.2.76-.39.54-1.22.43-1.55-.01-.09-.12-.13-.32-.15-.49h-2.62c.08.92.58,1.72,1.41,2.23,1.21.74,2.93.76,4.19.06.98-.55,1.54-1.48,1.54-2.55,0-.41-.04-.76-.16-1.06-.29-.63-.83-1.11-1.54-1.35Z"/>
              <path fill="#f15b40" d="M7.95,12h-1.31v9.09h2.61v-3.87c0-1.42,1.15-2.57,2.57-2.57v-2.61c-.98,0-1.9.27-2.69.75-.2-.46-.66-.78-1.2-.78Z"/>
              <path fill="#f15b40" d="M2.61,12v-2.99H0v9.7c0,1.31,1.06,2.37,2.37,2.37h2.01v-2.37h-1.14c-.35,0-.63-.28-.63-.63v-1.85c.38-.95,1.31-1.62,2.39-1.62v-2.61c-.86,0-1.68.21-2.39.59v-.59Z"/>
              {/* ── indi (teal) — the final "a" is the butterfly below ── */}
              <path fill="#20bec6" d="M65.43,9.25h-1.35v2.87c-.64-.32-1.37-.51-2.14-.51-2.62,0-4.74,2.12-4.74,4.74s2.12,4.74,4.74,4.74c.9,0,1.73-.25,2.45-.68.24.28.59.46.99.46h1.3v-10.36c0-.69-.56-1.25-1.25-1.25ZM61.94,18.48c-1.18,0-2.14-.96-2.14-2.14s.96-2.14,2.14-2.14,2.14.96,2.14,2.14-.96,2.14-2.14,2.14Z"/>
              <path fill="#20bec6" d="M51.21,12.06c-.36.12-.92.48-1.4,1.21,0-.67-.54-1.21-1.21-1.21h-1.39v5.42c0-.06,0-.11,0-.17h0v-.08.08h0v3.77s0,0,0,0h2.59s0,0,0,0v-4.84c0-.91.77-1.64,1.69-1.58.84.05,1.48.8,1.48,1.64v4.78s0,0,0,0h2.59s0,0,0,0v-4.88c0-3.37-1.95-4.96-4.37-4.14Z"/>
              <rect fill="#20bec6" x="43" y="12.06" width="2.6" height="9.02"/>
              <rect fill="#20bec6" x="68.29" y="12.06" width="2.6" height="9.02"/>
            </g>
          </g>

          {/* Logo butterfly = the final "a". Cross-fades + springs in on landing. */}
          <g ref={logoBfRef} opacity="0">
            <g transform="scale(5.3) translate(0.3, 3.6)">
              <path fill="#20bec6" d="M88.38,12.9c-1.18-1.19-2.7-1.55-4.18-1.13.24-1.55.21-3.11-.25-4.64-.84-2.85-2.98-4.99-5.35-6.66l-.65-.46c-1.76,4.32-2.7,10.24,1.99,13.13l-.37-.52c-2.38-3.37-2.36-6.96-1.04-10.62,4.16,3.18,5.4,6.58,4.11,11.61,1.61-.76,3.18-1.46,4.83.2.78.78,1.37,2.18.9,3.26-.55,1.28-2.3,1.31-3.46,1.15-1-.13-2-.51-2.94-1.02-1.11-.61-2.13-1.42-2.97-2.26-.97-.98-1.78-2.09-2.46-3.27-.96-1.69-1.62-3.55-2.01-5.46l-.13-.62c-.66,1.94-.04,4.33,1,6.4-1.71.71-2.92,2.4-2.92,4.38,0,2.62,2.12,4.74,4.74,4.74.9,0,1.73-.25,2.45-.68.24.28.59.46.99.46h1.3v-2.25c.89.42,1.82.73,2.77.85,1.02.13,2.15.13,3.12-.28.76-.32,1.36-.87,1.68-1.63.67-1.58-.02-3.5-1.17-4.66ZM77.24,17.98c-.9,0-1.63-.73-1.63-1.63s.73-1.63,1.63-1.63,1.63.73,1.63,1.63-.73,1.63-1.63,1.63Z"/>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Preloader;