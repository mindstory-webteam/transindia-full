import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import TransindiaFooter from "@/components/Transindiafooter";
import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | Transindia Insurance Broking",
  description: "Read the Cookie Policy of Transindia Insurance Broking Pvt. Ltd. to understand how we use cookies and tracking technologies.",
};

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `Transindia Insurance Broking and Risk Management Pvt. Ltd. ("Transindia", "we", "our", or "us") respects your privacy and is committed to being transparent about the technologies we use. This Cookie Policy explains how and why cookies, web beacons, pixels, and other tracking technologies (collectively "Cookies") may be stored on and accessed from your device when you use or visit our website (www.transindiainsurance.com) and any other media form related or connected thereto.

This Cookie Policy should be read alongside our Privacy Policy and Terms & Conditions. By continuing to browse or use our website, you agree to our use of Cookies as described in this policy.`,
  },
  {
    id: "what-are-cookies",
    title: "2. What are Cookies?",
    content: `Cookies are small text files that are placed on your computer, smartphone, or other electronic devices when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.

Cookies allow a website to recognize your device and remember if you have been to the website before. We use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your device for a set period or until you delete them) to provide you with a more personal and interactive experience on our website.`,
  },
  {
    id: "how-we-use-cookies",
    title: "3. How We Use Cookies",
    content: `We use Cookies for a variety of reasons, including:

• **Essential Operations:** To enable core functionality such as page navigation, secure areas access, and ensuring the website functions properly.
• **Performance and Analytics:** To collect information about how visitors use our website, for instance, which pages visitors go to most often. We use this information to improve how our website works.
• **Functionality:** To remember choices you make (such as your user name, language or the region you are in) and provide enhanced, more personal features.
• **Targeting or Advertising:** To deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaigns.`,
  },
  {
    id: "types-of-cookies",
    title: "4. Types of Cookies We Use",
    content: `**Strictly Necessary Cookies**
These cookies are essential for you to browse the website and use its features. Without these cookies, services like secure login or form submissions cannot be provided.

**Analytical/Performance Cookies**
These cookies allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily. (e.g., Google Analytics)

**Functionality Cookies**
These are used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name and remember your preferences.

**Targeting Cookies**
These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests. We may also share this information with third parties for this purpose.`,
  },
  {
    id: "third-party-cookies",
    title: "5. Third-Party Cookies",
    content: `In some special cases, we also use cookies provided by trusted third parties. For example, our site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.

We also use social media buttons and/or plugins on this site that allow you to connect with your social network in various ways. For these to work, social media sites will set cookies through our site which may be used to enhance your profile on their site or contribute to the data they hold for various purposes outlined in their respective privacy policies.`,
  },
  {
    id: "managing-cookies",
    title: "6. Managing Cookies",
    content: `You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner.

You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.

For more information on how to manage and delete cookies, visit aboutcookies.org.`,
  },
  {
    id: "changes",
    title: "7. Changes to This Cookie Policy",
    content: `We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.

The date at the top of this Cookie Policy indicates when it was last updated.`,
  },
  {
    id: "contact",
    title: "8. Contact Us",
    content: `We're here to listen. If you have any questions, concerns, or complaints regarding this Cookie Policy, please contact us:

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

export default function CookiePolicyPage() {
  return (
    <>
      <style>{CSS}</style>
      <div className="policy-page">
         <Preloader/>
        <Navbar alwaysSolid={true} />

        <div className="policy-wrapper">
          {/* Breadcrumb — hidden on tablet/mobile */}
          <nav className="policy-breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="bc-link">Home</Link>
            <span className="bc-sep">›</span>
            <span className="bc-current">Cookie Policy</span>
          </nav>

          {/* Header */}
          <header className="policy-header">
            <h1 className="policy-title">Cookie Policy</h1>
            <p className="policy-meta">
              <strong>Transindia Insurance Broking and Risk Management Pvt. Ltd.</strong><br />
              Effective Date: June 1, 2025
            </p>
            <p className="policy-intro">
              This Cookie Policy explains how Transindia Insurance Broking and Risk Management Pvt. Ltd. uses cookies and similar technologies to recognize you when you visit our website.
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
