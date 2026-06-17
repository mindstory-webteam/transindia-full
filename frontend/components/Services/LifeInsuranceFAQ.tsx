"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How much life cover do I need?",
    answer:
      "A common rule of thumb is 10-15x your annual income, but the right cover depends on your debts, dependents, future goals (children's education, marriage), and lifestyle. Our advisors can help you calculate a personalised number based on your financial situation.",
  },
  {
    question: "What is a claim settlement ratio?",
    answer:
      "The claim settlement ratio is the percentage of claims an insurer has successfully paid out against the total claims received in a year. A higher ratio (95%+) indicates the insurer is reliable when it comes to honouring claims.",
  },
  {
    question: "Can I buy life insurance online?",
    answer:
      "Yes, most insurers offer a fully digital process — from comparing plans and filling out the application to e-KYC and online payment. For larger sum assured amounts, a medical check-up may be scheduled at your home or a nearby diagnostic centre.",
  },
  {
    question: "What happens if I miss a premium?",
    answer:
      "Most policies offer a grace period (usually 15-30 days) to pay the missed premium without losing coverage. If the grace period lapses, the policy may lapse too, though many insurers allow reinstatement within a few years by paying due premiums with interest.",
  },
];

const LifeInsuranceFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-orange-50 text-orange-500 text-xs font-bold tracking-wider px-4 py-1.5 rounded-full mb-4 border border-orange-100">
            COMMON QUESTIONS
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            <span className="text-slate-900">Life Insurance </span>
            <span className="text-orange-600">FAQs</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-slate-900 font-semibold text-base">
                    {faq.question}
                  </span>
                  <span className="text-slate-500 text-xl font-light flex-shrink-0 leading-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LifeInsuranceFAQ;