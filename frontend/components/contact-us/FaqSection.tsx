"use client";

import { useState } from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "What types of insurance plans do you offer?",
    answer:
      "We offer a wide range of insurance plans including Life Insurance, Health Insurance, Motor Insurance, Travel Insurance, Home Insurance, and more through our 20+ insurer partners.",
  },
  {
    id: 2,
    question: "How can I purchase a policy online?",
    answer:
      "You can purchase a policy online by visiting our website, selecting the type of insurance, comparing plans, and completing the payment process. Our advisors are also available to guide you.",
  },
  {
    id: 3,
    question: "How do I renew my policy?",
    answer:
      "You can renew your policy online through our 'Renew Existing Policy' section. Enter your policy number, review the details, and proceed with payment to renew instantly.",
  },
  {
    id: 4,
    question: "How do I download my policy document?",
    answer:
      "Log in to your account, navigate to 'My Policies', and click on the download icon next to your policy. The document will be available as a PDF.",
  },
  {
    id: 5,
    question: "What is not covered under the policy?",
    answer:
      "Exclusions vary by plan and insurer. Generally, pre-existing conditions (for health), wear and tear (for motor), and intentional damage are not covered. Please read your policy document for specific exclusions.",
  },
  {
    id: 6,
    question: "What documents are required for a claim?",
    answer:
      "Required documents typically include your policy document, claim form, identity proof, and incident-related documents (hospital bills, FIR copy, repair estimate, etc.) depending on the type of claim.",
  },
  {
    id: 7,
    question: "Can I track the status of my claim?",
    answer:
      "Yes, you can track your claim status by logging into your account and visiting the 'Claims' section. You can also contact our support team for real-time updates.",
  },
  {
    id: 8,
    question: "What happens if I miss a premium payment?",
    answer:
      "Most policies have a grace period of 15–30 days after the due date. If you miss the payment beyond the grace period, the policy may lapse. Contact us to explore revival options.",
  },
  {
    id: 9,
    question: "Is there a free-look cancellation period?",
    answer:
      "Yes, all life insurance policies come with a free-look period of 15 days (30 days for policies sold online or through distance mode) from the date of receipt of the policy document.",
  },
  {
    id: 10,
    question: "Can I transfer my policy to another person?",
    answer:
      "Life insurance policies generally cannot be transferred. However, motor insurance policies can be transferred to a new owner during vehicle sale. Contact our support for specific cases.",
  },
  {
    id: 11,
    question: "Are cashless claims available?",
    answer:
      "Yes, cashless claims are available at network hospitals (for health insurance) and network garages (for motor insurance). Check our network list on the website for empanelled partners.",
  },
  {
    id: 12,
    question: "How do I choose the right insurance policy?",
    answer:
      "Consider your needs, budget, coverage requirements, and family situation. Use our comparison tool or speak with one of our 500+ advisors for personalised guidance at no cost.",
  },
  {
    id: 13,
    question: "What documents are required to buy a policy?",
    answer:
      "Typically you need identity proof (Aadhaar/PAN), address proof, age proof, recent photographs, and income proof (for high-value life insurance). Requirements may vary by insurer and plan.",
  },
  {
    id: 14,
    question: "Can I update my nominee details after purchase?",
    answer:
      "Yes, you can update nominee details at any time by logging into your account or contacting your insurer directly. We recommend keeping nominee details up to date.",
  },
  {
    id: 15,
    question: "What is covered under my insurance policy?",
    answer:
      "Coverage depends on your specific plan. Log in to your account and view your policy schedule for a detailed list of inclusions. You can also contact our support team for a summary.",
  },
  {
    id: 16,
    question: "How do I file an insurance claim?",
    answer:
      "Click 'Make a Claim' on our website, select your policy, fill in the claim details, upload the required documents, and submit. Our team will process it and keep you updated.",
  },
  {
    id: 17,
    question: "How long does claim settlement take?",
    answer:
      "Claim settlement timelines vary by type. Health cashless claims are typically settled within hours; reimbursement claims within 15–30 days; motor claims within 7–15 working days.",
  },
  {
    id: 18,
    question: "How can I pay my policy premium?",
    answer:
      "You can pay premiums online via net banking, UPI, credit/debit card, or set up auto-debit. Offline payment options are also available through our branch offices.",
  },
  {
    id: 19,
    question: "Can I cancel my policy?",
    answer:
      "Yes, you can cancel your policy. For cancellations within the free-look period, you receive a full refund minus certain deductions. Post free-look cancellations may attract surrender charges.",
  },
  {
    id: 20,
    question: "How do I update my contact information?",
    answer:
      "Log in to your account, go to 'Profile Settings', and update your contact details. Alternatively, contact our support team with your policy number and valid identity proof.",
  },
  {
    id: 21,
    question: "How do I contact customer support?",
    answer:
      "You can reach our support team via the 'Contact Us' page, by calling our helpline, or by using the live chat feature on our website. We're available Mon–Sat, 9AM–6PM.",
  },
  {
    id: 22,
    question: "What is the waiting period for health insurance?",
    answer:
      "Most health insurance plans have an initial waiting period of 30 days for illnesses (accidents are covered from day 1), and 2–4 years for pre-existing conditions depending on the insurer.",
  },
];

// Split into two columns
const leftFaqs = faqs.filter((_, i) => i % 2 === 0);
const rightFaqs = faqs.filter((_, i) => i % 2 !== 0);

function FAQRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`faq-row${isOpen ? " faq-row--open" : ""}`}>
      <button
        className="faq-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="faq-question">{item.question}</span>
        <span className={`faq-icon${isOpen ? " faq-icon--open" : ""}`}>
          {isOpen ? "-" : "+"}
        </span>
      </button>
      {isOpen && <p className="faq-answer">{item.answer}</p>}

      <style jsx>{`
        .faq-row {
          border: 1px solid #C3C3C3;
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 16px;
        }

        .faq-row:last-child {
          margin-bottom: 0;
        }

        .faq-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 0;
        }

        .faq-question {
          font-family: 'matterregular', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #111827;
          line-height: 1.5;
          flex: 1;
        }

        .faq-row--open .faq-question {
          color: #e84b2a;
          font-weight: 700;
        }

        .faq-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 500;
          color: #9ca3af;
          transition: color 0.2s;
        }

        .faq-icon--open {
          color: #2145d6;
        }

        .faq-answer {
          font-family: 'matterregular', sans-serif;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.7;
          margin-top: 10px;
          padding-right: 32px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="faq-section">
      {/* Header */}
      <div className="faq-header">
        <p className="faq-eyebrow">QUICK HELP</p>
        <h2 className="faq-heading">
          Common <span className="highlight">Questions</span>
        </h2>
      </div>

      {/* Two-column grid */}
      <div className="faq-grid">
        <div className="faq-col">
          {leftFaqs.map((item) => (
            <FAQRow
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
        <div className="faq-col">
          {rightFaqs.map((item) => (
            <FAQRow
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          background: #ffffff;
          padding: 80px 24px 120px 24px;
          font-family: 'matterregular', sans-serif;
        }

        /* ── HEADER ── */
        .faq-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .faq-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.8px;
          color: #e84b2a;
          text-transform: uppercase;
          background-color: #FEF0ED;
          padding: 6px 14px;
          border-radius: 18px;
          display: inline-block;
          margin-bottom: 16px;
        }

        .faq-heading {
          font-size: 38px;
          font-family: var(--font-sora), "Sora", sans-serif;
          font-weight: 800;
          color: #111827;
          line-height: 1.2;
        }

        .highlight {
          color: #e84b2a;
        }

        /* ── GRID ── */
        .faq-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 48px;
        }

        .faq-col {
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .faq-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .faq-section {
            padding: 48px 16px;
          }
        }
      `}</style>
    </section>
  );
}
