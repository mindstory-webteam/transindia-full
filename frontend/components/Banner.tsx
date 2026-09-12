"use client";

import {useEffect, useState} from "react";

/* ---------- brand ---------- */
const NAVY = "#001a5a";
const TEAL = "#20BEC6";
const ORANGE = "#EC4F34";

const SERVICE_BASE = "/our-services";
const HERO_IMAGE = "/images/banner/banner-6.png";

const INSURANCE_TYPES = [
  "Health Insurance",
  "Life Insurance",
  "Motor Insurance",
  "Term Insurance",
  "Travel Insurance",
];

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
      {text: "For Every ", color: ORANGE},
      {text: "Tomorrow. ", color: TEAL},
    ],
  },
  {
    line1: "ഓരോ ജീവിതത്തിനും. ",
    line2: [
      {text: " ഓരോ ", color: TEAL},
      {text: "നാളെക്കും.", color: ORANGE},
    ],
    font: "'BalooChettan2', sans-serif",
    className: "hero-headline-malayalam",
  },
  {
    line1: "हर जीवन के लिए। ",
    line2: [
      {text: "हर कल ", color: ORANGE},
      {text: "के लिए.", color: TEAL},
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
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % list.length);
        setVisible(true);
      }, 300);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [list.length, intervalMs]);

  return {headline: list[index], index, visible};
}

/* Every headline is rendered into the same grid cell — the live one on top, the
   others invisible ghosts underneath. The cell is therefore always as tall as
   the tallest translation, so swapping languages can't push the copy below it
   up and down. */
function headlineContent(h: Headline) {
  return (
    <>
      {h.line1}
      <br />
      {h.line2.map((word, i) => (
        <span key={i} style={{color: word.color}}>
          {word.text}
        </span>
      ))}
    </>
  );
}

/* ---------- line icons (24 grid, stroked — matches the reference set) ---------- */

type IconProps = {size?: number; color?: string; stroke?: number};

const box = (size: number) => ({
  width: size,
  height: size,
  display: "block" as const,
});

function LifeIcon({size = 30, color = TEAL, stroke = 1.6}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7.2" r="2.6" />
      <path d="M7.6 16.6a4.4 4.4 0 0 1 8.8 0" />
      <circle cx="5" cy="10.6" r="1.9" />
      <path d="M2 17.4a3.1 3.1 0 0 1 3.6-3" />
      <circle cx="19" cy="10.6" r="1.9" />
      <path d="M22 17.4a3.1 3.1 0 0 0-3.6-3" />
      <path d="M7.6 19.8h8.8" />
    </svg>
  );
}

function HealthIcon({size = 30, color = TEAL, stroke = 1.6}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.4S3.6 15.2 3.6 9.6a4.5 4.5 0 0 1 8.4-2.3 4.5 4.5 0 0 1 8.4 2.3c0 5.6-8.4 10.8-8.4 10.8Z" />
      <path d="M6.6 12h2.6l1.3-2.3 2 4.2 1.3-1.9h3" />
    </svg>
  );
}

function MotorIcon({size = 30, color = TEAL, stroke = 1.6}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.4 15.4v-3l1.7-.6 1.7-3.5A1.6 1.6 0 0 1 8.2 7.4h7.6a1.6 1.6 0 0 1 1.4.9l1.7 3.5 1.7.6v3" />
      <path d="M3.4 15.4h17.2v1.8a1 1 0 0 1-1 1h-1.4a1 1 0 0 1-1-1v-.8H6.8v.8a1 1 0 0 1-1 1H4.4a1 1 0 0 1-1-1Z" />
      <path d="M6 11.8h12" />
      <circle cx="7.2" cy="13.6" r=".9" fill={color} stroke="none" />
      <circle cx="16.8" cy="13.6" r=".9" fill={color} stroke="none" />
    </svg>
  );
}

function HomeIcon({size = 30, color = TEAL, stroke = 1.6}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.4 10.8 12 4.2l8.6 6.6" />
      <path d="M5.6 12.4v7a1.2 1.2 0 0 0 1.2 1.2h10.4a1.2 1.2 0 0 0 1.2-1.2v-7" />
      <path d="M9.8 20.6v-4.8h4.4v4.8" />
    </svg>
  );
}

function MarineIcon({size = 30, color = TEAL, stroke = 1.6}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13.6 12 11l8 2.6-1.7 4.5a2 2 0 0 1-1.9 1.3H7.6a2 2 0 0 1-1.9-1.3Z" />
      <path d="M7 12.4V8.2h10v4.2" />
      <path d="M12 8.2V4.8M9.6 6.4h4.8" />
    </svg>
  );
}

function FireIcon({size = 30, color = TEAL, stroke = 1.6}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.4c2.7 2.5 5.2 5 5.2 8.6a5.2 5.2 0 1 1-10.4 0c0-1.9.8-3.5 2-4.9.6 1.1 1.3 1.8 2.1 2.1 0-2.3.3-4.1 1.1-5.8Z" />
      <path d="M12 18.4a2.3 2.3 0 0 1-1.4-4.2c.7.6 1.2.6 1.4.2.4.7.9 1.2 1.4 1.7a2.3 2.3 0 0 1-1.4 2.3Z" />
    </svg>
  );
}

function MiscIcon({size = 30, color = TEAL, stroke = 1.6}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.4 3.4H6.8a1.4 1.4 0 0 0-1.4 1.4v14.4a1.4 1.4 0 0 0 1.4 1.4h5" />
      <path d="M8.2 8h6M8.2 11.4h4.4M8.2 14.8h2.6" />
      <path d="M17.6 11.4 21.4 13v3.2c0 2-1.6 3.7-3.8 4.4-2.2-.7-3.8-2.4-3.8-4.4V13Z" />
    </svg>
  );
}

function EntertainmentIcon({size = 30, color = TEAL, stroke = 1.6}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7.4h8v5.4a4 4 0 0 1-8 0Z" />
      <path d="M5.4 9.8h.01M8.6 9.8h.01" />
      <path d="M5.6 12.4a2.4 2.4 0 0 0 2.8 0" />
      <path d="M13 7.4h8v5.4a4 4 0 0 1-8 0Z" />
      <path d="M15.4 9.8h.01M18.6 9.8h.01" />
      <path d="M15.6 12.8a2.4 2.4 0 0 1 2.8 0" />
    </svg>
  );
}

/* stat + ui icons */

function ShieldCheckIcon({size = 20, color = TEAL, stroke = 1.7}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4.8 5.6v5.6c0 4.3 3 8 7.2 9 4.2-1 7.2-4.7 7.2-9V5.6Z" />
      <path d="m9.2 12 2 2.1 3.6-4" />
    </svg>
  );
}

function UsersIcon({size = 20, color = TEAL, stroke = 1.7}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9.4" cy="8.4" r="3" />
      <path d="M3.6 19a5.8 5.8 0 0 1 11.6 0" />
      <path d="M16 6.2a3 3 0 0 1 0 5.8M17.4 19a5.4 5.4 0 0 0-2-4.2" />
    </svg>
  );
}

function CheckBadgeIcon({size = 20, color = TEAL, stroke = 1.7}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.6" />
      <path d="m8.2 12.4 2.6 2.6 5-5.4" />
    </svg>
  );
}

function ClockIcon({size = 20, color = TEAL, stroke = 1.7}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.4V12l3 1.8" />
    </svg>
  );
}

function ArrowCircleIcon({size = 20, color = "#fff"}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.6 12h6.8M12.6 9.2 15.4 12l-2.8 2.8" />
    </svg>
  );
}

function HeadsetIcon({size = 18, color = "#fff"}: IconProps) {
  return (
    <svg viewBox="0 0 24 24" style={box(size)} fill="none" stroke={color}
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.4 15v-3a7.6 7.6 0 0 1 15.2 0v3" />
      <path d="M4.4 13.4h1.8a1.4 1.4 0 0 1 1.4 1.4v2.4a1.4 1.4 0 0 1-1.4 1.4H5.8a1.4 1.4 0 0 1-1.4-1.4Z" />
      <path d="M19.6 13.4h-1.8a1.4 1.4 0 0 0-1.4 1.4v2.4a1.4 1.4 0 0 0 1.4 1.4h.4a1.4 1.4 0 0 0 1.4-1.4Z" />
      <path d="M18.2 18.6v.4a2 2 0 0 1-2 2H13" />
    </svg>
  );
}

function ChevronDown({color = "rgba(255,255,255,0.75)"}: {color?: string}) {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke={color} strokeWidth={2}>
      <polyline points="5 8 10 13 15 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({color = "#fff"}: {color?: string}) {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke={color} strokeWidth={2.2}>
      <line x1="5.5" y1="5.5" x2="14.5" y2="14.5" strokeLinecap="round" />
      <line x1="14.5" y1="5.5" x2="5.5" y2="14.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="#34D399" strokeWidth={2}>
      <circle cx="10" cy="10" r="8" />
      <polyline points="6.5 10.5 9 13 13.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="#FCA5A5" strokeWidth={2}>
      <circle cx="10" cy="10" r="8" />
      <line x1="10" y1="6" x2="10" y2="11" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.6" fill="#FCA5A5" stroke="none" />
    </svg>
  );
}

function TypeFieldIcon() {
  return (
    <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke={TEAL} strokeWidth={1.7}>
      <circle cx="10" cy="6.4" r="2.6" />
      <path d="M4 17c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" strokeLinecap="round" />
    </svg>
  );
}

function RupeeFieldIcon() {
  return (
    <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke={TEAL} strokeWidth={1.7}>
      <line x1="5" y1="4.5" x2="15" y2="4.5" strokeLinecap="round" />
      <line x1="5" y1="8" x2="15" y2="8" strokeLinecap="round" />
      <path d="M5 4.5c4 0 6 1.4 6 3.5S9 11.5 5 11.5" strokeLinecap="round" />
      <line x1="5" y1="11.5" x2="15" y2="16" strokeLinecap="round" />
    </svg>
  );
}

function PhoneFieldIcon() {
  return (
    <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke={TEAL} strokeWidth={1.7}>
      <path d="M5.5 3.5h3l1.4 3.4-1.8 1.4a9 9 0 0 0 4.6 4.6l1.4-1.8 3.4 1.4v3a1.3 1.3 0 0 1-1.4 1.3A13 13 0 0 1 4.2 4.9a1.3 1.3 0 0 1 1.3-1.4Z"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockFieldIcon() {
  return (
    <svg viewBox="0 0 20 20" width={12} height={12} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1.7}>
      <rect x="4.5" y="9" width="11" height="7.5" rx="1.6" />
      <path d="M6.8 9V6.4a3.2 3.2 0 0 1 6.4 0V9" strokeLinecap="round" />
    </svg>
  );
}

function ShieldBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={TEAL}
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4.8 5.6v5.6c0 4.3 3 8 7.2 9 4.2-1 7.2-4.7 7.2-9V5.6Z" />
      <path d="m9.2 12 2 2.1 3.6-4" />
    </svg>
  );
}

/* ---------- content ---------- */

const STATS = [
  {value: "1.2L+", label: "Policies Sold", Icon: ShieldCheckIcon},
  {value: "500+", label: "Happy Clients", Icon: UsersIcon},
  {value: "₹250Cr+", label: "Claim Settled", Icon: CheckBadgeIcon},
  {value: "20+", label: "Years of Trust", Icon: ClockIcon},
];

/* the eight nav services, in nav order */
const SERVICES = [
  {l1: "Life", l2: "Insurance", slug: "life-insurance", Icon: LifeIcon},
  {l1: "Health", l2: "Insurance", slug: "health-insurance", Icon: HealthIcon},
  {l1: "Motor", l2: "Insurance", slug: "motor-insurance", Icon: MotorIcon},
  {l1: "Home", l2: "Insurance", slug: "home-insurance", Icon: HomeIcon},
  {l1: "Marine", l2: "Insurance", slug: "marine-insurance", Icon: MarineIcon},
  {l1: "Fire", l2: "Insurance", slug: "fire-insurance", Icon: FireIcon},
  {l1: "Miscellaneous", l2: "Insurance", slug: "miscellaneous-insurance", Icon: MiscIcon},
  {l1: "Entertainment", l2: "Insurance", slug: "entertainment-insurance", Icon: EntertainmentIcon},
];

/* ---------- stats row ---------- */

function StatsRow() {
  return (
    <div className="hero-stats">
      {STATS.map(({value, label, Icon}) => (
        <div className="hero-stat" key={label}>
          <span className="hero-stat-chip">
            <Icon size={18} />
          </span>
          <span>
            <span className="hero-stat-value">{value}</span>
            <span className="hero-stat-label">{label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- bottom service grid ---------- */

function ServiceGrid() {
  return (
    <div className="hero-services-panel">
      <div className="hero-services-head">
        <span className="hero-rule" />
        <h2 className="hero-services-title">What would you like to protect?</h2>
        <span className="hero-rule" />
      </div>

      <div className="hero-services">
        {SERVICES.map(({l1, l2, slug, Icon}) => (
          <a key={slug} href={`${SERVICE_BASE}/${slug}`} className="hero-service">
            <span className="hero-service-icon">
              <Icon size={55} stroke={1.5} />
            </span>
            <span className="hero-service-label">
              {l1}
              <br />
              {l2}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------- quote form ---------- */

function QuotePanel({onClose}: {onClose?: () => void}) {
  const [insType, setInsType] = useState("");
  const [sum, setSum] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleGetQuote = async () => {
    if (!insType) {
      setFeedback({type: "error", text: "Please choose an insurance type"});
      return;
    }
    if (!sum.trim()) {
      setFeedback({type: "error", text: "Please enter the sum insured amount"});
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setFeedback({type: "error", text: "Please enter a valid 10-digit mobile number"});
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
        body: JSON.stringify({insuranceType: insType, sumInsured: sum, mobile}),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error("Lead save failed:", res.status, errBody);
        setFeedback({
          type: "error",
          text: errBody.message || "Could not save your request. Please try again.",
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
      setFeedback({type: "error", text: "Network error — could not reach the server."});
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  return (
    <div className="hero-quote">
      {onClose && (
        <button type="button" className="hero-modal-close" onClick={onClose} aria-label="Close quote form">
          <CloseIcon />
        </button>
      )}

      <div className="hero-quote-head">
        <span className="hero-quote-badge">
          <ShieldBadgeIcon />
        </span>
        <span>
          <span className="hero-quote-title">Get Insured Fast</span>
          <span className="hero-quote-sub">Quick. Simple. Secure.</span>
        </span>
      </div>

      <label className="hero-field-label" htmlFor="hero-type">
        <TypeFieldIcon /> Insurance Type
      </label>
      <div className="hero-field">
        <select
          id="hero-type"
          className="hero-input hero-select"
          value={insType}
          onChange={(e) => setInsType(e.target.value)}
        >
          <option value="">Select Insurance Type</option>
          {INSURANCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="hero-field-chevron">
          <ChevronDown />
        </span>
      </div>

      <label className="hero-field-label" htmlFor="hero-sum">
        <RupeeFieldIcon /> Sum Insured (₹)
      </label>
      <div className="hero-field">
        <input
          id="hero-sum"
          className="hero-input"
          type="text"
          inputMode="numeric"
          value={sum}
          onChange={(e) => setSum(e.target.value)}
          placeholder="Enter Sum Insured"
        />
      </div>

      <label className="hero-field-label" htmlFor="hero-mobile">
        <PhoneFieldIcon /> Mobile Number
      </label>
      <div className="hero-field">
        <span className="hero-field-lead">
          <PhoneFieldIcon />
        </span>
        <input
          id="hero-mobile"
          className="hero-input"
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          maxLength={10}
          placeholder="Enter 10-digit mobile number"
        />
      </div>

      <button className="hero-quote-cta" disabled={submitting} onClick={handleGetQuote}>
        {submitting ? "Sending..." : "Get Quote"}
        {!submitting && <ArrowCircleIcon size={19} />}
      </button>

      <div className="hero-quote-note">
        <LockFieldIcon /> Your information is secure and encrypted
      </div>

      {feedback && (
        <div className={`hero-feedback hero-feedback-${feedback.type}`}>
          {feedback.type === "success" ? <CheckCircleIcon /> : <AlertIcon />}
          {feedback.text}
        </div>
      )}
    </div>
  );
}

/* ---------- modal (the hero CTA opens the same form) ---------- */

function QuoteModal({onClose}: {onClose: () => void}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="hero-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Get an insurance quote"
    >
      <div className="hero-modal" onClick={(e) => e.stopPropagation()}>
        <QuotePanel onClose={onClose} />
      </div>
    </div>
  );
}

export default function Banner() {
  const {headline, index, visible} = useRotatingHeadline(
    HEADLINES,
    HEADLINE_INTERVAL_MS,
  );
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <style>{`
        @font-face{font-family:'BalooChettan2' !important;src:url('/BalooChettan2-Medium.ttf') format('truetype') !important;font-weight:100 900 !important;font-style:normal !important;font-display:swap !important;}

        .hero-root, .hero-root *{ box-sizing:border-box !important; font-family:var(--font-sora),"Sora",sans-serif !important; }
        .hero-headline-malayalam, .hero-headline-malayalam *{ font-family:'BalooChettan2',sans-serif!important; }

        .hero-section{
          position:relative !important;
          background:${NAVY} !important;
          padding:88px 0 56px !important;
          overflow:hidden !important;
        }
        /* soft light behind the artwork, as in the reference */
        .hero-section::before{
          content:"" !important;
          position:absolute !important;
          top:-10% !important;
          right:8% !important;
          width:52% !important;
          height:90% !important;
          background:radial-gradient(circle, rgba(32,190,198,0.16) 0%, rgba(0,26,90,0) 68%) !important;
          pointer-events:none !important;
        }
        .hero-wrap{ position:relative !important; z-index:1 !important; max-width:1280px !important; margin:0 auto !important; padding:0 24px !important; }

        /* ---- hero: copy | artwork | quote form ---- */
        .hero-hero{ display:flex !important; align-items:center !important; gap:28px !important; }
        .hero-copy{ flex:1 1 42% !important; min-width:0 !important; }
        .hero-art{ flex:1 1 30% !important; min-width:0 !important; display:flex !important; justify-content:center !important; }
        .hero-art img{ width:100% !important; max-width:520px !important; height:auto !important; object-fit:contain !important; }
        .hero-form{ flex:0 0 330px !important; min-width:0 !important; }

        .hero-headline{
          font-size:clamp(32px,3.2vw,52px) !important;
          font-weight:900 !important;
          line-height:1.1 !important;
          letter-spacing:-1px !important;
          color:#fff !important;
          margin:0 !important;
          transition:opacity .3s ease, transform .3s ease !important;
        }
        .hero-headline-stack{ display:grid !important; margin:0 0 16px !important; }
        .hero-headline-stack > *{ grid-area:1 / 1 !important; margin:0 !important; }
        .hero-headline-ghost{ visibility:hidden !important; pointer-events:none !important; }
        .hero-headline-hidden{ opacity:0 !important; transform:translateY(6px) !important; }
        .hero-headline-visible{ opacity:1 !important; transform:translateY(0) !important; }
        .hero-lede{
          max-width:440px !important;
          margin:0 0 26px !important;
          font-size:14.5px !important;
          line-height:1.7 !important;
          color:rgba(255,255,255,0.72) !important;
        }

        /* ---- CTAs ---- */
        .hero-ctas{ display:flex !important; gap:14px !important; margin-bottom:34px !important; flex-wrap:wrap !important; }
        .hero-cta{
          display:inline-flex !important;
          align-items:center !important;
          gap:9px !important;
          padding:13px 22px !important;
          border-radius:12px !important;
          font-size:14.5px !important;
          font-weight:700 !important;
          text-decoration:none !important;
          border:none !important;
          cursor:pointer !important;
          font-family:inherit !important;
          transition:transform .18s ease, box-shadow .18s ease, background .18s ease !important;
        }
        .hero-cta-primary{ background:#1899A0 !important; color:#fff !important; }
        .hero-cta-primary:hover{ transform:translateY(-2px) !important; background:#20BEC6 !important; }
        .hero-cta-ghost{
          background:rgba(255,255,255,0.06) !important;
          border:1.5px solid rgba(255,255,255,0.24) !important;
          color:#fff !important;
        }
        .hero-cta-ghost:hover{ background:rgba(255,255,255,0.12) !important; transform:translateY(-2px) !important; }

        /* ---- stats ---- */
        .hero-stats{ display:flex !important; align-items:center !important; flex-wrap:nowrap !important; gap:0 !important; }
        .hero-stat{
          display:flex !important;
          align-items:center !important;
          gap:10px !important;
          padding:0 20px !important;
          border-left:1px solid rgba(255,255,255,0.14) !important;
        }
        .hero-stat:first-child{ padding-left:0 !important; border-left:none !important; }
        .hero-stat-chip{
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          width:36px !important;
          height:36px !important;
          border-radius:10px !important;
          flex:0 0 auto !important;
          background:rgba(32,190,198,0.12) !important;
          border:1px solid rgba(32,190,198,0.28) !important;
        }
        .hero-stat-value{ display:block !important; font-size:19px !important; font-weight:800 !important; color:#fff !important; line-height:1.15 !important; white-space:nowrap !important; }
        .hero-stat-label{ display:block !important; font-size:11.5px !important; color:rgba(255,255,255,0.55) !important; margin-top:2px !important; white-space:nowrap !important; }

        /* ---- quote form (glass, on-theme) ---- */
        .hero-quote{
          position:relative !important;
          border-radius:18px !important;
          padding:22px 22px 20px !important;
          background:rgba(255,255,255,0.055) !important;
          border:1px solid rgba(255,255,255,0.14) !important;
          backdrop-filter:blur(10px) !important;
          -webkit-backdrop-filter:blur(10px) !important;
          box-shadow:0 18px 48px rgba(0,6,40,0.42) !important;
        }
        .hero-quote-head{ display:flex !important; align-items:center !important; gap:12px !important; margin-bottom:18px !important; }
        .hero-quote-badge{
          display:flex !important; align-items:center !important; justify-content:center !important;
          width:42px !important; height:42px !important; border-radius:12px !important; flex:0 0 auto !important;
          background:rgba(32,190,198,0.14) !important;
          border:1px solid rgba(32,190,198,0.3) !important;
        }
        .hero-quote-title{ display:block !important; font-size:17px !important; font-weight:800 !important; color:#fff !important; line-height:1.2 !important; }
        .hero-quote-sub{ display:block !important; font-size:12px !important; color:rgba(255,255,255,0.6) !important; margin-top:2px !important; }

        .hero-field-label{
          display:flex !important; align-items:center !important; gap:6px !important;
          font-size:11.5px !important; font-weight:600 !important;
          color:rgba(255,255,255,0.72) !important;
          margin-bottom:7px !important;
        }
        .hero-field{
          position:relative !important;
          display:flex !important; align-items:center !important; gap:8px !important;
          padding:11px 14px !important;
          margin-bottom:15px !important;
          border-radius:11px !important;
          background:rgba(255,255,255,0.05) !important;
          border:1px solid rgba(255,255,255,0.16) !important;
          transition:border-color .18s ease, background .18s ease !important;
        }
        .hero-field:focus-within{ border-color:${TEAL} !important; background:rgba(255,255,255,0.08) !important; }
        .hero-field-lead{ display:flex !important; flex:0 0 auto !important; }
        .hero-field-chevron{ position:absolute !important; right:14px !important; pointer-events:none !important; display:flex !important; }
        .hero-input{
          width:100% !important; min-width:0 !important;
          border:none !important; outline:none !important; background:transparent !important;
          font-family:inherit !important; font-size:14px !important; font-weight:500 !important; color:#fff !important;
        }
        .hero-input::placeholder{ color:rgba(255,255,255,0.42) !important; }
        .hero-select{ appearance:none !important; -webkit-appearance:none !important; padding-right:22px !important; cursor:pointer !important; }
        .hero-select option{ color:#0B2563 !important; background:#fff !important; }

        .hero-quote-cta{
          width:100% !important;
          display:flex !important; align-items:center !important; justify-content:center !important; gap:9px !important;
          margin-top:4px !important; padding:14px 20px !important;
          border:none !important; border-radius:12px !important;
          background:#1899A0 !important; color:#fff !important;
          font-family:inherit !important; font-size:15px !important; font-weight:800 !important;
          cursor:pointer !important;
          transition:transform .18s ease, box-shadow .18s ease, opacity .18s ease !important;
        }
        .hero-quote-cta:hover:not(:disabled){ transform:translateY(-2px) !important; background:#20BEC6 !important;  }
        .hero-quote-cta:disabled{ opacity:.65 !important; cursor:not-allowed !important; }
        .hero-quote-note{
          display:flex !important; align-items:center !important; justify-content:center !important; gap:6px !important;
          margin-top:13px !important; font-size:11.5px !important; color:rgba(255,255,255,0.55) !important;
        }
        .hero-feedback{
          display:flex !important; align-items:center !important; gap:8px !important;
          margin-top:13px !important; padding:10px 13px !important; border-radius:10px !important;
          font-size:12.5px !important; font-weight:600 !important;
        }
        .hero-feedback-success{ background:rgba(16,185,129,0.14) !important; border:1px solid rgba(52,211,153,0.4) !important; color:#6EE7B7 !important; }
        .hero-feedback-error{ background:rgba(220,38,38,0.14) !important; border:1px solid rgba(252,165,165,0.4) !important; color:#FCA5A5 !important; }

        /* ---- bottom services panel ---- */
        .hero-services-panel{
          margin-top:18px !important;
          padding:26px 26px 28px !important;
          border-radius:22px !important;
          border:1px solid rgba(255,255,255,0.12) !important;
          background:rgba(255,255,255,0.025) !important;
        }
        .hero-services-head{ display:flex !important; align-items:center !important; gap:18px !important; margin-bottom:22px !important; }
        .hero-rule{ flex:1 1 auto !important; height:1px !important; background:linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 100%) !important; }
        .hero-services-head .hero-rule:last-child{ background:linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%) !important; }
        .hero-services-title{ margin:0 !important; font-size:16px !important; font-weight:700 !important; color:#fff !important; white-space:nowrap !important; }

        .hero-services{ display:grid !important; grid-template-columns:repeat(8,minmax(0,1fr)) !important; gap:14px !important; }
        .hero-service{
          display:flex !important; flex-direction:column !important; align-items:center !important; justify-content:center !important;
          gap:14px !important; min-height:142px !important; padding:22px 10px !important;
          border-radius:14px !important;
          border:1px solid rgba(255,255,255,0.12) !important;
          background:rgba(255,255,255,0.04) !important;
          text-decoration:none !important;
          transition:transform .2s ease, border-color .2s ease, background .2s ease, box-shadow .2s ease !important;
        }
        .hero-service-icon{ display:flex !important; transition:transform .25s cubic-bezier(.34,1.5,.64,1) !important; }
        .hero-service-label{
          text-align:center !important; font-size:12.5px !important; font-weight:600 !important;
          line-height:1.35 !important; color:rgba(255,255,255,0.92) !important;
        }
        .hero-service:hover{
          transform:translateY(-4px) !important;
          border-color:rgba(32,190,198,0.55) !important;
          background:rgba(255,255,255,0.07) !important;
          box-shadow:0 16px 30px rgba(0,6,40,0.4) !important;
        }
        .hero-service:hover .hero-service-icon{ transform:scale(1.1) !important; }
        .hero-service:focus-visible{ outline:2px solid ${TEAL} !important; outline-offset:3px !important; }

        /* ---- modal ---- */
        .hero-modal-backdrop{
          position:fixed !important; inset:0 !important; z-index:1000 !important;
          display:flex !important; align-items:center !important; justify-content:center !important;
          padding:20px !important; overflow-y:auto !important;
          background:rgba(0,10,45,0.7) !important;
          backdrop-filter:blur(5px) !important; -webkit-backdrop-filter:blur(5px) !important;
          animation:hero-fade .18s ease !important;
        }
        .hero-modal{ width:100% !important; max-width:380px !important; margin:auto !important; animation:hero-pop .24s cubic-bezier(.34,1.3,.64,1) !important; }
        .hero-modal .hero-quote{ background:rgba(10,32,86,0.96) !important; }
        .hero-modal-close{
          position:absolute !important; top:14px !important; right:14px !important;
          width:30px !important; height:30px !important;
          display:flex !important; align-items:center !important; justify-content:center !important;
          border:1px solid rgba(255,255,255,0.18) !important; border-radius:9px !important;
          background:rgba(255,255,255,0.08) !important; cursor:pointer !important;
          transition:background .18s ease !important;
        }
        .hero-modal-close:hover{ background:rgba(255,255,255,0.16) !important; }
        @keyframes hero-fade{ from{opacity:0} to{opacity:1} }
        @keyframes hero-pop{ from{opacity:0; transform:translateY(10px) scale(.98)} to{opacity:1; transform:none} }

        @media (prefers-reduced-motion: reduce){
          .hero-headline, .hero-service, .hero-service-icon, .hero-cta, .hero-quote-cta{ transition:none !important; }
          .hero-modal-backdrop, .hero-modal{ animation:none !important; }
        }

        /* ---- responsive ---- */
        @media(max-width:1180px){
          .hero-hero{ flex-wrap:wrap !important; }
          .hero-copy{ flex:1 1 100% !important; order:1 !important; }
          .hero-art{ flex:1 1 48% !important; order:2 !important; }
          .hero-form{ flex:1 1 44% !important; order:3 !important; max-width:420px !important; }
          .hero-services{ grid-template-columns:repeat(4,minmax(0,1fr)) !important; }
        }
        @media(max-width:820px){
          .hero-section{ padding:64px 0 44px !important; }
          .hero-wrap{ padding:0 18px !important; }
          .hero-art{ flex:1 1 100% !important; }
          .hero-art img{ max-width:380px !important; }
          .hero-form{ flex:1 1 100% !important; max-width:460px !important; margin:0 auto !important; }
          .hero-stats{ flex-wrap:wrap !important; gap:16px 0 !important; }
          .hero-stat{ padding:0 16px !important; }
          .hero-services-head{ gap:12px !important; }
          .hero-services-title{ font-size:15px !important; white-space:normal !important; text-align:center !important; }
        }
        @media(max-width:600px){
          .hero-headline{ font-size:clamp(30px,8.5vw,40px) !important; }
          .hero-lede{ font-size:14px !important; }
          .hero-ctas{ gap:10px !important; }
          .hero-cta{ flex:1 1 0 !important; justify-content:center !important; padding:12px 14px !important; font-size:13.5px !important; white-space:nowrap !important; }
          .hero-stats{ display:grid !important; grid-template-columns:repeat(2,1fr) !important; gap:18px 10px !important; }
          .hero-stat{ padding:0!important; border-left:none!important; }
          .hero-services-panel{ margin-top:34px !important; padding:20px 14px 22px !important; border-radius:18px !important; }
          .hero-services{ grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:10px !important; }
          .hero-service{ min-height:122px !important; padding:18px 8px !important; gap:12px !important; }
          .hero-service-icon svg{ width:36px !important; height:36px !important; }
          .hero-modal-backdrop{ padding:14px !important; }
        }
      `}</style>

      <div className="hero-root">
        <section className="hero-section" style={{background: NAVY}}>
          <div className="hero-wrap">
            <div className="hero-hero">
              {/* ---- left: headline, copy, CTAs, stats ---- */}
              <div className="hero-copy">
                <div className="hero-headline-stack">
                  {/* height reservers — never seen, never read out */}
                  {HEADLINES.map((h, i) => (
                    <div
                      key={`ghost-${i}`}
                      aria-hidden="true"
                      className={`hero-headline hero-headline-ghost ${h.className || ""}`}
                      style={h.font ? {fontFamily: h.font} : undefined}
                    >
                      {headlineContent(h)}
                    </div>
                  ))}

                  <h1
                    className={`hero-headline hero-headline-live ${visible ? "hero-headline-visible" : "hero-headline-hidden"} ${headline.className || ""}`}
                    style={headline.font ? {fontFamily: headline.font} : undefined}
                  >
                    {headlineContent(HEADLINES[index])}
                  </h1>
                </div>

                <p className="hero-lede">
                  We help families and businesses find the right insurance
                  solutions with trusted guidance, simple processes, and claims
                  you can rely on.
                </p>

                <div className="hero-ctas">
                  <button
                    type="button"
                    className="hero-cta hero-cta-primary"
                    onClick={() => setQuoteOpen(true)}
                  >
                    Get your quote <ArrowCircleIcon size={19} />
                  </button>
                  <a href="tel:18004258084" className="hero-cta hero-cta-ghost">
                    Talk to an expert <HeadsetIcon size={18} />
                  </a>
                </div>

                <StatsRow />
              </div>

              {/* ---- middle: artwork ---- */}
              <div className="hero-art">
                <img src={HERO_IMAGE} alt="Insurance coverage for your family" />
              </div>

              {/* ---- right: quote form ---- */}
              <div className="hero-form">
                <QuotePanel />
              </div>
            </div>

            {/* ---- bottom: eight services ---- */}
            <ServiceGrid />
          </div>
        </section>
      </div>

      {quoteOpen && <QuoteModal onClose={() => setQuoteOpen(false)} />}
    </>
  );
}