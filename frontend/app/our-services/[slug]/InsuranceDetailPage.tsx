"use client";
// app/our-services/[slug]/InsuranceDetailPage.tsx

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import ConsultationCTA from "@/components/about/ConsultationCTA";
import Breadcrum from "@/components/Breadcrum";
import { InsuranceDetailData } from "../insuranceData";

interface Props {
  data: InsuranceDetailData;
  slug: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO CALCULATOR CARD — now driven by API data (calcCardTitle, calcFields, etc.)
// ─────────────────────────────────────────────────────────────────────────────
function HeroCalcCard({ data }: { data: InsuranceDetailData }) {
  // calcFields comes directly from the API response
  const fields = data.calcFields ?? [];
  const initialState: Record<string, string> = {};
  fields.forEach((f) => {
    initialState[f.stateKey] = f.defaultValue;
  });

  const [values, setValues] = useState<Record<string, string>>(initialState);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  if (!fields.length) return null;

  return (
    <div className="li-card">
      <h2 className="li-card-title">{data.calcCardTitle}</h2>

      {fields.map((field) => {
        if (field.type === "date") {
          return (
            <label className="li-field" key={field.stateKey}>
              <span className="li-label">{field.label}</span>
              <div className="li-input-wrap">
                <input
                  type="date"
                  value={values[field.stateKey]}
                  onChange={(e) => handleChange(field.stateKey, e.target.value)}
                  className="li-input"
                />
                <svg
                  className="li-calendar-icon"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </label>
          );
        }
        return (
          <label className="li-field" key={field.stateKey}>
            <span className="li-label">{field.label}</span>
            <select
              value={values[field.stateKey]}
              onChange={(e) => handleChange(field.stateKey, e.target.value)}
              className="li-select"
            >
              {field.options?.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        );
      })}

      <button className="li-submit" style={{ background: data.calcSubmitBg }}>
        {data.calcSubmitLabel}
      </button>
      <p className="li-disclaimer">No spam. No calls unless you want.</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ ACCORDION — unchanged
// ─────────────────────────────────────────────────────────────────────────────
function FAQSection({ data }: { data: InsuranceDetailData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-orange-50 text-orange-500 text-xs font-bold tracking-wider px-4 py-1.5 rounded-full mb-4 border border-orange-100">
            {data.faqBadge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            <span className="text-slate-900">{data.faqTitle} </span>
            <span style={{ color: data.faqTitleAccentColor }}>{data.faqTitleAccent}</span>
          </h2>
        </div>
        <div className="space-y-3">
          {data.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-slate-900 font-semibold text-base">{faq.question}</span>
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
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT — unchanged except HeroCalcCard now receives data instead of slug
// ─────────────────────────────────────────────────────────────────────────────
export default function InsuranceDetailPage({ data, slug }: Props) {
  return (
    <>
      <style>{CSS}</style>
      <div style={{ overflowX: "hidden", width: "100%" }}>
        <Navbar />

        {/* ── HERO ── */}
        <section className="li-hero">
          <div className="li-inner">
            <div className="li-left">
              <div className="li-trail">
                <Breadcrum
                  crumbs={[
                    { label: "Home", href: "/" },
                    { label: "Our Services", href: "/our-services" },
                    { label: data.heroBadgeText },
                  ]}
                />
              </div>
              <h1 className="li-title">
                {data.heroRestTitle}
                <br />
                <span style={{ color: data.heroAccentColor }}>{data.heroAccentWord} </span>
                <span style={{ color: data.heroAccentColor2 }}>most</span>
              </h1>
              <p className="li-desc">{data.heroSubtitle}</p>
              <a href="#contact" className="li-btn-cta" style={{ background: data.heroCtaBg }}>
                {data.heroCtaLabel}
              </a>
              <div className="li-stats">
                {data.heroStats.map((s, i) => (
                  <div className="li-stat-item" key={s.label}>
                    {i !== 0 && <div className="li-stat-divider" />}
                    <div>
                      <div className="li-stat-value">{s.value}</div>
                      <div className="li-stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — calc card now uses API data */}
            <div className="li-right">
              <HeroCalcCard data={data} />
            </div>
          </div>
        </section>

        {/* ── WHY SECTION ── */}
        <section className="bg-white py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 max-w-2xl">
                <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-bold tracking-wider px-3 py-1.5 rounded-full mb-4">
                  {data.whyBadge}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                  {data.whyTitle}
                  <br />
                  <span style={{ color: data.whyTitleAccentColor }}>{data.whyTitleAccent}</span>
                </h2>
                <div className="space-y-5 text-slate-700 text-base leading-relaxed">
                  {data.whyBody.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex justify-center items-center">
                <div className="w-full max-w-md h-72 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center text-6xl">
                  {data.benefits[0]?.emoji ?? "🛡️"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="bg-slate-50 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold tracking-wider px-3 py-1.5 rounded-full mb-4">
                {data.benefitsBadge}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                {data.benefitsTitle}
                <br />
                <span style={{ color: data.benefitsTitleAccentColor }}>{data.benefitsTitleAccent}</span>
              </h2>
              <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {data.benefitsSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.benefits.map((b) => (
                <div key={b.title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className={`${b.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                    {b.emoji}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STAGES / COMPARISON ── */}
        <section className="bg-white py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-bold tracking-wider px-3 py-1.5 rounded-full mb-4">
                {data.stagesBadge}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                <span className="text-slate-900">{data.stagesTitle}</span>
                <br />
                <span className="text-cyan-500">{data.stagesTitleAccent}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-2xl overflow-hidden mb-10">
              {data.stages.map((stage, i) => (
                <div
                  key={stage.title}
                  className={`${stage.bg} p-6 ${i !== 0 ? "lg:border-l border-slate-200" : ""} ${i % 2 !== 0 ? "sm:border-l border-slate-200" : ""}`}
                >
                  <div className="text-3xl mb-6">{stage.emoji}</div>
                  <div className={`${stage.ageColor} text-xs font-bold tracking-wider mb-2`}>{stage.age}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{stage.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{stage.description}</p>
                  <div className={`${stage.linkColor} text-sm font-bold`}>→ {stage.linkText}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">😟</span>
                  <h3 className="text-lg font-bold text-rose-600">{data.withoutTitle}</h3>
                </div>
                <ul className="space-y-3">
                  {data.withoutItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="text-rose-500 font-bold flex-shrink-0">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">😊</span>
                  <h3 className="text-lg font-bold text-emerald-600">{data.withTitle}</h3>
                </div>
                <ul className="space-y-3">
                  {data.withItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="text-emerald-500 font-bold flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-950 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-1">{data.ctaHeading}</h3>
                <p className="text-slate-300 text-sm">{data.ctaBody}</p>
              </div>
              
              <a  href="#contact"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-lg whitespace-nowrap transition-colors"
              >
                Talk to an Expert
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <FAQSection data={data} />

        {/* ── OTHER SERVICES ── */}
        <section className="bg-slate-50 py-10 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-slate-500 text-sm mb-3">Looking for another type of cover?</p>
            <Link href="/our-services" className="inline-flex items-center gap-2 text-blue-700 font-bold text-sm hover:underline">
              ← View all Insurance Services
            </Link>
          </div>
        </section>

        <ConsultationCTA />
        <TransindiaFooter />
      </div>
    </>
  );
}

const CSS = `
  .li-hero *{ box-sizing: border-box; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
  .li-hero{ background: #001250; padding: 56px 48px; }
  .li-inner{ max-width: 1280px; margin: 0 auto; display: flex; align-items: flex-start; justify-content: space-between; gap: 48px; }
  .li-left{ flex: 0 0 50%; max-width: 600px; padding-top: 100px; }
  .li-trail{ margin-bottom: 48px; }
  .li-title{ font-size: clamp(28px, 4vw, 52px); font-weight: 800; color: #fff; line-height: 1.15; margin: 0 0 24px; letter-spacing: -0.5px; }
  .li-desc{ font-size: 15px; color: rgba(255,255,255,0.72); line-height: 1.75; max-width: 480px; margin: 0 0 32px; }
  .li-btn-cta{ display: inline-flex; align-items: center; padding: 15px 34px; color: #fff; text-decoration: none; border-radius: 10px; font-size: 15px; font-weight: 800; box-shadow: 0 4px 24px rgba(0,0,0,0.3); white-space: nowrap; transition: transform 0.2s, box-shadow 0.2s; margin-bottom: 48px; }
  .li-btn-cta:hover{ transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.4); }
  .li-stats{ display: flex; align-items: flex-start; flex-wrap: wrap; gap: 8px; }
  .li-stat-item{ display: flex; align-items: center; gap: 24px; padding-right: 24px; }
  .li-stat-divider{ width: 1px; height: 44px; background: rgba(255,255,255,0.18); flex-shrink: 0; }
  .li-stat-value{ font-size: clamp(32px, 4vw, 48px); font-weight: 800; color: #fff; line-height: 1.1; }
  .li-stat-label{ font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 4px; white-space: nowrap; }
  .li-right{ flex: 0 0 42%; max-width: 800px; width: 100%; padding-top: 80px; }
  .li-card{ background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 24px 60px rgba(0,0,0,0.25); width: 100%; }
  .li-card-title{ font-size: 22px; font-weight: 800; color: #0B1F4D; margin: 0 0 24px; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
  .li-field{ display: block; margin-bottom: 18px; }
  .li-label{ display: block; font-size: 13px; font-weight: 700; color: #1F2937; margin-bottom: 8px; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
  .li-input-wrap{ position: relative; display: flex; align-items: center; }
  .li-input, .li-select{ width: 100%; padding: 12px 14px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 14px; color: #1F2937; background: #fff; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; appearance: none; -webkit-appearance: none; outline: none; transition: border-color 0.15s; }
  .li-input:focus, .li-select:focus{ border-color: #38BDF8; }
  .li-input{ padding-right: 40px; }
  .li-calendar-icon{ position: absolute; right: 14px; pointer-events: none; }
  .li-select{ background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='5 8 10 13 15 8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 38px; }
  .li-submit{ width: 100%; padding: 16px; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 800; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; cursor: pointer; margin-top: 6px; transition: filter 0.2s; }
  .li-submit:hover{ filter: brightness(0.9); }
  .li-disclaimer{ text-align: center; font-size: 12px; color: #9CA3AF; margin: 12px 0 0; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
  @media(max-width: 1024px){
    .li-inner{ flex-direction: column; align-items: stretch; }
    .li-left, .li-right{ flex: unset; max-width: 100%; width: 100%; }
    .li-left{ padding-top: 40px; text-align: left; margin-bottom: 16px; }
    .li-right{ padding-top: 0; }
    .li-card{ max-width: 560px; margin: 0 auto; }
  }
  @media(max-width: 600px){
    .li-hero{ padding: 40px 16px; }
    .li-title{ font-size: clamp(26px, 8vw, 36px); }
    .li-desc{ font-size: 14px; }
    .li-btn-cta{ width: 100%; justify-content: center; margin-bottom: 28px; }
    .li-stats{ display: none; }
    .li-card{ padding: 24px 20px; }
  }
`;