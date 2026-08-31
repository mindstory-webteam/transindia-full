"use client";

import { useEffect, useState } from "react";

const FAMILY_IMAGE_SRC = "/images/banner/Layer 2.png]";

const STATS = [
  { value: "1.2L+",   label: "Policies sold"  },
  { value: "500+",    label: "Happy clients"  },
  { value: "₹250Cr+", label: "Claim Settled"  },
  { value: "20+",     label: "Years of Trust" },
];

const INSURANCE_TYPES = [
  "Health Insurance","Life Insurance","Motor Insurance",
  "Term Insurance","Travel Insurance",
];

/* Route prefix the service pages live under. The slugs below are the same
   ones the navigation uses, so a card and a nav item always resolve to the
   same page — change the prefix here only, never in the card list. */
const SERVICE_BASE = "/our-services";


type HeadlineWord = { text: string; color?: string };
type Headline = { line1: string; line2: HeadlineWord[] };

const HEADLINES: Headline[] = [
  {
    line1: "For Every Life. ",
    line2: [
      { text: "For Every ", color: "#F15A40" },
      { text: "Tomorrow. ", color: "#20BEC6" },
    ],
  },
  {
    line1: "ഓരോ ജീവിതത്തിനും. ",
    line2: [
      { text: " ഓരോ ", color: "#20BEC6" },
      { text: "നാളെക്കും.", color: "#F15A40" },
    ],
  },
  {
    line1: "हर जीवन के लिए। ",
    line2: [
      { text: "हर कल  ", color: "#F15A40" },
      { text: "के लिए.", color: "#20BEC6" },
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
        setIndex(prev => (prev + 1) % list.length);
        setVisible(true); // fade in next headline
      }, 300); // matches CSS transition duration below
    }, intervalMs);

    return () => clearInterval(timer);
  }, [list.length, intervalMs]);

  return { headline: list[index], visible };
}

/* ---------- Icons (soft-filled, drawn on a 32 grid) ---------- */

type IconProps = { size?: number; color?: string };

function LifeIcon({ size = 34, color = "#20BEC6" }: IconProps) {
  const f = color + "33";
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" style={{ display: "block" }}>
      <path d="M16 3.5 5.5 7.3v8.1c0 6.3 4.3 11.7 10.5 13.1 6.2-1.4 10.5-6.8 10.5-13.1V7.3L16 3.5Z"
        fill={f} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <circle cx="16" cy="14" r="2.9" fill={color} />
      <path d="M10.7 22.4a5.6 5.6 0 0 1 10.6 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function HealthIcon({ size = 34, color = "#F15A40" }: IconProps) {
  const f = color + "33";
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" style={{ display: "block" }}>
      <path d="M16 27.5S4.8 20.6 4.8 13.2A6 6 0 0 1 16 10a6 6 0 0 1 11.2 3.2c0 7.4-11.2 14.3-11.2 14.3Z"
        fill={f} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <path d="M9.4 16.6h3.4l1.7-3 2.6 5.4 1.7-2.4h3.8"
        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MotorIcon({ size = 34, color = "#F15A40" }: IconProps) {
  const f = color + "33";
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" style={{ display: "block" }}>
      <path d="M4.6 20.4h22.8v3.1a1.4 1.4 0 0 1-1.4 1.4h-2.1a1.4 1.4 0 0 1-1.4-1.4v-1.2H8.5v1.2a1.4 1.4 0 0 1-1.4 1.4H5a1.4 1.4 0 0 1-1.4-1.4v-3.1Z"
        fill={f} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <path d="M4.6 20.4v-4.1l2.3-.8 2.2-4.6a2.1 2.1 0 0 1 1.9-1.2h10a2.1 2.1 0 0 1 1.9 1.2l2.2 4.6 2.3.8v4.1"
        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15.5h16" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx="9.6" cy="18" r="1.3" fill={color} />
      <circle cx="22.4" cy="18" r="1.3" fill={color} />
    </svg>
  );
}

function HomeIcon({ size = 34, color = "#20BEC6" }: IconProps) {
  const f = color + "33";
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" style={{ display: "block" }}>
      <path d="M6.4 14.6 16 6.6l9.6 8v11.2a1.6 1.6 0 0 1-1.6 1.6H8a1.6 1.6 0 0 1-1.6-1.6V14.6Z"
        fill={f} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <path d="M3.6 15.8 16 5.2l12.4 10.6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 27.4v-6.2h6v6.2" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

function MarineIcon({ size = 34, color = "#20BEC6" }: IconProps) {
  const f = color + "33";
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" style={{ display: "block" }}>
      <path d="M5.4 17.6 16 14.2l10.6 3.4-2.2 6a2.6 2.6 0 0 1-2.5 1.7h-11.8a2.6 2.6 0 0 1-2.5-1.7l-2.2-6Z"
        fill={f} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <path d="M9 16.4v-5.6h14v5.6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 10.8V6.4M12.8 8.6h6.4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function FireIcon({ size = 34, color = "#F15A40" }: IconProps) {
  const f = color + "33";
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" style={{ display: "block" }}>
      <path d="M16 3.6c3.6 3.4 6.9 6.6 6.9 11.4a6.9 6.9 0 1 1-13.8 0c0-2.5 1.1-4.6 2.7-6.5.7 1.4 1.7 2.3 2.8 2.8 0-3 .4-5.5 1.4-7.7Z"
        fill={f} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <path d="M16 24.6a3.1 3.1 0 0 1-1.8-5.6c.9.8 1.5.8 1.8.3.5.9 1.2 1.5 1.9 2.2a3.1 3.1 0 0 1-1.9 3.1Z"
        fill={color} stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  );
}

const TEAL   = "#20BEC6";
const ORANGE = "#F15A40";

/* `slug` matches the navigation entries exactly (m1–m4, m6, m7). The two
   remaining nav services — miscellaneous-insurance and entertainment-insurance
   — have no card here yet; they need an icon before they can be added. */
const INSURANCE_CARDS = [
  { l1: "Life",   l2: "Insurance", accent: TEAL,   slug: "life-insurance",   Icon: LifeIcon,
    desc: "Secure your family's future with dependable life cover." },
  { l1: "Health", l2: "Insurance", accent: ORANGE, slug: "health-insurance", Icon: HealthIcon,
    desc: "Comprehensive medical coverage for you and your family." },
  { l1: "Motor",  l2: "Insurance", accent: ORANGE, slug: "motor-insurance",  Icon: MotorIcon,
    desc: "Complete protection for your car and two-wheeler." },
  { l1: "Home",   l2: "Insurance", accent: TEAL,   slug: "home-insurance",   Icon: HomeIcon,
    desc: "Safeguard your home against unexpected risks and loss." },
  { l1: "Marine", l2: "Insurance", accent: TEAL,   slug: "marine-insurance", Icon: MarineIcon,
    desc: "Coverage for cargo and goods in transit by sea or land." },
  { l1: "Fire",   l2: "Insurance", accent: ORANGE, slug: "fire-insurance",   Icon: FireIcon,
    desc: "Protect your property from fire and related damage." },
];

/* ---------- 6-up insurance card row (sits in the bottom panel now) ---------- */

function InsuranceCards() {
  return (
    <div
      className="ins-cards"
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        gap: 16,
        overflowX: "auto",
        overflowY: "visible", // was "hidden" — this clipped the card on hover-lift
        paddingTop: 12,       // room for the hover translateY(-7px) + shadow
        paddingBottom: 2,
        width: "100%",
      }}
    >
      {INSURANCE_CARDS.map(({ l1, l2, accent, slug, Icon, desc }) => (
        
        <a  key={slug}
          href={`${SERVICE_BASE}/${slug}`}
          className="ins-card"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
            flex: "1 1 0",
            minWidth: 150,
            minHeight: 128,
            padding: "20px 14px",
            borderRadius: 18,
            border: `2px solid ${accent}55`,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            textDecoration: "none",
            cursor: "pointer",
         
            transition: "transform .22s ease, box-shadow .22s ease, background .22s ease, border-color .22s ease",
          }}
        >
          <span
            className="ins-card-icon"
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 2,
              transition: "transform .28s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            <Icon size={32} color={accent} />
          </span>

          <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.25,
              }}
            >
              {l1}
              <br />
              {l2}
            </span>

            <span
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                marginTop: 8,
                fontSize: 11.5,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.55)",
                fontWeight: 500,
              }}
            >
              {desc}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}

/* ---------- misc small icons ---------- */

function ChevronDown({ color = "#0B2563" }: { color?: string }) {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke={color} strokeWidth={2.2}>
      <polyline points="5 8 10 13 15 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="#fff" strokeWidth={2.2}>
      <line x1="4" y1="10" x2="16" y2="10" strokeLinecap="round" />
      <polyline points="11 5 16 10 11 15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="#16A34A" strokeWidth={2}>
      <circle cx="10" cy="10" r="8" />
      <polyline points="6.5 10.5 9 13 13.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="#DC2626" strokeWidth={2}>
      <circle cx="10" cy="10" r="8" />
      <line x1="10" y1="6" x2="10" y2="11" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.6" fill="#DC2626" stroke="none" />
    </svg>
  );
}

function ShieldBadgeIcon() {
  return (
    <svg viewBox="0 0 32 32" width={22} height={22} fill="none">
      <path d="M16 3.5 5.5 7.3v8.1c0 6.3 4.3 11.7 10.5 13.1 6.2-1.4 10.5-6.8 10.5-13.1V7.3L16 3.5Z"
        fill="#fff" fillOpacity={0.18} stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
      <polyline points="11.3 16.2 14.4 19.2 20.7 12.4" stroke="#fff" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TypeFieldIcon({ color = TEAL }: { color?: string }) {
  return (
    <svg viewBox="0 0 20 20" width={15} height={15} fill="none" stroke={color} strokeWidth={1.8}>
      <circle cx="10" cy="6.4" r="2.6" />
      <path d="M4 17c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" strokeLinecap="round" />
    </svg>
  );
}

function RupeeFieldIcon({ color = TEAL }: { color?: string }) {
  return (
    <svg viewBox="0 0 20 20" width={15} height={15} fill="none" stroke={color} strokeWidth={1.8}>
      <line x1="5" y1="4.5" x2="15" y2="4.5" strokeLinecap="round" />
      <line x1="5" y1="8" x2="15" y2="8" strokeLinecap="round" />
      <path d="M5 4.5c4 0 6 1.4 6 3.5S9 11.5 5 11.5" strokeLinecap="round" />
      <line x1="5" y1="11.5" x2="15" y2="16" strokeLinecap="round" />
    </svg>
  );
}

function PhoneFieldIcon({ color = TEAL }: { color?: string }) {
  return (
    <svg viewBox="0 0 20 20" width={15} height={15} fill="none" stroke={color} strokeWidth={1.8}>
      <path d="M5.5 3.5h3l1.4 3.4-1.8 1.4a9 9 0 0 0 4.6 4.6l1.4-1.8 3.4 1.4v3a1.3 1.3 0 0 1-1.4 1.3A13 13 0 0 1 4.2 4.9a1.3 1.3 0 0 1 1.3-1.4Z"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockFieldIcon() {
  return (
    <svg viewBox="0 0 20 20" width={13} height={13} fill="none" stroke="#0B2563" strokeWidth={1.8}>
      <rect x="4.5" y="9" width="11" height="7.5" rx="1.6" />
      <path d="M6.8 9V6.4a3.2 3.2 0 0 1 6.4 0V9" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Right-hand "Get Insured Fast" quote form ---------- */

function QuotePanel() {
  const [insType, setInsType]       = useState("Health Insurance");
  const [sum,     setSum]           = useState("");
  const [mobile,  setMobile]        = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback]     = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fieldLabelStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 10.5, fontWeight: 600, color: "#838383",
    letterSpacing: 1, textTransform: "uppercase", marginBottom: 6,
  };
  const fieldWrapStyle: React.CSSProperties = {
    border: "1.5px solid #E5E9F2", borderRadius: 12,
    padding: "12px 14px", marginBottom: 14,
  };
  const selectStyle: React.CSSProperties = {
    appearance: "none", WebkitAppearance: "none", border: "none",
    background: "transparent", fontSize: 15, fontWeight: 600,
    color: "#0B2563", fontFamily: "inherit", cursor: "pointer",
    paddingRight: 24, outline: "none", width: "100%",
  };
  const inputStyle: React.CSSProperties = {
    border: "none", outline: "none", background: "transparent",
    fontSize: 15, fontWeight: 600, color: "#0B2563",
    fontFamily: "inherit", width: "100%",
  };

  const handleGetQuote = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setFeedback({ type: "error", text: "Please enter a valid 10-digit mobile number" });
      return;
    }

    if (!sum.trim()) {
      setFeedback({ type: "error", text: "Please enter the sum insured amount" });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

    try {
      const res = await fetch(`${apiUrl}/quoteleads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insuranceType: insType,
          sumInsured: sum,
          mobile,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error("Lead save failed:", res.status, errBody);
        setFeedback({ type: "error", text: errBody.message || "Could not save your request. Please try again." });
        setSubmitting(false);
        return;
      }

      setFeedback({ type: "success", text: "Got it! Our expert will get in touch with you shortly." });
    } catch (err) {
      console.error("Failed to save lead:", err);
      setFeedback({ type: "error", text: "Network error — could not reach the server." });
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  return (
    <div
      className="ins-quotepanel"
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 48px rgba(0,0,0,0.28)",
        padding: "24px 24px 20px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "#0B2563",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <ShieldBadgeIcon />
        </div>
        <div>
          <div style={{ fontSize: 16.5, fontWeight: 900, color: "#0B2563", lineHeight: 1.2 }}>
            Get Insured Fast
          </div>
          <div style={{ fontSize: 12, color: "#838383", fontWeight: 500 }}>
            Quick. Simple. Secure.
          </div>
        </div>
      </div>

      <div style={fieldWrapStyle}>
        <div style={fieldLabelStyle}><TypeFieldIcon /> Insurance Type</div>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <select value={insType} onChange={e => setInsType(e.target.value)} style={selectStyle}>
            {INSURANCE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <div style={{ position: "absolute", right: 0, pointerEvents: "none" }}><ChevronDown /></div>
        </div>
      </div>

      <div style={fieldWrapStyle}>
        <div style={fieldLabelStyle}><RupeeFieldIcon /> Sum Insured (₹)</div>
        <input
          type="text"
          value={sum}
          onChange={e => setSum(e.target.value)}
          placeholder="Enter Sum Insured"
          style={inputStyle}
        />
      </div>

      <div style={{ ...fieldWrapStyle, marginBottom: 20 }}>
        <div style={fieldLabelStyle}><PhoneFieldIcon /> Mobile Number</div>
        <input
          placeholder="Enter 10-digit mobile number"
          type="tel"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          maxLength={10}
          style={inputStyle}
        />
      </div>

      <button
        className="ins-quote-cta"
        disabled={submitting}
        onClick={handleGetQuote}
        style={{
          width: "100%", padding: "15px 20px", background: "#F25917",
          border: "none", borderRadius: 12, color: "#fff", fontSize: 15.5,
          fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 10, fontFamily: "inherit", transition: "transform 0.2s, box-shadow 0.2s",
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? "Sending..." : <>Get Quote <ArrowRight /></>}
      </button>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        marginTop: 14, fontSize: 11.5, color: "#838383", fontWeight: 500,
      }}>
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

export default function Banner() {
  const { headline, visible } = useRotatingHeadline(HEADLINES, HEADLINE_INTERVAL_MS);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;0,900;1,800;1,900&display=swap');
        .ins-root *{box-sizing:border-box;font-family: var(--font-sora), "Sora", sans-serif;}

        /* ---- three-column hero: left content | center image | right quote panel ---- */
        .ins-inner{
          display:flex;
          align-items:center;
          gap:24px;
        }
        .ins-left{ flex:0 1 34%; min-width:0; }
        .ins-center{ flex:1 1 40%; min-width:0; display:flex; align-items:center; justify-content:center; }
        .ins-right{ flex:0 0 280px; }

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

        .ins-card:hover{
          transform:translateY(-7px);
          box-shadow:0 18px 38px rgba(0,0,0,0.42)!important;
          background:rgba(255,255,255,0.1)!important;
          border-color:rgba(255,255,255,0.5)!important;
        }
        .ins-card:hover .ins-card-icon{ transform:scale(1.18) rotate(-4deg); }
        .ins-card:active{ transform:translateY(-2px); }

        .ins-quote-cta:hover{ transform:translateY(-2px); box-shadow:0 10px 22px rgba(242,89,23,0.35); }

        /* ---- bottom "what would you like to protect" panel ---- */
        .ins-cards-panel{
          border:1px solid rgba(255,255,255,0.14);
          border-radius:22px;
          background:rgba(255,255,255,0.03);
          padding:32px 28px 32px;
        }
        .ins-cards-title{
          text-align:center;
          color:#fff;
          font-size:16px;
          font-weight:800;
          margin-bottom:22px;
          position:relative;
        }
        .ins-cards{
          display:flex;
          flex-wrap:nowrap;
          gap:16px;
          overflow-x:auto;
          overflow-y:visible;
          padding-top:12px;
          padding-bottom:2px;
          scrollbar-width:none;
        }
        .ins-cards::-webkit-scrollbar{ display:none; }
        .ins-cards .ins-card{ flex:1 1 0; min-width:150px; }

        @media(max-width:1200px){
          .ins-inner{ flex-wrap:wrap; }
          .ins-left{ flex:1 1 100%; order:1; }
          .ins-center{ flex:1 1 55%; order:2; }
          .ins-right{ flex:1 1 40%; order:3; }
        }

        @media(max-width:1024px){
          .ins-section{ padding-top:72px!important; }
          .ins-inner{ padding:32px 32px 0!important; gap:28px!important; }
          .ins-left{ text-align:left!important; }
          .ins-left h1{ font-size:clamp(26px, 4vw, 40px)!important; text-align:left!important; white-space:normal!important; }
          .ins-left p{ font-size:13px!important; text-align:left!important; }
          .ins-cta-row{ justify-content:flex-start!important; }
          .ins-cta-row a { padding: 10px 18px!important; font-size: 13px!important; }
          .ins-stats{ justify-content:space-between!important; flex-wrap: nowrap!important; gap: 4px!important; overflow: hidden!important; width: 100%!important; }
          .ins-stats > div { padding-right: 0!important; }
          .ins-stats .text-left > div:first-child { font-size: 13px!important; }
          .ins-stats .text-left > div:last-child { font-size: 9px!important; }
          .ins-stats .w-\\[1px\\] { display: none!important; }
          .ins-center{ flex:1 1 100%!important; order:2!important; }
          .ins-center img{ max-width:380px!important; }
          .ins-right{ flex:1 1 100%!important; order:3!important; max-width:420px; margin:0 auto; }
          .ins-cards-wrap{ padding:0 32px 44px!important; }
          .ins-cards .ins-card{ min-width:150px!important; }
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
            flex-direction:column!important;
            align-items:stretch!important;
            justify-content:center!important;
            gap:12px!important;
            margin-bottom:32px!important;
          }
          .ins-cta-row a{
            width:100%!important;
            text-align:center!important;
            box-sizing:border-box!important;
            justify-content:center!important;
            display:flex!important;
            padding:14px 18px!important;
            font-size:14.5px!important;
          }
          .ins-stats{
            display:grid!important;
            grid-template-columns:repeat(2, 1fr)!important;
            row-gap:20px!important;
            column-gap:12px!important;
            width:100%!important;
            overflow:visible!important;
            flex-wrap:unset!important;
          }
          .ins-stats > div{
            padding-right:0!important;
            gap:0!important;
            flex-shrink:1!important;
          }
          .ins-stats .w-\\[1px\\]{ display:none!important; }
          .ins-stats .text-left > div:first-child { font-size: 20px!important; }
          .ins-stats .text-left > div:last-child { font-size: 11.5px!important; margin-top:3px!important; }
          .ins-center img{ max-width:230px!important; }
          .ins-cards-wrap{ padding:0 16px 36px!important; margin-top:36px!important; }
          .ins-cards-panel{ padding:22px 16px 24px!important; border-radius:18px!important; }
          .ins-cards .ins-card{ min-width:150px!important; padding:16px 12px!important; }
          .ins-cards .ins-card-icon svg{ width:26px!important; height:26px!important; }
        }
      `}</style>

      <div className="ins-root">
        <section className="ins-section" style={{
          background: "#001a5a",
          position: "relative", overflow: "visible",
          paddingTop: 88,
          paddingBottom: 56,
        }}>

          <div className="ins-inner max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-16 relative z-10">

            {/* ---- left: headline, copy, CTAs, stats ---- */}
            <div className="ins-left text-center lg:text-left">
              <h1
                className={`ins-headline ${visible ? "ins-headline-visible" : "ins-headline-hidden"} text-[clamp(30px,2.4vw,44px)] font-black text-white leading-[1.15] mb-4 sm:mb-5 tracking-tight whitespace-nowrap`}
              >
                {headline.line1}<br />
                {headline.line2.map((word, i) => (
                  <span key={i} style={{ color: word.color }}>{word.text}</span>
                ))}
              </h1>
              <p className="text-[13.5px] sm:text-[14px] text-white/70 leading-relaxed mb-6 sm:mb-9 max-w-[460px] mx-auto lg:mx-0">
                We help families find the right insurance coverage with easy processes,
                trusted advisors, and dependable claim support whenever you need it.
              </p>
              <div className="ins-cta-row flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap justify-center lg:justify-start mb-10 sm:mb-14">
                <a href="/contact-us" className="py-3 sm:py-3.5 px-6 sm:px-9 bg-[#EC4F34] rounded-xl text-white no-underline text-[14px] sm:text-[15px] font-extrabold whitespace-nowrap">
                  Get your quote
                </a>
                <a href="tel:18004258084" className="py-3 sm:py-3.5 px-6 sm:px-9 bg-[#D5D7DA] border-[1.5px] border-white/40 rounded-xl text-black no-underline text-[14px] sm:text-[15px] font-extrabold backdrop-blur-md whitespace-nowrap">
                  Talk to an expert
                </a>
              </div>
              <div className="ins-stats flex items-start flex-nowrap overflow-x-auto justify-start md:justify-start gap-4 sm:gap-0" style={{ scrollbarWidth: "none" }}>
                <style>{`.ins-stats::-webkit-scrollbar { display: none; }`}</style>
                {STATS.map((s, i) => (
                  <div key={s.label} className="flex items-start gap-[10px] sm:gap-[18px] pr-2 sm:pr-[18px] flex-shrink-0">
                    {i !== 0 && <div className="block w-[1px] h-10 bg-white/15 shrink-0 mt-0.5" />}
                    <div className="text-left">
                      <div className="text-[clamp(17px,2vw,23px)] font-black text-white leading-tight">{s.value}</div>
                      <div className="text-[11px] text-white/50 mt-1 whitespace-nowrap">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---- center: family image ---- */}
            <div className="ins-center">
              <img
                src="/images/banner/banner-4.png"
                alt="Insurance coverage"
                className="w-full h-auto object-contain max-w-[640px] mx-auto"
              />
            </div>

            {/* ---- right: get-a-quote form ---- */}
            <div className="ins-right">
              <QuotePanel />
            </div>
          </div>

          {/* ---- bottom: "what would you like to protect" card row ---- */}
          <div className="ins-cards-wrap px-4 sm:px-8 lg:px-12 mt-10 sm:mt-14">
            <div className="max-w-7xl mx-auto">
              <div className="ins-cards-panel">
                <div className="ins-cards-title">What would you like to protect?</div>
                <InsuranceCards />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}