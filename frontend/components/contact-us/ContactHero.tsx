"use client";

import Breadcrum from "@/components/Breadcrum";

const contactCards = [
  {
    icon: "/images/contact-us/CONTACT/Contact Icons - Call.png",
    label: "Call us",
    sub: "Mon–Sat, 9:30 – 5:30",
    highlight: "1800 425 8084",
    highlightHref: "tel:18001234567",
    badge: "Toll free",
    badgeColor: "#2AC764",
  },
  {
    icon: "/images/contact-us/CONTACT/Contact Icons - Msg.png",
    label: "Live chat",
    sub: "Average wait: 2 minutes",
    cta: "Start Chat",
    ctaHref: "https://wa.me/917510400320",
    badge: "Available 24/7",
    badgeColor: "#2AC764",
  },
  {
    icon: "/images/contact-us/CONTACT/Contact Icons - mail.png",
    label: "Email Us",
    sub: "Reply within 4 hours",
    highlight: "care@transindia.com",
    highlightHref: "mailto:care@transindia.com",
    badge: "Mon–sat",
    badgeColor: "#6b7280",
  },
  {
    icon: "/images/contact-us/CONTACT/Contact Icons - Location.png",
    label: "Visit Us",
    sub: "Walk-in welcome",
    highlight: "Find Nearest Branch",
    highlightHref: "https://maps.google.com",
    badge: "Kochi",
    badgeColor: "#6b7280",
  },
];

export default function ContactHero() {
  return (
    <>
      <style>{CSS}</style>
      <div className="contact-hero-wrapper">
        <section className="contact-hero">
          <div className="contact-inner">
            <div className="contact-trail-wrapper">
              <Breadcrum crumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
            </div>

            <div className="contact-content">
              <h1 className="contact-title">
                We&apos;re here,
                <br />
                <span style={{ color: "#F15A40" }}>whenever you</span>{" "}
                <span style={{ color: "#20BEC6" }}>need us</span>
              </h1>
              <p className="contact-desc">
                Have a question, want expert advice, or need help with a claim? Our team
                is available 7 days a week — call, chat, or visit us.
              </p>
            </div>

            {/* ── Large-screen banner image ── */}
            <div className="contact-lg-banner">
              <img
                src="/images/contact-us/CONTACT/Contacts page - Hero banner.png"
                alt="Contact us representative"
                className="contact-lg-banner-img"
              />
            </div>

            {/* ── Small-screen banner image ── */}
            <div className="contact-sm-banner">
              <img
                src="/images/contact-us/CONTACT/Contacts page - Hero banner.png"
                alt="Contact us banner"
                className="contact-sm-banner-img"
              />
            </div>
          </div>
        </section>

        {/* ── Contact Cards bar (outside section so hero bg doesn't bleed onto cards) ── */}
        <div className="contact-cards-bar">
          <div className="contact-cards-inner">
            {contactCards.map((card) => (
              <div key={card.label} className="contact-card">
                <div className="contact-card-icon">
                  <img src={card.icon} alt={card.label} width={44} height={44} />
                </div>
                <p className="contact-card-label">{card.label}</p>
                <p className="contact-card-sub">{card.sub}</p>

                {card.cta && (
                  
                  <a  href={card.ctaHref}
                    className="contact-card-cta"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {card.cta}
                  </a>
                )}
                {card.highlight && (
                  <a href={card.highlightHref} className="contact-card-highlight">
                    {card.highlight}
                  </a>
                )}

                <p className="contact-card-badge" style={{ color: card.badgeColor }}>
                  {card.badge}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
  /* ── Wrapper: positioning context for desktop cards bar ── */
  .contact-hero-wrapper {
    position: relative;
    overflow: visible;
  }

  .contact-hero {
    background: #00124C;
    position: relative;
    overflow: visible;
    padding-top: 150px;
    padding-bottom: 75px;
    font-family: 'matterregular', sans-serif;
  }

  .contact-inner {
    max-width: 1350px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    min-height: 535px;
    position: relative;
    z-index: 2;
  }

  .contact-trail-wrapper {
    position: absolute;
    top: 10px;
    left: 32px;
  }

  .contact-content {
    flex: 0 0 52%;
    padding-bottom: 150px;
  }

  .contact-title {
    font-size: 55px;
    font-weight: 800;
    font-family: var(--font-sora), "Sora", sans-serif;
    color: #fff;
    line-height: 1.15;
    margin: 0 0 14px 0;
    letter-spacing: -0.5px;
  }

  .contact-desc {
    font-size: 15px;
    color: rgba(255,255,255,0.80);
    line-height: 1.72;
    max-width: 480px;
    margin: 0;
  }

  /* ── Cards bar: anchored to wrapper bottom = section bottom on desktop ── */
  .contact-cards-bar {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    width: calc(100% - 64px);
    max-width: 1300px;
    z-index: 20;
  }

  .contact-cards-inner {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .contact-card {
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    background: #fff;
    border-radius: 26px;
    box-shadow: 0 8px 32px rgba(10, 31, 110, 0.10), 0 2px 8px rgba(0,0,0,0.06);
  }

  .contact-card-icon {
    margin-bottom: 6px;
  }

  .contact-card-label {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .contact-card-sub {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
  }

  .contact-card-cta {
    display: inline-block;
    margin-top: 4px;
    background: #FF6B35;
    color: #fff;
    text-decoration: none;
    padding: 7px 22px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 10px rgba(255, 107, 53, 0.55);
  }

  .contact-card-highlight {
    display: inline-block;
    margin-top: 4px;
    font-size: 14px;
    font-weight: 700;
    color: #0A3D91;
    text-decoration: none;
    transition: color 0.2s;
  }

  .contact-card-badge {
    font-size: 12px;
    font-weight: 500;
    margin: 0;
  }

  /* ── Large-screen banner ── */
  .contact-lg-banner {
    position: absolute;
    right: 12%;
    bottom: -20px;
    width: 700px;
    pointer-events: none;
    z-index: 1;
  }
  .contact-lg-banner-img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* ── Responsive ── */
  @media (min-width: 1025px) {
    .contact-hero {
      padding-bottom: 0px;
    }
    .contact-inner {
      min-height: 460px;
    }
  }

  @media (max-width: 1024px) {
    .contact-lg-banner {
      display: none;
    }
    .contact-trail-wrapper {
      display: none;
    }
    .contact-hero {
      background: #0b1240;
    }
    .contact-cards-inner {
      grid-template-columns: repeat(2, 1fr);
    }
    .contact-card:nth-child(2) { border-right: none; }
    .contact-card:nth-child(1),
    .contact-card:nth-child(2) {
      border-bottom: 1px solid #e8ecf4;
    }
  }

  @media (max-width: 900px) {
    .contact-content { 
      flex: 1; 
      padding-bottom: 180px; 
    }
    .contact-inner {
      min-height: auto;
    }
    .contact-title { font-size: 32px; }
  }

  /* ── Small-screen banner: hidden by default ── */
  .contact-sm-banner {
    display: none;
  }

  /* ── iPad Mini & Pro (601px–1024px): show lady image on the right ── */
  @media (min-width: 601px) and (max-width: 1024px) {
    .contact-hero {
      overflow: hidden;
      background: #0b1240;
    }
    .contact-sm-banner {
      display: block;
      position: absolute;
      right: 30px;
      bottom: 100px;
      width: 42%;
      max-width: 420px;
      pointer-events: none;
      z-index: 1;
    }
    .contact-sm-banner-img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: contain;
      object-position: bottom right;
    }
  }

  @media (max-width: 600px) {
    .contact-hero {
      padding-top: 100px;
      padding-bottom: 24px;
      overflow: visible;
    }
    .contact-inner {
      padding: 0 20px;
      min-height: auto;
      flex-direction: column;
      align-items: flex-start;
    }
    .contact-trail-wrapper { display: none; }
    .contact-content { padding-bottom: 16px; width: 100%; }
    .contact-title { font-size: 28px; }

    /* Show the small-screen banner between content and cards */
    .contact-sm-banner {
      display: block;
      width: calc(100% + 40px);
      margin-left: -20px;
      margin-right: -20px;
      margin-top: 8px;
    }
    .contact-sm-banner-img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }

    /* Mobile: pull cards bar up so first card half-overlaps the banner */
    .contact-cards-bar {
      position: relative;
      bottom: auto;
      left: auto;
      transform: none;
      width: 100%;
      max-width: 100%;
      margin-top: -110px;
      padding: 0 16px;
      box-sizing: border-box;
      z-index: 10;
    }
    .contact-cards-inner {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: auto;
      gap: 12px;
      background: transparent;
      box-shadow: none;
      border-radius: 0;
      overflow: visible;
    }
    .contact-card {
      position: relative;
      z-index: 10;
      width: 100%;
      height: auto;
      padding: 28px 24px;
      border-radius: 20px;
      box-shadow: 0 4px 24px rgba(10, 31, 110, 0.10), 0 1px 6px rgba(0,0,0,0.06);
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 6px;
      border-bottom: none;
      background: #fff;
    }
    .contact-card:last-child { border-bottom: none; }
    .contact-card-icon { margin-bottom: 6px; }
    .contact-card-label { font-size: 16px; }
    .contact-card-sub   { font-size: 13px; }
  }
`;