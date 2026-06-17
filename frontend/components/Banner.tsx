"use client";

import { useState } from "react";

const FAMILY_IMAGE_SRC = "/images/banner/Layer 2.png";

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

function QuoteBar() {
  const [insType, setInsType] = useState("Health Insurance");
  const [sum,     setSum]     = useState("₹5 Lakhs");
  const [mobile,  setMobile]  = useState("7510715196");

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

  return (
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
        <span style={{fontSize:10,fontWeight:700,color:"#8A96B0",letterSpacing:1,textTransform:"uppercase"}}>Insurance Type</span>
        <div style={{position:"relative",display:"flex",alignItems:"center"}}>
          <select value={insType} onChange={e=>setInsType(e.target.value)} style={selectStyle}>
            {INSURANCE_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
          <div style={{position:"absolute",right:0,pointerEvents:"none"}}><ChevronDown /></div>
        </div>
      </div>

      <div className="ins-quote-col" style={colStyle}>
        <span style={{fontSize:10,fontWeight:700,color:"#8A96B0",letterSpacing:1,textTransform:"uppercase"}}>Sum Insured</span>
        <div style={{position:"relative",display:"flex",alignItems:"center"}}>
          <select value={sum} onChange={e=>setSum(e.target.value)} style={selectStyle}>
            {SUM_INSURED.map(s=><option key={s}>{s}</option>)}
          </select>
          <div style={{position:"absolute",right:0,pointerEvents:"none"}}><ChevronDown /></div>
        </div>
      </div>

      <div className="ins-quote-col" style={{...colStyle,borderRight:"none"}}>
        <span style={{fontSize:10,fontWeight:700,color:"#8A96B0",letterSpacing:1,textTransform:"uppercase"}}>Mobile Number</span>
        <input type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} maxLength={10}
          style={{border:"none",outline:"none",background:"transparent",fontSize:17,
            fontWeight:600,color:"#0B2563",fontFamily:"inherit",width:"100%"}} />
      </div>

      <button className="ins-quote-cta" style={{
          marginLeft:16, padding:"16px 32px", background:"#F25917",
          border:"none", borderRadius:12, color:"#fff", fontSize:16,
          fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center",
          gap:10, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(244,98,42,0.45)",
          fontFamily:"inherit", transition:"transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e=>{
          (e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow="0 8px 28px rgba(244,98,42,0.6)";
        }}
        onMouseLeave={e=>{
          (e.currentTarget as HTMLButtonElement).style.transform="translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow="0 4px 20px rgba(244,98,42,0.45)";
        }}
      >Get Quote <ArrowRight /></button>
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

        /* ── TABLET (≤960px) ── */
        @media(max-width:960px){
          .ins-section{
            height:auto!important;
            min-height:auto!important;
            padding-bottom:0!important;
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
          .ins-left > div[style]{justify-content:center!important;}
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
            max-width:280px!important;
            margin:0 auto!important;
          }
          .floating-card{ display:none!important; }
          .ins-quote-wrap{
            position:relative!important;
            bottom:0!important;
            padding:24px 32px!important;
            margin-top:0!important;
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
          .ins-spacer{
            padding-top:${QUOTE_BAR_HALF + 32}px!important;
          }
        }

        /* ── MOBILE (≤600px) ── */
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
            padding:20px 16px!important;
          }
          .ins-quotebar{
            border-radius:14px!important;
          }
        
        }
      `}</style>

      <div className="ins-root">
        <section className="ins-section" style={{
          background:"linear-gradient(160deg, #0B2080 0%, #0A1B6B 45%, #061448 100%)",
          position:"relative", overflow:"visible",
          paddingTop:88,
          paddingBottom:`${QUOTE_BAR_HALF}px`,
          height:"100vh", minHeight:500,
        }}>
          {/* Background glows */}
          <div style={{position:"absolute",top:"10%",right:"25%",width:700,height:900,
            borderRadius:"50%",background:"radial-gradient(circle,rgba(56,189,248,0.09) 0%,transparent 65%)",
            pointerEvents:"none"}} />
          <div style={{position:"absolute",bottom:"15%",left:"5%",width:500,height:500,
            borderRadius:"50%",background:"radial-gradient(circle,rgba(30,80,220,0.10) 0%,transparent 65%)",
            pointerEvents:"none"}} />

          {/* Main row */}
          <div className="ins-inner" style={{
            maxWidth:1280, margin:"0 auto", padding:"64px 0 0 48px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            gap:32, position:"relative", zIndex:1,
          }}>
            {/* LEFT */}
            <div className="ins-left" style={{flex:"0 0 44%",maxWidth:530,paddingBottom:80}}>
              <h1 style={{
                fontSize:"clamp(28px,3.6vw,54px)", fontWeight:900, color:"#fff",
                lineHeight:1.12, margin:"0 0 20px", letterSpacing:"-0.5px",
              }}>
                Protection for<br />
                <span style={{color:"#F4622A",}}>Every </span>
                <span style={{color:"#38BDF8"}}>stage of life.</span>
              </h1>
              <p style={{fontSize:15,color:"rgba(255,255,255,0.64)",lineHeight:1.8,margin:"0 0 36px",maxWidth:460}}>
                We help families find the right insurance coverage with easy
                processes, trusted advisors, and dependable claim support
                whenever you need it.
              </p>
              <div className="ins-cta-row" style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:56}}>
                <a href="#" style={{padding:"14px 36px",background:"#F4622A",borderRadius:10,
                  color:"#fff",textDecoration:"none",fontSize:15,fontWeight:800,
                  boxShadow:"0 4px 26px rgba(244,98,42,0.5)",whiteSpace:"nowrap"}}>
                  Get your quote
                </a>
                <a href="#" style={{padding:"14px 36px",background:"rgba(255,255,255,0.06)",
                  border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:10,color:"#fff",
                  textDecoration:"none",fontSize:15,fontWeight:800,
                  backdropFilter:"blur(6px)",whiteSpace:"nowrap"}}>
                  Talk to an expert
                </a>
              </div>
              <div className="ins-stats" style={{display:"flex",alignItems:"flex-start",flexWrap:"wrap"}}>
                {STATS.map((s,i)=>(
                  <div key={s.label} style={{display:"flex",alignItems:"flex-start",gap:18,paddingRight:18}}>
                    {i!==0 && <div style={{width:1,height:40,background:"rgba(255,255,255,0.15)",flexShrink:0,marginTop:2}} />}
                    <div>
                      <div style={{fontSize:"clamp(17px,1.7vw,23px)",fontWeight:900,color:"#fff",lineHeight:1.1}}>{s.value}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.42)",marginTop:4,whiteSpace:"nowrap"}}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: image + 4 floating cards */}
            <div className="ins-right" style={{
              flex:"0 0 52%", maxWidth:680,
              display:"flex", flexDirection:"column", alignItems:"flex-end",
            }}>
              <div style={{position:"relative", width:"88%", marginRight:"-24px"}}>

                {/* ── CARD 1: ₹50L Health Cover (top-left) ── */}
                <FloatingCard style={{top:"30%", left:"-25%"}}>
                  <IconBox>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#00B3FB" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                      <path d="M9 12h6"/><path d="M12 9v6"/>
                    </svg>
                  </IconBox>
                  <div>
                    <div style={{fontSize:18,fontWeight:900,color:"#fff",lineHeight:1.1}}>₹50L</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.55)",marginTop:4,fontWeight:500}}>Lifetime Security</div>
                  </div>
                </FloatingCard>

                {/* ── CARD 2: Advisor Online (top-right) ── */}
                <FloatingCard style={{top:"30%", right:"-15%"}}>
                  <div style={{position:"relative", flexShrink:0}}>
                    <IconBox>
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="#00B3FB" stroke="#00B3FB" strokeWidth={1.8} xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="7" r="3" strokeLinecap="round"/>
                        <path d="M6.5 10.5C6.5 7.46 9.02 5 12 5s5.5 2.46 5.5 5.5" strokeLinecap="round"/>
                        <rect x="5" y="10.5" width="3" height="4.5" rx="1.5" fill="#38BDF8" stroke="none"/>
                        <rect x="16" y="10.5" width="3" height="4.5" rx="1.5" fill="#38BDF8" stroke="none"/>
                        <path d="M18 14v1a3 3 0 01-3 3h-2" strokeLinecap="round"/>
                      </svg>
                    </IconBox>
                    <div className="pulse-dot" style={{
                      position:"absolute", top:-2, right:-2,
                      width:12, height:12, borderRadius:"50%", background:"#4ADE80",
                      border:"2px solid rgba(5,18,80,0.9)",
                    }} />
                  </div>
                  <div style={{fontSize:15,fontWeight:700,color:"#fff",lineHeight:1.1}}>Hassle-Free <br/> Claims</div>
                </FloatingCard>

                {/* ── CARD 3: 24 hrs Avg. Claim Time (bottom-left) ── */}
                <FloatingCard style={{bottom:"18%", left:"-28%"}}>
                  <IconBox>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#00B3FB">
                      <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                    </svg>
                  </IconBox>
                  <div>
                    <div style={{fontSize:18,fontWeight:900,color:"#fff",lineHeight:1.1}}>24 hrs</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.55)",marginTop:4,fontWeight:500}}>Personalized Policy Guidance</div>
                  </div>
                </FloatingCard>

                {/* ── CARD 4: Renjith Kumar – Insurance Expert (bottom-right) ── */}
                <FloatingCard style={{bottom:"18%", right:"-12%"}}>
                  <div style={{
                    width:52, height:52, borderRadius:"50%",
                    background:"#00B3FB",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    flexShrink:0, fontSize:22, fontWeight:900, color:"#fff",
                    letterSpacing:"-0.5px",
                  }}>%</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"#fff",lineHeight:1.2}}>Trusted by <br /> Thousands</div>
                    <div style={{fontSize:11,color:"#38BDF8",marginTop:4,fontWeight:600}}>Insurance Expert</div>
                  </div>
                </FloatingCard>

                {/* Main banner image */}
                <img
                  src={FAMILY_IMAGE_SRC}
                  alt="Insurance coverage"
                  style={{width:"100%", height:"auto", display:"block", maxWidth:380, marginLeft:"70px"}}
                />
              </div>
            </div>
          </div>

          {/* Quote bar */}
          <div className="ins-quote-wrap" style={{
            position:"absolute", bottom:`-${QUOTE_BAR_HALF}px`,
            left:0, right:0, zIndex:20, padding:"0 48px",
          }}>
            <div style={{maxWidth:1280,margin:"0 auto"}}>
              <QuoteBar />
            </div>
          </div>
        </section>

    
      </div>
    </>
  );
}
