"use client";
// app/our-services/InsuranceDetailPage.tsx

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import ConsultationCTA from "@/components/about/ConsultationCTA";
import Breadcrum from "@/components/Breadcrum";
import { InsuranceDetailData } from "./insuranceData";
import Preloader from "@/components/Preloader";

interface Props {
  data: InsuranceDetailData;
  slug: string;
}

const CONTACT_HREF = "/contact-us";
const VIEW_PLANS_HREF = "/our-services";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ═════════════════════════════════════════════════════════════════════════════
// SERVICE FORM TYPE DEFINITIONS
// ═════════════════════════════════════════════════════════════════════════════

type FieldType = "text" | "email" | "tel" | "date" | "select" | "textarea" | "file" | "number";
type FormType = "calculator" | "motor" | "miscellaneous" | "simple" | "life-simple" | "fire-simple" | "entertainment-simple" | "health-hero";

interface CalcFieldDef {
  label: string;
  type: FieldType;
  options?: string[];
  stateKey: string;
  defaultValue: string;
}

interface CalcResult {
  coverageCaption: string;
  coverageLabel: string;
  primaryAmount: string;
  primaryUnit: string;
  secondaryAmount: string;
  secondaryUnit: string;
  totalLabel?: string;
  total?: string;
  note?: string;
  disclaimer: string;
}

type Values = Record<string, string>;

interface ServiceCalc {
  formType: FormType;
  cardTitle: string;
  submitLabel: string;
  submitBg: string;
  aboutTitle?: string;
  aboutFields?: CalcFieldDef[];
  quoteFields?: CalcFieldDef[];
  compute?: (v: Values) => CalcResult;
  description?: string;
}

// ── Shared helpers ────────────────────────────────────────────────────────────
const ageFromDOB = (dob?: string): number | null => {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
};

const fmt = (n: number, symbol = "₹"): string =>
  symbol + Math.round(n).toLocaleString("en-IN");

const GST = 1.18;

const CONTACT_FIELDS: CalcFieldDef[] = [
  { label: "Full Name", type: "text", stateKey: "name", defaultValue: "" },
  { label: "Email Address", type: "email", stateKey: "email", defaultValue: "" },
  { label: "Phone Number", type: "tel", stateKey: "phone", defaultValue: "" },
];

const PINCODE_FIELD: CalcFieldDef = {
  label: "Pincode", type: "number", stateKey: "pincode", defaultValue: "",
};

// ═════════════════════════════════════════════════════════════════════════════
// SERVICE CONFIGURATIONS
// ═════════════════════════════════════════════════════════════════════════════

const SERVICE_CALCS: Record<string, ServiceCalc> = {
  "life-insurance": {
    formType: "life-simple",
    cardTitle: "Get your life insurance quote",
    submitLabel: "Get Life Quote",
    submitBg: "#1B8A3A",
    aboutTitle: "Tell us about yourself",
    aboutFields: [
      { label: "Date of Birth", type: "date", stateKey: "dob", defaultValue: "" },
      { label: "Marital Status", type: "select", options: ["Married", "Unmarried"], stateKey: "marital", defaultValue: "Unmarried" },
      { label: "Gender", type: "select", options: ["Male", "Female"], stateKey: "gender", defaultValue: "Male" },
      PINCODE_FIELD,
    ],
  },
  "health-insurance": {
    formType: "health-hero",
    cardTitle: "Find Your Ideal Health Insurance\nin Just a Few Clicks:",
    submitLabel: "Find My Health Plan",
    submitBg: "#0D9488",
    aboutTitle: "Tell us about yourself",
    aboutFields: [
      { label: "Date of Birth", type: "date", stateKey: "dob", defaultValue: "" },
      { label: "Gender", type: "select", options: ["Male", "Female"], stateKey: "gender", defaultValue: "Male" },
      PINCODE_FIELD,
    ],
    quoteFields: [
      { label: "Cover Type", type: "select", options: ["Individual", "Family Floater", "Senior Citizen"], stateKey: "coverType", defaultValue: "Individual" },
      { label: "Sum Insured", type: "select", options: ["₹3 lakh", "₹5 lakh", "₹10 lakh", "₹25 lakh", "₹50 lakh"], stateKey: "sumInsured", defaultValue: "₹5 lakh" },
      { label: "Pre-existing Conditions", type: "select", options: ["None", "Diabetes", "Hypertension", "Both"], stateKey: "conditions", defaultValue: "None" },
      { label: "City Tier", type: "select", options: ["Tier 1 (Metro)", "Tier 2", "Tier 3"], stateKey: "cityTier", defaultValue: "Tier 1 (Metro)" },
    ],
    compute: (v) => {
      const siMap: Record<string, number> = { "₹3 lakh": 300000, "₹5 lakh": 500000, "₹10 lakh": 1000000, "₹25 lakh": 2500000, "₹50 lakh": 5000000 };
      const si = siMap[v.sumInsured] ?? 500000;
      const age = ageFromDOB(v.dob) ?? 30;
      const rate = age <= 25 ? 10 : age <= 35 ? 14 : age <= 45 ? 22 : age <= 55 ? 38 : age <= 65 ? 60 : 95;
      const coverFactor = v.coverType === "Family Floater" ? 1.6 : v.coverType === "Senior Citizen" ? 1.8 : 1;
      const condFactor = v.conditions === "Diabetes" ? 1.25 : v.conditions === "Hypertension" ? 1.2 : v.conditions === "Both" ? 1.45 : 1;
      const cityFactor = v.cityTier.startsWith("Tier 1") ? 1.15 : v.cityTier.startsWith("Tier 2") ? 1 : 0.9;
      const yearly = (si / 1000) * rate * coverFactor * condFactor * cityFactor * GST;
      return {
        coverageCaption: "Sum insured",
        coverageLabel: v.sumInsured,
        primaryAmount: fmt(yearly / 12), primaryUnit: "per month",
        secondaryAmount: fmt(yearly), secondaryUnit: "per year",
        totalLabel: "First-year premium", total: fmt(yearly),
        disclaimer: "Estimated premium incl. 18% GST. Final price depends on medical history & insurer underwriting.",
      };
    },
  },
  "motor-insurance": {
    formType: "motor",
    cardTitle: "Get your motor insurance quote",
    submitLabel: "Submit Motor Quote",
    submitBg: "#EA580C",
    description: "Provide your vehicle details and policy information for a quick quote.",
  },
  "home-insurance": {
    formType: "simple",
    cardTitle: "Get your home insurance quote",
    submitLabel: "Get Home Quote",
    submitBg: "#7C3AED",
    description: "Our insurance experts will help you find the perfect home coverage. Share your details and we'll prepare a personalized quote.",
  },
  "travel-insurance": {
    formType: "simple",
    cardTitle: "Plan your travel cover",
    submitLabel: "Get Travel Quote",
    submitBg: "#0891B2",
    description: "Get instant travel insurance quotes for domestic and international trips. Quick approval, hassle-free claims.",
  },
  "marine-insurance": {
    formType: "simple",
    cardTitle: "Get your marine quote",
    submitLabel: "Get Marine Quote",
    submitBg: "#0369A1",
    description: "Protect your cargo with comprehensive marine insurance. Our experts will assess your cargo and provide the best coverage.",
  },
  "fire-insurance": {
    formType: "fire-simple",
    cardTitle: "Calculate fire premium",
    submitLabel: "Get Fire Quote",
    submitBg: "#DC2626",
    description: "Safeguard your property and business assets with our fire insurance. Get a customized quote in minutes.",
  },
  "miscellaneous-insurance": {
    formType: "miscellaneous",
    cardTitle: "Find your cover",
    submitLabel: "Get a Quote",
    submitBg: "#4F46E5",
    description: "Specialized coverage for your unique business needs.",
  },
  "entertainment-insurance": {
    formType: "entertainment-simple",
    cardTitle: "Insure your production",
    submitLabel: "Get Production Quote",
    submitBg: "#9333EA",
    description: "Complete insurance coverage for your film, TV, and entertainment productions. Protect your cast, crew, and equipment.",
  },
  "risk-consultation": {
    formType: "simple",
    cardTitle: "Book your free assessment",
    submitLabel: "Book Free Session",
    submitBg: "#1E293B",
    description: "Get a personalized risk assessment and portfolio review from our experts. Free consultation, no obligation.",
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// HEALTH HERO FORM — matches Image 1 design
// ═════════════════════════════════════════════════════════════════════════════
function HealthHeroForm({ slug, serviceTitle, config }: { slug: string; serviceTitle: string; config: ServiceCalc }) {
  const [values, setValues] = useState<Values>({
    name: "",
    phone: "",
    email: "",
    query: "",
    wantsCallback: "true",
    agreeTerms: "false",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    const name = (values.name || "").trim();
    const email = (values.email || "").trim();
    const phoneDigits = (values.phone || "").replace(/\D/g, "");
    if (!name) { setError("Please enter your name."); return false; }
    if (phoneDigits.length < 10) { setError("Please enter a valid 10-digit phone number."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (values.agreeTerms !== "true") { setError("Please agree to the Terms & Conditions and Privacy Policy."); return false; }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/serviceleads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, serviceSlug: slug, serviceTitle, source: "website" }),
      });
      setSubmitted(true);
    } catch (e) {
      console.error("Service lead submit failed:", e);
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="hhf-card">
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginBottom: 8, marginTop: 0 }}>Thank you!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 12 }}>
            Our health insurance expert will call you back shortly.
          </p>
          <p style={{ color: "#9CA3AF", fontSize: 12, marginBottom: 0 }}>
            We&apos;ll also send details to <strong>{values.email}</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setValues({ name: "", phone: "", email: "", query: "", wantsCallback: "true", agreeTerms: "false" }); }}
          className="hhf-submit"
          style={{ background: config.submitBg, marginTop: 14 }}
        >
          Get Another Quote
        </button>
      </div>
    );
  }

  return (
    <div className="hhf-card">
      <h2 className="hhf-title">
        FIND YOUR IDEAL HEALTH INSURANCE<br />IN JUST A FEW CLICKS:
      </h2>

      {/* Name */}
      <div className="hhf-field">
        <label className="hhf-label">Your Name <span className="hhf-req">*</span></label>
        <input
          type="text"
          className="hhf-input"
          placeholder="Enter your full name"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* Phone */}
      <div className="hhf-field">
        <label className="hhf-label">Your Phone Number <span className="hhf-req">*</span></label>
        <div className="hhf-phone-wrap">
          <span className="hhf-phone-prefix">
            <span className="hhf-flag">🇮🇳</span>
            <span className="hhf-isd">+91</span>
          </span>
          <input
            type="tel"
            inputMode="tel"
            className="hhf-input hhf-phone-input"
            placeholder="98765 43210"
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
      </div>

      {/* Email */}
      <div className="hhf-field">
        <label className="hhf-label">Your Email <span className="hhf-req">*</span></label>
        <input
          type="email"
          className="hhf-input"
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

      {/* Query */}
      <div className="hhf-field">
        <label className="hhf-label">Tell us your query</label>
        <textarea
          className="hhf-textarea"
          rows={3}
          placeholder="E.g. I'm looking for a family floater plan for 4 members..."
          value={values.query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>

      {/* Callback checkbox */}
      <div
        className={`hhf-checkbox-banner${values.wantsCallback === "true" ? " hhf-checkbox-banner--active" : ""}`}
        onClick={() => handleChange("wantsCallback", values.wantsCallback === "true" ? "false" : "true")}
      >
        <span className={`hhf-custom-checkbox${values.wantsCallback === "true" ? " hhf-custom-checkbox--checked" : ""}`}>
          {values.wantsCallback === "true" && <span className="hhf-check-inner">✓</span>}
        </span>
        <span className="hhf-checkbox-text">
          <span style={{ color: "#0D9488", fontWeight: 800 }}>✅ Yes, I want a callback</span> from a TransIndia health insurance expert
        </span>
      </div>

      {/* Terms checkbox */}
      <div className="hhf-terms-row" onClick={() => handleChange("agreeTerms", values.agreeTerms === "true" ? "false" : "true")}>
        <span className={`hhf-custom-checkbox hhf-custom-checkbox--sm${values.agreeTerms === "true" ? " hhf-custom-checkbox--checked" : ""}`}>
          {values.agreeTerms === "true" && <span className="hhf-check-inner">✓</span>}
        </span>
        <span className="hhf-terms-text">
          I agree to the{" "}
          <a href="/terms" onClick={(e) => e.stopPropagation()} style={{ color: "#0D9488", textDecoration: "underline" }}>Terms &amp; Conditions</a>
          {" "}and{" "}
          <a href="/privacy" onClick={(e) => e.stopPropagation()} style={{ color: "#0D9488", textDecoration: "underline" }}>Privacy Policy</a>
        </span>
      </div>

      {error && <p className="hhf-error">{error}</p>}

      <button
        type="button"
        className="hhf-submit"
        style={{ background: config.submitBg, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Submitting…" : config.submitLabel}
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EXACT QUOTE MODAL — shown when "GET EXACT QUOTE" is clicked in PremiumCalculator (Image 2)
// ═════════════════════════════════════════════════════════════════════════════
function ExactQuoteModal({ onClose, slug, serviceTitle }: { onClose: () => void; slug: string; serviceTitle: string }) {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    lastFour: "",
    plan: "",
    wantsCallback: "true",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    const name = (values.name || "").trim();
    const email = (values.email || "").trim();
    const phoneDigits = (values.phone || "").replace(/\D/g, "");
    const lastFour = (values.lastFour || "").replace(/\D/g, "");
    if (!name) { setError("Please enter your full name."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (phoneDigits.length < 10) { setError("Please enter a valid 10-digit phone number."); return false; }
    if (lastFour.length !== 4) { setError("Please enter the last 4 digits of your phone number."); return false; }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/serviceleads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, serviceSlug: slug, serviceTitle, source: "exact-quote-modal" }),
      });
      setSubmitted(true);
    } catch (e) {
      console.error("Exact quote submit failed:", e);
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="eqm-overlay" onClick={(e) => { if ((e.target as HTMLElement).classList.contains("eqm-overlay")) onClose(); }}>
      <div className="eqm-modal">
        <button type="button" className="eqm-close" onClick={onClose} aria-label="Close">✕</button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#047857", marginBottom: 10, marginTop: 0 }}>We&apos;ll be in touch!</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
              Our team will contact you at <strong>{values.phone}</strong> with your exact health insurance quote.
            </p>
            <button type="button" onClick={onClose} className="eqm-submit" style={{ background: "#0D9488" }}>Close</button>
          </div>
        ) : (
          <>
            <h2 className="eqm-title">Get Your Exact Quote</h2>
            <p className="eqm-subtitle">Our experts will call you with personalised plans from 19+ insurers.</p>

            <div className="eqm-field">
              <label className="eqm-label">Full Name <span className="eqm-req">*</span></label>
              <input type="text" className="eqm-input" placeholder="Enter your full name" value={values.name} onChange={(e) => handleChange("name", e.target.value)} />
            </div>

            <div className="eqm-field">
              <label className="eqm-label">Email Address <span className="eqm-req">*</span></label>
              <input type="email" className="eqm-input" placeholder="you@example.com" value={values.email} onChange={(e) => handleChange("email", e.target.value)} />
            </div>

            <div className="eqm-field">
              <label className="eqm-label">Phone Number <span className="eqm-req">*</span></label>
              <div className="eqm-phone-wrap">
                <span className="eqm-phone-prefix">+91</span>
                <input type="tel" inputMode="tel" className="eqm-input eqm-phone-input" placeholder="98765 43210" value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              </div>
            </div>

            {/* Last 4 digits confirm — shown once phone is filled */}
            {(values.phone || "").replace(/\D/g, "").length >= 7 && (
              <div className="eqm-verify-box">
                <label className="eqm-verify-label">Confirm last 4 digits of your number</label>
                <div className="eqm-otp-wrap">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="eqm-otp-input"
                      value={values.lastFour[i] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                        const arr = (values.lastFour || "    ").split("").slice(0, 4);
                        arr[i] = val || " ";
                        handleChange("lastFour", arr.join("").trimEnd());
                        if (val && i < 3) {
                          const next = document.querySelector<HTMLInputElement>(`.eqm-otp-input:nth-child(${i + 2})`);
                          next?.focus();
                        }
                      }}
                    />
                  ))}
                </div>
                <p className="eqm-verify-hint">This helps us ensure we reach the right person</p>
              </div>
            )}

            <div className="eqm-field">
              <label className="eqm-label">Interested Plan</label>
              <select className="eqm-select" value={values.plan} onChange={(e) => handleChange("plan", e.target.value)}>
                <option value="">Select a plan (optional)</option>
                <option>Individual Plan</option>
                <option>Family Floater Plan</option>
                <option>Senior Citizen Plan</option>
                <option>Top-up Plan</option>
                <option>Not sure yet</option>
              </select>
            </div>

            <div
              className={`eqm-callback-banner${values.wantsCallback === "true" ? " eqm-callback-banner--active" : ""}`}
              onClick={() => handleChange("wantsCallback", values.wantsCallback === "true" ? "false" : "true")}
            >
              <span className={`eqm-custom-cb${values.wantsCallback === "true" ? " eqm-custom-cb--checked" : ""}`}>
                {values.wantsCallback === "true" && "✓"}
              </span>
              <span className="eqm-cb-text">
                <span style={{ color: "#0D9488", fontWeight: 800 }}>✅ Yes, I want a callback</span> from TransIndia regarding health insurance plans
              </span>
            </div>

            {error && <p className="eqm-error">{error}</p>}

            <button
              type="button"
              className="eqm-submit"
              style={{ background: "#0D9488", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Get My Exact Quote"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STATS BAR — shown inside the hero area for health-insurance (Image 3)
// ═════════════════════════════════════════════════════════════════════════════

function HealthStatsBar() {
  const stats = [
    { value: "19+", label: "INSURER PARTNERS" },
    { value: "10,000+", label: "NETWORK HOSPITALS" },
    { value: "98%", label: "CLAIM SETTLEMENT" },
    { value: "24/7", label: "CUSTOMER SUPPORT" },
  ];

  return (
    <section className="hsb-section">
      <div className="hsb-inner">
        {stats.map((s) => (
          <div className="hsb-item" key={s.label}>
            <div className="hsb-value">{s.value}</div>
            <div className="hsb-label">{s.label}</div>
          </div>
        ))}
      </div>

      <style>{`
        .hsb-section {
          background: radial-gradient(120% 160% at 15% 20%, #16264C 0%, #0A1330 55%, #060B1C 100%);
          padding: 40px 48px;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }
        .hsb-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 24px;
        }
        .hsb-item { text-align: center; min-width: 130px; }
        .hsb-value {
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 800;
          color: #F5A623;
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .hsb-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #94A3B8;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .hsb-section { padding: 28px 20px; }
          .hsb-inner { justify-content: space-between; gap: 20px; }
          .hsb-item { min-width: 42%; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// GET COVERED IN 4 STEPS — health-insurance only (Image 4)
// ═════════════════════════════════════════════════════════════════════════════

function GetCoveredStepsSection() {
  const steps = [
    {
      number: 1,
      title: "SHARE YOUR NEEDS",
      description: "Tell us about your family, age group, and budget.",
    },
    {
      number: 2,
      title: "COMPARE PLANS",
      description: "We shortlist the best options across 19+ insurers.",
    },
    {
      number: 3,
      title: "PICK & PAY",
      description: "Choose your plan and pay online securely.",
    },
    {
      number: 4,
      title: "GET INSURED",
      description: "Receive your policy instantly. We handle the rest.",
    },
  ];

  return (
    <section className="gcs-section">
      <div className="gcs-inner">
        <div className="gcs-header">
          <h2 className="gcs-title">GET COVERED IN 4 SIMPLE STEPS</h2>
          <p className="gcs-subtitle">From inquiry to policy — we keep it fast and frictionless.</p>
        </div>

        <div className="gcs-steps">
          {steps.map((step, index) => (
            <div className="gcs-step" key={step.number}>
              <div className="gcs-circle">{step.number}</div>
              {index < steps.length - 1 && <div className="gcs-connector" />}
              <div className="gcs-step-title">{step.title}</div>
              <div className="gcs-step-desc">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .gcs-section {
          background: #EEF6FB;
          padding: 72px 48px;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }
        .gcs-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .gcs-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .gcs-title {
          font-size: clamp(24px, 3.5vw, 38px);
          font-weight: 900;
          color: #0B1F4D;
          margin: 0 0 12px;
          letter-spacing: -0.5px;
        }
        .gcs-subtitle {
          font-size: 15px;
          color: #6B7280;
          margin: 0;
          line-height: 1.6;
        }

        .gcs-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          position: relative;
          align-items: start;
        }

        .gcs-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 16px;
          position: relative;
        }

        .gcs-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #0D9488;
          color: #fff;
          font-size: 20px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          margin-bottom: 20px;
          box-shadow: 0 4px 16px rgba(13,148,136,0.3);
        }

        .gcs-connector {
          position: absolute;
          top: 28px;
          left: calc(50% + 28px);
          width: calc(100% - 56px);
          height: 2px;
          background: linear-gradient(to right, #0D9488, #5EEAD4);
          z-index: 1;
        }

        .gcs-step-title {
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #0B1F4D;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .gcs-step-desc {
          font-size: 13.5px;
          color: #6B7280;
          line-height: 1.6;
          max-width: 180px;
        }

        @media (max-width: 900px) {
          .gcs-section { padding: 48px 24px; }
          .gcs-steps { grid-template-columns: repeat(2, 1fr); gap: 40px; }
          .gcs-connector { display: none; }
        }
        @media (max-width: 560px) {
          .gcs-section { padding: 40px 16px; }
          .gcs-steps { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PREMIUM CALCULATOR SECTION — with GET EXACT QUOTE opening modal
// ═════════════════════════════════════════════════════════════════════════════

const PC_STATES = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana", "Gujarat",
  "West Bengal", "Kerala", "Uttar Pradesh", "Rajasthan", "Punjab", "Haryana",
  "Madhya Pradesh", "Andhra Pradesh", "Bihar", "Odisha",
];

const PC_TIER1_STATES = new Set(["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana", "Gujarat", "West Bengal"]);

type PCCoverType = "Individual" | "Family" | "Senior";

const PC_COVER_OPTIONS: { value: PCCoverType; label: string; icon: string }[] = [
  { value: "Individual", label: "Individual", icon: "/images/services/SERVICE - HEALTH INSURANCE/PREMIUM CALCULATOR - INDIVIDUAL.png" },
  { value: "Family", label: "Family", icon: "/images/services/SERVICE - HEALTH INSURANCE/PREMIUM CALCULATOR - FAMILY.png" },
  { value: "Senior", label: "Senior", icon: "/images/services/SERVICE - HEALTH INSURANCE/PREMIUM CALCULATOR - SENIOR.png" },
];
function pcEstimate(age: number, coverType: PCCoverType, sumInsuredLakh: number, stateName: string) {
  const ageFactor =
    age <= 25 ? 0.85 :
    age <= 35 ? 1.0 :
    age <= 45 ? 1.4 :
    age <= 55 ? 2.0 :
    age <= 65 ? 2.8 : 3.8;
  const coverFactor = coverType === "Family" ? 1.6 : coverType === "Senior" ? 1.8 : 1;
  const cityFactor = PC_TIER1_STATES.has(stateName) ? 1.15 : 1.0;
  const BASE_RATE_PER_LAKH = 300;
  const yearlyRaw = sumInsuredLakh * BASE_RATE_PER_LAKH * ageFactor * coverFactor * cityFactor;
  const yearly = Math.round(yearlyRaw / 10) * 10;
  const monthly = Math.round(yearly / 12);
  return { yearly, monthly };
}

const pcFormatSumInsured = (lakh: number) =>
  lakh >= 100 ? "₹1 Crore" : `₹${lakh} Lakh`;

function PremiumCalculatorSection({ slug, serviceTitle }: { slug: string; serviceTitle: string }) {
  const [age, setAge] = useState(31);
  const [coverType, setCoverType] = useState<PCCoverType>("Individual");
  const [sumInsuredLakh, setSumInsuredLakh] = useState(23);
  const [stateName, setStateName] = useState("Maharashtra");
  const [showModal, setShowModal] = useState(false);

  const { yearly, monthly } = pcEstimate(age, coverType, sumInsuredLakh, stateName);

  const decAge = () => setAge((a) => Math.max(18, a - 1));
  const incAge = () => setAge((a) => Math.min(75, a + 1));

  const sumPercent = ((sumInsuredLakh - 1) / (100 - 1)) * 100;

  return (
    <>
      {showModal && (
        <ExactQuoteModal
          onClose={() => setShowModal(false)}
          slug={slug}
          serviceTitle={serviceTitle}
        />
      )}

      <section className="pc-section">
        <div className="pc-inner">
          <div className="pc-header">
            <h2 className="pc-title">PREMIUM CALCULATOR</h2>
            <p className="pc-subtitle">Get an instant estimate of your health insurance premium in seconds.</p>
          </div>

          <div className="pc-card">
            {/* LEFT — inputs */}
            <div className="pc-left">
              <div className="pc-field">
                <span className="pc-label">YOUR AGE</span>
                <div className="pc-age-row">
                  <button type="button" className="pc-step-btn" onClick={decAge} aria-label="Decrease age">−</button>
                  <span className="pc-age-value">{age}</span>
                  <button type="button" className="pc-step-btn" onClick={incAge} aria-label="Increase age">+</button>
                </div>
                <span className="pc-hint">18 – 75 years</span>
              </div>

              <div className="pc-field">
                <span className="pc-label">COVERAGE TYPE</span>
                <div className="pc-cover-row">
                  {PC_COVER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`pc-cover-btn${coverType === opt.value ? " pc-cover-btn--active" : ""}`}
                      onClick={() => setCoverType(opt.value)}
                    >
                      <img src={opt.icon} alt={opt.label} className="pc-cover-icon" />
                      <span className="pc-cover-label">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pc-field">
                <span className="pc-label">SUM INSURED</span>
                <div className="pc-slider-wrap">
                  <input
                    type="range"
                    min={1}
                    max={100}
                    step={1}
                    value={sumInsuredLakh}
                    onChange={(e) => setSumInsuredLakh(Number(e.target.value))}
                    className="pc-slider"
                    style={{ background: `linear-gradient(to right, #0D9488 ${sumPercent}%, #DCEFEC ${sumPercent}%)` }}
                    aria-label="Sum insured"
                  />
                </div>
                <div className="pc-slider-labels">
                  <span>₹1 Lakh</span>
                  <span className="pc-slider-value">{pcFormatSumInsured(sumInsuredLakh)}</span>
                  <span>₹1 Crore</span>
                </div>
              </div>

              <div className="pc-field">
                <span className="pc-label">YOUR STATE</span>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="pc-select"
                >
                  {PC_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* RIGHT — live estimate */}
            <div className="pc-right">
              <span className="pc-est-label">ESTIMATED PREMIUM</span>
              <div className="pc-est-amount">
                <span className="pc-est-value">{fmt(yearly)}</span>
                <span className="pc-est-unit">/year*</span>
              </div>
              <p className="pc-est-sub">or {fmt(monthly)}/month</p>

              <div className="pc-coverage-box">
                <div className="pc-coverage-row">
                  <span className="pc-coverage-label">COVERAGE</span>
                  <span className="pc-coverage-value">{coverType}</span>
                </div>
                <div className="pc-coverage-row">
                  <span className="pc-coverage-label">SUM INSURED</span>
                  <span className="pc-coverage-value">{pcFormatSumInsured(sumInsuredLakh)}</span>
                </div>
              </div>

              {/* GET EXACT QUOTE — now opens modal */}
              <button
                type="button"
                className="pc-cta"
                onClick={() => setShowModal(true)}
              >
                GET EXACT QUOTE →
              </button>

              <p className="pc-disclaimer">*Indicative premium and may vary based on insurer underwriting.</p>
            </div>
          </div>
        </div>

        <style>{`
          .pc-section {
            background: linear-gradient(135deg, #F0FDFA 0%, #F8FAFC 50%, #ECFEFF 100%);
            padding: 72px 48px;
            font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          }
          .pc-inner { max-width: 1100px; margin: 0 auto; }
          .pc-header { text-align: center; margin-bottom: 40px; }
          .pc-title {
            font-size: clamp(22px, 3vw, 32px);
            font-weight: 900;
            color: #0B1F4D;
            letter-spacing: 0.04em;
            margin: 0 0 12px;
            text-transform: uppercase;
          }
          .pc-subtitle { font-size: 15px; color: #6B7280; margin: 0; line-height: 1.6; }
          .pc-card {
            display: grid;
            grid-template-columns: 1.15fr 1fr;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 24px 60px rgba(11,31,77,0.14);
          }
          .pc-left {
            background: linear-gradient(165deg, #E3F6F1 0%, #DCEFEC 100%);
            padding: 36px 34px;
            display: flex;
            flex-direction: column;
            gap: 26px;
          }
          .pc-field { display: flex; flex-direction: column; }
          .pc-label {
            font-size: 11.5px;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: #0B1F4D;
            margin-bottom: 12px;
          }
          .pc-hint { font-size: 12px; color: #6B7280; margin-top: 8px; }
          .pc-age-row { display: flex; align-items: center; gap: 18px; }
          .pc-step-btn {
            width: 36px; height: 36px;
            border-radius: 50%;
            border: 1.5px solid #0D9488;
            background: #fff;
            color: #0D9488;
            font-size: 18px;
            font-weight: 800;
            line-height: 1;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s, color 0.15s;
          }
          .pc-step-btn:hover { background: #0D9488; color: #fff; }
          .pc-age-value { font-size: 26px; font-weight: 800; color: #0B1F4D; min-width: 36px; text-align: center; }
          .pc-cover-row { display: flex; gap: 10px; }
          .pc-cover-btn {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            padding: 14px 8px;
            background: #fff;
            border: 1.5px solid #D1E7E2;
            border-radius: 12px;
            cursor: pointer;
            transition: border-color 0.15s, box-shadow 0.15s;
            font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          }
          .pc-cover-btn--active { border-color: #0D9488; box-shadow: 0 0 0 1px #0D9488 inset; background: #F0FDFA; }
          .pc-cover-icon { font-size: 20px; }
          .pc-cover-label { font-size: 11px; font-weight: 800; letter-spacing: 0.04em; color: #0B1F4D; text-transform: uppercase; }
          .pc-slider-wrap { padding: 4px 0; }
          .pc-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 6px;
            border-radius: 999px;
            outline: none;
            cursor: pointer;
            accent-color: #0D9488;
          }
          .pc-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px; height: 20px;
            border-radius: 50%;
            background: #0D9488;
            border: 3px solid #fff;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            cursor: pointer;
          }
          .pc-slider::-moz-range-thumb {
            width: 20px; height: 20px;
            border-radius: 50%;
            background: #0D9488;
            border: 3px solid #fff;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            cursor: pointer;
          }
          .pc-slider-labels {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            font-size: 11.5px;
            color: #6B7280;
          }
          .pc-slider-value { font-size: 13px; font-weight: 800; color: #0D9488; }
          .pc-select {
            width: 100%;
            padding: 11px 14px;
            border: 1.5px solid #D1E7E2;
            border-radius: 8px;
            background: #fff;
            font-size: 14px;
            color: #1F2937;
            font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='5 8 10 13 15 8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
            padding-right: 38px;
            outline: none;
            cursor: pointer;
          }
          .pc-select:focus { border-color: #0D9488; }
          .pc-right {
            background: #0B1F4D;
            padding: 36px 34px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .pc-est-label {
            font-size: 11.5px;
            font-weight: 800;
            letter-spacing: 0.1em;
            color: #5EEAD4;
          }
          .pc-est-amount { display: flex; align-items: baseline; gap: 6px; margin-top: 14px; }
          .pc-est-value { font-size: clamp(34px, 4vw, 44px); font-weight: 900; color: #fff; line-height: 1; }
          .pc-est-unit { font-size: 14px; color: rgba(255,255,255,0.6); font-weight: 600; }
          .pc-est-sub { font-size: 13px; color: rgba(255,255,255,0.6); margin: 6px 0 24px; }
          .pc-coverage-box {
            width: 100%;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 12px;
            padding: 14px 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 24px;
          }
          .pc-coverage-row { display: flex; align-items: center; justify-content: space-between; }
          .pc-coverage-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; color: rgba(255,255,255,0.5); }
          .pc-coverage-value { font-size: 14px; font-weight: 800; color: #fff; }
          .pc-cta {
            width: 100%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 14px;
            background: #F97316;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 0.02em;
            cursor: pointer;
            font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
            transition: background 0.18s, transform 0.15s;
          }
          .pc-cta:hover { background: #EA580C; transform: translateY(-1px); }
          .pc-disclaimer { font-size: 11px; color: rgba(255,255,255,0.45); margin: 14px 0 0; line-height: 1.5; }
          @media (max-width: 900px) {
            .pc-section { padding: 48px 24px; }
            .pc-card { grid-template-columns: 1fr; }
            .pc-left, .pc-right { padding: 28px 24px; }
          }
          @media (max-width: 600px) {
            .pc-section { padding: 40px 16px; }
            .pc-cover-row { gap: 8px; }
          }
        `}</style>
      </section>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// LIFE INSURANCE TWO-STEP FORM CARD
// ═════════════════════════════════════════════════════════════════════════════
function LifeSimpleFormCard({ slug, serviceTitle, config }: { slug: string; serviceTitle: string; config: ServiceCalc }) {
  const step1Fields = CONTACT_FIELDS;
  const step2Fields = config.aboutFields || [];
  
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<Values>({
    name: "", email: "", phone: "", dob: "", marital: "Unmarried", gender: "Male", pincode: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => { setValues((prev) => ({ ...prev, [key]: value })); setError(null); };

  const validateContact = (): boolean => {
    const name = (values.name || "").trim();
    const email = (values.email || "").trim();
    const phoneDigits = (values.phone || "").replace(/\D/g, "");
    if (!name) { setError("Please enter your name."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (phoneDigits.length < 10) { setError("Please enter a valid 10-digit phone number."); return false; }
    setError(null);
    return true;
  };

  const goToStep2 = () => { if (validateContact()) setStep(2); };

  const handleSubmit = async () => {
    if (!validateContact()) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/serviceleads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, serviceSlug: slug, serviceTitle, source: "website" }),
      });
      setSubmitted(true);
    } catch (e) {
      console.error("Service lead submit failed:", e);
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: CalcFieldDef) => {
    if (field.type === "date") {
      return (
        <label className="li-field" key={field.stateKey}>
          <span className="li-label">{field.label}</span>
          <div className="li-input-wrap">
            <input type="date" value={values[field.stateKey]} onChange={(e) => handleChange(field.stateKey, e.target.value)} className="li-input" />
            <svg className="li-calendar-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </label>
      );
    }
    if (field.type === "select") {
      return (
        <label className="li-field" key={field.stateKey}>
          <span className="li-label">{field.label}</span>
          <select value={values[field.stateKey]} onChange={(e) => handleChange(field.stateKey, e.target.value)} className="li-select">
            {field.options?.map((o, oi) => <option key={`${field.stateKey}-${oi}`}>{o}</option>)}
          </select>
        </label>
      );
    }
    if (field.type === "number") {
      return (
        <label className="li-field" key={field.stateKey}>
          <span className="li-label">{field.label}</span>
          <input type="number" inputMode="numeric" value={values[field.stateKey]} onChange={(e) => handleChange(field.stateKey, e.target.value)} className="li-textfield" placeholder="Enter your pincode" maxLength={6} />
        </label>
      );
    }
    return (
      <label className="li-field" key={field.stateKey}>
        <span className="li-label">{field.label}</span>
        <input type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text"} inputMode={field.type === "tel" ? "tel" : undefined} value={values[field.stateKey]} onChange={(e) => handleChange(field.stateKey, e.target.value)} className="li-textfield" placeholder={field.label} />
      </label>
    );
  };

  const StepDot = ({ n, label }: { n: 1 | 2; label: string }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: step >= n ? "#0B1F4D" : "#9CA3AF", whiteSpace: "nowrap" }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 800, background: step >= n ? config.submitBg : "#E5E7EB", color: step >= n ? "#fff" : "#6B7280", flexShrink: 0 }}>
        {step > n ? "✓" : n}
      </span>
      {label}
    </span>
  );

  const currentFields = step === 1 ? step1Fields : step2Fields;
  const cardTitle = step === 1 ? "How can we reach you?" : config.aboutTitle;

  if (submitted) {
    return (
      <div className="li-card">
        <div className="li-result" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginBottom: 12, marginTop: 0 }}>Thank you!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>We&apos;ve received your information. Our insurance experts will reach out to you shortly with a personalized quote.</p>
          <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 0 }}>Quote sent to: <strong>{values.email}</strong></p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" onClick={() => { setSubmitted(false); setValues({ name: "", email: "", phone: "", dob: "", marital: "Unmarried", gender: "Male", pincode: "" }); }} className="li-back-btn">New Quote</button>
          <Link href={VIEW_PLANS_HREF} className="li-submit li-submit-link" style={{ background: config.submitBg, flex: 1, width: "auto", marginTop: 0 }}>Compare Plans</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="li-card">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <StepDot n={1} label="Contact" />
        <span style={{ flex: 1, height: 2, background: "#E2E8F0", borderRadius: 2 }} />
        <StepDot n={2} label="About you" />
      </div>
      <h2 className="li-card-title">{cardTitle}</h2>
      <>
        {currentFields.map(renderField)}
        {step === 1 && <button className="li-submit" style={{ background: config.submitBg }} onClick={goToStep2} type="button">Continue</button>}
        {step === 2 && (
          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            <button type="button" onClick={() => setStep(1)} className="li-back-btn">Back</button>
            <button className="li-submit" style={{ background: config.submitBg, flex: 1, width: "auto", marginTop: 0, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }} onClick={handleSubmit} disabled={submitting} type="button">
              {submitting ? "Saving…" : config.submitLabel}
            </button>
          </div>
        )}
        {error && <p className="li-error">{error}</p>}
        <p className="li-disclaimer">No spam. No calls unless you want.</p>
      </>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SIMPLE FORM CARD
// ═════════════════════════════════════════════════════════════════════════════
function SimpleFormCard({ slug, serviceTitle, config }: { slug: string; serviceTitle: string; config: ServiceCalc }) {
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => { setValues((prev) => ({ ...prev, [key]: value })); setError(null); };

  const validateForm = (): boolean => {
    const name = (values.name || "").trim();
    const email = (values.email || "").trim();
    const phoneDigits = (values.phone || "").replace(/\D/g, "");
    if (!name) { setError("Please enter your name."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (phoneDigits.length < 10) { setError("Please enter a valid 10-digit phone number."); return false; }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/serviceleads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, serviceSlug: slug, serviceTitle, source: "website" }) });
      setSubmitted(true);
    } catch (e) { console.error("Service lead submit failed:", e); setError("Failed to submit. Please try again."); } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="li-card">
        <div className="li-result" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginBottom: 12, marginTop: 0 }}>Thank you!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>We&apos;ve received your information. Our insurance experts will reach out to you shortly with a personalized quote.</p>
          <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 0 }}>Quote sent to: <strong>{values.email}</strong></p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" onClick={() => { setSubmitted(false); setValues({ name: "", email: "", phone: "" }); }} className="li-back-btn">New Quote</button>
        </div>
      </div>
    );
  }

  return (
    <div className="li-card">
      <h2 className="li-card-title">{config.cardTitle}</h2>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18, marginTop: 0 }}>{config.description}</p>
      <label className="li-field"><span className="li-label">Full Name</span><input type="text" value={values.name} onChange={(e) => handleChange("name", e.target.value)} className="li-textfield" placeholder="Your name" /></label>
      <label className="li-field"><span className="li-label">Email Address</span><input type="email" value={values.email} onChange={(e) => handleChange("email", e.target.value)} className="li-textfield" placeholder="your@email.com" /></label>
      <label className="li-field"><span className="li-label">Phone Number</span><input type="tel" inputMode="tel" value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} className="li-textfield" placeholder="+91" /></label>
      <button className="li-submit" style={{ background: config.submitBg, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }} onClick={handleSubmit} disabled={submitting} type="button">{submitting ? "Sending…" : config.submitLabel}</button>
      {error && <p className="li-error">{error}</p>}
      <p className="li-disclaimer">No spam. No calls unless you want.</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MOTOR FORM CARD
// ═════════════════════════════════════════════════════════════════════════════
function MotorFormCard({ slug, serviceTitle, config }: { slug: string; serviceTitle: string; config: ServiceCalc }) {
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", expiryDate: "", vehicleType: "Car" });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => { setValues((prev) => ({ ...prev, [key]: value })); setError(null); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = newFiles.filter((f) => {
      if (f.size > 5 * 1024 * 1024) { setError(`File ${f.name} is too large (max 5MB)`); return false; }
      return true;
    });
    if (validFiles.length > 0) { setFiles((prev) => [...prev, ...validFiles]); setError(null); }
  };

  const removeFile = (index: number) => { setFiles((prev) => prev.filter((_, i) => i !== index)); };

  const validateForm = (): boolean => {
    const name = (values.name || "").trim();
    const email = (values.email || "").trim();
    const phoneDigits = (values.phone || "").replace(/\D/g, "");
    const expiryDate = (values.expiryDate || "").trim();
    if (!name) { setError("Please enter your name."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (phoneDigits.length < 10) { setError("Please enter a valid 10-digit phone number."); return false; }
    if (!expiryDate) { setError("Please enter policy expiry date."); return false; }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("expiryDate", values.expiryDate);
      formData.append("vehicleType", values.vehicleType);
      formData.append("serviceSlug", slug);
      formData.append("serviceTitle", serviceTitle);
      formData.append("source", "website");
      files.forEach((file) => { formData.append("insuranceDocuments", file); });
      await fetch(`${API_BASE}/serviceleads`, { method: "POST", body: formData });
      setSubmitted(true);
    } catch (e) { console.error("Service lead submit failed:", e); setError("Failed to submit. Please try again."); } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="li-card">
        <div className="li-result" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginBottom: 12, marginTop: 0 }}>Quote Request Received!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>Thank you for sharing your vehicle details. Our team will compare quotes and send you the best options shortly.</p>
          <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 0 }}>Vehicle Type: <strong>{values.vehicleType}</strong></p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" onClick={() => { setSubmitted(false); setValues({ name: "", email: "", phone: "", expiryDate: "", vehicleType: "Car" }); setFiles([]); }} className="li-back-btn">New Quote</button>
          <Link href={VIEW_PLANS_HREF} className="li-submit li-submit-link" style={{ background: config.submitBg, flex: 1, width: "auto", marginTop: 0 }}>Compare Plans</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="li-card">
      <h2 className="li-card-title">{config.cardTitle}</h2>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18, marginTop: 0 }}>{config.description}</p>
      <label className="li-field"><span className="li-label">Full Name</span><input type="text" value={values.name} onChange={(e) => handleChange("name", e.target.value)} className="li-textfield" placeholder="Your name" /></label>
      <label className="li-field"><span className="li-label">Email Address</span><input type="email" value={values.email} onChange={(e) => handleChange("email", e.target.value)} className="li-textfield" placeholder="your@email.com" /></label>
      <label className="li-field"><span className="li-label">Phone Number</span><input type="tel" inputMode="tel" value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} className="li-textfield" placeholder="+91" /></label>
      <label className="li-field">
        <span className="li-label">Policy Expiry Date</span>
        <div className="li-input-wrap">
          <input type="date" value={values.expiryDate} onChange={(e) => handleChange("expiryDate", e.target.value)} className="li-input" />
          <svg className="li-calendar-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </label>
      <label className="li-field">
        <span className="li-label">Type of Vehicle</span>
        <select value={values.vehicleType} onChange={(e) => handleChange("vehicleType", e.target.value)} className="li-select">
          <option>Car</option><option>Bike</option><option>Scooter</option><option>Truck</option><option>Auto</option><option>Commercial Vehicle</option>
        </select>
      </label>
      <label className="li-field">
        <span className="li-label">Upload Insurance Documents <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(Optional)</span></span>
        <div className="li-file-upload">
          <input type="file" onChange={handleFileChange} className="li-file-input" accept=".pdf,.jpg,.jpeg,.png" multiple />
          <div className="li-file-label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            <span className="li-file-text">Click or drag to upload (PDF, JPG, PNG) - Multiple files allowed</span>
          </div>
        </div>
        {files.length > 0 && (
          <div style={{ marginTop: 12, padding: 12, background: "#F3F4F6", borderRadius: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Uploaded Files:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {files.map((file, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, background: "#fff", borderRadius: 6, border: "1px solid #E5E7EB" }}>
                  <span style={{ fontSize: 12, color: "#374151", wordBreak: "break-word" }}>{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} style={{ fontSize: 12, color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>✕ Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </label>
      <button className="li-submit" style={{ background: config.submitBg, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }} onClick={handleSubmit} disabled={submitting} type="button">{submitting ? "Sending…" : config.submitLabel}</button>
      {error && <p className="li-error">{error}</p>}
      <p className="li-disclaimer">No spam. No calls unless you want.</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FIRE INSURANCE FORM CARD
// ═════════════════════════════════════════════════════════════════════════════
function FireFormCard({ slug, serviceTitle, config }: { slug: string; serviceTitle: string; config: ServiceCalc }) {
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", industries: "", insuranceType: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => { setValues((prev) => ({ ...prev, [key]: value })); setError(null); };

  const validateForm = (): boolean => {
    const name = (values.name || "").trim();
    const email = (values.email || "").trim();
    const phoneDigits = (values.phone || "").replace(/\D/g, "");
    const industries = (values.industries || "").trim();
    const insuranceType = (values.insuranceType || "").trim();
    if (!name) { setError("Please enter your name."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (phoneDigits.length < 10) { setError("Please enter a valid 10-digit phone number."); return false; }
    if (!industries) { setError("Please tell us about your industries."); return false; }
    if (!insuranceType) { setError("Please specify the type of insurance needed."); return false; }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/serviceleads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, serviceSlug: slug, serviceTitle, source: "website" }) });
      setSubmitted(true);
    } catch (e) { console.error("Service lead submit failed:", e); setError("Failed to submit. Please try again."); } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="li-card">
        <div className="li-result" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginBottom: 12, marginTop: 0 }}>Thank you!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>We&apos;ve received your fire insurance inquiry. Our experts will review your requirements and provide a customized quote.</p>
          <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 0 }}>Quote sent to: <strong>{values.email}</strong></p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" onClick={() => { setSubmitted(false); setValues({ name: "", email: "", phone: "", industries: "", insuranceType: "" }); }} className="li-back-btn">New Quote</button>
        </div>
      </div>
    );
  }

  return (
    <div className="li-card">
      <h2 className="li-card-title">{config.cardTitle}</h2>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18, marginTop: 0 }}>{config.description}</p>
      <label className="li-field"><span className="li-label">Full Name</span><input type="text" value={values.name} onChange={(e) => handleChange("name", e.target.value)} className="li-textfield" placeholder="Your name" /></label>
      <label className="li-field"><span className="li-label">Email Address</span><input type="email" value={values.email} onChange={(e) => handleChange("email", e.target.value)} className="li-textfield" placeholder="your@email.com" /></label>
      <label className="li-field"><span className="li-label">Phone Number</span><input type="tel" inputMode="tel" value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} className="li-textfield" placeholder="+91" /></label>
      <label className="li-field"><span className="li-label">Which Industries</span><textarea value={values.industries} onChange={(e) => handleChange("industries", e.target.value)} className="li-textarea" rows={3} placeholder="E.g., Manufacturing, Retail, Hospitality, etc." /></label>
      <label className="li-field"><span className="li-label">Type of Insurance</span><textarea value={values.insuranceType} onChange={(e) => handleChange("insuranceType", e.target.value)} className="li-textarea" rows={3} placeholder="Describe the type of fire insurance coverage you need..." /></label>
      <button className="li-submit" style={{ background: config.submitBg, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }} onClick={handleSubmit} disabled={submitting} type="button">{submitting ? "Sending…" : config.submitLabel}</button>
      {error && <p className="li-error">{error}</p>}
      <p className="li-disclaimer">No spam. No calls unless you want.</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ENTERTAINMENT INSURANCE FORM CARD
// ═════════════════════════════════════════════════════════════════════════════
function EntertainmentFormCard({ slug, serviceTitle, config }: { slug: string; serviceTitle: string; config: ServiceCalc }) {
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", insuranceType: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => { setValues((prev) => ({ ...prev, [key]: value })); setError(null); };

  const validateForm = (): boolean => {
    const name = (values.name || "").trim();
    const email = (values.email || "").trim();
    const phoneDigits = (values.phone || "").replace(/\D/g, "");
    const insuranceType = (values.insuranceType || "").trim();
    if (!name) { setError("Please enter your name."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (phoneDigits.length < 10) { setError("Please enter a valid 10-digit phone number."); return false; }
    if (!insuranceType) { setError("Please specify the type of insurance needed."); return false; }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/serviceleads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, serviceSlug: slug, serviceTitle, source: "website" }) });
      setSubmitted(true);
    } catch (e) { console.error("Service lead submit failed:", e); setError("Failed to submit. Please try again."); } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="li-card">
        <div className="li-result" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginBottom: 12, marginTop: 0 }}>Thank you!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>We&apos;ve received your production insurance inquiry. Our team will review your requirements and prepare a customized quote.</p>
          <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 0 }}>Quote sent to: <strong>{values.email}</strong></p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" onClick={() => { setSubmitted(false); setValues({ name: "", email: "", phone: "", insuranceType: "" }); }} className="li-back-btn">New Quote</button>
        </div>
      </div>
    );
  }

  return (
    <div className="li-card">
      <h2 className="li-card-title">{config.cardTitle}</h2>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18, marginTop: 0 }}>{config.description}</p>
      <label className="li-field"><span className="li-label">Full Name</span><input type="text" value={values.name} onChange={(e) => handleChange("name", e.target.value)} className="li-textfield" placeholder="Your name" /></label>
      <label className="li-field"><span className="li-label">Email Address</span><input type="email" value={values.email} onChange={(e) => handleChange("email", e.target.value)} className="li-textfield" placeholder="your@email.com" /></label>
      <label className="li-field"><span className="li-label">Phone Number</span><input type="tel" inputMode="tel" value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} className="li-textfield" placeholder="+91" /></label>
      <label className="li-field"><span className="li-label">Type of Insurance</span><textarea value={values.insuranceType} onChange={(e) => handleChange("insuranceType", e.target.value)} className="li-textarea" rows={3} placeholder="E.g., Film production, TV show, Theater, Music event, Sports event, etc." /></label>
      <button className="li-submit" style={{ background: config.submitBg, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }} onClick={handleSubmit} disabled={submitting} type="button">{submitting ? "Sending…" : config.submitLabel}</button>
      {error && <p className="li-error">{error}</p>}
      <p className="li-disclaimer">No spam. No calls unless you want.</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MISCELLANEOUS FORM CARD
// ═════════════════════════════════════════════════════════════════════════════
function MiscellaneousFormCard({ slug, serviceTitle, config }: { slug: string; serviceTitle: string; config: ServiceCalc }) {
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", insuranceTypes: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => { setValues((prev) => ({ ...prev, [key]: value })); setError(null); };

  const validateForm = (): boolean => {
    const name = (values.name || "").trim();
    const email = (values.email || "").trim();
    const phoneDigits = (values.phone || "").replace(/\D/g, "");
    const types = (values.insuranceTypes || "").trim();
    if (!name) { setError("Please enter your name."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (phoneDigits.length < 10) { setError("Please enter a valid 10-digit phone number."); return false; }
    if (!types) { setError("Please tell us about your insurance needs."); return false; }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/serviceleads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, serviceSlug: slug, serviceTitle, source: "website" }) });
      setSubmitted(true);
    } catch (e) { console.error("Service lead submit failed:", e); setError("Failed to submit. Please try again."); } finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="li-card">
        <div className="li-result" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginBottom: 12, marginTop: 0 }}>Thank you!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>We&apos;ve received your inquiry. Our insurance experts will assess your needs and provide the best coverage options.</p>
          <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 0 }}>We&apos;ll contact you at: <strong>{values.email}</strong></p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" onClick={() => { setSubmitted(false); setValues({ name: "", email: "", phone: "", insuranceTypes: "" }); }} className="li-back-btn">New Inquiry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="li-card">
      <h2 className="li-card-title">{config.cardTitle}</h2>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18, marginTop: 0 }}>{config.description}</p>
      <label className="li-field"><span className="li-label">Full Name</span><input type="text" value={values.name} onChange={(e) => handleChange("name", e.target.value)} className="li-textfield" placeholder="Your name" /></label>
      <label className="li-field"><span className="li-label">Email Address</span><input type="email" value={values.email} onChange={(e) => handleChange("email", e.target.value)} className="li-textfield" placeholder="your@email.com" /></label>
      <label className="li-field"><span className="li-label">Phone Number</span><input type="tel" inputMode="tel" value={values.phone} onChange={(e) => handleChange("phone", e.target.value)} className="li-textfield" placeholder="+91" /></label>
      <label className="li-field"><span className="li-label">Insurance Types &amp; Requirements</span><textarea value={values.insuranceTypes} onChange={(e) => handleChange("insuranceTypes", e.target.value)} className="li-textarea" rows={4} placeholder="Tell us about your insurance needs. E.g., Burglary coverage, Professional indemnity, Employee welfare, etc." /></label>
      <button className="li-submit" style={{ background: config.submitBg, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }} onClick={handleSubmit} disabled={submitting} type="button">{submitting ? "Sending…" : config.submitLabel}</button>
      {error && <p className="li-error">{error}</p>}
      <p className="li-disclaimer">No spam. No calls unless you want.</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FAQ SECTION
// ═════════════════════════════════════════════════════════════════════════════
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
              <div key={faq.question} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="text-slate-900 font-semibold text-base">{faq.question}</span>
                  <span className="text-slate-500 text-xl font-light flex-shrink-0 leading-none">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed">{faq.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function InsuranceDetailPage({ data, slug }: Props) {
  const config = SERVICE_CALCS[slug] ?? SERVICE_CALCS["life-insurance"];

  return (
    <>
      <style>{CSS}</style>
      <div style={{ overflowX: "hidden", width: "100%" }}>
        <Preloader />
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
                    { label: data.heroBadgeText || data.title },
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
              <Link href={CONTACT_HREF} className="li-btn-cta" style={{ background: data.heroCtaBg }}>
                {data.heroCtaLabel}
              </Link>
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

            {/* RIGHT — form */}
            <div className="li-right">
              {config.formType === "health-hero" && <HealthHeroForm slug={slug} serviceTitle={data.title || data.heroBadgeText} config={config} />}
              {config.formType === "life-simple" && <LifeSimpleFormCard slug={slug} serviceTitle={data.title || data.heroBadgeText} config={config} />}
              {config.formType === "simple" && <SimpleFormCard slug={slug} serviceTitle={data.title || data.heroBadgeText} config={config} />}
              {config.formType === "motor" && <MotorFormCard slug={slug} serviceTitle={data.title || data.heroBadgeText} config={config} />}
              {config.formType === "fire-simple" && <FireFormCard slug={slug} serviceTitle={data.title || data.heroBadgeText} config={config} />}
              {config.formType === "entertainment-simple" && <EntertainmentFormCard slug={slug} serviceTitle={data.title || data.heroBadgeText} config={config} />}
              {config.formType === "miscellaneous" && <MiscellaneousFormCard slug={slug} serviceTitle={data.title || data.heroBadgeText} config={config} />}
            </div>
          </div>
        </section>

        {/* ── HEALTH STATS BAR — inside hero area, health-insurance only (Image 3) ── */}
        {/* {slug === "health-insurance" && <HealthStatsBar />} */}



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
          {data.whyBody.map((para, i) => <p key={i}>{para}</p>)}
        </div>
      </div>
      <div className="flex-1 w-full">
        {data.whyImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.whyImage} alt={data.whyTitle || "illustration"} className="w-full h-auto object-contain rounded-3xl" />
        ) : data.benefits[0]?.emoji ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.benefits[0].emoji} alt={data.whyTitle || "illustration"} className="w-full h-auto object-contain rounded-3xl" />
        ) : (
          <div className="w-full h-96 flex items-center justify-center text-6xl">
            🛡️
          </div>
        )}
      </div>
    </div>
  </div>
</section>

        {/* ── PREMIUM CALCULATOR (health-insurance only) ── */}
        {slug === "health-insurance" && (
          <PremiumCalculatorSection slug={slug} serviceTitle={data.title || data.heroBadgeText} />
        )}

        {/* ── GET COVERED IN 4 STEPS (health-insurance only, Image 4) ── */}
        {slug === "health-insurance" && <GetCoveredStepsSection />}

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
                  <div className={`${b.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.icon || b.emoji} alt={b.title} className="w-8 h-8 object-contain" />
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
                <div key={stage.title} className={`${stage.bg} p-6 ${i !== 0 ? "lg:border-l border-slate-200" : ""} ${i % 2 !== 0 ? "sm:border-l border-slate-200" : ""}`}>
                  <div className="mb-6 h-10 flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stage.icon || stage.emoji} alt={stage.title} className="w-10 h-10 object-contain" />
                  </div>
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
      <img
        
         src="/images/services/SERVICE - LIFE INSURANCE/Without.png"
        alt="worried face"
        className="w-7 h-7"
      />
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
      <img
       src="/images/services/SERVICE - LIFE INSURANCE/With.png"
        alt="smiling face"
        className="w-7 h-7"
      />
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
              <Link href={CONTACT_HREF} className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-lg whitespace-nowrap transition-colors">
                Talk to an Expert
              </Link>
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
  /* ── base ── */
  .li-hero *{ box-sizing: border-box; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
  .li-hero{ background: #001250; padding: 56px 48px; }
  .li-inner{ max-width: 1280px; margin: 0 auto; display: flex; align-items: flex-start; justify-content: space-between; gap: 48px; }
  .li-left{ flex: 0 0 50%; max-width: 600px; min-width: 0; padding-top: 100px; }
  .li-trail{ margin-bottom: 48px; }
  .li-title{ font-size: clamp(28px, 4vw, 52px); font-weight: 800; color: #fff; line-height: 1.15; margin: 0 0 24px; letter-spacing: -0.5px; overflow-wrap: break-word; word-break: break-word; }
  .li-desc{ font-size: 15px; color: rgba(255,255,255,0.72); line-height: 1.75; max-width: 480px; margin: 0 0 32px; overflow-wrap: break-word; }
  .li-btn-cta{ display: inline-flex; align-items: center; padding: 15px 34px; color: #fff; text-decoration: none; border-radius: 10px; font-size: 15px; font-weight: 800; box-shadow: 0 4px 24px rgba(0,0,0,0.3); white-space: nowrap; transition: transform 0.2s, box-shadow 0.2s; margin-bottom: 48px; }
  .li-btn-cta:hover{ transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.4); }
  .li-stats{ display: flex; align-items: flex-start; flex-wrap: wrap; gap: 8px; }
  .li-stat-item{ display: flex; align-items: center; gap: 24px; padding-right: 24px; }
  .li-stat-divider{ width: 1px; height: 44px; background: rgba(255,255,255,0.18); flex-shrink: 0; }
  .li-stat-value{ font-size: clamp(32px, 4vw, 48px); font-weight: 800; color: #fff; line-height: 1.1; }
  .li-stat-label{ font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 4px; white-space: nowrap; }
  .li-right{ flex: 0 0 42%; max-width: 800px; width: 100%; padding-top: 80px; }

  /* ── shared card base ── */
  .li-card{ background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 24px 60px rgba(0,0,0,0.25); width: 100%; }
  .li-card-title{ font-size: 20px; font-weight: 800; color: #0B1F4D; margin: 0 0 16px; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
  .li-field{ display: block; margin-bottom: 13px; }
  .li-label{ display: block; font-size: 12.5px; font-weight: 700; color: #1F2937; margin-bottom: 6px; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
  .li-input-wrap{ position: relative; display: flex; align-items: center; }
  .li-input, .li-select, .li-textfield, .li-textarea{ width: 100%; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 14px; color: #1F2937; background: #fff; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; appearance: none; -webkit-appearance: none; outline: none; transition: border-color 0.15s; }
  .li-input:focus, .li-select:focus, .li-textfield:focus, .li-textarea:focus{ border-color: #38BDF8; }
  .li-input{ padding-right: 40px; }
  .li-textfield::placeholder, .li-textarea::placeholder{ color: #9CA3AF; }
  .li-textarea{ resize: vertical; min-height: 56px; line-height: 1.5; }
  .li-calendar-icon{ position: absolute; right: 14px; pointer-events: none; }
  .li-select{ background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='5 8 10 13 15 8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 38px; }
  .li-submit{ width: 100%; padding: 14px; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 800; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; cursor: pointer; margin-top: 6px; transition: filter 0.2s; }
  .li-submit:hover{ filter: brightness(0.9); }
  .li-submit-link{ display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
  .li-back-btn{ flex-shrink: 0; padding: 14px 20px; background: transparent; color: #0B1F4D; border: 1.5px solid #0B1F4D; border-radius: 8px; font-size: 15px; font-weight: 800; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; cursor: pointer; transition: background 0.15s; }
  .li-back-btn:hover{ background: #F1F5F9; }
  .li-disclaimer{ text-align: center; font-size: 12px; color: #9CA3AF; margin: 10px 0 0; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
  .li-file-upload{ position: relative; border: 1.5px dashed #E2E8F0; border-radius: 8px; padding: 20px; text-align: center; transition: border-color 0.15s; cursor: pointer; background: #F9FAFB; }
  .li-file-upload:hover{ border-color: #38BDF8; background: #F0F9FF; }
  .li-file-input{ display: none; }
  .li-file-label{ display: flex; flex-direction: column; align-items: center; gap: 8px; color: #6B7280; font-size: 13px; font-weight: 600; pointer-events: none; }
  .li-file-label svg{ width: 24px; height: 24px; stroke: #6B7280; }
  .li-file-text{ color: #374151; }
  .li-error{ margin: 12px 0 0; padding: 10px 12px; font-size: 12.5px; font-weight: 600; color: #B91C1C; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; text-align: center; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
  .li-result{ margin-top: 16px; padding: 16px; border-radius: 12px; background: #F0FDF4; border: 1px solid #BBF7D0; animation: li-result-in 0.25s ease; }
  @keyframes li-result-in{ from{ opacity: 0; transform: translateY(6px); } to{ opacity: 1; transform: translateY(0); } }
  .li-result-cov{ display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 12px; margin-bottom: 14px; border-bottom: 1px dashed #BBF7D0; }
  .li-result-cov-label{ font-size: 11px; font-weight: 700; color: #15803D; text-transform: uppercase; letter-spacing: 0.05em; }
  .li-result-cov-value{ font-size: 16px; font-weight: 800; color: #0B1F4D; text-align: right; }
  .li-result-grid{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .li-result-box{ background: #fff; border: 1px solid #D1FAE5; border-radius: 10px; padding: 14px 12px; text-align: center; }
  .li-result-amt{ display: block; font-size: 22px; font-weight: 800; color: #047857; line-height: 1.1; word-break: break-word; }
  .li-result-unit{ display: block; font-size: 12px; color: #6B7280; margin-top: 4px; font-weight: 600; }
  .li-result-total{ margin-top: 12px; font-size: 13px; color: #374151; text-align: center; }
  .li-result-total strong{ color: #0B1F4D; font-weight: 800; }
  .li-result-note{ margin: 10px 0 0; font-size: 11px; color: #6B7280; text-align: center; line-height: 1.5; }
  .li-result-cap{ margin: 10px 0 0; padding: 8px 10px; font-size: 11px; font-weight: 600; color: #92400E; background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; text-align: center; line-height: 1.5; }

  /* ═══ HEALTH HERO FORM (Image 1) ═══ */
  .hhf-card {
    background: #fff;
    border-radius: 16px;
    padding: 28px 24px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.28);
    width: 100%;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  }
  .hhf-title {
    font-size: 17px;
    font-weight: 900;
    color: #0B1F4D;
    line-height: 1.35;
    margin: 0 0 20px;
    text-transform: uppercase;
    letter-spacing: 0.01em;
  }
  .hhf-field { display: block; margin-bottom: 14px; }
  .hhf-label { display: block; font-size: 13px; font-weight: 700; color: #1F2937; margin-bottom: 6px; }
  .hhf-req { color: #EF4444; margin-left: 2px; }
  .hhf-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    color: #1F2937;
    background: #F8FAFC;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.15s, background 0.15s;
    box-sizing: border-box;
  }
  .hhf-input:focus { border-color: #0D9488; background: #fff; }
  .hhf-input::placeholder { color: #9CA3AF; }
  .hhf-phone-wrap { display: flex; align-items: stretch; gap: 0; }
  .hhf-phone-prefix {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 11px 12px;
    background: #F3F4F6;
    border: 1.5px solid #E2E8F0;
    border-right: none;
    border-radius: 8px 0 0 8px;
    font-size: 14px;
    font-weight: 700;
    color: #374151;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .hhf-flag { font-size: 16px; }
  .hhf-isd { font-size: 13px; font-weight: 700; color: #374151; }
  .hhf-phone-input { border-radius: 0 8px 8px 0 !important; }
  .hhf-textarea {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    color: #1F2937;
    background: #F8FAFC;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    outline: none;
    resize: vertical;
    min-height: 76px;
    line-height: 1.5;
    transition: border-color 0.15s, background 0.15s;
    box-sizing: border-box;
  }
  .hhf-textarea:focus { border-color: #0D9488; background: #fff; }
  .hhf-textarea::placeholder { color: #9CA3AF; }
  /* Callback banner */
  .hhf-checkbox-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #FFFBEB;
    border: 1.5px solid #FDE68A;
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    user-select: none;
  }
  .hhf-checkbox-banner--active { background: #ECFDF5; border-color: #6EE7B7; }
  .hhf-custom-checkbox {
    width: 22px; height: 22px;
    border-radius: 6px;
    border: 2px solid #D1D5DB;
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.15s, background 0.15s;
  }
  .hhf-custom-checkbox--checked { border-color: #0D9488; background: #0D9488; }
  .hhf-custom-checkbox--sm { width: 18px; height: 18px; border-radius: 4px; }
  .hhf-check-inner { color: #fff; font-size: 12px; font-weight: 800; line-height: 1; }
  .hhf-checkbox-text { font-size: 13px; color: #374151; line-height: 1.4; }
  /* Terms row */
  .hhf-terms-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    cursor: pointer;
    user-select: none;
  }
  .hhf-terms-text { font-size: 12.5px; color: #6B7280; line-height: 1.4; }
  .hhf-error { margin: 10px 0 6px; padding: 10px 12px; font-size: 12.5px; font-weight: 600; color: #B91C1C; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; text-align: center; }
  .hhf-submit {
    width: 100%;
    padding: 14px;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    cursor: pointer;
    transition: filter 0.2s, transform 0.15s;
    margin-top: 2px;
  }
  .hhf-submit:hover { filter: brightness(0.9); transform: translateY(-1px); }

  /* ═══ EXACT QUOTE MODAL (Image 2) ═══ */
  .eqm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(4px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: eqm-fade 0.2s ease;
  }
  @keyframes eqm-fade { from { opacity: 0; } to { opacity: 1; } }
  .eqm-modal {
    background: #fff;
    border-radius: 20px;
    padding: 32px 28px;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 32px 80px rgba(0,0,0,0.3);
    animation: eqm-slide 0.25s ease;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
  }
  @keyframes eqm-slide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .eqm-close {
    position: absolute;
    top: 16px; right: 18px;
    background: #F3F4F6;
    border: none;
    border-radius: 50%;
    width: 32px; height: 32px;
    font-size: 14px;
    cursor: pointer;
    color: #6B7280;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .eqm-close:hover { background: #E5E7EB; color: #374151; }
  .eqm-title { font-size: 20px; font-weight: 900; color: #0B1F4D; margin: 0 0 6px; padding-right: 32px; }
  .eqm-subtitle { font-size: 13px; color: #6B7280; margin: 0 0 20px; line-height: 1.5; }
  .eqm-field { display: block; margin-bottom: 14px; }
  .eqm-label { display: block; font-size: 12.5px; font-weight: 700; color: #1F2937; margin-bottom: 6px; }
  .eqm-req { color: #EF4444; margin-left: 2px; }
  .eqm-input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    color: #1F2937;
    background: #F8FAFC;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .eqm-input:focus { border-color: #0D9488; background: #fff; }
  .eqm-input::placeholder { color: #9CA3AF; }
  .eqm-phone-wrap { display: flex; align-items: stretch; }
  .eqm-phone-prefix {
    display: inline-flex;
    align-items: center;
    padding: 10px 12px;
    background: #F3F4F6;
    border: 1.5px solid #E2E8F0;
    border-right: none;
    border-radius: 8px 0 0 8px;
    font-size: 13px;
    font-weight: 700;
    color: #374151;
    flex-shrink: 0;
  }
  .eqm-phone-input { border-radius: 0 8px 8px 0 !important; }
  /* OTP / last 4 verify */
  .eqm-verify-box {
    background: #F0FDFA;
    border: 1.5px solid #99F6E4;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 14px;
    animation: li-result-in 0.2s ease;
  }
  .eqm-verify-label { display: block; font-size: 13px; font-weight: 700; color: #0D9488; margin-bottom: 12px; }
  .eqm-otp-wrap { display: flex; gap: 10px; margin-bottom: 8px; }
  .eqm-otp-input {
    width: 48px; height: 48px;
    border: 1.5px solid #99F6E4;
    border-radius: 8px;
    text-align: center;
    font-size: 18px;
    font-weight: 800;
    color: #0B1F4D;
    background: #fff;
    outline: none;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    transition: border-color 0.15s;
  }
  .eqm-otp-input:focus { border-color: #0D9488; }
  .eqm-verify-hint { font-size: 11.5px; color: #6B7280; margin: 0; }
  .eqm-select {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #E2E8F0;
    border-radius: 8px;
    font-size: 14px;
    color: #1F2937;
    background: #F8FAFC;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='5 8 10 13 15 8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .eqm-select:focus { border-color: #0D9488; }
  /* callback banner */
  .eqm-callback-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #FFFBEB;
    border: 1.5px solid #FDE68A;
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 14px;
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s, background 0.15s;
  }
  .eqm-callback-banner--active { background: #ECFDF5; border-color: #6EE7B7; }
  .eqm-custom-cb {
    width: 22px; height: 22px;
    border-radius: 6px;
    border: 2px solid #D1D5DB;
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 800;
    color: #fff;
    transition: border-color 0.15s, background 0.15s;
  }
  .eqm-custom-cb--checked { border-color: #0D9488; background: #0D9488; }
  .eqm-cb-text { font-size: 13px; color: #374151; line-height: 1.4; }
  .eqm-error { margin: 8px 0 6px; padding: 10px 12px; font-size: 12.5px; font-weight: 600; color: #B91C1C; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; text-align: center; }
  .eqm-submit {
    width: 100%;
    padding: 14px;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    cursor: pointer;
    margin-top: 4px;
    transition: filter 0.2s;
  }
  .eqm-submit:hover { filter: brightness(0.9); }

  /* ── responsive ── */
  @media(max-width: 1024px){
    .li-inner{ flex-direction: column; align-items: stretch; }
    .li-left, .li-right{ flex: unset; max-width: 100%; width: 100%; }
    .li-left{ padding-top: 40px; text-align: left; margin-bottom: 16px; }
    .li-right{ padding-top: 0; }
    .li-card{ max-width: 560px; margin: 0 auto; }
    .hhf-card{ max-width: 560px; margin: 0 auto; }
    .li-trail{ display: none; }
  }
  @media(max-width: 600px){
    .li-hero{ padding: 40px 16px; }
    .li-title{ font-size: clamp(26px, 8vw, 36px); }
    .li-desc{ font-size: 14px; }
    .li-btn-cta{ width: 100%; justify-content: center; margin-bottom: 28px; }
    .li-stats{ display: none; }
    .li-trail{ display: none; }
    .li-card{ padding: 20px 18px; }
    .hhf-card{ padding: 20px 16px; }
    .hhf-title{ font-size: 15px; }
    .eqm-modal{ padding: 24px 18px; }
    .eqm-otp-wrap{ gap: 8px; }
    .eqm-otp-input{ width: 44px; height: 44px; }
  }
`;