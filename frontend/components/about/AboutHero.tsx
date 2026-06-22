"use client";

import Breadcrum from "@/components/Breadcrum";

export default function AboutHero() {
  return (
    <>
      <style>{CSS}</style>
      <section className="about-hero">
        <div className="about-inner">
          <div className="about-trail-wrapper">
             <Breadcrum crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
          </div>

          <div className="about-content">
            <h1 className="about-title">
              India's Most Trusted
              <br />
              <span style={{ color: "#F15A40" }}>Insurance</span>{" "}
              <span style={{ color: "#20BEC6" }}>Marketplace.</span>
            </h1>
            <p className="about-desc">
              We exist to make insurance simple, honest, and accessible for every Indian family — whether you're planning for tomorrow or protecting what you've built today.
            </p>

            <div className="about-btns">
              <a href="#contact" className="about-btn-orange">Talk to an Expert</a>
              <a href="/careers" className="about-btn-ghost">Join Our Team</a>
            </div>
          </div>

          <div className="about-mobile-visual">
            <img src="/images/about/about-us-sm-banner1.png" alt="About TransIndia" />
          </div>

          <div className="about-lg-banner">
            <img src="/images/about/about-us-hero-lg.png" alt="About TransIndia Banner" />
          </div>
        </div>

        {/* ── .contact-lg-banner  ── */}
        <div className="about-stats-bar">
          <div className="about-stats-inner">
            {[
              { value: "18", label: "Years of Experience" },
              { value: "20", label: "Insurer Partners" },
              { value: "500K", label: "Happy Customers" },
              { value: "₹7000Cr", label: "Claims Settled" },
            ].map((s) => (
              <div key={s.label} className="about-stat">
                <p className="about-stat-value">{s.value}<span>+</span></p>
                <p className="about-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const CSS = `
  .about-hero {
    background: #000d3a;
    position: relative;
    overflow: visible; 
    padding-top: 150px; 
    padding-bottom: 75px; 
    font-family: 'matterregular', sans-serif;
  }

  .about-inner {
    max-width: 1350px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    min-height: 535px;
    position: relative;
    z-index: 2;
  }

  .about-trail-wrapper {
    position: absolute;
    top: 40px;
    left: 32px;
  }

  .about-content {
    position: relative;
    z-index: 10;
    flex: 0 0 52%;
    padding-bottom: 48px;
  }

  .about-title {
    font-size: 55px;
    font-weight: 800;
    color: #fff;
    line-height: 1.15;
    margin: 0 0 14px 0;
    letter-spacing: -0.5px;
  }

  .about-desc {
    font-size: 15px;
    color: rgba(255,255,255,0.80);
    line-height: 1.72;
    max-width: 540px;
    margin: 0 0 32px 0;
  }

  .about-btns {
    display: flex;
    gap: 14px;
    align-items: center;
    flex-wrap: wrap;
  }

  .about-btn-orange {
    background: #e84b2a;
    color: #fff;
    text-decoration: none;
    padding: 12px 26px;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 700;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    display: inline-flex;
    align-items: center;
  }
  
  .about-btn-ghost {
    background: transparent;
    color: #fff;
    border: 2px solid rgba(255,255,255,0.65);
    text-decoration: none;
    padding: 11px 24px;
    border-radius: 9px;
    font-size: 14px;
    font-weight: 700;
    transition: border-color 0.2s, background 0.2s;
    display: inline-flex;
    align-items: center;
  }

  .about-mobile-visual {
    display: none;
  }

  .about-lg-banner {
    position: absolute;
    right: -50px;
    bottom: -75px; /* peek under the stats bar */
    width: 55%;
    max-width: 680px;
    z-index: 1;
    pointer-events: none;
  }

  @media (max-width: 1450px) {
    .about-lg-banner {
      right: 0;
    }
  }

  .about-lg-banner img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    object-position: bottom right;
  }

  .about-stats-bar {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    width: calc(100% - 64px);
    max-width: 1300px;
    z-index: 20;
  }

  .about-stats-inner {
    width: 100%;
    padding: 28px 40px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    text-align: center;
    gap: 20px;
    background: #fff;
    border-radius: 16px;
    box-shadow:
      0 8px 32px rgba(10, 31, 110, 0.13),
      0 2px 8px rgba(0, 0, 0, 0.07);
  }

  .about-stat + .about-stat {
    border-left: 1px solid #e8ecf4;
  }

  .about-stat-value {
    font-size: 30px;
    font-weight: bold;
    color: #000;
    line-height: 1;
    margin-bottom: 6px;
  }

  .about-stat-value span {
    color: #e84b2a;
  }

  .about-stat-label {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
  }

  /* ── Tablets / small laptops (≤1200px): adjust breadcrumb to avoid overlap ── */
  @media (max-width: 1200px) {
    .about-trail-wrapper {
      top: -10px;
    }
  }

  /* ── iPad Pro & Mini / tablets (≤1024px): side-by-side layout ── */
  @media (max-width: 1024px) {
    .about-lg-banner {
      display: none;
    }
    .about-hero {
      background: #000b37;
      padding-top: 110px;
      padding-bottom: 60px;
      overflow: visible;
    }
    .about-inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      min-height: 400px;
      padding: 0 28px;
    }

    /* Breadcrumb */
    .about-trail-wrapper {
      display: none;
    }

    .about-content { 
      flex: 0 0 50%; 
      padding-bottom: 60px; 
      text-align: left; 
    }
    .about-title { font-size: 34px; }
    .about-desc { max-width: 100%; margin-bottom: 24px; margin-left: 0; }
    .about-btns { justify-content: flex-start; }

    .about-mobile-visual {
      display: block;
      flex: 0 0 45%;
      text-align: right;
      padding-bottom: 60px;
      margin-top: 0;
    }
    .about-mobile-visual img {
      display: inline-block;
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }

    .about-stats-bar { width: calc(100% - 48px); }

    .about-stats-inner {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px 16px;
    }
    .about-stat + .about-stat { border-left: none; }
    .about-stat { border-bottom: 1px solid #e8ecf4; padding-bottom: 24px; }
    .about-stat:nth-child(3), .about-stat:nth-child(4) { border-bottom: none; padding-bottom: 0; }
    .about-stat:nth-child(even) { border-left: 1px solid #e8ecf4; padding-left: 16px; }
  }

  @media (max-width: 600px) {
    .about-hero { background: #000b37; padding-top: 100px; }
    .about-inner { 
      padding: 0 20px; 
      min-height: auto; 
      flex-direction: column; 
      align-items: flex-start; 
    }
    .about-trail-wrapper { display: none; }
    .about-content {  padding-bottom: 20px; width: 100%; }
    .about-title { font-size: 26px; }
    
    .about-btns { flex-direction: column; width: 100%; }
    .about-btn-orange, .about-btn-ghost { width: 100%; justify-content: center; }

    .about-mobile-visual {
      display: block;
      width: 100%;
      text-align: center;
      margin-top: 20px;
      padding-bottom: 140px; 
    }
    .about-mobile-visual img {
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }

    .about-stats-bar { width: calc(100% - 32px); }
    
    .about-stats-inner {
      grid-template-columns: 1fr;
      padding: 24px 20px;
      gap: 20px;
      border-radius: 12px;
    }
    .about-stat { border-left: none !important; padding-left: 0 !important; border-bottom: 1px solid #e8ecf4; padding-bottom: 20px; }
    .about-stat:last-child { border-bottom: none; padding-bottom: 0; }
  }
`;
