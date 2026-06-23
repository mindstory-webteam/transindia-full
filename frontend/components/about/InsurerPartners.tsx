import React from "react";

const partners = [
  { id: 1,  name: "iffcotokio",         image: "./images/partners/iffcotokio.webp" },
  { id: 2,  name: "starhealthinsurance",     image: "./images/partners/starhealthinsurance.webp" },
  { id: 3,  name: "TATAAIA",          image: "./images/partners/TATAAIA.webp" },
  { id: 4,  name: "UnitedIndia",          image: "./images/partners/UnitedIndia.webp" },
  { id: 5,  name: "TheOrientalInsurance",       image: "./images/partners/TheOrientalInsurance.png" },
  { id: 6,  name: "Cholamandalam-MS-General-Insurance",         image: "./images/partners/cholams.png" },
  { id: 7,  name: "SBILife",     image: "./images/partners/SBILife.webp" },
  { id: 8,  name: "NivaLogo",          image: "./images/partners/NivaLogo.webp" },
  { id: 9,  name: "partnerFutureGenerali",         image: "./images/partners/partnerFutureGenerali.webp" },
  { id: 10, name: "Reliance General",  image: "./images/partners/partnerHDFCErgo.webp" },
  { id: 11, name: "partnerIciciLombard",         image: "./images/partners/partnerICICILombard.webp" },
  { id: 12, name: "newindia",               image: "./images/partners/newindia.png" },
  { id: 13, name: "MAGMAHDI",               image: "./images/partners/MAGMAHDI.png" },
  { id: 14, name: "digit",               image: "./images/partners/digit.png" },
  { id: 15, name: "royalsundaram",               image: "./images/partners/royalsundaram.png" },
  { id: 16, name: "Reliancegeneral",               image: "./images/partners/Reliancegeneral.png" },
  { id: 17, name: "AdityaBirla",               image: "./images/partners/AdityaBirla.png" },
  { id: 18, name: "HDFCLIFE",               image: "./images/partners/HDFCLIFE.png" },
  { id: 19, name: "sbigeneralinsurance",               image: "./images/partners/sbigeneralinsurance.png" },
];

export default function InsurerPartners() {
  return (
    <>
      <style>{CSS}</style>
      <section className="ip-section">
        <div className="ip-container">

          {/* Heading box */}
          <div className="ip-heading-box">
            <span className="ip-badge">Our Network</span>
            <h2 className="ip-heading">20+ Insurer Partners</h2>
          </div>

          {/* Logos marquee  */}
          <div className="ip-logos-box">
            <div className="ip-marquee">
              <div className="ip-marquee-row">
                {[...partners.slice(0, 10), ...partners.slice(0, 10)].map((p, index) => (
                  <div key={`r1-${index}`} className="ip-logo-cell">
                    <img src={p.image} alt={p.name} className="ip-logo" />
                  </div>
                ))}
              </div>
              <div className="ip-marquee-row" style={{ animationDirection: "reverse" }}>
                {[...partners.slice(10), ...partners.slice(10)].map((p, index) => (
                  <div key={`r2-${index}`} className="ip-logo-cell">
                    <img src={p.image} alt={p.name} className="ip-logo" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

const CSS = `
  .ip-section {
    background-color: #ffffff;
    padding: 0px 62px 90px 88px;
    font-family: 'matterregular', sans-serif;
  }

  .ip-container {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 100px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }

  /* ── Heading box with dashed teal border ── */
  .ip-heading-box {
    border-radius: 12px;
    padding: 24px 64px 28px;
    text-align: center;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    min-width: 480px;
  }

  .ip-badge {
    display: inline-block;
    background-color: #e0f9f9;
    color: #00b8c4;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 14px;
  }

  .ip-heading {
    margin: 0;
    font-size: 36px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  /* ── Logos marquee box ── */
  .ip-logos-box {
    width: 100%;
    border-radius: 16px;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
  }

  .ip-marquee {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .ip-marquee-row {
    display: flex;
    gap: 15px;
    width: max-content;
    animation: scrollMarquee 30s linear infinite;
  }

  @keyframes scrollMarquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* Each logo cell */
  .ip-logo-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 16px;
    width: 180px;
    height: 90px;
    background-color: #EBEFF9;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .ip-logo {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .ip-section { padding: 60px 0; }
    .ip-container { padding: 0 48px; }
    .ip-heading-box { min-width: 360px; padding: 20px 40px 24px; }
    .ip-logo-cell { width: 160px; height: 80px; }
  }

  @media (max-width: 768px) {
    .ip-section { padding: 48px 0; overflow: hidden; width: 100%; box-sizing: border-box; }
    .ip-container { padding: 0 16px; gap: 24px; }
    .ip-heading-box { min-width: 100%; padding: 0; }
    .ip-heading { font-size: 28px; }
    .ip-logos-box { 
      padding: 0; 
      width: calc(100% + 32px); 
      margin-left: -16px; /* Negate left padding */
      margin-right: -16px; /* Negate right padding */
      border-radius: 0; /* Remove rounded corners to fit edge-to-edge cleanly */
    }
    .ip-logo-cell { width: 140px; height: 70px; padding: 10px; }
  }

  @media (max-width: 480px) {
    .ip-heading { font-size: 24px; }
    .ip-logo-cell { width: 120px; height: 60px; }
    .ip-marquee { gap: 10px; }
    .ip-marquee-row { gap: 10px; }
  }
`;