"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import BmiInfoSection from "./BmiInfoSection";

/* ============================================================================
   API BASE URL  — set NEXT_PUBLIC_API_URL in your .env.local
   Works whether the value includes "/api" or not, e.g.
     NEXT_PUBLIC_API_URL=http://localhost:5000
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ========================================================================== */
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// Drop trailing slashes and a trailing "/api" so we never build /api/api/leads
const API_BASE = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

/* ============================================================================
   TYPES
   ========================================================================== */

type Gender = "male" | "female";

interface BmiResult {
  bmi: number;
  category: string;
  healthyWeightLow: number;
  healthyWeightHigh: number;
  weightToHealthy: number;
  action: "lose" | "gain" | "maintain" | null;
}

/* ============================================================================
   PLANS POPUP MODAL  (PolicyBazaar-style multi-step lead form)
   ========================================================================== */

const MEMBER_OPTIONS = [
  "Self",
  "Wife",
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Grand Father",
  "Grand Mother",
  "Father-in-law",
  "Mother-in-law",
];

const POPULAR_CITIES = [
  "New Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

interface PlansModalProps {
  open: boolean;
  onClose: () => void;
  defaultGender: Gender;
  bmiResult: BmiResult | null;
}

function PlansModal({ open, onClose, defaultGender, bmiResult }: PlansModalProps) {
  const [step, setStep] = useState<number>(1);

  // Step 1 — gender + members
  const [gender, setGender] = useState<Gender>(defaultGender);
  const [members, setMembers] = useState<string[]>(["Self"]);

  // Step 2 — ages keyed by member name
  const [ages, setAges] = useState<Record<string, string>>({});

  // Step 3 — city
  const [city, setCity] = useState<string>("");

  // Step 4 — contact details
  const [fullName, setFullName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Step 5 — medical history
  const [hasIllness, setHasIllness] = useState<"yes" | "no" | "">("");
  const [whatsappUpdates, setWhatsappUpdates] = useState<boolean>(true);

  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!open) return null;

  function resetAndClose() {
    onClose();
    // reset so reopening starts fresh
    setStep(1);
    setGender(defaultGender);
    setMembers(["Self"]);
    setAges({});
    setCity("");
    setFullName("");
    setMobile("");
    setEmail("");
    setHasIllness("");
    setWhatsappUpdates(true);
    setError("");
    setSubmitting(false);
    setSubmitted(false);
  }

  function toggleMember(member: string) {
    setMembers((prev) =>
      prev.includes(member)
        ? prev.filter((m) => m !== member)
        : [...prev, member]
    );
  }

  async function submitLead() {
    setError("");
    if (hasIllness === "") {
      setError("Please select an option.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: fullName.trim(),
        email: email.trim(),
        phone: mobile.trim(),
        gender,
        city: city.trim(),
        members,
        memberAges: members.map((m) => ({
          member: m,
          age: Number(ages[m]) || 0,
        })),
        hasIllness: hasIllness === "yes",
        whatsappUpdates,
        bmi: bmiResult ? bmiResult.bmi : null,
        bmiCategory: bmiResult ? bmiResult.category : "",
      };

      const res = await fetch(`${API_BASE}/api/bmileads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    setError("");

    if (step === 1) {
      if (members.length === 0) {
        setError("Please select at least one member to insure.");
        return;
      }
    }

    if (step === 2) {
      const missing = members.some((m) => !ages[m] || parseInt(ages[m]) <= 0);
      if (missing) {
        setError("Please enter a valid age for each member.");
        return;
      }
    }

    if (step === 3) {
      if (!city.trim()) {
        setError("Please select or enter your city.");
        return;
      }
    }

    if (step === 4) {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!/^[0-9]{10}$/.test(mobile.trim())) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    setStep((s) => s + 1);
  }

  function back() {
    setError("");
    if (step === 1) {
      resetAndClose();
      return;
    }
    setStep((s) => s - 1);
  }

  const stepTitles: Record<number, string> = {
    1: "Find Affordable Plans With up to 25% Discount**",
    2: "This will help us calculate the premium & discounts for your family",
    3: "This will help us find the network of Cashless Hospitals in your city",
    4: "Get to plans directly next time you visit us",
    5: "We will find you the plans that cover your condition",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1B2A4A]/60 backdrop-blur-sm"
        onClick={resetAndClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-15px_rgba(30,41,82,0.45)] mt-18 md:mt-15">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#2C6FE8] px-6 py-5">
          <div>
            <p className="text-[13px] font-medium text-blue-100">
              Health Insurance
            </p>
            <h2 className="text-lg font-extrabold text-white">
              Get the right plan for you & your family
            </h2>
          </div>
          <button
            onClick={resetAndClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="flex gap-1.5 bg-[#F0F4FA] px-6 py-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition ${
                  s <= step ? "bg-[#2C6FE8]" : "bg-[#D7DCE6]"
                }`}
              />
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {submitted ? (
            /* ----- SUCCESS / VIEW PLANS ----- */
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#27AE60]/10">
                <svg className="h-8 w-8 text-[#27AE60]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-[#1B2A4A]">
                Thank you{fullName ? `, ${fullName.split(" ")[0]}` : ""}!
              </h3>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-slate-500">
                We&apos;re fetching the best health insurance plans for you and your
                family. Our advisor will reach out shortly.
              </p>
              <div className="mt-6 w-full max-w-sm rounded-xl bg-[#F0F4FA] p-4 text-left text-sm text-[#1B2A4A]">
                <p><span className="font-semibold">Members:</span> {members.join(", ")}</p>
                <p className="mt-1"><span className="font-semibold">City:</span> {city}</p>
                <p className="mt-1"><span className="font-semibold">Mobile:</span> {mobile}</p>
              </div>
              <button
                onClick={resetAndClose}
                className="mt-7 w-full max-w-sm rounded-lg bg-[#2C6FE8] py-3.5 text-[15px] font-bold text-white shadow-[0_10px_25px_-8px_rgba(44,111,232,0.6)] transition active:scale-[0.99]"
              >
                View Plans
              </button>
            </div>
          ) : (
            <>
              <h3 className="mb-6 text-xl font-extrabold leading-snug text-[#1B2A4A]">
                {stepTitles[step]}
              </h3>

              {/* ---------- STEP 1: GENDER + MEMBERS ---------- */}
              {step === 1 && (
                <div>
                  <div className="mb-6 flex gap-3">
                    {(["male", "female"] as Gender[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 rounded-lg border py-3 text-[15px] font-semibold capitalize transition ${
                          gender === g
                            ? "border-[#2C6FE8] bg-[#2C6FE8]/5 text-[#2C6FE8]"
                            : "border-[#D7DCE6] text-[#1B2A4A] hover:border-[#2C6FE8]/50"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <p className="mb-3 text-[15px] font-semibold text-[#1B2A4A]">
                    Select members you want to insure
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {MEMBER_OPTIONS.map((member) => {
                      const active = members.includes(member);
                      return (
                        <button
                          key={member}
                          onClick={() => toggleMember(member)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[14px] font-medium transition ${
                            active
                              ? "border-[#2C6FE8] bg-[#2C6FE8]/5 text-[#2C6FE8]"
                              : "border-[#D7DCE6] text-[#1B2A4A] hover:border-[#2C6FE8]/50"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              active
                                ? "border-[#2C6FE8] bg-[#2C6FE8]"
                                : "border-[#D7DCE6]"
                            }`}
                          >
                            {active && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          {member}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ---------- STEP 2: AGES ---------- */}
              {step === 2 && (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member} className="flex items-center justify-between gap-4">
                      <span className="text-[15px] font-medium text-[#1B2A4A]">
                        {member}&apos;s age
                      </span>
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Age"
                        value={ages[member] || ""}
                        onChange={(e) =>
                          setAges((prev) => ({ ...prev, [member]: e.target.value }))
                        }
                        className="w-32 rounded-lg border border-[#D7DCE6] px-4 py-2.5 text-[15px] text-[#1B2A4A] placeholder:text-[#6B7280] outline-none transition focus:border-[#2C6FE8] focus:ring-2 focus:ring-[#2C6FE8]/20"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ---------- STEP 3: CITY ---------- */}
              {step === 3 && (
                <div>
                  <input
                    type="text"
                    placeholder="Enter City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mb-5 w-full rounded-lg border border-[#D7DCE6] px-4 py-3.5 text-[15px] text-[#1B2A4A] placeholder:text-[#6B7280] outline-none transition focus:border-[#2C6FE8] focus:ring-2 focus:ring-[#2C6FE8]/20"
                  />
                  <p className="mb-3 text-[14px] font-semibold text-[#5B6478]">
                    Popular Cities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCity(c)}
                        className={`rounded-full border px-4 py-2 text-[14px] font-medium transition ${
                          city === c
                            ? "border-[#2C6FE8] bg-[#2C6FE8]/5 text-[#2C6FE8]"
                            : "border-[#D7DCE6] text-[#1B2A4A] hover:border-[#2C6FE8]/50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------- STEP 4: CONTACT ---------- */}
              {step === 4 && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-[#D7DCE6] px-4 py-3.5 text-[15px] text-[#1B2A4A] placeholder:text-[#6B7280] outline-none transition focus:border-[#2C6FE8] focus:ring-2 focus:ring-[#2C6FE8]/20"
                  />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-lg border border-[#D7DCE6] px-4 py-3.5 text-[15px] text-[#1B2A4A] placeholder:text-[#6B7280] outline-none transition focus:border-[#2C6FE8] focus:ring-2 focus:ring-[#2C6FE8]/20"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-[#D7DCE6] px-4 py-3.5 text-[15px] text-[#1B2A4A] placeholder:text-[#6B7280] outline-none transition focus:border-[#2C6FE8] focus:ring-2 focus:ring-[#2C6FE8]/20"
                  />
                </div>
              )}

              {/* ---------- STEP 5: MEDICAL HISTORY ---------- */}
              {step === 5 && (
                <div>
                  <p className="mb-4 text-[15px] text-[#5B6478]">
                    Do any member(s) have any existing illnesses for which they take
                    regular medication?
                  </p>
                  <div className="mb-6 flex gap-3">
                    {(["yes", "no"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setHasIllness(opt)}
                        className={`flex-1 rounded-lg border py-3 text-[15px] font-semibold capitalize transition ${
                          hasIllness === opt
                            ? "border-[#2C6FE8] bg-[#2C6FE8]/5 text-[#2C6FE8]"
                            : "border-[#D7DCE6] text-[#1B2A4A] hover:border-[#2C6FE8]/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      checked={whatsappUpdates}
                      onChange={(e) => setWhatsappUpdates(e.target.checked)}
                      className="h-5 w-5 cursor-pointer rounded accent-[#2C6FE8]"
                    />
                    <span className="text-[15px] text-[#1B2A4A]">
                      Get Updates on WhatsApp
                    </span>
                  </label>
                </div>
              )}

              {error && (
                <p className="mt-5 text-sm font-medium text-[#EB5757]">{error}</p>
              )}
            </>
          )}
        </div>

        {/* Footer / Nav */}
        {!submitted && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <button
              onClick={back}
              disabled={submitting}
              className="text-[15px] font-semibold text-[#5B6478] transition hover:text-[#1B2A4A] disabled:opacity-50"
            >
              {step === 1 ? "Cancel" : "Previous step"}
            </button>
            <button
              onClick={step === 5 ? submitLead : next}
              disabled={submitting}
              className="rounded-lg bg-[#2C6FE8] px-7 py-2.5 text-[15px] font-bold text-white shadow-[0_10px_25px_-8px_rgba(44,111,232,0.6)] transition active:scale-[0.99] disabled:opacity-60"
            >
              {step === 5 ? (submitting ? "Submitting…" : "View Plans") : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   BMI RESULT CARD
   ========================================================================== */

interface BmiResultCardProps {
  result: BmiResult;
  onRecalculate: () => void;
  onViewPlans: () => void;
}

const RESULT_CONTENT: Record<string, any> = {
  Underweight: {
    heading: "Take care,",
    title: "Your BMI is\nbelow normal",
    titleColor: "text-[#F2994A]",
    subtext: "Nourish your body, rebuild strength, & protect your health with reliable health insurance.",
    features: ["OPD cover", "FREE annual health checkup", "Tax benefits up to ₹1 Lakh"],
  },
  Normal: {
    heading: "Good job,",
    title: "Your BMI is\nhealthy!",
    titleColor: "text-[#27AE60]",
    subtext: "Stay on track with nutritious meals, regular workouts, and ideal health coverage",
    features: ["OPD cover", "FREE annual health checkup", "Tax benefits up to ₹1 Lakh"],
  },
  Overweight: {
    heading: "Be mindful,",
    title: "Your BMI is\nslightly high",
    titleColor: "text-[#F2994A]",
    subtext: "Eat healthy, stay active, and protect your health with the right insurance support",
    features: ["OPD cover", "PED Cover from Day 1*", "Zero waiting period"],
  },
  Obesity: {
    heading: "Take action,",
    title: "Your BMI is\nhigh",
    titleColor: "text-[#EB5A2B]",
    subtext: "Take the first step toward better health, eat mindfully, stay active, and choose a plan that supports your journey.",
    features: ["OPD cover", "PED Cover from Day 1*", "Zero waiting period"],
  }
};

function BmiResultCard({ result, onRecalculate, onViewPlans }: BmiResultCardProps) {
  const content = RESULT_CONTENT[result.category] || RESULT_CONTENT.Normal;

  return (
    <article className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col">
        <p className="text-[#1B2A4A] font-semibold">{content.heading}</p>
        <h2 className={`mt-1 text-2xl font-extrabold whitespace-pre-line ${content.titleColor}`}>
          {content.title}
        </h2>
      </div>

      <p className="mt-4 text-[15px] text-slate-500 leading-relaxed">
        {content.subtext}
      </p>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-sm font-semibold text-slate-900">Things to look for</p>
        </div>
        <ul className="mt-4 space-y-3">
          {content.features.map((feature: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2 text-[14px] text-slate-600">
              <img
                src="/images/claims/insurance-claim-section/green-tick.svg"
                alt="✓"
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span dangerouslySetInnerHTML={{ __html: feature.replace("FREE", "<span class='text-[#27AE60] font-bold'>FREE</span>") }} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button 
          onClick={onRecalculate}
          className="flex items-center gap-1.5 text-sm font-semibold text-[#2C6FE8]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Re-calculate
        </button>
        <button
          onClick={onViewPlans}
          className="rounded-lg bg-[#2C6FE8] px-6 py-2.5 text-[15px] font-bold text-white shadow-[0_10px_25px_-8px_rgba(44,111,232,0.6)] transition "
        >
          View plans
        </button>
      </div>
    </article>
  );
}


function calculateBmi(heightCm: number, weightKg: number): BmiResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  const healthyWeightLow = 18.5 * heightM * heightM;
  const healthyWeightHigh = 24.9 * heightM * heightM;

  let category = "Normal";
  let action: BmiResult["action"] = "maintain";
  let weightToHealthy = 0;

  if (bmi < 18.5) {
    category = "Underweight";
    action = "gain";
    weightToHealthy = healthyWeightLow - weightKg;
  } else if (bmi < 25) {
    category = "Normal";
    action = "maintain";
    weightToHealthy = 0;
  } else if (bmi < 30) {
    category = "Overweight";
    action = "lose";
    weightToHealthy = weightKg - healthyWeightHigh;
  } else {
    category = "Obesity";
    action = "lose";
    weightToHealthy = weightKg - healthyWeightHigh;
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    healthyWeightLow: Math.round(healthyWeightLow),
    healthyWeightHigh: Math.round(healthyWeightHigh),
    weightToHealthy: Math.round(Math.abs(weightToHealthy)),
    action,
  };
}



const GAUGE_MIN_BMI = 10;
const GAUGE_MAX_BMI = 40;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function bmiToAngle(bmi: number) {
  const clamped = clamp(bmi, GAUGE_MIN_BMI, GAUGE_MAX_BMI);
  const fraction = (clamped - GAUGE_MIN_BMI) / (GAUGE_MAX_BMI - GAUGE_MIN_BMI);
  return fraction * 180;
}

function BmiGaugeSection({ bmi }: { bmi: number | null }) {
  const needleAngle = bmi !== null ? bmiToAngle(bmi) : 0;

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[432px] mx-auto aspect-[2/1] mb-6 sm:mb-8 overflow-visible">
      <Image 
        src="/images/bmi/bmi-calculator-image.svg" 
        alt="BMI Gauge Track" 
        fill
        className="object-contain opacity-80 brightness-110 contrast-75"
      />
      <div 
        className="absolute"
        style={{ 
          width: '38.2%',
          height: '24%',
          left: '18%',
          bottom: '-9.3%',
          transformOrigin: "83.6% 50%", 
          transform: `rotate(${needleAngle}deg)`,
          transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Image 
          src="/images/bmi/bmi-calculator-gauge-image.svg" 
          alt="Needle" 
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}



interface BmiFormSectionProps {
  gender: Gender;
  setGender: (g: Gender) => void;
  height: string;
  setHeight: (v: string) => void;
  heightInch: string;
  setHeightInch: (v: string) => void;
  weight: string;
  setWeight: (v: string) => void;
  error: string;
  onCalculate: () => void;
  isCm: boolean;
  setIsCm: (v: boolean) => void;
}

function BmiFormSection({
  gender,
  setGender,
  height,
  setHeight,
  heightInch,
  setHeightInch,
  weight,
  setWeight,
  error,
  onCalculate,
  isCm,
  setIsCm
}: BmiFormSectionProps) {
  return (
    <section className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 lg:p-10">
      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-extrabold text-[#1B2A4A]">Calculate your BMI</h1>

      {/* Gender selector */}
      <div className="mb-6 flex items-center gap-8">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="gender"
            value="male"
            checked={gender === "male"}
            onChange={() => setGender("male")}
            className="h-5 w-5 accent-[#2C6FE8] cursor-pointer"
          />
          <span
            className={`text-[15px] ${
              gender === "male" ? "font-semibold text-[#2C6FE8]" : "text-[#1B2A4A]"
            }`}
          >
            Male
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="gender"
            value="female"
            checked={gender === "female"}
            onChange={() => setGender("female")}
            className="h-5 w-5 accent-[#2C6FE8] cursor-pointer"
          />
          <span
            className={`text-[15px] ${
              gender === "female" ? "font-semibold text-[#2C6FE8]" : "text-[#1B2A4A]"
            }`}
          >
            Female
          </span>
        </label>
      </div>

      {/* Height input */}
      {isCm ? (
        <div className="mb-4">
          <input
            type="number"
            inputMode="decimal"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-lg border border-[#D7DCE6] px-4 py-3.5 text-[15px] text-[#1B2A4A] placeholder:text-[#6B7280] outline-none transition focus:border-[#2C6FE8] focus:ring-2 focus:ring-[#2C6FE8]/20"
          />
        </div>
      ) : (
        <div className="mb-4 flex gap-4">
          <input
            type="number"
            inputMode="decimal"
            placeholder="Height (Feet)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-lg border border-[#D7DCE6] px-4 py-3.5 text-[15px] text-[#1B2A4A] placeholder:text-[#6B7280] outline-none transition focus:border-[#2C6FE8] focus:ring-2 focus:ring-[#2C6FE8]/20"
          />
          <input
            type="number"
            inputMode="decimal"
            placeholder="Height (Inch)"
            value={heightInch}
            onChange={(e) => setHeightInch(e.target.value)}
            className="w-full rounded-lg border border-[#D7DCE6] px-4 py-3.5 text-[15px] text-[#1B2A4A] placeholder:text-[#6B7280] outline-none transition focus:border-[#2C6FE8] focus:ring-2 focus:ring-[#2C6FE8]/20"
          />
        </div>
      )}

      {/* Switch to cm checkbox */}
      <label className="mb-4 flex cursor-pointer items-center gap-2 select-none">
        <input
          type="checkbox"
          checked={isCm}
          onChange={(e) => setIsCm(e.target.checked)}
          className="h-5 w-5 cursor-pointer rounded accent-[#2C6FE8]"
        />
        <span className="text-[15px] text-[#1B2A4A]">Switch to cm</span>
      </label>

      {/* Weight input */}
      <div className="mb-7">
        <input
          type="number"
          inputMode="decimal"
          placeholder="Weight (Kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full rounded-lg border border-[#D7DCE6] px-4 py-3.5 text-[15px] text-[#1B2A4A] placeholder:text-[#6B7280] outline-none transition focus:border-[#2C6FE8] focus:ring-2 focus:ring-[#2C6FE8]/20"
        />
      </div>

      {error && <p className="mb-4 text-sm font-medium text-[#EB5757]">{error}</p>}

      <button
        onClick={onCalculate}
        className="w-full rounded-lg bg-[#2C6FE8] py-3.5 text-[15px] font-bold text-white shadow-[0_10px_25px_-8px_rgba(44,111,232,0.6)] transition  active:scale-[0.99]"
      >
        Calculate
      </button>
    </section>
  );
}

/* ============================================================================
   RESULTS SECTION — gauge + healthy range / healthy weight / action stats
   ========================================================================== */

interface BmiResultsSectionProps {
  result: BmiResult | null;
  actionLabel: string;
}

function BmiResultsSection({ result, actionLabel }: BmiResultsSectionProps) {
  return (
    <section className="flex w-full max-w-xl lg:max-w-lg flex-col items-center">
      {!result ? (
        <div className="mb-12 text-center flex flex-col items-center">
          <h2 className="text-2xl font-extrabold text-[#1B2A4A]">
            Take the first step towards better health!
          </h2>
          <p className="mt-2 text-[15px] text-[#5B6478] max-w-sm">
            Calculate your BMI to understand your fitness level and find the perfect health plan.
          </p>
        </div>
      ) : (
        <div className="mb-12 rounded-xl bg-[#F0F4FA] px-12 py-3 text-center">
          <h2 className="text-2xl font-extrabold text-[#1B2A4A]">
            Your BMI = {result.bmi}
          </h2>
        </div>
      )}

      <div className="w-full max-w-md">
        <BmiGaugeSection bmi={result ? result.bmi : null} />
      </div>

      <div className="mt-2 flex w-full max-w-[432px] mx-auto items-center justify-between">
        <div className="text-left">
          <p className="text-[11px] sm:text-[12px] text-[#5B6478] whitespace-nowrap">Healthy BMI range</p>
          <p className="mt-1 text-[13px] sm:text-[14px] font-bold text-[#1B2A4A] whitespace-nowrap">18.5 - 24.9</p>
        </div>
        <div className="text-center">
          <p className="text-[11px] sm:text-[12px] text-[#5B6478] whitespace-nowrap">Healthy weight for this height</p>
          <p className="mt-1 text-[13px] sm:text-[14px] font-bold text-[#1B2A4A] whitespace-nowrap">
            {result ? `${result.healthyWeightLow} - ${result.healthyWeightHigh} kg` : "0 kg"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] sm:text-[12px] text-[#5B6478] whitespace-nowrap">Action</p>
          <p className="mt-1 text-[13px] sm:text-[14px] font-bold text-[#EB5757] whitespace-nowrap">{actionLabel === "-" ? "--" : actionLabel}</p>
        </div>
      </div>
    </section>
  );
}



export default function BmiCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState<string>("");
  const [heightInch, setHeightInch] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [isCm, setIsCm] = useState<boolean>(false);
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState<string>("");
  const [showPlans, setShowPlans] = useState<boolean>(false);

  const actionLabel = useMemo(() => {
    if (!result) return "-";
    if (result.action === "gain") return `Gain ${result.weightToHealthy} kg`;
    if (result.action === "lose") return `Lose ${result.weightToHealthy} kg`;
    return "Maintain weight";
  }, [result]);

  function handleCalculate() {
    let h = parseFloat(height);
    let hInch = parseFloat(heightInch) || 0;
    const w = parseFloat(weight);

    if (!isCm) {
      if (isNaN(h)) h = 0;
      // convert feet and inches to cm
      h = (h * 30.48) + (hInch * 2.54);
    }

    if (!h || !w || h <= 0 || w <= 0) {
      setError("Please enter a valid height and weight.");
      setResult(null);
      return;
    }

    setError("");
    setResult(calculateBmi(h, w));
  }

  return (
    <div className="min-h-[80vh] w-full bg-[#ECF3FE] relative overflow-hidden pt-[100px] sm:pt-[120px] lg:pt-[130px] pb-10 sm:pb-16 lg:pb-[50px]">
      
      {/* UNIFIED CONTAINER: Intro + Calculator + Meter all left-aligned */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-5 lg:py-20">

        {/* Breadcrumb */}
        <nav className="mb-6 hidden lg:flex items-center gap-2 text-[13px]  font-medium text-[#5B6478]">
          <a href="/" className="hover:text-[#2C6FE8] hover:underline">Home</a>
          <span className="text-[#8E97A6]">&gt;</span>
          <span className="text-[#1B2A4A] font-semibold">BMI Calculator</span>
        </nav>

        {/* Heading & Description */}
        <div className="mb-8 sm:mb-10">
          <h1 
            className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#1B2A4A] leading-tight" 
            style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}
          >
            BMI Calculator
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#535862] leading-relaxed max-w-2xl">
            Body Mass Index (BMI) is a simple tool that is generally used to estimate the total amount of body fat. Calculate your BMI to determine if you are at a healthy weight.
          </p>
        </div>

        {/* Form + Meter side by side */}
        <div className="flex flex-col items-start gap-8 pt-8 lg:pt-12 md:flex-row md:items-start md:gap-20 lg:gap-32 xl:gap-40">
          {/* LEFT: FORM or RESULT CARD */}
          {!result ? (
            <BmiFormSection
              gender={gender}
              setGender={setGender}
              height={height}
              setHeight={setHeight}
              heightInch={heightInch}
              setHeightInch={setHeightInch}
              weight={weight}
              setWeight={setWeight}
              error={error}
              onCalculate={handleCalculate}
              isCm={isCm}
              setIsCm={setIsCm}
            />
          ) : (
            <BmiResultCard
              result={result}
              onRecalculate={() => setResult(null)}
              onViewPlans={() => setShowPlans(true)}
            />
          )}

          {/* RIGHT: GAUGE AND RESULTS */}
          <BmiResultsSection 
            result={result} 
            actionLabel={actionLabel} 
          />
        </div>
      </div>

      {/* BOTTOM INFO SECTION */}
      <BmiInfoSection />

      {/* PLANS POPUP MODAL */}
      <PlansModal
        open={showPlans}
        onClose={() => setShowPlans(false)}
        defaultGender={gender}
        bmiResult={result}
      />
    </div>
  );
}