"use client";

import { useState, useEffect, useRef } from "react";

const FAMILY_IMAGE_SRC = "/images/banner/Layer 2.png]";

const STATS = [
  { value: "1.2L+",   label: "Policies sold"  },
  { value: "50K+",    label: "Happy clients"  },
  { value: "₹500Cr+", label: "Claim Settled"  },
  { value: "15+",     label: "Years of Trust" },
];

const INSURANCE_TYPES = [
  "Health Insurance","Life Insurance","Motor Insurance",
  "Term Insurance","Travel Insurance",
];

const SUM_INSURED = [
  "₹2 Lakhs","₹3 Lakhs","₹5 Lakhs",
  "₹10 Lakhs","₹25 Lakhs","₹50 Lakhs","₹1 Crore",
];

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

function QuoteBar({ innerRef }: { innerRef?: React.Ref<HTMLDivElement> }) {
  const [insType, setInsType]       = useState("Health Insurance");
  const [sum,     setSum]           = useState("₹5 Lakhs");
  const [mobile,  setMobile]        = useState("7510715196");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback]     = useState<{ type: "success" | "error"; text: string } | null>(null);

  const selectStyle: React.CSSProperties = {
    appearance:"none", WebkitAppearance:"none", border:"none",
    background:"transparent", fontSize:17, fontWeight:600,
    color:"#0B2563", fontFamily:"inherit", cursor:"pointer",
    paddingRight:28, outline:"none", width:"100%",
  };
  const colStyle: React.CSSProperties = {
    flex:1, minWidth:180, padding:"0 28px",
    borderRight:"1.5px solid #E5E9F2",
    display:"flex", flexDirection:"column", gap:4, position:"relative",
  };

  const handleGetQuote = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setFeedback({ type: "error", text: "Please enter a valid 10-digit mobile number" });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not set — lead was NOT saved to backend.");
      setFeedback({ type: "error", text: "Configuration error: lead was not saved (missing API URL)" });
      setSubmitting(false);
      return; // stop here — don't pretend it worked
    }

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
        return; // don't open WhatsApp if the save failed — keeps behaviour honest
      }

      setFeedback({ type: "success", text: "Got it! Opening WhatsApp to connect you with an expert…" });
    } catch (err) {
      console.error("Failed to save lead:", err);
      setFeedback({ type: "error", text: "Network error — could not reach the server." });
      setSubmitting(false);
      return;
    }

    setSubmitting(false);

    const whatsappNumber = "7510400320";
    const message = `Hello, I'm interested in an insurance .\n\n*Insurance Type:* ${insType}\n*Sum Insured:* ${sum}\n*Mobile Number:* ${mobile}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div ref={innerRef} style={{ position: "relative" }}>
      <div className="ins-quotebar" style={{
        background:"#fff", borderRadius:18,
        boxShadow:"0 8px 48px rgba(0,0,0,0.18)",
        padding:"20px 28px", display:"flex", alignItems:"center", gap:0,
      }}>
        <div style={{
          paddingRight:28, borderRight:"1.5px solid #E5E9F2",
          whiteSpace:"nowrap", fontSize:18, fontWeight:900,
          color:"#0B2563", minWidth:148,
        }}>Get Insured Fast</div>

        <div className="ins-quote-col" style={colStyle}>
          <span style={{fontSize:10,fontWeight:400,color:"#838383",letterSpacing:1,textTransform:"uppercase"}}>Insurance Type</span>
          <div style={{position:"relative",display:"flex",alignItems:"center"}}>
            <select value={insType} onChange={e=>setInsType(e.target.value)} style={selectStyle}>
              {INSURANCE_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
            <div style={{position:"absolute",right:0,pointerEvents:"none"}}><ChevronDown /></div>
          </div>
        </div>

        <div className="ins-quote-col" style={colStyle}>
          <span style={{fontSize:10,fontWeight:400,color:"#838383",letterSpacing:1,textTransform:"uppercase"}}>Sum Insured</span>
          <div style={{position:"relative",display:"flex",alignItems:"center"}}>
            <select value={sum} onChange={e=>setSum(e.target.value)} style={selectStyle}>
              {SUM_INSURED.map(s=><option key={s}>{s}</option>)}
            </select>
            <div style={{position:"absolute",right:0,pointerEvents:"none"}}><ChevronDown /></div>
          </div>
        </div>

        <div className="ins-quote-col" style={{...colStyle,borderRight:"none"}}>
          <span style={{fontSize:10,fontWeight:400,color:"#838383",letterSpacing:1,textTransform:"uppercase"}}>Mobile Number</span>
          <input type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} maxLength={10}
            style={{border:"none",outline:"none",background:"transparent",fontSize:17,
              fontWeight:600,color:"#0B2563",fontFamily:"inherit",width:"100%"}} />
        </div>

        <button
          className="ins-quote-cta"
          disabled={submitting}
          onClick={handleGetQuote}
          style={{
            marginLeft:16, padding:"16px 32px", background:"#F25917",
            border:"none", borderRadius:12, color:"#fff", fontSize:16,
            fontWeight:800, cursor: submitting ? "not-allowed" : "pointer",
            display:"flex", alignItems:"center",
            gap:10, whiteSpace:"nowrap",
            fontFamily:"inherit", transition:"transform 0.2s, box-shadow 0.2s",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Sending..." : <>Get Quote <ArrowRight /></>}
        </button>
      </div>

      {feedback && (
        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderRadius: 10,
            fontSize: 13,
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

function FloatingCard({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <div className="floating-card" style={{
      position: "absolute",
      background: "rgba(5, 18, 80, 0.82)",
      border: "1.5px solid rgba(56, 189, 248, 0.28)",
      borderRadius: 18,
      padding: "14px 22px 14px 14px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      boxShadow: "0 4px 24px rgba(0,0,0,0.50)",
      zIndex: 10,
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      minWidth: 185,
      ...style,
    }}>
      {children}
    </div>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 52, height: 52,
      borderRadius: 13,
      background: "rgba(14, 60, 180, 0.55)",
      border: "1px solid rgba(56,189,248,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

export default function Banner() {
  const QUOTE_BAR_HALF = 38;
  const STACK_GAP = 28;

  const quoteRef = useRef<HTMLDivElement>(null);
  const [quoteH, setQuoteH] = useState(0);
  const [isStacked, setIsStacked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const onChange = () => setIsStacked(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    const measure = () => setQuoteH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const stacked = isStacked && quoteH > 0;
  const half = stacked ? Math.round(quoteH / 2) : QUOTE_BAR_HALF;
  const sectionPadB = stacked ? half + STACK_GAP : QUOTE_BAR_HALF;
  const spacerH = stacked ? half : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;0,900;1,800;1,900&display=swap');
        .ins-root *{box-sizing:border-box;font-family: var(--font-sora), "Sora", sans-serif;}

        @keyframes pulseDot{
          0%,100%{box-shadow:0 0 4px #4ADE80}
          50%    {box-shadow:0 0 12px #4ADE80,0 0 22px #4ADE8066}
        }
        .pulse-dot{animation:pulseDot 2s ease-in-out infinite}

        @media(max-width:1024px){
          .ins-section{
            height:auto!important;
            min-height:auto!important;
            padding-top:80px!important;
          }
          .ins-inner{
            flex-direction:column!important;
            padding:32px 32px 0!important;
            align-items:center!important;
          }
          .ins-left{
            flex:unset!important;
            max-width:100%!important;
            width:100%!important;
            padding-bottom:40px!important;
            text-align:center!important;
          }
          .ins-left h1,
          .ins-left p{
            margin-left:auto!important;
            margin-right:auto!important;
            text-align:center!important;
          }
          .ins-cta-row{
            justify-content:center!important;
          }
          .ins-stats{
            justify-content:center!important;
          }
          .ins-right{
            flex:unset!important;
            max-width:100%!important;
            width:100%!important;
            align-items:center!important;
            justify-content:center!important;
          }
          .ins-right > div{
            width:80%!important;
            margin-right:0!important;
          }
          .ins-right img{
            max-width:320px!important;
            margin:0 auto!important;
          }
          .floating-card{ display:none!important; }
          .ins-quote-wrap{
            padding-left:32px!important;
            padding-right:32px!important;
          }
          .ins-quotebar{
            flex-direction:column!important;
            align-items:stretch!important;
            gap:0!important;
            padding:20px!important;
          }
          .ins-quotebar > div:first-child{
            border-right:none!important;
            border-bottom:1.5px solid #E5E9F2!important;
            padding:0 0 16px 0!important;
            min-width:0!important;
            text-align:center!important;
          }
          .ins-quote-col{
            padding:14px 0!important;
            border-right:none!important;
            border-bottom:1.5px solid #E5E9F2!important;
            min-width:0!important;
          }
          .ins-quote-cta{
            margin-left:0!important;
            margin-top:16px!important;
            justify-content:center!important;
            width:100%!important;
          }
        }

        @media(max-width:600px){
          .ins-section{
            padding-top:72px!important;
          }
          .ins-inner{
            padding:24px 16px 0!important;
          }
          .ins-left{
            padding-bottom:32px!important;
          }
          .ins-left h1{
            font-size:clamp(26px,7.5vw,38px)!important;
          }
          .ins-left p{
            font-size:14px!important;
          }
          .ins-cta-row{
            flex-direction:column!important;
            align-items:center!important;
            justify-content:center!important;
            gap:10px!important;
          }
          .ins-cta-row a{
            width:100%!important;
            text-align:center!important;
            box-sizing:border-box!important;
          }
          .ins-stats{
            justify-content:center!important;
            gap:8px 0!important;
          }
          .ins-stats > div{
            padding-right:12px!important;
          }
          .ins-right > div{
            width:100%!important;
          }
          .ins-right img{
            max-width:240px!important;
          }
          .ins-quote-wrap{
            padding-left:16px!important;
            padding-right:16px!important;
          }
          .ins-quotebar{
            border-radius:14px!important;
          }
        }
      `}</style>

      <div className="ins-root">
        <section className="ins-section" style={{
          background:"#001a5a",
          position:"relative", overflow:"visible",
          paddingTop:88,
          paddingBottom:`${sectionPadB}px`,
          minHeight:"100vh",
        }}>

          <div className="ins-inner max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-8 relative z-10">
            <div className="ins-left w-full lg:w-[44%] max-w-[530px] pb-10 lg:pb-20 text-center lg:text-left mx-auto lg:mx-0">
              <h1 className="text-[clamp(32px,4vw,54px)] font-black text-white leading-tight mb-4 sm:mb-5 tracking-tight">
                Protection for<br />
                <span className="text-[#F15A40]">Every </span>
                <span className="text-[#20BEC6]">stage of life.</span>
              </h1>
              <p className="text-[13.5px] sm:text-[14px] text-white/70 leading-relaxed mb-6 sm:mb-9 max-w-[530px] mx-auto lg:mx-0">
                We help families find the right insurance coverage with easy processes, <br className="hidden md:block" />
                trusted advisors, and dependable claim support whenever you need it.
              </p>
              <div className="ins-cta-row flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap justify-center lg:justify-start mb-10 sm:mb-14">
                <a href="/contact-us" className="py-3 sm:py-3.5 px-6 sm:px-9 bg-[#EC4F34] rounded-xl text-white no-underline text-[14px] sm:text-[15px] font-extrabold  whitespace-nowrap">
                  Get your quote
                </a>
                <a href="tel:+18004258084" className="py-3 sm:py-3.5 px-6 sm:px-9 bg-[#D5D7DA] border-[1.5px] border-white/40 rounded-xl text-black no-underline text-[14px] sm:text-[15px] font-extrabold backdrop-blur-md whitespace-nowrap">
                  Talk to an expert
                </a>
              </div>
              <div className="ins-stats flex items-start flex-wrap justify-center lg:justify-start gap-4 sm:gap-0">
                {STATS.map((s,i)=>(
                  <div key={s.label} className="flex items-start gap-[10px] sm:gap-[18px] pr-2 sm:pr-[18px]">
                    {i!==0 && <div className="hidden sm:block w-[1px] h-10 bg-white/15 shrink-0 mt-0.5" />}
                    <div className="text-left">
                      <div className="text-[clamp(17px,2vw,23px)] font-black text-white leading-tight">{s.value}</div>
                      <div className="text-[11px] text-white/50 mt-1 whitespace-nowrap">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ins-right w-full lg:w-[52%] max-w-[500px] lg:max-w-[680px] flex flex-col items-center lg:items-end mt-4 lg:mt-0 mx-auto lg:mx-0">
              <div className="relative w-full lg:w-full lg:mr-[-18px]">
                <img
                  src="/images/home/HOME/HERO BANNER.png"
                  alt="Insurance coverage"
                  className="w-full h-auto object-contain max-w-full lg:max-w-[110%] mx-auto lg:ml-auto"
                />
              </div>
            </div>
          </div>

          <div className="ins-quote-wrap absolute left-0 right-0 z-20 px-4 sm:px-8 lg:px-12" style={{
            bottom: `-${half}px`,
          }}>
            <div className="max-w-7xl mx-auto">
              <QuoteBar innerRef={quoteRef} />
            </div>
          </div>
        </section>

        <div className="ins-quote-spacer" aria-hidden style={{ height: spacerH }} />

      </div>
    </>
  );
}