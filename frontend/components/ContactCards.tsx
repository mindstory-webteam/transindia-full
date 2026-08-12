"use client";

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

export default function ContactCards() {
  return (
    <section className="contact-cards-section">
      <style>{CSS}</style>
      <div className="contact-cards-inner">
        {contactCards.map((card) => (
          <div key={card.label} className="contact-card">
            <div className="contact-card-icon">
              <img src={card.icon} alt={card.label} width={44} height={44} />
            </div>
            <p className="contact-card-label">{card.label}</p>
            <p className="contact-card-sub">{card.sub}</p>

            {card.cta && (
              <a
                href={card.ctaHref}
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
    </section>
  );
}

const CSS = `
  /* ── Standalone section: normal document flow, own vertical spacing ── */
  .contact-cards-section {
    background: #fff;
    padding: 56px 32px;
  }

  .contact-cards-inner {
    max-width: 1300px;
    margin: 0 auto;
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

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .contact-cards-section { padding: 48px 24px; }
    .contact-cards-inner {
      grid-template-columns: repeat(2, 1fr);
    }
    .contact-card:nth-child(2) { border-right: none; }
    .contact-card:nth-child(1),
    .contact-card:nth-child(2) {
      border-bottom: 1px solid #e8ecf4;
    }
  }

  @media (max-width: 600px) {
    .contact-cards-section { padding: 32px 16px; }
    .contact-cards-inner {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .contact-card {
      width: 100%;
      padding: 28px 24px;
      border-radius: 20px;
      box-shadow: 0 4px 24px rgba(10, 31, 110, 0.10), 0 1px 6px rgba(0,0,0,0.06);
      border-bottom: none;
    }
    .contact-card:last-child { border-bottom: none; }
    .contact-card-icon { margin-bottom: 6px; }
    .contact-card-label { font-size: 16px; }
    .contact-card-sub   { font-size: 13px; }
  }
`;