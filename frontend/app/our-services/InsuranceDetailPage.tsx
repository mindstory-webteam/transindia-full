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

// Contact page route — used by every "Talk to an Expert" CTA.
const CONTACT_HREF = "/contact-us";

// Where the "View Plans" button (shown with the estimate) sends the user.
const VIEW_PLANS_HREF = "/our-services";

// Backend base URL. Set NEXT_PUBLIC_API_URL in your .env.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ═════════════════════════════════════════════════════════════════════════════
// SERVICE FORM TYPE DEFINITIONS
// ═════════════════════════════════════════════════════════════════════════════

type FieldType = "text" | "email" | "tel" | "date" | "select" | "textarea" | "file";
type FormType = "calculator" | "motor" | "miscellaneous" | "simple";

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

const pct = (n: number): string => `${(n * 100).toFixed(2)}%`;

const GST = 1.18;

// ── Shared contact fields (Step 1 — same for every service) ──────────────────
const CONTACT_FIELDS: CalcFieldDef[] = [
  { label: "Full Name", type: "text", stateKey: "name", defaultValue: "" },
  { label: "Email Address", type: "email", stateKey: "email", defaultValue: "" },
  { label: "Phone Number", type: "tel", stateKey: "phone", defaultValue: "" },
];

// Reusable address field used in several "about you" steps.
const ADDRESS_FIELD: CalcFieldDef = {
  label: "Address", type: "textarea", stateKey: "address", defaultValue: "",
};

// ═════════════════════════════════════════════════════════════════════════════
// SERVICE CONFIGURATIONS
// ═════════════════════════════════════════════════════════════════════════════

const SERVICE_CALCS: Record<string, ServiceCalc> = {
  // ─── LIFE ──────────────────────────────────────────────────────────────────
  "life-insurance": {
    formType: "calculator",
    cardTitle: "Calculate your premium",
    submitLabel: "Get My Quote",
    submitBg: "#1B8A3A",
    aboutTitle: "Tell us about yourself",
    aboutFields: [
      { label: "Date of Birth", type: "date", stateKey: "dob", defaultValue: "" },
      { label: "Marital Status", type: "select", options: ["Married", "Unmarried"], stateKey: "marital", defaultValue: "Unmarried" },
      ADDRESS_FIELD,
      { label: "Gender", type: "select", options: ["Male", "Female"], stateKey: "gender", defaultValue: "Male" },
    ],
    quoteFields: [
      { label: "Smoker", type: "select", options: ["No", "Yes"], stateKey: "smoker", defaultValue: "No" },
      { label: "Sum Assured Required", type: "select", options: ["₹25 Lakh", "₹50 Lakh", "₹1 crore", "₹2 crore", "₹5 crore"], stateKey: "sumAssured", defaultValue: "₹1 crore" },
      { label: "Policy Term", type: "select", options: ["10 years", "20 years", "30 years", "40 years"], stateKey: "term", defaultValue: "30 years" },
      { label: "Annual Income", type: "select", options: ["Below ₹6 Lakh", "₹6-12 Lakh", "₹12-25 Lakh", "₹25 Lakh+"], stateKey: "income", defaultValue: "₹6-12 Lakh" },
    ],
    compute: (v) => {
      const sumMap: Record<string, number> = { "₹25 Lakh": 2500000, "₹50 Lakh": 5000000, "₹1 crore": 10000000, "₹2 crore": 20000000, "₹5 crore": 50000000 };
      const incMap: Record<string, number> = { "Below ₹6 Lakh": 500000, "₹6-12 Lakh": 900000, "₹12-25 Lakh": 1800000, "₹25 Lakh+": 3000000 };
      let sum = sumMap[v.sumAssured] ?? 10000000;
      const age = ageFromDOB(v.dob) ?? 30;
      const term = parseInt((v.term || "").replace(/\D/g, ""), 10) || 20;
      const smoker = v.smoker === "Yes";
      const female = v.gender === "Female";
      const income = incMap[v.income];

      let note: string | undefined;
      if (income) {
        const mult = age <= 35 ? 25 : age <= 45 ? 20 : age <= 55 ? 15 : 10;
        const maxCover = mult * income;
        if (sum > maxCover) { sum = maxCover; note = `Coverage capped to ${fmt(maxCover)} — the maximum eligible for your income.`; }
      }
      const baseRate = age <= 25 ? 0.85 : age <= 30 ? 1.05 : age <= 35 ? 1.45 : age <= 40 ? 2.1 : age <= 45 ? 3.2 : age <= 50 ? 4.9 : age <= 55 ? 7.8 : age <= 60 ? 12 : 18;
      const termFactor = term <= 10 ? 0.8 : term <= 20 ? 0.95 : term <= 30 ? 1.1 : term <= 40 ? 1.28 : 1.45;
      const yearly = (sum / 1000) * baseRate * (female ? 0.87 : 1) * (smoker ? 1.55 : 1) * termFactor * GST;
      return {
        coverageCaption: "Your coverage",
        coverageLabel: note ? fmt(sum) : v.sumAssured,
        primaryAmount: fmt(yearly / 12), primaryUnit: "per month",
        secondaryAmount: fmt(yearly), secondaryUnit: "per year",
        totalLabel: "Total over term", total: fmt(yearly * term),
        note,
        disclaimer: "Estimated premium incl. 18% GST. Final price depends on underwriting & medical checks.",
      };
    },
  },

  // ─── HEALTH ────────────────────────────────────────────────────────────────
  "health-insurance": {
    formType: "calculator",
    cardTitle: "Get your health quote",
    submitLabel: "Get My Health Quote",
    submitBg: "#0D9488",
    aboutTitle: "Tell us about yourself",
    aboutFields: [
      { label: "Date of Birth", type: "date", stateKey: "dob", defaultValue: "" },
      { label: "Gender", type: "select", options: ["Male", "Female"], stateKey: "gender", defaultValue: "Male" },
      ADDRESS_FIELD,
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

  // ─── MOTOR ─────────────────────────────────────────────────────────────────
  "motor-insurance": {
    formType: "motor",
    cardTitle: "Get your motor insurance quote",
    submitLabel: "Submit Motor Quote",
    submitBg: "#EA580C",
    description: "Upload your old insurance document and provide your policy number for a quick quote comparison.",
  },

  // ─── HOME ──────────────────────────────────────────────────────────────────
  "home-insurance": {
    formType: "simple",
    cardTitle: "Get your home insurance quote",
    submitLabel: "Get Home Quote",
    submitBg: "#7C3AED",
    description: "Our insurance experts will help you find the perfect home coverage. Share your details and we'll prepare a personalized quote.",
  },

  // ─── TRAVEL ────────────────────────────────────────────────────────────────
  "travel-insurance": {
    formType: "simple",
    cardTitle: "Plan your travel cover",
    submitLabel: "Get Travel Quote",
    submitBg: "#0891B2",
    description: "Get instant travel insurance quotes for domestic and international trips. Quick approval, hassle-free claims.",
  },

  // ─── MARINE ────────────────────────────────────────────────────────────────
  "marine-insurance": {
    formType: "simple",
    cardTitle: "Get your marine quote",
    submitLabel: "Get Marine Quote",
    submitBg: "#0369A1",
    description: "Protect your cargo with comprehensive marine insurance. Our experts will assess your cargo and provide the best coverage.",
  },

  // ─── FIRE ──────────────────────────────────────────────────────────────────
  "fire-insurance": {
    formType: "simple",
    cardTitle: "Calculate fire premium",
    submitLabel: "Get Fire Quote",
    submitBg: "#DC2626",
    description: "Safeguard your property and business assets with our fire insurance. Get a customized quote in minutes.",
  },

  // ─── MISCELLANEOUS ─────────────────────────────────────────────────────────
  "miscellaneous-insurance": {
    formType: "miscellaneous",
    cardTitle: "Find your cover",
    submitLabel: "Get a Quote",
    submitBg: "#4F46E5",
    description: "Specialized coverage for your unique business needs.",
  },

  // ─── ENTERTAINMENT ─────────────────────────────────────────────────────────
  "entertainment-insurance": {
    formType: "simple",
    cardTitle: "Insure your production",
    submitLabel: "Get Production Quote",
    submitBg: "#9333EA",
    description: "Complete insurance coverage for your film, TV, and entertainment productions. Protect your cast, crew, and equipment.",
  },

  // ─── RISK CONSULTATION (free) ────────────────────────────────────────────────
  "risk-consultation": {
    formType: "simple",
    cardTitle: "Book your free assessment",
    submitLabel: "Book Free Session",
    submitBg: "#1E293B",
    description: "Get a personalized risk assessment and portfolio review from our experts. Free consultation, no obligation.",
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// CALCULATOR CARD — for "calculator" formType only
// ═════════════════════════════════════════════════════════════════════════════
function CalculatorCard({ slug, serviceTitle }: { slug: string; serviceTitle: string }) {
  const config = SERVICE_CALCS[slug] ?? SERVICE_CALCS["life-insurance"];

  if (config.formType !== "calculator" || !config.compute || !config.quoteFields || !config.aboutFields) {
    return null;
  }

  const step1Fields = CONTACT_FIELDS;
  const step2Fields = config.aboutFields;
  const step3Fields = config.quoteFields;
  const fields = [...step1Fields, ...step2Fields, ...step3Fields];

  const initialState: Values = {};
  fields.forEach((f) => { initialState[f.stateKey] = f.defaultValue; });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<Values>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<(CalcResult & { to?: string }) | null>(null);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setResult(null);
    setError(null);
  };

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
  const goToStep3 = () => { setError(null); setStep(3); };
  const handleRetry = () => { setResult(null); setError(null); setStep(3); };

  const calculate = async () => {
    if (!validateContact()) { setResult(null); setStep(1); return; }

    const estimate = config.compute!(values);
    setResult({ ...estimate, to: (values.email || "").trim() });

    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/serviceleads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          estimate,
          serviceSlug: slug,
          serviceTitle,
          source: "website",
        }),
      });
    } catch (e) {
      console.error("Service lead submit failed:", e);
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
            <input
              type="date"
              value={values[field.stateKey]}
              onChange={(e) => handleChange(field.stateKey, e.target.value)}
              className="li-input"
            />
            <svg className="li-calendar-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </label>
      );
    }

    if (field.type === "select") {
      return (
        <label className="li-field" key={field.stateKey}>
          <span className="li-label">{field.label}</span>
          <select
            value={values[field.stateKey]}
            onChange={(e) => handleChange(field.stateKey, e.target.value)}
            className="li-select"
          >
            {field.options?.map((o, oi) => (
              <option key={`${field.stateKey}-${oi}`}>{o}</option>
            ))}
          </select>
        </label>
      );
    }

    if (field.type === "textarea") {
      return (
        <label className="li-field" key={field.stateKey}>
          <span className="li-label">{field.label}</span>
          <textarea
            value={values[field.stateKey]}
            onChange={(e) => handleChange(field.stateKey, e.target.value)}
            className="li-textarea"
            rows={2}
            placeholder="House no, street, city, pincode"
          />
        </label>
      );
    }

    return (
      <label className="li-field" key={field.stateKey}>
        <span className="li-label">{field.label}</span>
        <input
          type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text"}
          inputMode={field.type === "tel" ? "tel" : undefined}
          value={values[field.stateKey]}
          onChange={(e) => handleChange(field.stateKey, e.target.value)}
          className="li-textfield"
          placeholder={field.label}
        />
      </label>
    );
  };

  const StepDot = ({ n, label }: { n: 1 | 2 | 3; label: string }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: step >= n ? "#0B1F4D" : "#9CA3AF", whiteSpace: "nowrap" }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 800, background: step >= n ? config.submitBg : "#E5E7EB", color: step >= n ? "#fff" : "#6B7280", flexShrink: 0 }}>
        {step > n ? "✓" : n}
      </span>
      {label}
    </span>
  );

  const currentFields = step === 1 ? step1Fields : step === 2 ? step2Fields : step3Fields;
  const cardTitle = step === 1 ? "How can we reach you?" : step === 2 ? config.aboutTitle : config.cardTitle;
  const showingResult = step === 3 && !!result;

  return (
    <div className="li-card">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <StepDot n={1} label="Contact" />
        <span style={{ flex: 1, height: 2, background: "#E2E8F0", borderRadius: 2 }} />
        <StepDot n={2} label="About you" />
        <span style={{ flex: 1, height: 2, background: "#E2E8F0", borderRadius: 2 }} />
        <StepDot n={3} label="Quote" />
      </div>

      <h2 className="li-card-title">
        {showingResult ? "Your estimated premium" : cardTitle}
      </h2>

      {!showingResult && (
        <>
          {currentFields.map(renderField)}

          {step === 1 && (
            <button className="li-submit" style={{ background: config.submitBg }} onClick={goToStep2} type="button">
              Continue
            </button>
          )}

          {step === 2 && (
            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <button type="button" onClick={() => setStep(1)} className="li-back-btn">Back</button>
              <button className="li-submit" style={{ background: config.submitBg, flex: 1, width: "auto", marginTop: 0 }} onClick={goToStep3} type="button">
                Continue
              </button>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <button type="button" onClick={() => setStep(2)} className="li-back-btn">Back</button>
              <button
                className="li-submit"
                style={{ background: config.submitBg, flex: 1, width: "auto", marginTop: 0, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                onClick={calculate}
                disabled={submitting}
                type="button"
              >
                {submitting ? "Saving…" : config.submitLabel}
              </button>
            </div>
          )}

          {error && <p className="li-error">{error}</p>}
          <p className="li-disclaimer">No spam. No calls unless you want.</p>
        </>
      )}

      {showingResult && result && (
        <>
          <div className="li-result">
            <div className="li-result-cov">
              <span className="li-result-cov-label">{result.coverageCaption}</span>
              <span className="li-result-cov-value">{result.coverageLabel}</span>
            </div>
            <div className="li-result-grid">
              <div className="li-result-box">
                <span className="li-result-amt">{result.primaryAmount}</span>
                <span className="li-result-unit">{result.primaryUnit}</span>
              </div>
              <div className="li-result-box">
                <span className="li-result-amt">{result.secondaryAmount}</span>
                <span className="li-result-unit">{result.secondaryUnit}</span>
              </div>
            </div>
            {result.total && (
              <div className="li-result-total">
                {result.totalLabel ?? "Total"}: <strong>{result.total}</strong>
              </div>
            )}
            {result.note && <p className="li-result-cap">{result.note}</p>}
            <p className="li-result-note">{result.disclaimer}</p>
            {result.to && (
              <p className="li-result-note">We'll share this estimate with you at {result.to}.</p>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button type="button" onClick={handleRetry} className="li-back-btn">Retry</button>
            <Link href={VIEW_PLANS_HREF} className="li-submit li-submit-link" style={{ background: config.submitBg, flex: 1, width: "auto", marginTop: 0 }}>
              Compare Plans
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SIMPLE FORM CARD — for "simple" formType
// ═════════════════════════════════════════════════════════════════════════════
function SimpleFormCard({ slug, serviceTitle, config }: { slug: string; serviceTitle: string; config: ServiceCalc }) {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (phoneDigits.length < 10) { setError("Please enter a valid 10-digit phone number."); return false; }
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
        body: JSON.stringify({
          ...values,
          serviceSlug: slug,
          serviceTitle,
          source: "website",
        }),
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
      <div className="li-card">
        <div className="li-result" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginBottom: 12, marginTop: 0 }}>Thank you!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
            We've received your information. Our insurance experts will reach out to you shortly with a personalized quote.
          </p>
          <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 0 }}>
            Quote sent to: <strong>{values.email}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" onClick={() => { setSubmitted(false); setValues({ name: "", email: "", phone: "" }); }} className="li-back-btn">
            New Quote
          </button>
          <Link href={VIEW_PLANS_HREF} className="li-submit li-submit-link" style={{ background: config.submitBg, flex: 1, width: "auto", marginTop: 0 }}>
           Compare Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="li-card">
      <h2 className="li-card-title">{config.cardTitle}</h2>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18, marginTop: 0 }}>{config.description}</p>

      <label className="li-field">
        <span className="li-label">Full Name</span>
        <input
          type="text"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="li-textfield"
          placeholder="Your name"
        />
      </label>

      <label className="li-field">
        <span className="li-label">Email Address</span>
        <input
          type="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="li-textfield"
          placeholder="your@email.com"
        />
      </label>

      <label className="li-field">
        <span className="li-label">Phone Number</span>
        <input
          type="tel"
          inputMode="tel"
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="li-textfield"
          placeholder="+91"
        />
      </label>

      <button
        className="li-submit"
        style={{ background: config.submitBg, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
        onClick={handleSubmit}
        disabled={submitting}
        type="button"
      >
        {submitting ? "Sending…" : config.submitLabel}
      </button>

      {error && <p className="li-error">{error}</p>}
      <p className="li-disclaimer">No spam. No calls unless you want.</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MOTOR FORM CARD — for "motor" formType
// ═════════════════════════════════════════════════════════════════════════════
function MotorFormCard({ slug, serviceTitle, config }: { slug: string; serviceTitle: string; config: ServiceCalc }) {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    insuranceNumber: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setFile(f);
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    const name = (values.name || "").trim();
    const email = (values.email || "").trim();
    const phoneDigits = (values.phone || "").replace(/\D/g, "");
    const insNumber = (values.insuranceNumber || "").trim();
    
    if (!name) { setError("Please enter your name."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (phoneDigits.length < 10) { setError("Please enter a valid 10-digit phone number."); return false; }
    if (!insNumber) { setError("Please enter your insurance policy number."); return false; }
    if (!file) { setError("Please upload your old insurance document."); return false; }
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
      formData.append("insuranceNumber", values.insuranceNumber);
      formData.append("serviceSlug", slug);
      formData.append("serviceTitle", serviceTitle);
      formData.append("source", "website");
      if (file) formData.append("insuranceDocument", file);

      await fetch(`${API_BASE}/serviceleads`, {
        method: "POST",
        body: formData,
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
      <div className="li-card">
        <div className="li-result" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginBottom: 12, marginTop: 0 }}>Quote Request Received!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
            Thank you for uploading your insurance document. Our team will compare quotes and send you the best options shortly.
          </p>
          <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 0 }}>
            Policy #: <strong>{values.insuranceNumber}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" onClick={() => { setSubmitted(false); setValues({ name: "", email: "", phone: "", insuranceNumber: "" }); setFile(null); }} className="li-back-btn">
            New Quote
          </button>
          <Link href={VIEW_PLANS_HREF} className="li-submit li-submit-link" style={{ background: config.submitBg, flex: 1, width: "auto", marginTop: 0 }}>
           Compare Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="li-card">
      <h2 className="li-card-title">{config.cardTitle}</h2>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18, marginTop: 0 }}>{config.description}</p>

      <label className="li-field">
        <span className="li-label">Full Name</span>
        <input
          type="text"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="li-textfield"
          placeholder="Your name"
        />
      </label>

      <label className="li-field">
        <span className="li-label">Email Address</span>
        <input
          type="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="li-textfield"
          placeholder="your@email.com"
        />
      </label>

      <label className="li-field">
        <span className="li-label">Phone Number</span>
        <input
          type="tel"
          inputMode="tel"
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="li-textfield"
          placeholder="+91"
        />
      </label>

      <label className="li-field">
        <span className="li-label">Insurance Policy Number</span>
        <input
          type="text"
          value={values.insuranceNumber}
          onChange={(e) => handleChange("insuranceNumber", e.target.value)}
          className="li-textfield"
          placeholder="e.g., POL123456789"
        />
      </label>

      <label className="li-field">
        <span className="li-label">Upload Old Insurance Document</span>
        <div className="li-file-upload">
          <input
            type="file"
            onChange={handleFileChange}
            className="li-file-input"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <div className="li-file-label">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="li-file-text">
              {file ? file.name : "Click or drag to upload (PDF, JPG, PNG)"}
            </span>
          </div>
        </div>
      </label>

      <button
        className="li-submit"
        style={{ background: config.submitBg, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
        onClick={handleSubmit}
        disabled={submitting}
        type="button"
      >
        {submitting ? "Sending…" : config.submitLabel}
      </button>

      {error && <p className="li-error">{error}</p>}
      <p className="li-disclaimer">No spam. No calls unless you want.</p>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MISCELLANEOUS FORM CARD — for "miscellaneous" formType
// ═════════════════════════════════════════════════════════════════════════════
function MiscellaneousFormCard({ slug, serviceTitle, config }: { slug: string; serviceTitle: string; config: ServiceCalc }) {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    insuranceTypes: "",
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
      await fetch(`${API_BASE}/serviceleads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          serviceSlug: slug,
          serviceTitle,
          source: "website",
        }),
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
      <div className="li-card">
        <div className="li-result" style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#047857", marginBottom: 12, marginTop: 0 }}>Thank you!</h2>
          <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
            We've received your inquiry. Our insurance experts will assess your needs and provide the best coverage options.
          </p>
          <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 0 }}>
            We'll contact you at: <strong>{values.email}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button type="button" onClick={() => { setSubmitted(false); setValues({ name: "", email: "", phone: "", insuranceTypes: "" }); }} className="li-back-btn">
            New Inquiry
          </button>
          <Link href={VIEW_PLANS_HREF} className="li-submit li-submit-link" style={{ background: config.submitBg, flex: 1, width: "auto", marginTop: 0 }}>
           Compare Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="li-card">
      <h2 className="li-card-title">{config.cardTitle}</h2>
      <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 18, marginTop: 0 }}>{config.description}</p>

      <label className="li-field">
        <span className="li-label">Full Name</span>
        <input
          type="text"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="li-textfield"
          placeholder="Your name"
        />
      </label>

      <label className="li-field">
        <span className="li-label">Email Address</span>
        <input
          type="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="li-textfield"
          placeholder="your@email.com"
        />
      </label>

      <label className="li-field">
        <span className="li-label">Phone Number</span>
        <input
          type="tel"
          inputMode="tel"
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="li-textfield"
          placeholder="+91"
        />
      </label>

      <label className="li-field">
        <span className="li-label">Insurance Types & Requirements</span>
        <textarea
          value={values.insuranceTypes}
          onChange={(e) => handleChange("insuranceTypes", e.target.value)}
          className="li-textarea"
          rows={4}
          placeholder="Tell us about your insurance needs. E.g., Burglary coverage, Professional indemnity, Employee welfare, etc."
        />
      </label>

      <button
        className="li-submit"
        style={{ background: config.submitBg, opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
        onClick={handleSubmit}
        disabled={submitting}
        type="button"
      >
        {submitting ? "Sending…" : config.submitLabel}
      </button>

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

            {/* RIGHT — render appropriate form based on formType */}
            <div className="li-right">
              {config.formType === "calculator" && <CalculatorCard slug={slug} serviceTitle={data.title || data.heroBadgeText} />}
              {config.formType === "simple" && <SimpleFormCard slug={slug} serviceTitle={data.title || data.heroBadgeText} config={config} />}
              {config.formType === "motor" && <MotorFormCard slug={slug} serviceTitle={data.title || data.heroBadgeText} config={config} />}
              {config.formType === "miscellaneous" && <MiscellaneousFormCard slug={slug} serviceTitle={data.title || data.heroBadgeText} config={config} />}
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
              <div className="flex-1 flex justify-center items-center h-96">
                {data.whyImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.whyImage} alt={data.whyTitle || "illustration"} className="w-full h-full object-cover rounded-3xl shadow-sm" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center text-6xl">
                    {data.benefits[0]?.emoji ?? "🛡️"}
                  </div>
                )}
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
                  <div className={`${b.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl overflow-hidden`}>
                    {b.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.icon} alt={b.title} className="w-8 h-8 object-contain" />
                    ) : (
                      b.emoji
                    )}
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
                  <div className="mb-6 text-3xl h-10 flex items-center">
                    {stage.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={stage.icon} alt={stage.title} className="w-10 h-10 object-contain" />
                    ) : (
                      stage.emoji
                    )}
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

  /* ── calculator card ── */
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

  /* ── file upload ── */
  .li-file-upload{ position: relative; border: 1.5px dashed #E2E8F0; border-radius: 8px; padding: 20px; text-align: center; transition: border-color 0.15s; cursor: pointer; background: #F9FAFB; }
  .li-file-upload:hover{ border-color: #38BDF8; background: #F0F9FF; }
  .li-file-input{ display: none; }
  .li-file-label{ display: flex; flex-direction: column; align-items: center; gap: 8px; color: #6B7280; font-size: 13px; font-weight: 600; pointer-events: none; }
  .li-file-label svg{ width: 24px; height: 24px; stroke: #6B7280; }
  .li-file-text{ color: #374151; }

  /* ── inline validation message ── */
  .li-error{ margin: 12px 0 0; padding: 10px 12px; font-size: 12.5px; font-weight: 600; color: #B91C1C; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; text-align: center; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }

  /* ── premium estimate result panel ── */
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
    .li-trail{ display: none; }
    .li-card{ padding: 20px 18px; }
  }
`;