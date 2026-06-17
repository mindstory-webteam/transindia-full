"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "What is the first step when I need to file a claim?",
    answer:
      "Simply call us or fill out the online intimation form. Our team will respond within 2 hours and guide you through everything that needs to happen next.",
  },
  {
    question: "Do I need to deal with the insurer directly?",
    answer:
      "No. We handle communication with the insurer on your behalf — from submitting documents to following up on status — so you don't have to chase anyone yourself.",
  },
  {
    question: "What if my claim is rejected?",
    answer:
      "We review the rejection reason with you, help you gather any additional documents needed, and file an appeal. If the rejection is unfair, we escalate to the insurer's grievance team and the IRDAI ombudsman on your behalf.",
  },
  {
    question: "How long does a claim take to settle?",
    answer:
      "Settlement timelines vary by claim type, typically ranging from 7 to 30 days once all documents are submitted. We track your claim daily and keep you updated at every stage.",
  },
];

export default function ClaimsFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-orange-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#B74E3B]">
            Common questions
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl" style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}>
            Claims <span className="text-orange-500">FAQs</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="rounded-2xl border border-slate-200"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    {item.question}
                  </span>
                  <Plus
                    className={`h-5 w-5 flex-shrink-0 text-slate-700 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    strokeWidth={2}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-slate-500">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
