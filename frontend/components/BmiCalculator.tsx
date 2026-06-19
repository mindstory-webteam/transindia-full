"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import BmiInfoSection from "./BmiInfoSection";

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
   BMI RESULT CARD
   ========================================================================== */

interface BmiResultCardProps {
  result: BmiResult;
  onRecalculate: () => void;
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

function BmiResultCard({ result, onRecalculate }: BmiResultCardProps) {
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
        <button className="rounded-lg bg-[#2C6FE8] px-6 py-2.5 text-[15px] font-bold text-white shadow-[0_10px_25px_-8px_rgba(44,111,232,0.6)] transition ">
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
    <div className="relative w-full max-w-[432px] mx-auto h-[217px] mb-8 overflow-visible">
      <Image 
        src="/images/bmi/bmi-calculator-image.svg" 
        alt="BMI Gauge Track" 
        fill
        className="object-contain opacity-80 brightness-110 contrast-75"
      />
      <div 
        className="absolute"
        style={{ 
          width: '165px',
          height: '52px',
          left: '50%',
          bottom: '0',
          marginLeft: '-138px', 
          marginBottom: '-20px', 
          transform: `rotate(${needleAngle}deg)`,
          transformOrigin: "138px 26px", 
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
    <section className="w-full max-w-md rounded-2xl bg-white p-10 shadow-[0_20px_60px_-15px_rgba(30,41,82,0.25)]">
      <h1 className="mb-8 text-3xl font-extrabold text-[#1B2A4A]">Calculate your BMI</h1>

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
    <section className="flex w-full max-w-xl flex-col items-center">
      {!result ? (
        <h2 className="mb-6 text-center text-2xl font-extrabold text-[#1B2A4A]">
          Take the first step towards better health!
        </h2>
      ) : (
        <div className="mb-6 rounded-xl bg-[#F0F4FA] px-12 py-3 text-center">
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
    <div className="min-h-[80vh] w-full bg-gradient-to-br from-[#EAF3FB] via-[#EEF2FB] to-[#F1EEFB] relative overflow-hidden pt-32 pb-10">
      
      {/* TOP SECTION: BREADCRUMB & INTRO */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-12">
        <nav className="mb-8 flex items-center gap-2 text-[13px] font-medium text-[#5B6478]">
          <a href="/" className="hover:text-[#2C6FE8] hover:underline">Home</a>
          <span className="text-[#8E97A6]">&gt;</span>
          <span className="text-[#1B2A4A] font-semibold">BMI Calculator</span>
        </nav>
        
        <div className="max-w-3xl">
          <h1 
            className="mb-5 text-3xl font-extrabold text-[#1B2A4A] md:text-4xl lg:text-[42px] leading-tight" 
            style={{ fontFamily: 'var(--font-sora), "Sora", sans-serif' }}
          >
            BMI Calculator
          </h1>
          <p className="text-[17px] text-[#535862] leading-relaxed">
            Body Mass Index (BMI) is a simple tool that is generally used to estimate the total amount of body fat. Calculate your BMI to determine if you are at a healthy weight.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-12 lg:flex-row lg:items-start lg:gap-20 px-6">
        {/* LEFT COLUMN: FORM or RESULT CARD */}
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
          <BmiResultCard result={result} onRecalculate={() => setResult(null)} />
        )}

        {/* RIGHT COLUMN: GAUGE AND RESULTS */}
        <BmiResultsSection 
          result={result} 
          actionLabel={actionLabel} 
        />
      </div>

      {/* BOTTOM INFO SECTION */}
      <BmiInfoSection />
    </div>
  );
}


