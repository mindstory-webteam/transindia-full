import React from "react";

const features = [
  {
    id: 1,
    icon: "/images/about/whychooseus/medical insurance.svg",
    bgColor: "#FFF1F0",
    iconAlign: "bottom",
    title: "Policy Clarity",
    description:
      "Some insurance policies can be complicated. Our brokers explain every detail, advise on the right level of cover, and flag special situations you need to know about — so you're always properly protected.",
  },
  {
    id: 2,
    icon: "/images/about/whychooseus/Handshake for sealing a financial deal.svg",
    bgColor: "#EEF9FF",
    iconAlign: "bottom",
    title: "Better Deals",
    description:
      "Brokers have a thorough understanding of the insurance market and can negotiate premiums on your behalf. We often find you significantly better deals than going direct to an insurer.",
  },
  {
    id: 3,
    icon: "/images/about/whychooseus/Business men shaking hands for deal.svg",
    bgColor: "#FFF6DE",
    iconAlign: "bottom",
    title: "Custom Programs",
    description:
      "We prepare customized insurance and risk management programs for individuals and businesses designing policies, negotiating terms with insurers, and placing cover tailored to your needs.",
  },
  {
    id: 4,
    icon: "/images/about/whychooseus/Cloud wallet security with shield protecting online money savings.svg",
    bgColor: "#E6F9E6",
    title: "Zero Extra Cost",
    description:
      "Using a broker doesn't cost you more than going direct. We are paid brokerage by insurers — so expert advice, better coverage, and claims support come at no additional cost to you.",
  },
  {
    id: 5,
    icon: "/images/about/whychooseus/Completed list or work tasks.svg",
    bgColor: "#FFE4E5",
    title: "Claims Assistance",
    description:
      "When you need to make a claim, your broker assists you through the entire process and liaises directly with the insurer on your behalf — fighting for every rupee you're entitled to.",
  },
  {
    id: 6,
    icon: "/images/about/whychooseus/risk calculation panel.svg",
    bgColor: "#DEF6FD",
    title: "Risk Management",
    description:
      "Beyond buying a policy, we assess and manage your actual risk exposure — both personal and business — helping you prevent gaps in coverage before they become costly surprises.",
  },
];

export default function WhyChooseUs() {
  return (
    <>
      <style>{CSS}</style>
      <section className="wct-section">
        <div className="wct-container">

          {/* Badge */}
          <div style={{ textAlign: "center" }}>
            <p className="wct-badge">Why Choose Transindia?</p>
          </div>

          {/* Heading */}
          <h2 className="wct-heading">
            The broker that <span className="wct-teal">works for you</span>
          </h2>

          {/* Sub-text */}
          <p className="wct-sub">
            Using a broker doesn't cost more than going direct — we are paid
            brokerage by insurers for selling their products. You get expert
            advice at zero extra cost.
          </p>

          {/* Grid */}
          <div className="wct-grid">
            {features.map((f) => (
              <div key={f.id} className="wct-cell">
                <div
                  className="wct-icon-wrap"
                  style={{
                    backgroundColor: f.bgColor,
                    alignItems: f.iconAlign === "bottom" ? "flex-end" : "center",
                    paddingBottom: f.iconAlign === "bottom" ? "0" : undefined,
                  }}
                >
                  <img src={f.icon} alt={f.title} className="wct-icon" />
                </div>
                <h3 className="wct-title">{f.title}</h3>
                <p className="wct-desc">{f.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

const CSS = `
  .wct-section {
    background-color: #ffffff;
    padding: 72px 0 88px;
    font-family: 'matterregular', sans-serif;
  }

  .wct-container {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 60px;
    box-sizing: border-box;
  }

  /* ── Badge ── */
  .wct-badge {
    display: inline-block;
    margin: 0 0 20px 0;
    background-color: #fde8e4;
    color: #E14629;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 20px;
  }

  /* ── Heading ── */
  .wct-heading {
    margin: 0 0 16px 0;
    text-align: center;
    font-size: 38px;
    font-weight: 800;
    font-family: var(--font-sora), "Sora", sans-serif;
    color: #111827;
    letter-spacing: -0.5px;
    line-height: 1.15;
  }

  .wct-teal {
    color: #E14629;
  }

  /* ── Sub text ── */
  .wct-sub {
    margin: 0 auto 60px auto;
    max-width: 500px;
    text-align: center;
    font-size: 18px;
    line-height: 1.7;
    color: #535862;
  }

  /* ── Grid: 3 cols, 2 rows ── */
  .wct-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 10px;
  }

  /* ── Each cell ── */
  .wct-cell {
    padding: 36px 40px;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
  }

  /* ── Icon ── */
  /* ── Icon wrapper ── */
  .wct-icon-wrap {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .wct-icon {
    width: 44px;
    height: 44px;
    object-fit: contain;
    display: block;
  }

  /* ── Card title ── */
  .wct-title {
    margin: 0 0 10px 0;
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.1px;
  }

  /* ── Card description ── */
  .wct-desc {
    margin: 0;
    font-size: 13.5px;
    line-height: 1.75;
    color: #6b7280;
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .wct-container {
      padding: 0 48px;
    }
    .wct-cell {
      padding: 28px 32px;
    }
  }

  @media (max-width: 768px) {
    .wct-section {
      padding: 56px 0 64px;
    }
    .wct-container {
      padding: 0 24px;
    }
    .wct-heading {
      font-size: 28px;
    }
    .wct-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .wct-cell {
      padding: 24px 24px;
    }
  }

  @media (max-width: 480px) {
    .wct-grid {
      grid-template-columns: 1fr;
    }
    .wct-cell {
      padding: 24px;
    }
  }
`;
