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
// PER-SERVICE CALCULATOR REGISTRY
// Each service defines its OWN step-2/step-3 fields and its OWN pricing logic,
// while sharing the same card style. The contact step (step 1) is shared.
// To add/adjust a service, edit its entry in SERVICE_CALCS below.
// ═════════════════════════════════════════════════════════════════════════════

type FieldType = "text" | "email" | "tel" | "date" | "select" | "textarea";

interface CalcFieldDef {
  label: string;
  type: FieldType;
  options?: string[];
  stateKey: string;
  defaultValue: string;
}

// What every compute() returns — drives the result panel (same style for all).
interface CalcResult {
  coverageCaption: string;   // top-left label  (e.g. "Your coverage", "Sum insured")
  coverageLabel: string;     // top-right value  (e.g. "₹1 crore")
  primaryAmount: string;     // left result box amount
  primaryUnit: string;       // left result box unit
  secondaryAmount: string;   // right result box amount
  secondaryUnit: string;     // right result box unit
  totalLabel?: string;       // optional "Total over term:" row label
  total?: string;            // optional total value
  note?: string;             // optional amber callout (e.g. income cap)
  disclaimer: string;        // bottom fine print
}

type Values = Record<string, string>;

interface ServiceCalc {
  cardTitle: string;
  submitLabel: string;
  submitBg: string;
  aboutTitle: string;
  aboutFields: CalcFieldDef[];   // Step 2 — "about you"
  quoteFields: CalcFieldDef[];   // Step 3 — the calculator inputs
  compute: (v: Values) => CalcResult;
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
const SERVICE_CALCS: Record<string, ServiceCalc> = {
  // ─── LIFE ──────────────────────────────────────────────────────────────────
  "life-insurance": {
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
      const rate = age <= 25 ? 10 : age <= 35 ? 14 : age <= 45 ? 22 : age <= 55 ? 38 : age <= 65 ? 60 : 95; // per ₹1,000
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
    cardTitle: "Calculate motor premium",
    submitLabel: "Get My Motor Quote",
    submitBg: "#EA580C",
    aboutTitle: "Where are you based?",
    aboutFields: [ADDRESS_FIELD],
    quoteFields: [
      { label: "Vehicle Type", type: "select", options: ["Car", "Two-Wheeler", "Commercial Vehicle"], stateKey: "vehicleType", defaultValue: "Car" },
      { label: "Registration Year", type: "select", options: ["2024", "2023", "2022", "2021", "2020", "2019 or older"], stateKey: "regYear", defaultValue: "2023" },
      { label: "Fuel Type", type: "select", options: ["Petrol", "Diesel", "CNG", "Electric"], stateKey: "fuelType", defaultValue: "Petrol" },
      { label: "NCB (No Claim Bonus)", type: "select", options: ["0%", "20%", "25%", "35%", "45%", "50%"], stateKey: "ncb", defaultValue: "0%" },
      { label: "Add-ons Required", type: "select", options: ["None", "Zero Depreciation", "Engine Protect", "Both"], stateKey: "addons", defaultValue: "None" },
    ],
    compute: (v) => {
      const baseIDV = v.vehicleType === "Two-Wheeler" ? 80000 : v.vehicleType === "Commercial Vehicle" ? 900000 : 600000;
      const year = v.regYear.includes("older") ? new Date().getFullYear() - 7 : parseInt(v.regYear, 10);
      const vAge = Math.max(0, new Date().getFullYear() - year);
      const idv = baseIDV * (1 - Math.min(0.5, vAge * 0.1));
      const odPremium = idv * 0.03;
      const fuelFactor = v.fuelType === "Electric" ? 0.9 : v.fuelType === "CNG" ? 1.05 : v.fuelType === "Diesel" ? 1.1 : 1;
      const ncb = parseInt(v.ncb.replace(/\D/g, ""), 10) / 100 || 0;
      const tp = v.vehicleType === "Two-Wheeler" ? 752 : v.vehicleType === "Commercial Vehicle" ? 3500 : 2094;
      const od = odPremium * fuelFactor * (1 - ncb);
      const addon = v.addons === "Zero Depreciation" ? od * 0.15 : v.addons === "Engine Protect" ? od * 0.05 : v.addons === "Both" ? od * 0.2 : 0;
      const yearly = (od + tp + addon) * GST;
      return {
        coverageCaption: "Approx IDV",
        coverageLabel: fmt(idv),
        primaryAmount: fmt(yearly), primaryUnit: "per year",
        secondaryAmount: fmt(yearly / 12), secondaryUnit: "per month",
        disclaimer: "Estimated premium incl. 18% GST. Final IDV & price depend on make, model & insurer.",
      };
    },
  },

  // ─── HOME ──────────────────────────────────────────────────────────────────
  "home-insurance": {
    cardTitle: "Protect your home",
    submitLabel: "Get Home Quote",
    submitBg: "#7C3AED",
    aboutTitle: "Where is the property?",
    aboutFields: [ADDRESS_FIELD],
    quoteFields: [
      { label: "Property Type", type: "select", options: ["Apartment", "Independent House", "Villa", "Row House"], stateKey: "propertyType", defaultValue: "Apartment" },
      { label: "Property Age", type: "select", options: ["Less than 5 years", "5–10 years", "10–20 years", "20+ years"], stateKey: "propertyAge", defaultValue: "Less than 5 years" },
      { label: "Cover Required", type: "select", options: ["Structure Only", "Contents Only", "Structure + Contents"], stateKey: "coverType", defaultValue: "Structure + Contents" },
      { label: "Property Value", type: "select", options: ["Below ₹20L", "₹20–50L", "₹50L–1Cr", "₹1Cr–2Cr", "Above ₹2Cr"], stateKey: "propertyValue", defaultValue: "₹50L–1Cr" },
    ],
    compute: (v) => {
      const valMap: Record<string, number> = { "Below ₹20L": 1500000, "₹20–50L": 3500000, "₹50L–1Cr": 7500000, "₹1Cr–2Cr": 15000000, "Above ₹2Cr": 30000000 };
      const value = valMap[v.propertyValue] ?? 7500000;
      const coverFactor = v.coverType === "Structure Only" ? 0.8 : v.coverType === "Contents Only" ? 0.6 : 1;
      const ageFactor = v.propertyAge.startsWith("Less") ? 1 : v.propertyAge.startsWith("5") ? 1.1 : v.propertyAge.startsWith("10") ? 1.25 : 1.4;
      const typeFactor = v.propertyType === "Villa" ? 1.15 : v.propertyType === "Apartment" ? 0.9 : 1;
      const yearly = value * 0.0004 * coverFactor * ageFactor * typeFactor * GST;
      return {
        coverageCaption: "Sum insured",
        coverageLabel: fmt(value),
        primaryAmount: fmt(yearly), primaryUnit: "per year",
        secondaryAmount: fmt(yearly / 12), secondaryUnit: "per month",
        disclaimer: "Estimated premium incl. 18% GST. Final price depends on construction, location & valuation.",
      };
    },
  },

  // ─── TRAVEL ────────────────────────────────────────────────────────────────
  "travel-insurance": {
    cardTitle: "Plan your travel cover",
    submitLabel: "Get Travel Quote",
    submitBg: "#0891B2",
    aboutTitle: "Tell us about the traveller",
    aboutFields: [
      { label: "Date of Birth", type: "date", stateKey: "dob", defaultValue: "" },
      ADDRESS_FIELD,
    ],
    quoteFields: [
      { label: "Travel Type", type: "select", options: ["International", "Domestic"], stateKey: "travelType", defaultValue: "International" },
      { label: "Trip Type", type: "select", options: ["Single Trip", "Multi-Trip Annual"], stateKey: "tripType", defaultValue: "Single Trip" },
      { label: "Traveller Type", type: "select", options: ["Individual", "Family", "Senior Citizen", "Student"], stateKey: "travellerType", defaultValue: "Individual" },
      { label: "Destination Region", type: "select", options: ["Asia", "Europe", "USA/Canada", "Worldwide"], stateKey: "destination", defaultValue: "Asia" },
      { label: "Trip Duration", type: "select", options: ["1–7 days", "8–15 days", "16–30 days", "31–90 days"], stateKey: "duration", defaultValue: "8–15 days" },
    ],
    compute: (v) => {
      const daysMap: Record<string, number> = { "1–7 days": 7, "8–15 days": 15, "16–30 days": 30, "31–90 days": 90 };
      const days = daysMap[v.duration] ?? 15;
      const domestic = v.travelType === "Domestic";
      const perDay = domestic ? 25 : v.destination === "Europe" ? 90 : v.destination === "USA/Canada" ? 140 : v.destination === "Worldwide" ? 160 : 60;
      const travellerFactor = v.travellerType === "Family" ? 2.6 : v.travellerType === "Senior Citizen" ? 1.8 : v.travellerType === "Student" ? 1.1 : 1;
      const tripFactor = v.tripType === "Multi-Trip Annual" ? 4.5 : 1;
      const premium = perDay * days * travellerFactor * tripFactor * GST;
      const medMap: Record<string, string> = { Asia: "₹25 Lakh", Europe: "₹40 Lakh", "USA/Canada": "₹1 Crore", Worldwide: "₹1 Crore" };
      const cover = domestic ? "₹5 Lakh" : medMap[v.destination] ?? "₹25 Lakh";
      return {
        coverageCaption: "Medical cover",
        coverageLabel: cover,
        primaryAmount: fmt(premium), primaryUnit: "trip premium",
        secondaryAmount: fmt(premium / days), secondaryUnit: "per day",
        disclaimer: "Estimated one-time premium incl. 18% GST. Final price depends on age & plan benefits.",
      };
    },
  },

  // ─── MARINE ────────────────────────────────────────────────────────────────
  "marine-insurance": {
    cardTitle: "Get your marine quote",
    submitLabel: "Get Marine Quote",
    submitBg: "#0369A1",
    aboutTitle: "Your business details",
    aboutFields: [ADDRESS_FIELD],
    quoteFields: [
      { label: "Cargo Type", type: "select", options: ["General Goods", "Perishables", "Machinery", "Hazardous", "Electronics"], stateKey: "cargoType", defaultValue: "General Goods" },
      { label: "Mode of Transit", type: "select", options: ["Sea", "Air", "Road", "Rail", "Multimodal"], stateKey: "transitMode", defaultValue: "Sea" },
      { label: "Trade Type", type: "select", options: ["Import", "Export", "Inland (Domestic)"], stateKey: "tradeType", defaultValue: "Export" },
      { label: "Policy Type", type: "select", options: ["Single Transit", "Open / Annual Policy"], stateKey: "policyType", defaultValue: "Single Transit" },
      { label: "Cargo Value", type: "select", options: ["Below ₹10L", "₹10–50L", "₹50L–1Cr", "₹1Cr–5Cr", "Above ₹5Cr"], stateKey: "cargoValue", defaultValue: "₹10–50L" },
    ],
    compute: (v) => {
      const valMap: Record<string, number> = { "Below ₹10L": 750000, "₹10–50L": 3000000, "₹50L–1Cr": 7500000, "₹1Cr–5Cr": 30000000, "Above ₹5Cr": 75000000 };
      const value = valMap[v.cargoValue] ?? 3000000;
      const baseRate = v.cargoType === "Perishables" ? 0.005 : v.cargoType === "Machinery" ? 0.003 : v.cargoType === "Hazardous" ? 0.0065 : v.cargoType === "Electronics" ? 0.004 : 0.0025;
      const modeFactor = v.transitMode === "Air" ? 0.8 : v.transitMode === "Road" ? 1.1 : v.transitMode === "Rail" ? 0.95 : v.transitMode === "Multimodal" ? 1.15 : 1;
      const tradeFactor = v.tradeType.startsWith("Inland") ? 0.85 : 1;
      const open = v.policyType.startsWith("Open");
      const policyFactor = open ? 8 : 1;
      const premium = value * baseRate * modeFactor * tradeFactor * policyFactor * GST;
      const effRate = premium / value;
      return {
        coverageCaption: "Cargo value",
        coverageLabel: fmt(value),
        primaryAmount: fmt(premium), primaryUnit: open ? "annual premium" : "per transit",
        secondaryAmount: pct(effRate), secondaryUnit: "effective rate",
        disclaimer: "Estimated premium incl. 18% GST. Final rate depends on route, packing & claims history.",
      };
    },
  },

  // ─── FIRE ──────────────────────────────────────────────────────────────────
  "fire-insurance": {
    cardTitle: "Calculate fire premium",
    submitLabel: "Get Fire Quote",
    submitBg: "#DC2626",
    aboutTitle: "Where is the premises?",
    aboutFields: [ADDRESS_FIELD],
    quoteFields: [
      { label: "Property Type", type: "select", options: ["Factory", "Warehouse / Godown", "Shop / Showroom", "Office"], stateKey: "propertyType", defaultValue: "Factory" },
      { label: "What to Cover", type: "select", options: ["Building Only", "Stock Only", "Building + Stock + Machinery"], stateKey: "coverScope", defaultValue: "Building + Stock + Machinery" },
      { label: "Sum Insured", type: "select", options: ["Below ₹25L", "₹25L–1Cr", "₹1Cr–5Cr", "₹5Cr–25Cr", "Above ₹25Cr"], stateKey: "sumInsured", defaultValue: "₹1Cr–5Cr" },
      { label: "Earthquake Cover", type: "select", options: ["No", "Yes"], stateKey: "earthquake", defaultValue: "No" },
      { label: "Loss of Profit Add-on", type: "select", options: ["No", "Yes"], stateKey: "lossOfProfit", defaultValue: "No" },
    ],
    compute: (v) => {
      const valMap: Record<string, number> = { "Below ₹25L": 1500000, "₹25L–1Cr": 6000000, "₹1Cr–5Cr": 30000000, "₹5Cr–25Cr": 150000000, "Above ₹25Cr": 350000000 };
      const value = valMap[v.sumInsured] ?? 6000000;
      const baseRate = v.propertyType === "Warehouse / Godown" ? 0.0008 : v.propertyType === "Shop / Showroom" ? 0.0005 : v.propertyType === "Office" ? 0.0004 : 0.0006;
      const scopeFactor = v.coverScope === "Building Only" ? 0.8 : v.coverScope === "Stock Only" ? 0.9 : 1;
      let yearly = value * baseRate * scopeFactor;
      if (v.earthquake === "Yes") yearly += value * 0.00015;
      if (v.lossOfProfit === "Yes") yearly *= 1.2;
      yearly *= GST;
      return {
        coverageCaption: "Sum insured",
        coverageLabel: fmt(value),
        primaryAmount: fmt(yearly), primaryUnit: "per year",
        secondaryAmount: fmt(yearly / 12), secondaryUnit: "per month",
        disclaimer: "Estimated premium incl. 18% GST. Final price depends on occupancy, risk grade & valuation.",
      };
    },
  },

  // ─── MISCELLANEOUS ─────────────────────────────────────────────────────────
  "miscellaneous-insurance": {
    cardTitle: "Find your cover",
    submitLabel: "Get a Quote",
    submitBg: "#4F46E5",
    aboutTitle: "Your details",
    aboutFields: [ADDRESS_FIELD],
    quoteFields: [
      { label: "Cover Required", type: "select", options: ["Burglary", "Fidelity Guarantee", "Money in Transit", "Machinery Breakdown", "Professional Indemnity", "Public Liability", "Workmen's Compensation"], stateKey: "coverType", defaultValue: "Burglary" },
      { label: "Applicant Type", type: "select", options: ["Business / SME", "Professional", "Manufacturer", "Retailer"], stateKey: "applicantType", defaultValue: "Business / SME" },
      { label: "Sum Insured / Limit", type: "select", options: ["Below ₹10L", "₹10–50L", "₹50L–2Cr", "₹2Cr–10Cr", "Above ₹10Cr"], stateKey: "sumInsured", defaultValue: "₹10–50L" },
      { label: "Number of Employees", type: "select", options: ["1–10", "11–50", "51–200", "200+"], stateKey: "employees", defaultValue: "11–50" },
    ],
    compute: (v) => {
      const valMap: Record<string, number> = { "Below ₹10L": 750000, "₹10–50L": 3000000, "₹50L–2Cr": 12500000, "₹2Cr–10Cr": 60000000, "Above ₹10Cr": 150000000 };
      const value = valMap[v.sumInsured] ?? 3000000;
      const rateMap: Record<string, number> = {
        "Burglary": 0.0015, "Fidelity Guarantee": 0.002, "Money in Transit": 0.0025,
        "Machinery Breakdown": 0.003, "Professional Indemnity": 0.0035, "Public Liability": 0.0018, "Workmen's Compensation": 0.0022,
      };
      const rate = rateMap[v.coverType] ?? 0.002;
      const empFactor = v.employees === "11–50" ? 1.4 : v.employees === "51–200" ? 2 : v.employees === "200+" ? 3 : 1;
      const headcountMatters = v.coverType === "Workmen's Compensation" || v.coverType === "Fidelity Guarantee";
      const yearly = value * rate * (headcountMatters ? empFactor : 1) * GST;
      return {
        coverageCaption: "Sum insured / limit",
        coverageLabel: fmt(value),
        primaryAmount: fmt(yearly), primaryUnit: "per year",
        secondaryAmount: fmt(yearly / 12), secondaryUnit: "per month",
        note: `Estimate for ${v.coverType} cover.`,
        disclaimer: "Estimated premium incl. 18% GST. Final price depends on risk profile & underwriting.",
      };
    },
  },

  // ─── ENTERTAINMENT ─────────────────────────────────────────────────────────
  "entertainment-insurance": {
    cardTitle: "Insure your production",
    submitLabel: "Get Production Quote",
    submitBg: "#9333EA",
    aboutTitle: "Production contact",
    aboutFields: [ADDRESS_FIELD],
    quoteFields: [
      { label: "Production Type", type: "select", options: ["Film / TV", "Concert / Live Event", "Broadcast / Streaming", "Exhibition / Fair", "Ad Film"], stateKey: "productionType", defaultValue: "Film / TV" },
      { label: "Cover Required", type: "select", options: ["Full Production Package", "Equipment Only", "Event Cancellation", "Public Liability"], stateKey: "coverType", defaultValue: "Full Production Package" },
      { label: "Venue / Shoot Setting", type: "select", options: ["Indoor / Studio", "Outdoor", "Both"], stateKey: "venue", defaultValue: "Both" },
      { label: "Budget / Sum Insured", type: "select", options: ["Below ₹25L", "₹25L–1Cr", "₹1Cr–5Cr", "₹5Cr–25Cr", "Above ₹25Cr"], stateKey: "budget", defaultValue: "₹25L–1Cr" },
      { label: "Duration", type: "select", options: ["1 day", "2–7 days", "1–4 weeks", "1–3 months", "3+ months"], stateKey: "duration", defaultValue: "2–7 days" },
    ],
    compute: (v) => {
      const valMap: Record<string, number> = { "Below ₹25L": 1500000, "₹25L–1Cr": 6000000, "₹1Cr–5Cr": 30000000, "₹5Cr–25Cr": 150000000, "Above ₹25Cr": 350000000 };
      const value = valMap[v.budget] ?? 6000000;
      const baseRate = v.productionType === "Concert / Live Event" ? 0.015 : v.productionType === "Broadcast / Streaming" ? 0.01 : v.productionType === "Exhibition / Fair" ? 0.011 : v.productionType === "Ad Film" ? 0.013 : 0.012;
      const coverFactor = v.coverType === "Equipment Only" ? 0.5 : v.coverType === "Event Cancellation" ? 0.7 : v.coverType === "Public Liability" ? 0.4 : 1;
      const venueFactor = v.venue === "Outdoor" ? 1.25 : v.venue === "Indoor / Studio" ? 0.9 : 1.1;
      const durMap: Record<string, number> = { "1 day": 0.6, "2–7 days": 1, "1–4 weeks": 1.8, "1–3 months": 3, "3+ months": 4.5 };
      const durFactor = durMap[v.duration] ?? 1;
      const premium = value * baseRate * coverFactor * venueFactor * durFactor * GST;
      return {
        coverageCaption: "Production budget",
        coverageLabel: fmt(value),
        primaryAmount: fmt(premium), primaryUnit: "total premium",
        secondaryAmount: pct(premium / value), secondaryUnit: "of budget",
        disclaimer: "Estimated premium incl. 18% GST. Final price depends on cast, schedule & risk survey.",
      };
    },
  },

  // ─── RISK CONSULTATION (free) ────────────────────────────────────────────────
  "risk-consultation": {
    cardTitle: "Book your free assessment",
    submitLabel: "Book Free Session",
    submitBg: "#1E293B",
    aboutTitle: "Your details",
    aboutFields: [ADDRESS_FIELD],
    quoteFields: [
      { label: "Assessment Type", type: "select", options: ["Personal Portfolio", "Business Risk", "Both"], stateKey: "assessmentType", defaultValue: "Personal Portfolio" },
      { label: "Current Policies", type: "select", options: ["None", "1–2 policies", "3–5 policies", "6+"], stateKey: "currentPolicies", defaultValue: "1–2 policies" },
      { label: "Annual Premium Spend", type: "select", options: ["Below ₹10K", "₹10–50K", "₹50K–2L", "Above ₹2L"], stateKey: "premiumSpend", defaultValue: "₹10–50K" },
      { label: "Preferred Slot", type: "select", options: ["Morning (9–12)", "Afternoon (12–5)", "Evening (5–8)"], stateKey: "slot", defaultValue: "Morning (9–12)" },
    ],
    compute: (v) => {
      const spendMap: Record<string, number> = { "Below ₹10K": 8000, "₹10–50K": 30000, "₹50K–2L": 125000, "Above ₹2L": 300000 };
      const spend = spendMap[v.premiumSpend] ?? 30000;
      const saving = spend * 0.22;
      return {
        coverageCaption: "Consultation",
        coverageLabel: "Free Portfolio Audit",
        primaryAmount: fmt(0), primaryUnit: "consultation fee",
        secondaryAmount: fmt(saving), secondaryUnit: "potential saving/yr",
        note: "Your first session is free — no obligation, no sales pitch.",
        disclaimer: "Estimated saving based on typical 15–30% optimisation. Actual result varies by portfolio.",
      };
    },
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// HERO CALCULATOR CARD — fields + pricing logic come from SERVICE_CALCS[slug].
// Same 3-step card style for every service; only the inputs and the math differ.
//   Step 1: contact   (shared)
//   Step 2: about you (config.aboutFields)
//   Step 3: calculator(config.quoteFields)  → config.compute(values)
// ═════════════════════════════════════════════════════════════════════════════
function HeroCalcCard({ slug, serviceTitle }: { slug: string; serviceTitle: string }) {
  // Pick this service's config; fall back to life-insurance for any unknown slug.
  const config = SERVICE_CALCS[slug] ?? SERVICE_CALCS["life-insurance"];

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
    setResult(null); // inputs changed → clear stale estimate
    setError(null);
  };

  // ── Step 1 validation (contact / lead info) ──────────────────────────────────
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

  // ── estimate (Step 3) — runs this service's compute() AND submits the lead ──
  const calculate = async () => {
    if (!validateContact()) { setResult(null); setStep(1); return; }

    // Per-service pricing logic:
    const estimate = config.compute(values);

    setResult({ ...estimate, to: (values.email || "").trim() });

    // Submit the lead WITH the computed estimate. A failed POST never blocks
    // the user from seeing their result.
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/serviceleads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,                 // all collected field values (varies per service)
          estimate,                  // the computed result for this service
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

  if (!fields.length) return null;

  // Shared field renderer — same markup for every service.
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

  // Step pill — active colour uses this service's submit colour.
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
      {/* Step indicator */}
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

      {/* FORM VIEW */}
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

      {/* RESULT VIEW — flexible labels, same style for every service */}
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
              <p className="li-result-note">We&apos;ll share this estimate with you at {result.to}.</p>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button type="button" onClick={handleRetry} className="li-back-btn">Retry</button>
            <Link href={VIEW_PLANS_HREF} className="li-submit li-submit-link" style={{ background: config.submitBg, flex: 1, width: "auto", marginTop: 0 }}>
              View Plans
            </Link>
          </div>
        </>
      )}
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function InsuranceDetailPage({ data, slug }: Props) {
  return (
    <>
      <style>{CSS}</style>
      <div style={{ overflowX: "hidden", width: "100%" }}>
         <Preloader/>
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

            {/* RIGHT — per-service premium calculator */}
            <div className="li-right">
              <HeroCalcCard slug={slug} serviceTitle={data.title || data.heroBadgeText} />
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