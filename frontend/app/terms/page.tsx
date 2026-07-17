import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import TransindiaFooter from "@/components/Transindiafooter";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Transindia Insurance Broking",
  description: "Read the Terms and Conditions of Transindia Insurance Broking Pvt. Ltd. governing the use of our website and insurance brokerage services.",
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using the website, mobile application, or any services offered by Transindia Insurance Broking Pvt. Ltd. ("Transindia", "we", "our", or "us"), you agree to be bound by these Terms and Conditions ("Terms"), our Privacy Policy, and all applicable laws and regulations. Transindia is a licensed insurance broker registered with the Insurance Regulatory and Development Authority of India (IRDAI) under License No. DB-439/10.

If you do not agree with any part of these Terms, you must discontinue use of our services immediately. We reserve the right to update or modify these Terms at any time, and your continued use of our services following such changes constitutes your acceptance of the revised Terms.`,
  },
  {
    id: "services",
    title: "2. Nature of Services",
    content: `Transindia is an IRDAI-licensed insurance broker that facilitates the purchase of insurance policies on behalf of customers from various IRDAI-registered insurance companies. Our services include:

• Comparing insurance products from multiple insurers.
• Assisting in the selection and purchase of suitable insurance policies.
• Supporting policy renewals, endorsements, and modifications.
• Facilitating claim intimation and follow-up with insurers.
• Providing guidance and advisory services related to insurance planning.

**Important:** Transindia acts as an intermediary between you and the insurance company. The actual insurance policy, coverage terms, and claims decisions are the responsibility of the respective insurer, not Transindia. We do not underwrite, guarantee, or assume any insurance risk.`,
  },
  {
    id: "eligibility",
    title: "3. Eligibility",
    content: `You must be at least 18 years of age and a resident of India to use our services and purchase insurance products through our platform. By using our services, you represent and warrant that you meet these eligibility requirements. If you are acting on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.`,
  },
  {
    id: "account",
    title: "4. User Account and Responsibilities",
    content: `When you create an account with Transindia, you are responsible for:

• Providing accurate, complete, and up-to-date information during registration and throughout your use of our services.
• Maintaining the confidentiality of your account credentials and password.
• All activities that occur under your account.
• Notifying us immediately at care@transindia.com if you suspect any unauthorized access to your account.

We reserve the right to suspend or terminate accounts found to be in violation of these Terms, containing fraudulent information, or involved in unauthorized activities.`,
  },
  {
    id: "premium-payments",
    title: "5. Premium Payments",
    content: `All insurance premiums are collected on behalf of the respective insurance companies. Transindia does not retain any premium amounts and transfers them to the insurer as per applicable regulations. Key payment terms include:

• Premiums must be paid in full before policy issuance unless a specific installment plan is offered by the insurer.
• Payment receipts will be issued by the insurer and/or Transindia upon successful premium collection.
• In case of payment failure, Transindia is not responsible for any lapse in coverage or denial of claims.
• Refund of premiums, where applicable, shall be subject to the insurer's refund and cancellation policies.
• Transindia does not charge any additional fees to customers for brokerage services; our remuneration is received as commission from insurance companies as permitted by IRDAI.`,
  },
  {
    id: "disclosure",
    title: "6. Disclosure and Transparency",
    content: `In compliance with IRDAI (Insurance Brokers) Regulations, 2018, Transindia discloses the following:

• **Broker's Role:** Transindia acts as a broker and not as an agent of any specific insurer. We have arrangements with multiple insurers.
• **Commission:** Transindia receives commission from insurance companies, which may vary by product and insurer.
• **Conflict of Interest:** We are committed to recommending products that are in the best interest of our customers, not those with the highest commission.
• **Insurer Information:** The full list of insurance companies with whom we have arrangements is available on request or on our website.`,
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    content: `All content on the Transindia website and application, including but not limited to text, graphics, logos, images, software, and data compilations, is the proprietary property of Transindia Insurance Broking Pvt. Ltd. and is protected under applicable intellectual property laws.

You are granted a limited, non-exclusive, non-transferable license to access and use our website for personal, non-commercial purposes only. You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any content without our prior written consent.`,
  },
  {
    id: "prohibited",
    title: "8. Prohibited Activities",
    content: `When using our services, you agree not to:

• Provide false, misleading, or fraudulent information in insurance applications or claims.
• Use our platform to commit fraud, money laundering, or any other illegal activity.
• Attempt to gain unauthorized access to our systems, servers, or databases.
• Scrape, harvest, or copy data from our website using automated tools.
• Use our services to transmit malware, viruses, or any harmful code.
• Impersonate another person or entity.
• Engage in any activity that disrupts or interferes with our services.

Violation of these prohibitions may result in immediate termination of your account and may be reported to relevant law enforcement authorities.`,
  },
  {
    id: "disclaimer",
    title: "9. Disclaimers and Limitation of Liability",
    content: `Our services are provided on an "as-is" and "as-available" basis without warranties of any kind, either express or implied.

• **Insurance Products:** The terms, conditions, coverage, exclusions, and premium rates of insurance policies are set by the respective insurers. Transindia does not guarantee the accuracy or completeness of policy information displayed on our platform.
• **Third-Party Links:** Our website may contain links to third-party sites. We are not responsible for the content or practices of those sites.
• **Availability:** We do not guarantee that our services will be uninterrupted, error-free, or free from security vulnerabilities.
• **Limitation of Liability:** To the maximum extent permitted by law, Transindia shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use our services. Our total liability to you shall not exceed the brokerage fees (if any) received from you for the specific transaction giving rise to the claim.`,
  },
  {
    id: "grievance",
    title: "10. Grievance Redressal",
    content: `We are committed to resolving customer grievances promptly and fairly. Our grievance redressal process is as follows:

• **Level 1:** Contact our customer support at care@transindia.com or 1800 425 8084. We aim to resolve complaints within 7 working days.
• **Level 2:** If unsatisfied, escalate to our Grievance Officer at the address below. Resolution within 15 days as per IRDAI norms.
• **Level 3:** You may escalate to IRDAI's Integrated Grievance Management System (IGMS) at igms.irda.gov.in or the Insurance Ombudsman in your region.

**Grievance Officer:**
Transindia Insurance Broking Pvt. Ltd.
1st Floor, Indel House, Changampuzha Nagar,
Kalamassery, Kochi – 682 033
Email: care@transindia.com`,
  },
  {
    id: "governing-law",
    title: "11. Governing Law and Jurisdiction",
    content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Kochi, Kerala, India. Before resorting to formal legal proceedings, both parties agree to attempt resolution through good-faith negotiation.`,
  },
  {
    id: "changes",
    title: "12. Changes to These Terms",
    content: `Transindia reserves the right to amend, update, or replace these Terms at any time without prior notice. The revised Terms will be posted on this page with an updated effective date. We encourage you to review these Terms periodically. Your continued use of our services after any changes constitutes acceptance of the new Terms.`,
  },
  {
    id: "contact",
    title: "13. Contact Information",
    content: `We're here to listen. For any questions, concerns, or clarifications regarding these Terms and Conditions, please reach out to us:

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

export default function TermsPage() {
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
            <span className="bc-current">Terms & Conditions</span>
          </nav>

          {/* Header */}
          <header className="policy-header">
            <h1 className="policy-title">Terms &amp; Conditions</h1>
            <p className="policy-meta">
              <strong>Transindia Insurance Broking Pvt. Ltd.</strong><br />
              Effective Date: June 1, 2025 
            </p>
            <p className="policy-intro">
              These Terms and Conditions govern your access to and use of the services provided by Transindia Insurance Broking Pvt. Ltd., an IRDAI-licensed insurance broker (License No. DB-439/10). Please read these Terms carefully before using our services.
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
    padding: 160px 80px 80px;
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
    word-break: break-word;
  }

  /* ── Responsive ── */

  /* Large desktop (≤ 1280px) */
  @media (max-width: 1280px) {
    .policy-wrapper { padding: 140px 64px 64px; }
  }

  /* Tablet landscape (≤ 1024px) */
  @media (max-width: 1024px) {
    .policy-wrapper { padding: 130px 48px 56px; }
    .policy-title { font-size: 32px; }
  }

  /* Tablet portrait (≤ 768px) */
  @media (max-width: 768px) {
    .policy-breadcrumb { display: none; }
    .policy-wrapper { padding: 120px 24px 60px; }
    .policy-title { font-size: 28px; }
    .policy-intro { font-size: 14.5px; }
    .policy-toc { padding: 16px 18px; }
    .policy-section-title { font-size: 17px; }
  }

  /* Large mobile (≤ 600px) */
  @media (max-width: 600px) {
    .policy-title { font-size: 26px; }
    .policy-intro { font-size: 14px; }
    .policy-section-body p { font-size: 14px; }
  }

  /* Mobile (≤ 480px) */
  @media (max-width: 480px) {
    .policy-wrapper { padding: 110px 16px 48px; }
    .policy-title { font-size: 24px; }
    .policy-section-title { font-size: 16px; }
    .policy-section-body p { font-size: 13.5px; }
  }

  /* Very small mobile (≤ 360px) */
  @media (max-width: 360px) {
    .policy-wrapper { padding: 100px 12px 40px; }
    .policy-title { font-size: 22px; }
  }
`;
