import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Transindia Insurance Broking",
  description: "Read the Privacy Policy of Transindia Insurance Broking Pvt. Ltd. to understand how we collect, use, and protect your personal information.",
};

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `Transindia Insurance Broking Pvt. Ltd. ("Transindia", "we", "our", or "us"), licensed by the Insurance Regulatory and Development Authority of India (IRDAI), is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, use our mobile application, or engage with our insurance brokerage services. By accessing or using our services, you consent to the practices described in this policy.`,
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    content: `We collect information you provide directly to us, including:

• **Personal Identification Information:** Full name, date of birth, gender, and government-issued ID numbers (PAN, Aadhaar, Passport).
• **Contact Information:** Email address, phone number, and residential/business address.
• **Financial Information:** Bank account details, credit/debit card information, and premium payment history — collected solely for processing insurance transactions.
• **Insurance Details:** Existing policy numbers, nominee information, health records (where required for health or life insurance), and claim history.
• **Technical Information:** IP address, browser type, device identifiers, cookies, and usage data collected automatically when you use our website or app.
• **Communications:** Records of your interactions with our customer support team, including calls, emails, and chat messages.`,
  },
  {
    id: "use-of-information",
    title: "3. How We Use Your Information",
    content: `We use your personal information for the following purposes:

• **Service Delivery:** To process insurance applications, renewals, endorsements, and claims on your behalf.
• **KYC Compliance:** To verify your identity as required under IRDAI regulations and anti-money laundering (AML) laws.
• **Communication:** To send policy documents, renewal reminders, claim updates, and important regulatory notices.
• **Customer Support:** To respond to your queries, grievances, and service requests.
• **Personalization:** To tailor product recommendations and offers based on your insurance needs and browsing behaviour.
• **Legal Compliance:** To fulfill our obligations under applicable laws, including the Insurance Act, 1938, and IRDAI guidelines.
• **Analytics & Improvement:** To analyze usage patterns and improve our website, app, and overall service quality.`,
  },
  {
    id: "data-sharing",
    title: "4. Data Sharing and Disclosure",
    content: `We do not sell, rent, or trade your personal information. We may share your data only in the following circumstances:

• **Insurance Companies:** We share your details with insurers to facilitate policy issuance, endorsements, and claims processing.
• **IRDAI and Regulators:** We may disclose information to IRDAI, law enforcement agencies, or courts as required by law.
• **Third-Party Service Providers:** Trusted vendors who assist us in payment processing, IT infrastructure, marketing, and analytics — bound by confidentiality agreements.
• **Business Transfers:** In the event of a merger, acquisition, or sale of our business assets, your information may be transferred as part of that transaction.
• **With Your Consent:** In any other case where you have explicitly authorized us to share your data.`,
  },
  {
    id: "data-security",
    title: "5. Data Security",
    content: `We implement industry-standard technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include SSL/TLS encryption, access controls, firewalls, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security. In the event of a data breach, we will notify affected users and regulators as required by applicable law.`,
  },
  {
    id: "cookies",
    title: "6. Cookies and Tracking Technologies",
    content: `Our website uses cookies and similar tracking technologies to enhance your browsing experience. We use:

• **Essential Cookies:** Required for core website functionality such as session management and security.
• **Analytics Cookies:** To understand how visitors interact with our site (e.g., Google Analytics).
• **Marketing Cookies:** To deliver relevant advertisements on third-party platforms.

You can control cookie settings through your browser preferences. Please note that disabling certain cookies may affect the functionality of our website.`,
  },
  {
    id: "data-retention",
    title: "7. Data Retention",
    content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy and to comply with legal, regulatory, and accounting requirements. Insurance-related records are typically retained for a minimum of 10 years as mandated by IRDAI regulations. Upon the expiry of the retention period, your data will be securely deleted or anonymized.`,
  },
  {
    id: "your-rights",
    title: "8. Your Rights",
    content: `Subject to applicable law, you have the following rights regarding your personal data:

• **Right to Access:** Request a copy of the personal information we hold about you.
• **Right to Correction:** Request correction of any inaccurate or incomplete data.
• **Right to Deletion:** Request deletion of your data, subject to legal and regulatory retention requirements.
• **Right to Portability:** Request transfer of your data to another service provider where technically feasible.
• **Right to Object:** Object to the processing of your data for direct marketing purposes.

To exercise any of these rights, please contact us at care@transindia.com.`,
  },
  {
    id: "third-party-links",
    title: "9. Third-Party Links",
    content: `Our website may contain links to third-party websites, including insurer portals and payment gateways. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies before providing any personal information.`,
  },
  {
    id: "children",
    title: "10. Children's Privacy",
    content: `Our services are not directed at children under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a child has provided us with personal data, we will take steps to delete such information promptly.`,
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content: `We reserve the right to update this Privacy Policy at any time. We will notify you of significant changes by posting a notice on our website or sending an email to your registered address. Your continued use of our services following such changes constitutes acceptance of the revised policy. The effective date at the top of this page will reflect the latest revision.`,
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content: `We're here to listen. If you have any questions, concerns, or complaints regarding this Privacy Policy or our data practices, please contact us:

**Transindia Insurance Broking and Risk Management Pvt. Ltd.**
1st Floor, Indel House, Changampuzha Nagar,
S. Kalamassery, Cochin – 682 033, Kerala, India

Email: support@transindia.com
Phone: 1800 425 8084 (Toll-free)
Hours: Monday to Friday, 9:30 AM – 5:30 PM IST
Website: www.transindiainsurance.com

IRDAI Licence No.: 345
Validity Period: 11.01.2025 to 10.01.2028
Broker Type: Direct Broker – Life & General

**Principal Officer:**
Email: po_transindia@transindiainsurance.com
Phone: +91-7510401001`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <style>{CSS}</style>
      <div className="policy-page">
        <Navbar alwaysSolid={true} />

        <div className="policy-wrapper">
          {/* Breadcrumb — hidden on tablet/mobile */}
          <nav className="policy-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="bc-link">Home</Link>
            <span className="bc-sep">›</span>
            <span className="bc-current">Privacy Policy</span>
          </nav>

          {/* Header */}
          <header className="policy-header">
            <h1 className="policy-title">Privacy Policy</h1>
            <p className="policy-meta">
              <strong>Transindia Insurance Broking Pvt. Ltd.</strong><br />
              Effective Date: June 1, 2025 
            </p>
            <p className="policy-intro">
              This Privacy Policy describes how Transindia Insurance Broking Pvt. Ltd., an IRDAI-licensed insurance broker (License No. DB-439/10), collects, uses, and protects your personal information in connection with our insurance brokerage services.
            </p>
          </header>

          {/* Table of Contents */}
          <nav className="policy-toc" aria-label="Table of Contents">
            <h2 className="policy-toc-title">Table of Contents</h2>
            <ol className="policy-toc-list">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="policy-toc-link">{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections */}
          <main className="policy-content">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="policy-section">
                <h2 className="policy-section-title">{s.title}</h2>
                <div className="policy-section-body">
                  {s.content.split("\n").map((line, i) =>
                    line.trim() === "" ? (
                      <br key={i} />
                    ) : (
                      <p key={i} dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }} />
                    )
                  )}
                </div>
              </section>
            ))}
          </main>
        </div>

        <TransindiaFooter />
      </div>
    </>
  );
}

const CSS = `
  .policy-page {
    min-height: 100vh;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1a1a1a;
  }

  .policy-wrapper {
    max-width: 860px;
    width: 100%;
    margin: 0 auto;
    padding: 140px 40px 80px;
    flex: 1;
  }

  /* ── Breadcrumb ── */
  .policy-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 32px;
  }

  .bc-link {
    font-size: 13px;
    color: #666;
    text-decoration: none;
    transition: color 0.15s;
  }
  .bc-link:hover { color: #111; }
  .bc-sep { font-size: 13px; color: #aaa; }
  .bc-current { font-size: 13px; color: #111; font-weight: 600; }

  /* ── Header ── */
  .policy-header {
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 28px;
    margin-bottom: 36px;
  }

  .policy-title {
    font-size: 36px;
    font-weight: 800;
    color: #111;
    margin: 0 0 12px 0;
    letter-spacing: -0.5px;
  }

  .policy-meta {
    font-size: 13.5px;
    color: #6b7280;
    margin: 0 0 16px 0;
    line-height: 1.6;
  }

  .policy-intro {
    font-size: 15px;
    color: #374151;
    line-height: 1.75;
    margin: 0;
    background: #f0fafa;
    padding: 14px 18px;
    border-radius: 0 8px 8px 0;
  }

  /* ── Table of Contents ── */
  .policy-toc {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 20px 24px;
    margin-bottom: 40px;
  }

  .policy-toc-title {
    font-size: 14px;
    font-weight: 700;
    color: #111;
    margin: 0 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .policy-toc-list {
    margin: 0;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .policy-toc-link {
    font-size: 13.5px;
    color: #00b8c4;
    text-decoration: none;
    transition: color 0.15s;
  }
  .policy-toc-link:hover { color: #007a83; text-decoration: underline; }

  /* ── Sections ── */
  .policy-content {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .policy-section {
    scroll-margin-top: 90px;
  }

  .policy-section-title {
    font-size: 18px;
    font-weight: 700;
    color: #111;
    margin: 0 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #f3f4f6;
  }

  .policy-section-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .policy-section-body p {
    font-size: 14.5px;
    color: #4b5563;
    line-height: 1.8;
    margin: 0;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .policy-breadcrumb { display: none; }
    .policy-wrapper { padding: 110px 24px 60px; }
    .policy-title { font-size: 28px; }
    .policy-intro { font-size: 14px; }
    .policy-toc { padding: 16px 18px; }
  }

  @media (max-width: 480px) {
    .policy-wrapper { padding: 100px 16px 48px; }
    .policy-title { font-size: 24px; }
    .policy-section-title { font-size: 16px; }
    .policy-section-body p { font-size: 14px; }
  }

  @media (max-width: 360px) {
    .policy-wrapper { padding: 90px 12px 40px; }
    .policy-title { font-size: 22px; }
  }
`;
