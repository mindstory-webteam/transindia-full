import React from "react";

const leaders = [
  { id: 1, name: "Rajesh Sharma", role: "Founder & CEO", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Arjun Mehta", role: "Managing Director", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 3, name: "Vikram Nair", role: "Chief Operating Officer", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 4, name: "Suresh Pillai", role: "Head of Broking", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 5, name: "Aditya Kumar", role: "VP - Risk Management", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 6, name: "Pradeep Rao", role: "Head of Claims", image: "https://randomuser.me/api/portraits/men/32.jpg" },
];

export default function OurMembers() {
  return (
    <>
      <style>{CSS}</style>
      <section className="ml-section">
        <div className="ml-container">

          <div className="ml-badge-wrap">
            <span className="ml-badge">The People Behind Transindia</span>
          </div>

          <h2 className="ml-heading">
            Meet our <span className="ml-teal">Leadership</span>
          </h2>

          <div className="ml-grid">
            {leaders.map((leader) => (
              <div key={leader.id} className="ml-card">
                <div className="ml-image-wrap">
                  <img src={leader.image} alt={leader.name} className="ml-image" />
                  <div className="ml-info">
                    <p className="ml-name">{leader.name}</p>
                    <p className="ml-role">{leader.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

const CSS = `
  .ml-section {
    background-color: #F8FAFF;
    padding: 72px 20px 88px;
    font-family: 'matterregular', sans-serif;
  }

  .ml-container {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 100px;
    box-sizing: border-box;
  }

  .ml-badge-wrap {
    text-align: center;
    margin-bottom: 14px;
  }

  .ml-badge {
    display: inline-block;
    background-color:#E0F7FA;
    color:#158693;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 20px;
  }

  .ml-heading {
    margin: 0 0 0 0;
    font-family: var(--font-sora), "Sora", sans-serif;
    text-align: center;
    font-size: 38px;
    font-weight: 800;
    color: #E14629;
    letter-spacing: -0.5px;
    line-height: 1.15;
  }

  .ml-teal {
    color: #00b8c4;
  }

  .ml-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 24px;
    row-gap: 72px;
    padding-top: 72px;
  }

  .ml-card {
    border-radius: 24px;
    overflow: hidden;
  }

  /* Card: white bg, padding only at bottom to make room for the pill */
  .ml-image-wrap {
    position: relative;
    background-color: #F8FAFF;
    border-radius: 24px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    overflow: hidden;
  }

  /* Image fills full width, no bottom rounding — bleeds into the white area */
  .ml-image {
    width: 100%;
    aspect-ratio: 1 / 1.05;
    object-fit: contain;
    object-position: center top;
    display: block;
  }

  /* Pill sits centered, half overlapping image / half in white strip below */
  .ml-info {
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ffffff;
    border-radius: 40px;
    padding: 10px 28px 11px;
    text-align: center;
    white-space: nowrap;
    box-shadow: 0 2px 12px rgba(0,0,0,0.10);
    min-width: 410px;
    z-index: 2;
  }

  .ml-name {
    margin: 0 0 3px 0;
    font-size: 14.5px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.1px;
  }

  .ml-role {
    margin: 0;
    font-size: 12.5px;
    color: #6b7280;
    font-weight: 400;
    line-height: 1.4;
  }

  @media (max-width: 1100px) {
    .ml-container { padding: 0 48px; }
    .ml-grid { column-gap: 18px; row-gap: 72px; }
    .ml-info { min-width: 0; width: 100%; white-space: normal; padding: 9px 18px 10px; }
  }

  @media (max-width: 768px) {
    .ml-section { padding: 56px 20px 64px; }
    .ml-container { padding: 0 24px; }
    .ml-heading { font-size: 30px; font-family: var(--font-sora), "Sora", sans-serif;}
    .ml-grid { grid-template-columns: repeat(2, 1fr); column-gap: 14px; row-gap: 72px; }
    .ml-info { min-width: 0; width: 100%; white-space: normal; padding: 8px 14px 9px; }
  }

  @media (max-width: 480px) {
    .ml-grid { grid-template-columns: 1fr; }
    .ml-info { min-width: 0; width: 100%; white-space: normal; }
  }
`;
