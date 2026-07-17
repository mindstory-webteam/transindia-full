"use client";

import Breadcrum from "@/components/Breadcrum";

const STATS = [
  { value: "6",    suffix: "+",  label: "Insurance Categories",      suffixColor: "#F4622A" },
  { value: "20",   suffix: "+",  label: "Insurer Partners",          suffixColor: "#F4622A" },
  { value: "100",  suffix: "%",  label: "Independent Advice",        suffixColor: "#F4622A" },
  { value: "₹0",   suffix: "",   label: "Cost to You for Advisory",  suffixColor: "#F4622A" },
];

export default function ServicesHero() {
  return (
    <>
      <style>{CSS}</style>
      <div className="svc-root">
        <section className="svc-section">
          {/* Background glows */}
          <div className="svc-glow svc-glow-1" />
          <div className="svc-glow svc-glow-2" />

          <div className="svc-inner">
            <div className="svc-trail-wrapper">
              <Breadcrum crumbs={[{ label: "Home", href: "/" }, { label: "Our services" }]} />
            </div>

            <div className="svc-row">
              {/* LEFT */}
              <div className="svc-left">
                <h1 className="svc-title">
                  Complete protection,
                  <br />
                 
                  <span style={{ color: "#F4622A" }}>from a single</span>
                  <br/>
                 
                  <span style={{ color: "#38BDF8" }}>trusted partner</span>
                </h1>
                <p className="svc-desc">
                  From personal insurance to complex corporate risk management — TransIndia offers end-to-end broking and advisory services for individuals, families, and businesses across India.
                </p>

                <div className="svc-btns">
                  <a href="#contact" className="svc-btn-orange">Get Free Consultation</a>
                  <a href="/services" className="svc-btn-ghost">View all services</a>
                </div>
              </div>

              {/* RIGHT */}
              <div className="svc-right">
                <img
                  src="/images/services/main-service-banner-img.png"
                  alt="Complete protection"
                  className="svc-visual-img"
                />
              </div>
            </div>
          </div>

          {/* ── Floating stats bar ── */}
          <div className="svc-stats-bar">
            <div className="svc-stats-inner">
              {STATS.map((s, i) => (
                <div className="svc-stat" key={s.label}>
                  {i !== 0 && <div className="svc-stat-divider" />}
                  <div>
                    <div className="svc-stat-value">
                      {s.value}
                      {s.suffix && <span style={{ color: s.suffixColor }}>{s.suffix}</span>}
                    </div>
                    <div className="svc-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

const CSS = `
  .svc-root *{ box-sizing:border-box; }

  .svc-section{
    background: linear-gradient(160deg, #0B2080 0%, #0A1B6B 45%, #061448 100%);
    position: relative;
    overflow: visible;
    padding-top: 140px;
    padding-bottom: 0;
    font-family: 'matterregular', sans-serif;
    height: 700px;
  }

  .svc-glow{
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .svc-glow-1{
    top: 10%; right: 20%;
    width: 700px; height: 900px;
    background: radial-gradient(circle, rgba(56,189,248,0.09) 0%, transparent 65%);
  }
  .svc-glow-2{
    bottom: 10%; left: 5%;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(30,80,220,0.10) 0%, transparent 65%);
  }

  .svc-inner{
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 48px 96px;
    position: relative;
    z-index: 1;
  }

  .svc-trail-wrapper{
    margin-bottom: 0px;
    margin-top:20px;
  }

  .svc-row{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }

  .svc-left{
    flex: 0 0 54%;
    max-width: 600px;
  }

  .svc-title{
    font-size: clamp(28px, 3.6vw, 46px);
    font-weight: 900;
    color: #fff;
    line-height: 1.12;
    margin: 0 0 20px;
    letter-spacing: -0.5px;
  }

  .svc-desc{
    font-size: 15px;
    color: rgba(255,255,255,0.64);
    line-height: 1.8;
    margin: 0 0 32px;
    max-width: 480px;
  }

  .svc-btns{
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .svc-btn-orange{
    padding: 14px 32px;
    background: #F4622A;
    border-radius: 10px;
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 800;
    box-shadow: 0 4px 26px rgba(244,98,42,0.5);
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .svc-btn-orange:hover{
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(244,98,42,0.6);
  }

  .svc-btn-ghost{
    padding: 13px 30px;
    background: rgba(255,255,255,0.06);
    border: 1.5px solid rgba(255,255,255,0.4);
    border-radius: 10px;
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 800;
    backdrop-filter: blur(6px);
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    transition: border-color 0.2s, background 0.2s;
  }
  .svc-btn-ghost:hover{
    border-color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.12);
  }

  .svc-right{
    flex: 0 0 42%;
    max-width: 560px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .svc-visual-img{
    width: 100%;
    max-width: 440px;
    height: auto;
    object-fit: contain;
    display: block;
  }

  /* ── Floating stats bar ── */
  .svc-stats-bar{
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 50%);
    width: calc(100% - 64px);
    max-width: 1184px;
    z-index: 20;
  }

  .svc-stats-inner{
    width: 100%;
    background: #fff;
    border-radius: 16px;
    box-shadow:
      0 8px 32px rgba(10, 31, 110, 0.18),
      0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 24px 40px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .svc-stat{
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .svc-stat-divider{
    width: 1px;
    height: 40px;
    background: #E5E9F2;
    flex-shrink: 0;
  }

  .svc-stat-value{
    font-size: 26px;
    font-weight: 800;
    color: #0B2563;
    line-height: 1.1;
    white-space: nowrap;
  }

  .svc-stat-label{
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
    margin-top: 4px;
    white-space: nowrap;
  }

  /* ── TABLET (≤960px) ── */
  @media(max-width: 960px){
    .svc-trail-wrapper {
      display: none;
    }
    .svc-section{
      padding-top: 100px;
      height: auto;
      padding-bottom: 80px;
    }
    .svc-inner{
      padding: 0 32px 140px;
    }
    .svc-row{
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .svc-left{
      flex: unset;
      max-width: 100%;
      width: 100%;
      padding-bottom: 40px;
    }
    .svc-desc{
      margin-left: auto;
      margin-right: auto;
    }
    .svc-btns{
      justify-content: center;
    }
    .svc-right{
      flex: unset;
      max-width: 320px;
      width: 100%;
    }

    .svc-stats-inner{
      grid-template-columns: repeat(2, 1fr);
      gap: 24px 16px;
      padding: 24px;
    }
    .svc-stat-divider{ display: none; }
    .svc-stat{
      justify-content: center;
      text-align: center;
      flex-direction: column;
      gap: 4px;
    }
  }

  /* ── MOBILE (≤600px) ── */
  @media(max-width: 600px){
    .svc-section{
      padding-top: 88px;
      padding-bottom: 0;
    }
    .svc-inner{
      padding: 0 16px 220px;
    }
    .svc-trail-wrapper{
      display: none;
    }
    .svc-title{
      font-size: clamp(26px, 7.5vw, 38px);
    }
    .svc-desc{
      font-size: 14px;
    }
    .svc-btns{
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .svc-btns a{
      width: 100%;
      text-align: center;
    }
    .svc-right{
      max-width: 220px;
    }

    .svc-stats-bar{
      width: calc(100% - 32px);
    }
    .svc-stats-inner{
      grid-template-columns: 1fr;
      padding: 28px 24px;
      gap: 22px;
      border-radius: 16px;
    }
    .svc-stat{
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      gap: 4px;
    }
    .svc-stat-divider{
      display: none;
    }
    .svc-stat-value{
      font-size: 24px;
      white-space: normal;
    }
    .svc-stat-label{
      font-size: 13px;
      margin-top: 2px;
      white-space: normal;
    }
  }

  /* ── SMALL MOBILE (≤380px) ── */
  @media(max-width: 380px){
    .svc-inner{
      padding: 0 12px 200px;
    }
    .svc-title{
      font-size: clamp(22px, 8vw, 30px);
    }
    .svc-desc{
      font-size: 13px;
    }
    .svc-btn-orange, .svc-btn-ghost{
      padding: 12px 20px;
      font-size: 13px;
    }
    .svc-right{
      max-width: 180px;
    }
    .svc-stats-bar{
      width: calc(100% - 24px);
    }
    .svc-stats-inner{
      padding: 22px 18px;
      gap: 18px;
    }
    .svc-stat-value{ font-size: 21px; }
    .svc-stat-label{ font-size: 12px; }
  }
`;