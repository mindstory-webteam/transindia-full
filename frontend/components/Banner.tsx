"use client";

import {useEffect, useState} from "react";

const FAMILY_IMAGE_SRC = "/images/banner/Layer 2.png]";

const STATS = [
  {value: "1.2L+", label: "Policies sold"},
  {value: "500+", label: "Happy clients"},
  {value: "₹250Cr+", label: "Claim Settled"},
  {value: "20+", label: "Years of Trust"},
];

const INSURANCE_TYPES = [
  "Health Insurance",
  "Life Insurance",
  "Motor Insurance",
  "Term Insurance",
  "Travel Insurance",
];

/* Route prefix the service pages live under. The slugs below are the same
   ones the navigation uses, so a card and a nav item always resolve to the
   same page — change the prefix here only, never in the card list. */
const SERVICE_BASE = "/our-services";

type HeadlineWord = {text: string; color?: string};
type Headline = {
  line1: string;
  line2: HeadlineWord[];
  font?: string;
  className?: string;
};

const HEADLINES: Headline[] = [
  {
    line1: "For Every Life. ",
    line2: [
      {text: "For Every ", color: "#F15A40"},
      {text: "Tomorrow. ", color: "#20BEC6"},
    ],
  },
  {
    line1: "ഓരോ ജീവിതത്തിനും. ",
    line2: [
      {text: " ഓരോ ", color: "#20BEC6"},
      {text: "നാളെക്കും.", color: "#F15A40"},
    ],
    font: "'BalooChettan2', sans-serif",
    className: "ins-headline-malayalam",
  },
  {
    line1: "हर जीवन के लिए। ",
    line2: [
      {text: "हर कल  ", color: "#F15A40"},
      {text: "के लिए.", color: "#20BEC6"},
    ],
  },
];

const HEADLINE_INTERVAL_MS = 4000;

function useRotatingHeadline(list: Headline[], intervalMs: number) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (list.length <= 1) return;

    const timer = setInterval(() => {
      setVisible(false); // fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % list.length);
        setVisible(true); // fade in next headline
      }, 300); // matches CSS transition duration below
    }, intervalMs);

    return () => clearInterval(timer);
  }, [list.length, intervalMs]);

  return {headline: list[index], visible};
}

const TEAL = "#20BEC6";

/* `slug` matches the navigation entries exactly (m1–m4, m6, m7). The two
   remaining nav services — miscellaneous-insurance and entertainment-insurance
   — have no bubble here yet; they need artwork before they can be added. */
/* `img` is the artwork shown inside the bubble — square, transparent PNGs at
   about 256x256, subject centred with a little breathing room.

   `x`, `y` and `size` place each bubble inside the cluster box as a percentage
   of its width, so the cascade scales with the column instead of being pinned
   to pixels. `delay` staggers the float so the six never bob in unison. */
const BUBBLE_IMG_BASE = "/images/banner/bubbles";

const INSURANCE_CARDS = [
  {
    title: "Life Insurance",
    slug: "life-insurance",
    img: `${BUBBLE_IMG_BASE}/life.png`,
    size: 30,
    x: 4,
    y: 0,
    delay: 0,
    duration: 6.5,
  },
  {
    title: "Health Insurance",
    slug: "health-insurance",
    img: `${BUBBLE_IMG_BASE}/health.png`,
    size: 24,
    x: 46,
    y: 14,
    delay: 1.1,
    duration: 5.4,
  },
  {
    title: "Motor Insurance",
    slug: "motor-insurance",
    img: `${BUBBLE_IMG_BASE}/motor.png`,
    size: 32,
    x: 0,
    y: 33,
    delay: 2.3,
    duration: 7.2,
  },
  {
    title: "Home Insurance",
    slug: "home-insurance",
    img: `${BUBBLE_IMG_BASE}/home.png`,
    size: 27,
    x: 45,
    y: 44,
    delay: 0.6,
    duration: 6.1,
  },
  {
    title: "Fire Insurance",
    slug: "fire-insurance",
    img: `${BUBBLE_IMG_BASE}/fire.png`,
    size: 25,
    x: 10,
    y: 68,
    delay: 3.1,
    duration: 6.8,
  },
  {
    title: "Marine Insurance",
    slug: "marine-insurance",
    img: `${BUBBLE_IMG_BASE}/marine.png`,
    size: 22,
    x: 53,
    y: 74,
    delay: 1.8,
    duration: 5.8,
  },
];

/* ---------- Sliding stats strip ----------
   This row used to be a plain overflow-x flex, so in a narrow column the first
   and last figures got sliced clean through. It is a marquee now: the list is
   rendered twice and the track slides exactly one copy's width, so it loops
   with no visible jump. The container edges are feathered with a mask instead
   of hard-clipped, so a figure fades rather than being cut mid-character.
   Below 600px it drops back to the static 2x2 grid. */

function StatsStrip() {
  const loop = [...STATS, ...STATS];

  return (
    <div className="ins-stats-wrap">
      <div className="ins-stats-track">
        {loop.map((s, i) => {
          const isDupe = i >= STATS.length;
          return (
            <div
              key={`${s.label}-${i}`}
              className={`ins-stat${isDupe ? " ins-stat-dupe" : ""}`}
              aria-hidden={isDupe || undefined}
            >
              <div className="ins-stat-value">{s.value}</div>
              <div className="ins-stat-label">{s.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Floating service bubbles ----------
   Six glass bubbles cascading down the right of the hero, echoing the ones the
   mascot is holding. The artwork is an <img> per bubble; the service name is
   carried by hidden link text and a tooltip, so the picture stays clean.
   Positions are absolute percentages inside the cluster box. */

function InsuranceBubbles() {
  return (
    <div className="ins-bubbles">
      {INSURANCE_CARDS.map(({title, slug, img, size, x, y, delay, duration}) => (
        <a
          key={slug}
          href={`${SERVICE_BASE}/${slug}`}
          className="ins-bubble-link"
          title={title}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}%`,
            textDecoration: "none",
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          <span className="ins-bubble">
            <span className="ins-bubble-gloss" aria-hidden="true" />
            <img
              src={img}
              alt=""
              aria-hidden="true"
              className="ins-bubble-img"
              width={256}
              height={256}
              loading="lazy"
              draggable={false}
            />
          </span>
          <span className="ins-sr-only">{title}</span>
        </a>
      ))}
    </div>
  );
}

/* ---------- misc small icons ---------- */

function ChevronDown({color = "#0B2563"}: {color?: string}) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={16}
      height={16}
      fill="none"
      stroke={color}
      strokeWidth={2.2}
    >
      <polyline
        points="5 8 10 13 15 8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 20 20"
      width={18}
      height={18}
      fill="none"
      stroke="#fff"
      strokeWidth={2.2}
    >
      <line x1="4" y1="10" x2="16" y2="10" strokeLinecap="round" />
      <polyline
        points="11 5 16 10 11 15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width={16}
      height={16}
      fill="none"
      stroke="#0B2563"
      strokeWidth={2.2}
    >
      <line x1="5.5" y1="5.5" x2="14.5" y2="14.5" strokeLinecap="round" />
      <line x1="14.5" y1="5.5" x2="5.5" y2="14.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width={16}
      height={16}
      fill="none"
      stroke="#16A34A"
      strokeWidth={2}
    >
      <circle cx="10" cy="10" r="8" />
      <polyline
        points="6.5 10.5 9 13 13.5 7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width={16}
      height={16}
      fill="none"
      stroke="#DC2626"
      strokeWidth={2}
    >
      <circle cx="10" cy="10" r="8" />
      <line x1="10" y1="6" x2="10" y2="11" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.6" fill="#DC2626" stroke="none" />
    </svg>
  );
}

function ShieldBadgeIcon() {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} fill="none">
      <path
        d="M16 3.5 5.5 7.3v8.1c0 6.3 4.3 11.7 10.5 13.1 6.2-1.4 10.5-6.8 10.5-13.1V7.3L16 3.5Z"
        fill="#fff"
        fillOpacity={0.18}
        stroke="#fff"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <polyline
        points="11.3 16.2 14.4 19.2 20.7 12.4"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TypeFieldIcon({color = TEAL}: {color?: string}) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={15}
      height={15}
      fill="none"
      stroke={color}
      strokeWidth={1.8}
    >
      <circle cx="10" cy="6.4" r="2.6" />
      <path d="M4 17c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" strokeLinecap="round" />
    </svg>
  );
}

function RupeeFieldIcon({color = TEAL}: {color?: string}) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={15}
      height={15}
      fill="none"
      stroke={color}
      strokeWidth={1.8}
    >
      <line x1="5" y1="4.5" x2="15" y2="4.5" strokeLinecap="round" />
      <line x1="5" y1="8" x2="15" y2="8" strokeLinecap="round" />
      <path d="M5 4.5c4 0 6 1.4 6 3.5S9 11.5 5 11.5" strokeLinecap="round" />
      <line x1="5" y1="11.5" x2="15" y2="16" strokeLinecap="round" />
    </svg>
  );
}

function PhoneFieldIcon({color = TEAL}: {color?: string}) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={15}
      height={15}
      fill="none"
      stroke={color}
      strokeWidth={1.8}
    >
      <path
        d="M5.5 3.5h3l1.4 3.4-1.8 1.4a9 9 0 0 0 4.6 4.6l1.4-1.8 3.4 1.4v3a1.3 1.3 0 0 1-1.4 1.3A13 13 0 0 1 4.2 4.9a1.3 1.3 0 0 1 1.3-1.4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockFieldIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width={13}
      height={13}
      fill="none"
      stroke="#0B2563"
      strokeWidth={1.8}
    >
      <rect x="4.5" y="9" width="11" height="7.5" rx="1.6" />
      <path d="M6.8 9V6.4a3.2 3.2 0 0 1 6.4 0V9" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- "Get Insured Fast" quote form (now shown inside the modal) ---------- */

function QuotePanel({onClose}: {onClose?: () => void}) {
  const [insType, setInsType] = useState("Health Insurance");
  const [sum, setSum] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fieldLabelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 10.5,
    fontWeight: 600,
    color: "#838383",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  };
  const fieldWrapStyle: React.CSSProperties = {
    border: "1.5px solid #E5E9F2",
    borderRadius: 12,
    padding: "12px 14px",
    marginBottom: 14,
  };
  const selectStyle: React.CSSProperties = {
    appearance: "none",
    WebkitAppearance: "none",
    border: "none",
    background: "transparent",
    fontSize: 15,
    fontWeight: 600,
    color: "#0B2563",
    fontFamily: "inherit",
    cursor: "pointer",
    paddingRight: 24,
    outline: "none",
    width: "100%",
  };
  const inputStyle: React.CSSProperties = {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 15,
    fontWeight: 600,
    color: "#0B2563",
    fontFamily: "inherit",
    width: "100%",
  };

  const handleGetQuote = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setFeedback({
        type: "error",
        text: "Please enter a valid 10-digit mobile number",
      });
      return;
    }

    if (!sum.trim()) {
      setFeedback({type: "error", text: "Please enter the sum insured amount"});
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    ).replace(/\/$/, "");

    try {
      const res = await fetch(`${apiUrl}/quoteleads`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          insuranceType: insType,
          sumInsured: sum,
          mobile,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error("Lead save failed:", res.status, errBody);
        setFeedback({
          type: "error",
          text:
            errBody.message || "Could not save your request. Please try again.",
        });
        setSubmitting(false);
        return;
      }

      setFeedback({
        type: "success",
        text: "Got it! Our expert will get in touch with you shortly.",
      });
    } catch (err) {
      console.error("Failed to save lead:", err);
      setFeedback({
        type: "error",
        text: "Network error — could not reach the server.",
      });
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  return (
    <div
      className="ins-quotepanel"
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 48px rgba(0,0,0,0.28)",
        padding: "24px 24px 20px",
        width: "100%",
      }}
    >
      {onClose && (
        <button
          type="button"
          className="ins-modal-close"
          onClick={onClose}
          aria-label="Close quote form"
        >
          <CloseIcon />
        </button>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#0B2563",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldBadgeIcon />
        </div>
        <div>
          <div
            style={{
              fontSize: 16.5,
              fontWeight: 900,
              color: "#0B2563",
              lineHeight: 1.2,
            }}
          >
            Get Insured Fast
          </div>
          <div style={{fontSize: 12, color: "#838383", fontWeight: 500}}>
            Quick. Simple. Secure.
          </div>
        </div>
      </div>

      <div style={fieldWrapStyle}>
        <div style={fieldLabelStyle}>
          <TypeFieldIcon /> Insurance Type
        </div>
        <div
          style={{position: "relative", display: "flex", alignItems: "center"}}
        >
          <select
            value={insType}
            onChange={(e) => setInsType(e.target.value)}
            style={selectStyle}
          >
            {INSURANCE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <div style={{position: "absolute", right: 0, pointerEvents: "none"}}>
            <ChevronDown />
          </div>
        </div>
      </div>

      <div style={fieldWrapStyle}>
        <div style={fieldLabelStyle}>
          <RupeeFieldIcon /> Sum Insured (₹)
        </div>
        <input
          type="text"
          value={sum}
          onChange={(e) => setSum(e.target.value)}
          placeholder="Enter Sum Insured"
          style={inputStyle}
        />
      </div>

      <div style={{...fieldWrapStyle, marginBottom: 20}}>
        <div style={fieldLabelStyle}>
          <PhoneFieldIcon /> Mobile Number
        </div>
        <input
          placeholder="Enter 10-digit mobile number"
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          maxLength={10}
          style={inputStyle}
        />
      </div>

      <button
        className="ins-quote-cta"
        disabled={submitting}
        onClick={handleGetQuote}
        style={{
          width: "100%",
          padding: "15px 20px",
          background: "#F25917",
          border: "none",
          borderRadius: 12,
          color: "#fff",
          fontSize: 15.5,
          fontWeight: 800,
          cursor: submitting ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontFamily: "inherit",
          transition: "transform 0.2s, box-shadow 0.2s",
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? (
          "Sending..."
        ) : (
          <>
            Get Quote <ArrowRight />
          </>
        )}
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          marginTop: 14,
          fontSize: 11.5,
          color: "#838383",
          fontWeight: 500,
        }}
      >
        <LockFieldIcon /> Your information is secure and encrypted
      </div>

      {feedback && (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 600,
            background: feedback.type === "success" ? "#ECFDF5" : "#FEF2F2",
            color: feedback.type === "success" ? "#047857" : "#DC2626",
            border: `1px solid ${feedback.type === "success" ? "#A7F3D0" : "#FECACA"}`,
          }}
        >
          {feedback.type === "success" ? <CheckCircleIcon /> : <AlertIcon />}
          {feedback.text}
        </div>
      )}
    </div>
  );
}

/* ---------- Modal shell ----------
   Closes on backdrop click and on Escape, and locks the page behind it so the
   hero doesn't scroll under the form. */

function QuoteModal({onClose}: {onClose: () => void}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="ins-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Get an insurance quote"
    >
      <div className="ins-modal" onClick={(e) => e.stopPropagation()}>
        <QuotePanel onClose={onClose} />
      </div>
    </div>
  );
}

export default function Banner() {
  const {headline, visible} = useRotatingHeadline(
    HEADLINES,
    HEADLINE_INTERVAL_MS,
  );
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;0,900;1,800;1,900&display=swap');
        @font-face {
          font-family: 'BalooChettan2';
          src: url('/BalooChettan2-Medium.ttf') format('truetype');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'BalooChettan2';
          src: url('/BalooChettan2-Medium.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'BalooChettan2';
          src: url('/BalooChettan2-Medium.ttf') format('truetype');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'BalooChettan2';
          src: url('/BalooChettan2-Medium.ttf') format('truetype');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'BalooChettan2';
          src: url('/BalooChettan2-Medium.ttf') format('truetype');
          font-weight: 900;
          font-style: normal;
          font-display: swap;
        }
        .ins-root *{box-sizing:border-box;font-family: var(--font-sora), "Sora", sans-serif;}
        .ins-headline-malayalam,
        .ins-headline-malayalam * {
          font-family: 'BalooChettan2', sans-serif !important;
        }

        /* ---- three-column hero: left content | center image | right service cards ---- */
        .ins-inner{
          display:flex;
          align-items:center;
          gap:24px;
        }
        .ins-left{ flex:0 1 34%; min-width:0; }
        .ins-center{ flex:1 1 36%; min-width:0; display:flex; align-items:center; justify-content:center; }
        .ins-right{ flex:0 0 296px; min-width:0; }

        .ins-headline{
          transition: opacity .3s ease, transform .3s ease;
        }
        .ins-headline.ins-headline-hidden{
          opacity:0;
          transform:translateY(6px);
        }
        .ins-headline.ins-headline-visible{
          opacity:1;
          transform:translateY(0);
        }

        /* ---- stats: seamless sliding strip, feathered at both ends ---- */
        .ins-stats-wrap{
          width:100%;
          max-width:100%;
          overflow:hidden;
          position:relative;
          padding:2px 0;
          /* feathered edges — figures fade out instead of being sliced */
          -webkit-mask-image:linear-gradient(90deg,
            transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);
                  mask-image:linear-gradient(90deg,
            transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%);
        }
        .ins-stats-track{
          display:flex;
          align-items:flex-start;
          width:max-content;
          will-change:transform;
          animation:ins-stats-slide 24s linear infinite;
        }
        /* the track holds two identical copies, so moving exactly half its
           width lands on an identical frame — the loop has no visible jump */
        @keyframes ins-stats-slide{
          from{ transform:translateX(0); }
          to  { transform:translateX(-50%); }
        }
        .ins-stats-wrap:hover .ins-stats-track{ animation-play-state:paused; }

        .ins-stat{
          flex:0 0 auto;
          padding:0 26px;
          border-left:1px solid rgba(255,255,255,0.15);
          text-align:left;
        }
        .ins-stat-value{
          font-size:clamp(18px,2vw,24px);
          font-weight:900;
          color:#fff;
          line-height:1.15;
          white-space:nowrap;
        }
        .ins-stat-label{
          font-size:11.5px;
          color:rgba(255,255,255,0.5);
          margin-top:4px;
          white-space:nowrap;
        }

        /* less motion requested: a plain swipeable row, still never mid-cut */
        @media (prefers-reduced-motion: reduce){
          .ins-stats-track{ animation:none; }
          .ins-stats-wrap{
            overflow-x:auto;
            scrollbar-width:none;
            -webkit-mask-image:none;
                    mask-image:none;
          }
          .ins-stats-wrap::-webkit-scrollbar{ display:none; }
          .ins-stat-dupe{ display:none; }
        }

        /* ---- right column: floating service bubbles ---- */
        .ins-cards-panel{ padding:0; min-width:0; }
        .ins-sr-only{
          position:absolute;
          width:1px;height:1px;
          padding:0;margin:-1px;
          overflow:hidden;
          clip:rect(0 0 0 0);
          white-space:nowrap;
          border:0;
        }
        .ins-bubbles{
          position:relative;
          width:100%;
          max-width:300px;
          margin:0 auto;
          aspect-ratio:1 / 1.35;
        }
        .ins-bubble-link{
          display:block;
          animation-name:ins-bubble-float;
          animation-timing-function:ease-in-out;
          animation-iteration-count:infinite;
        }
        /* translucent glass, lit from the upper left, with a faint cool glow
           around it so it separates from the navy without going solid white */
        .ins-bubble{
          position:relative;
          display:flex;
          align-items:center;
          justify-content:center;
          width:100%;
          aspect-ratio:1 / 1;
          border-radius:50%;
          border:1px solid rgba(255,255,255,0.45);
          background:
            radial-gradient(circle at 30% 26%,
              rgba(255,255,255,0.97) 0%,
              rgba(255,255,255,0.88) 38%,
              rgba(232,243,252,0.72) 70%,
              rgba(186,214,238,0.55) 100%);
          backdrop-filter:blur(3px);
          -webkit-backdrop-filter:blur(3px);
          box-shadow:
            0 16px 30px rgba(0,6,40,0.34),
            0 0 22px rgba(120,190,230,0.18),
            inset 0 -10px 18px rgba(255,255,255,0.7),
            inset 0 8px 16px rgba(130,170,210,0.22);
          transition:transform .25s ease, box-shadow .25s ease;
        }
        .ins-bubble-img{
          width:60%;
          height:60%;
          object-fit:contain;
          user-select:none;
          -webkit-user-drag:none;
        }
        /* specular highlight */
        .ins-bubble-gloss{
          position:absolute;
          top:10%;
          left:15%;
          width:32%;
          height:20%;
          border-radius:50%;
          background:rgba(255,255,255,0.95);
          filter:blur(4px);
          opacity:.95;
          pointer-events:none;
        }
        .ins-bubble-link:hover .ins-bubble{
          transform:scale(1.08);
          box-shadow:
            0 22px 38px rgba(0,6,40,0.42),
            0 0 30px rgba(120,190,230,0.28),
            inset 0 -10px 18px rgba(255,255,255,0.75),
            inset 0 8px 16px rgba(130,170,210,0.22);
        }
        .ins-bubble-link:hover{ animation-play-state:paused; }
        .ins-bubble-link:focus-visible{
          outline:2px solid #20BEC6;
          outline-offset:4px;
          border-radius:50%;
        }
        @keyframes ins-bubble-float{
          0%   { transform:translate3d(0,0,0); }
          50%  { transform:translate3d(0,-12px,0); }
          100% { transform:translate3d(0,0,0); }
        }
        @media (prefers-reduced-motion: reduce){
          .ins-bubble-link{ animation:none; }
          .ins-bubble{ transition:none; }
        }

        .ins-quote-cta:hover{ transform:translateY(-2px); box-shadow:0 10px 22px rgba(242,89,23,0.35); }

        /* ---- quote modal ---- */
        .ins-modal-backdrop{
          position:fixed;
          inset:0;
          z-index:1000;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
          overflow-y:auto;
          background:rgba(0,10,45,0.62);
          backdrop-filter:blur(5px);
          -webkit-backdrop-filter:blur(5px);
          animation:ins-modal-fade .18s ease;
        }
        .ins-modal{
          width:100%;
          max-width:400px;
          margin:auto;
          animation:ins-modal-pop .24s cubic-bezier(.34,1.3,.64,1);
        }
        .ins-modal-close{
          position:absolute;
          top:14px;
          right:14px;
          width:30px;
          height:30px;
          display:flex;
          align-items:center;
          justify-content:center;
          border:none;
          border-radius:9px;
          background:#F1F3F8;
          cursor:pointer;
          transition:background .18s ease;
        }
        .ins-modal-close:hover{ background:#E2E6F0; }
        @keyframes ins-modal-fade{ from{opacity:0} to{opacity:1} }
        @keyframes ins-modal-pop{
          from{ opacity:0; transform:translateY(10px) scale(.98); }
          to  { opacity:1; transform:none; }
        }
        @media (prefers-reduced-motion: reduce){
          .ins-modal-backdrop, .ins-modal{ animation:none; }
        }

        @media(max-width:1200px){
          .ins-inner{ flex-wrap:wrap; }
          .ins-left{ flex:1 1 100%; order:1; }
          .ins-center{ flex:1 1 45%; order:2; }
          .ins-right{ flex:1 1 50%; order:3; }
        }

        @media(max-width:1024px){
          .ins-section{ padding-top:72px!important; }
          .ins-inner{ padding:32px 32px 0!important; gap:28px!important; }
          .ins-left{ text-align:left!important; }
          .ins-left h1{ font-size:clamp(26px, 4vw, 40px)!important; text-align:left!important; white-space:normal!important; }
          .ins-left p{ font-size:13px!important; text-align:left!important; }
          .ins-cta-row{ justify-content:flex-start!important; flex-direction:row!important; flex-wrap:nowrap!important; }
          .ins-cta-row a, .ins-cta-row button { padding: 10px 18px!important; font-size: 13px!important; white-space:nowrap!important; }
          .ins-stat{ padding:0 20px!important; }
          .ins-stat-value{ font-size:20px!important; }
          .ins-stat-label{ font-size:11px!important; }
          .ins-center{ flex:1 1 100%!important; order:2!important; }
          .ins-center img{ max-width:380px!important; }
          .ins-right{ flex:1 1 100%!important; order:3!important; }
          .ins-bubbles{ max-width:340px!important; }
        }

        @media(max-width:600px){
          .ins-section{ padding-top:56px!important; }
          .ins-inner{ padding:28px 20px 0!important; }
          .ins-left h1{
            font-size:clamp(32px,10vw,44px)!important;
            line-height:1.14!important;
            margin-bottom:18px!important;
            white-space:normal!important;
          }
          .ins-left p{
            font-size:14.5px!important;
            line-height:1.6!important;
            margin-bottom:26px!important;
          }
          .ins-cta-row{
            flex-direction:row!important;
            flex-wrap:nowrap!important;
            align-items:center!important;
            justify-content:center!important;
            gap:10px!important;
            margin-bottom:32px!important;
          }
          .ins-cta-row a, .ins-cta-row button{
            flex:1 1 0!important;
            width:auto!important;
            text-align:center!important;
            box-sizing:border-box!important;
            justify-content:center!important;
            display:inline-flex!important;
            padding:12px 10px!important;
            font-size:13px!important;
            white-space:nowrap!important;
          }
          /* phones get the static 2x2 grid — it all fits, so nothing slides */
          .ins-stats-wrap{
            overflow:visible!important;
            -webkit-mask-image:none!important;
                    mask-image:none!important;
          }
          .ins-stats-track{
            display:grid!important;
            grid-template-columns:repeat(2,1fr)!important;
            width:100%!important;
            row-gap:20px!important;
            column-gap:12px!important;
            animation:none!important;
            transform:none!important;
          }
          .ins-stat-dupe{ display:none!important; }
          .ins-stat{
            padding:0!important;
            border-left:none!important;
          }
          .ins-stat-value{ font-size:20px!important; }
          .ins-stat-label{ font-size:11.5px!important; margin-top:3px!important; }
          .ins-center img{ max-width:230px!important; }
          .ins-bubbles{ max-width:280px!important; }
          .ins-modal-backdrop{ padding:14px!important; }
        }
      `}</style>

      <div className="ins-root">
        <section
          className="ins-section"
          style={{
            background: "#001a5a",
            position: "relative",
            overflow: "visible",
            paddingTop: 88,
            paddingBottom: 64,
          }}
        >
          <div className="ins-inner max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-16 relative z-10">
            {/* ---- left: headline, copy, CTAs, stats ---- */}
            <div className="ins-left text-center lg:text-left">
              <h1
                className={`ins-headline ${visible ? "ins-headline-visible" : "ins-headline-hidden"} ${headline.className || ""} text-[clamp(30px,2.4vw,44px)] font-black text-white leading-[1.15] mb-4 sm:mb-5 tracking-tight whitespace-nowrap`}
                style={headline.font ? {fontFamily: headline.font} : undefined}
              >
                {headline.line1}
                <br />
                {headline.line2.map((word, i) => (
                  <span
                    key={i}
                    style={{
                      color: word.color,
                      fontFamily: headline.font ? "inherit" : undefined,
                    }}
                  >
                    {word.text}
                  </span>
                ))}
              </h1>
              <p className="text-[13.5px] sm:text-[14px] text-white/70 leading-relaxed mb-6 sm:mb-9 max-w-[460px] mx-auto lg:mx-0">
                We help families find the right insurance coverage with easy
                processes, trusted advisors, and dependable claim support
                whenever you need it.
              </p>
              <div className="ins-cta-row flex flex-row gap-3 sm:gap-4 flex-nowrap items-center justify-center lg:justify-start mb-10 sm:mb-14">
                {/* opens the quote form in a modal instead of navigating away */}
                <button
                  type="button"
                  onClick={() => setQuoteOpen(true)}
                  className="py-3 sm:py-3.5 px-4 sm:px-6 bg-[#EC4F34] rounded-xl text-white no-underline text-[13.5px] sm:text-[14.5px] font-extrabold whitespace-nowrap text-center transition-all duration-200 hover:brightness-105 hover:-translate-y-0.5 cursor-pointer"
                >
                  Get your quote
                </button>
                <a
                  href="tel:18004258084"
                  className="py-3 sm:py-3.5 px-4 sm:px-6 bg-[#D5D7DA] border-[1.5px] border-white/40 rounded-xl text-black no-underline text-[13.5px] sm:text-[14.5px] font-extrabold backdrop-blur-md whitespace-nowrap text-center transition-all duration-200 hover:bg-white hover:-translate-y-0.5"
                >
                  Talk to an expert
                </a>
              </div>

              <StatsStrip />
            </div>

            {/* ---- center: family image ---- */}
            <div className="ins-center">
              <img
                src="/images/banner/banner-7.png"
                alt="Insurance coverage"
                className="w-full h-auto object-contain max-w-[640px] mx-auto"
              />
            </div>

            {/* ---- right: service cards (moved up from the old bottom strip) ---- */}
            <div className="ins-right">
              <div className="ins-cards-panel">
                <InsuranceBubbles />
              </div>
            </div>
          </div>
        </section>
      </div>

      {quoteOpen && <QuoteModal onClose={() => setQuoteOpen(false)} />}
    </>
  );
}