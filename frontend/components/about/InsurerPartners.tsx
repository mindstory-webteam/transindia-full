import React from "react";

const partners = [
  { id: 1,  name: "HDFC ERGO",         image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2,  name: "ICICI Lombard",     image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3,  name: "SBI Life",          image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 4,  name: "TATA AIA",          image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 5,  name: "Star Health",       image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 6,  name: "HDFC Life",         image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 7,  name: "Bajaj Allianz",     image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 8,  name: "Max Life",          image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 9,  name: "Niva Bupa",         image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 10, name: "Reliance General",  image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 11, name: "New India",         image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 12, name: "LIC",               image: "https://images.unsplash.com/photo-1780684594433-6e41dfafdf18?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
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

          {/* Logos grid  */}
          <div className="ip-logos-box">
            <div className="ip-grid">
              {partners.map((p) => (
                <div key={p.id} className="ip-logo-cell">
                  <img src={p.image} alt={p.name} className="ip-logo" />
                </div>
              ))}
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
    padding: 30px 62px 50px 88px;
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

  /* ── Logos grid box with dashed teal border ── */
  .ip-logos-box {
    width: 100%;
    border-radius: 16px;
    padding: 10px;
    box-sizing: border-box;
  }

  .ip-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }

  /* Each logo cell */
  .ip-logo-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 16px;
    min-height: 90px;
    background-color: #EBEFF9;
    border-radius: 8px;
  }

  /* Remove right border on last column */
  .ip-logo-cell:nth-child(6n) {
    border-right: none;
  }

  /* Remove bottom border on last row */
  .ip-logo-cell:nth-child(n+7) {
    border-bottom: none;
  }

  .ip-logo {
    max-width: 130px;
    max-height: 52px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .ip-container { padding: 0 48px; }
    .ip-heading-box { min-width: 360px; padding: 20px 40px 24px; }
    .ip-grid { grid-template-columns: repeat(4, 1fr); }
    .ip-logo-cell:nth-child(4n) { border-right: none; }
    .ip-logo-cell:nth-child(n+9) { border-bottom: none; }
  }

  @media (max-width: 768px) {
    .ip-section { padding: 56px 20px 64px; }
    .ip-container { padding: 0 24px; gap: 28px; }
    .ip-heading-box { min-width: unset; width: 100%; padding: 20px 24px 24px; }
    .ip-heading { font-size: 28px; }
    .ip-logos-box { padding: 16px; }
    .ip-grid { grid-template-columns: repeat(3, 1fr); }
    .ip-logo-cell:nth-child(3n) { border-right: none; }
    .ip-logo-cell:nth-child(n+10) { border-bottom: none; }
  }

  @media (max-width: 480px) {
    .ip-grid { grid-template-columns: repeat(2, 1fr); }
    .ip-logo-cell:nth-child(2n) { border-right: none; }
    .ip-logo-cell:nth-child(n+11) { border-bottom: none; }
  }
`;