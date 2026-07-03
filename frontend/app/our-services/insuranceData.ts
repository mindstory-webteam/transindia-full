// lib/insuranceData.ts  (or place in /data/insuranceData.ts — adjust import paths as needed)

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LifeStage {
  emoji: string; // now an image path, e.g. "/images/icons/just-starting-out.png"
  age: string;
  ageColor: string;
  title: string;
  description: string;
  linkText: string;
  linkColor: string;
  bg: string;
}

export interface BenefitCard {
  iconBg: string;
  emoji: string; // now an image path, e.g. "/images/icons/income-replacement.png"
  title: string;
  description: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface InsuranceDetailData {
  slug: string;
  // Hero
  heroAccentWord: string;
  heroRestTitle: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroBadgeBg: string;
  heroBadgeColor: string;
  heroStats: HeroStat[];
  heroCtaLabel: string;
  heroCtaBg: string;
  heroAccentColor: string;   // inline hex for the coloured word
  heroAccentColor2: string;  // second inline hex word
  // Why section
  whyBadge: string;
  whyTitle: string;
  whyTitleAccent: string;
  whyTitleAccentColor: string;
  whyBody: string[];
  whyImage: string; // image path for the right-side visual in the "Why" section
  // Benefits
  benefitsBadge: string;
  benefitsTitle: string;
  benefitsTitleAccent: string;
  benefitsTitleAccentColor: string;
  benefitsSubtitle: string;
  benefits: BenefitCard[];
  // Life stages
  stagesBadge: string;
  stagesTitle: string;
  stagesTitleAccent: string;
  stages: LifeStage[];
  withoutTitle: string;
  withoutItems: string[];
  withTitle: string;
  withItems: string[];
  ctaHeading: string;
  ctaBody: string;
  // FAQ
  faqBadge: string;
  faqTitle: string;
  faqTitleAccent: string;
  faqTitleAccentColor: string;
  faqs: FAQItem[];
}

// ─── Calculator field config (reused in hero card) ───────────────────────────
export interface CalcField {
  label: string;
  type: "date" | "select";
  options?: string[];
  stateKey: string;
  defaultValue: string;
}

export interface InsuranceCalcConfig {
  slug: string;
  cardTitle: string;
  submitLabel: string;
  submitBg: string;
  fields: CalcField[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CALCULATOR CONFIGS
// ─────────────────────────────────────────────────────────────────────────────
export const CALC_CONFIGS: Record<string, InsuranceCalcConfig> = {
  "life-insurance": {
    slug: "life-insurance",
    cardTitle: "Calculate your premium",
    submitLabel: "Get My Instant Quote",
    submitBg: "#1B8A3A",
    fields: [
      { label: "Date of Birth", type: "date", stateKey: "dob", defaultValue: "" },
      { label: "Gender", type: "select", options: ["Male", "Female", "Other"], stateKey: "gender", defaultValue: "Male" },
      { label: "Smoker", type: "select", options: ["No", "Yes"], stateKey: "smoker", defaultValue: "No" },
      { label: "Sum Assured Required", type: "select", options: ["₹25 lakh", "₹50 lakh", "₹75 lakh", "₹1 crore", "₹2 crore", "₹5 crore"], stateKey: "sumAssured", defaultValue: "₹1 crore" },
      { label: "Policy Term", type: "select", options: ["10 years", "15 years", "20 years", "25 years", "30 years"], stateKey: "policyTerm", defaultValue: "30 years" },
      { label: "Annual Income", type: "select", options: ["Below ₹3 Lakh", "₹3–6 Lakh", "₹6–12 Lakh", "₹12–25 Lakh", "Above ₹25 Lakh"], stateKey: "annualIncome", defaultValue: "₹6–12 Lakh" },
    ],
  },
  "health-insurance": {
    slug: "health-insurance",
    cardTitle: "Get your health quote",
    submitLabel: "Get My Health Quote",
    submitBg: "#0D9488",
    fields: [
      { label: "Date of Birth", type: "date", stateKey: "dob", defaultValue: "" },
      { label: "Cover Type", type: "select", options: ["Individual", "Family Floater", "Senior Citizen"], stateKey: "coverType", defaultValue: "Individual" },
      { label: "Sum Insured", type: "select", options: ["₹3 lakh", "₹5 lakh", "₹10 lakh", "₹25 lakh", "₹50 lakh"], stateKey: "sumInsured", defaultValue: "₹5 lakh" },
      { label: "Pre-existing Conditions", type: "select", options: ["None", "Diabetes", "Hypertension", "Both"], stateKey: "conditions", defaultValue: "None" },
      { label: "City Tier", type: "select", options: ["Tier 1 (Metro)", "Tier 2", "Tier 3"], stateKey: "city", defaultValue: "Tier 1 (Metro)" },
    ],
  },
  "motor-insurance": {
    slug: "motor-insurance",
    cardTitle: "Calculate motor premium",
    submitLabel: "Get My Motor Quote",
    submitBg: "#EA580C",
    fields: [
      { label: "Vehicle Type", type: "select", options: ["Car", "Two-Wheeler", "Commercial Vehicle"], stateKey: "vehicleType", defaultValue: "Car" },
      { label: "Registration Year", type: "select", options: ["2024", "2023", "2022", "2021", "2020", "2019 or older"], stateKey: "regYear", defaultValue: "2023" },
      { label: "Fuel Type", type: "select", options: ["Petrol", "Diesel", "CNG", "Electric"], stateKey: "fuelType", defaultValue: "Petrol" },
      { label: "NCB (No Claim Bonus)", type: "select", options: ["0%", "20%", "25%", "35%", "45%", "50%"], stateKey: "ncb", defaultValue: "0%" },
      { label: "Add-ons Required", type: "select", options: ["None", "Zero Depreciation", "Engine Protect", "Both"], stateKey: "addons", defaultValue: "None" },
    ],
  },
  "home-insurance": {
    slug: "home-insurance",
    cardTitle: "Protect your home",
    submitLabel: "Get Home Quote",
    submitBg: "#7C3AED",
    fields: [
      { label: "Property Type", type: "select", options: ["Apartment", "Independent House", "Villa", "Row House"], stateKey: "propertyType", defaultValue: "Apartment" },
      { label: "Property Age", type: "select", options: ["Less than 5 years", "5–10 years", "10–20 years", "20+ years"], stateKey: "propertyAge", defaultValue: "Less than 5 years" },
      { label: "Cover Required", type: "select", options: ["Structure Only", "Contents Only", "Structure + Contents"], stateKey: "coverType", defaultValue: "Structure + Contents" },
      { label: "Property Value", type: "select", options: ["Below ₹20L", "₹20–50L", "₹50L–1Cr", "₹1Cr–2Cr", "Above ₹2Cr"], stateKey: "propertyValue", defaultValue: "₹50L–1Cr" },
    ],
  },
  
  
  "marine-insurance": {
    slug: "marine-insurance",
    cardTitle: "Get your marine quote",
    submitLabel: "Get Marine Quote",
    submitBg: "#0369A1",
    fields: [
      { label: "Cargo Type", type: "select", options: ["General Goods", "Perishables", "Machinery", "Hazardous", "Electronics"], stateKey: "cargoType", defaultValue: "General Goods" },
      { label: "Mode of Transit", type: "select", options: ["Sea", "Air", "Road", "Rail", "Multimodal"], stateKey: "transitMode", defaultValue: "Sea" },
      { label: "Trade Type", type: "select", options: ["Import", "Export", "Inland (Domestic)"], stateKey: "tradeType", defaultValue: "Export" },
      { label: "Policy Type", type: "select", options: ["Single Transit", "Open / Annual Policy"], stateKey: "policyType", defaultValue: "Single Transit" },
      { label: "Cargo Value", type: "select", options: ["Below ₹10L", "₹10–50L", "₹50L–1Cr", "₹1Cr–5Cr", "Above ₹5Cr"], stateKey: "cargoValue", defaultValue: "₹10–50L" },
    ],
  },
  "fire-insurance": {
    slug: "fire-insurance",
    cardTitle: "Calculate fire premium",
    submitLabel: "Get Fire Quote",
    submitBg: "#DC2626",
    fields: [
      { label: "Property Type", type: "select", options: ["Factory", "Warehouse / Godown", "Shop / Showroom", "Office"], stateKey: "propertyType", defaultValue: "Factory" },
      { label: "What to Cover", type: "select", options: ["Building Only", "Stock Only", "Building + Stock + Machinery"], stateKey: "coverScope", defaultValue: "Building + Stock + Machinery" },
      { label: "Sum Insured", type: "select", options: ["Below ₹25L", "₹25L–1Cr", "₹1Cr–5Cr", "₹5Cr–25Cr", "Above ₹25Cr"], stateKey: "sumInsured", defaultValue: "₹1Cr–5Cr" },
      { label: "Earthquake Cover", type: "select", options: ["No", "Yes"], stateKey: "earthquake", defaultValue: "No" },
      { label: "Loss of Profit Add-on", type: "select", options: ["No", "Yes"], stateKey: "lossOfProfit", defaultValue: "No" },
    ],
  },
  "miscellaneous-insurance": {
    slug: "miscellaneous-insurance",
    cardTitle: "Find your cover",
    submitLabel: "Get a Quote",
    submitBg: "#4F46E5",
    fields: [
      { label: "Cover Required", type: "select", options: ["Burglary", "Fidelity Guarantee", "Money in Transit", "Machinery Breakdown", "Professional Indemnity", "Public Liability", "Workmen's Compensation"], stateKey: "coverType", defaultValue: "Burglary" },
      { label: "Applicant Type", type: "select", options: ["Business / SME", "Professional", "Manufacturer", "Retailer"], stateKey: "applicantType", defaultValue: "Business / SME" },
      { label: "Sum Insured / Limit", type: "select", options: ["Below ₹10L", "₹10–50L", "₹50L–2Cr", "₹2Cr–10Cr", "Above ₹10Cr"], stateKey: "sumInsured", defaultValue: "₹10–50L" },
      { label: "Number of Employees", type: "select", options: ["1–10", "11–50", "51–200", "200+"], stateKey: "employees", defaultValue: "11–50" },
    ],
  },
  "entertainment-insurance": {
    slug: "entertainment-insurance",
    cardTitle: "Insure your production",
    submitLabel: "Get Production Quote",
    submitBg: "#9333EA",
    fields: [
      { label: "Production Type", type: "select", options: ["Film / TV", "Concert / Live Event", "Broadcast / Streaming", "Exhibition / Fair", "Ad Film"], stateKey: "productionType", defaultValue: "Film / TV" },
      { label: "Cover Required", type: "select", options: ["Full Production Package", "Equipment Only", "Event Cancellation", "Public Liability"], stateKey: "coverType", defaultValue: "Full Production Package" },
      { label: "Venue / Shoot Setting", type: "select", options: ["Indoor / Studio", "Outdoor", "Both"], stateKey: "venue", defaultValue: "Both" },
      { label: "Budget / Sum Insured", type: "select", options: ["Below ₹25L", "₹25L–1Cr", "₹1Cr–5Cr", "₹5Cr–25Cr", "Above ₹25Cr"], stateKey: "budget", defaultValue: "₹25L–1Cr" },
      { label: "Duration", type: "select", options: ["1 day", "2–7 days", "1–4 weeks", "1–3 months", "3+ months"], stateKey: "duration", defaultValue: "2–7 days" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL PAGE DATA
// ─────────────────────────────────────────────────────────────────────────────
export const INSURANCE_DATA: Record<string, InsuranceDetailData> = {
  "life-insurance": {
    slug: "life-insurance",
    heroAccentWord: "who matter",
    heroRestTitle: "Protect the people",
    heroSubtitle:
      "Comprehensive life insurance plans starting from ₹437/month. Secure your family's future with cover up to ₹5 Crore.",
    heroBadgeText: "Life Insurance",
    heroBadgeBg: "#1e3a5f",
    heroBadgeColor: "#38BDF8",
    heroStats: [
      { value: "98.7%", label: "Claims Settlement Ratio" },
      { value: "20+", label: "Insurer Partners" },
      { value: "₹5Cr", label: "Max Sum Assured" },
    ],
    heroCtaLabel: "Talk to an Expert",
    heroCtaBg: "#F4622A",
    heroAccentColor: "#F4622A",
    heroAccentColor2: "#38BDF8",
    whyBadge: "WHY LIFE INSURANCE?",
    whyTitle: "One decision that protects",
    whyTitleAccent: "everything you've built",
    whyTitleAccentColor: "#F4622A",
    whyBody: [
      "With the pandemic and untimely death of sole breadwinners of many Indian families, more people have begun to realise how insurance policies act as a safety net. Several insurers have introduced innovative plans that offer a return of all premiums paid if the policyholder outlives the policy.",
      "While estimating the ideal life insurance cover, one needs to account for different factors — accumulated debts, children's higher education, and the ever-present impact of inflation.",
      "Our risk managers handle these concerns every day. Allow them to guide you towards a life insurance cover that serves you best.",
    ],
    whyImage: "/images/services/SERVICE - LIFE INSURANCE/magnific_xgQiZWNjfW.png",
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 reasons life insurance is",
    benefitsTitleAccent: "non-negotiable",
    benefitsTitleAccentColor: "#F97316",
    benefitsSubtitle:
      "Life insurance isn't just about death. It's about making sure the people who depend on you never have to struggle — no matter what happens.",
    benefits: [
      { iconBg: "bg-blue-100", emoji: "/images/services/SERVICE - LIFE INSURANCE/Income Replacement.png", title: "Income Replacement", description: "Your family maintains their standard of living. Monthly expenses, EMIs, school fees — all covered even when you're not around." },
      { iconBg: "bg-emerald-100", emoji: "/images/services/SERVICE - LIFE INSURANCE/Children's Education.png", title: "Children's Education", description: "Lock in your child's education goals — school, college, or professional courses — regardless of what life throws at you." },
      { iconBg: "bg-yellow-100", emoji: "/images/services/SERVICE - LIFE INSURANCE/Debt Clearance.png", title: "Debt Clearance", description: "Home loans, car loans, personal debts — the payout clears them all. Your family inherits your assets, not your liabilities." },
      { iconBg: "bg-pink-100", emoji: "/images/services/SERVICE - LIFE INSURANCE/Spouse Protection.png", title: "Spouse Protection", description: "Ensure your partner is financially secure and independent for life — especially if they're a homemaker or dependent on your income." },
      { iconBg: "bg-indigo-100", emoji: "/images/services/SERVICE - LIFE INSURANCE/Tax Benefits.png", title: "Tax Benefits", description: "Save up to ₹1.5 Lakh/year under Section 80C on premiums paid. Maturity and death proceeds are fully tax-exempt under 10(10D)." },
      { iconBg: "bg-rose-100", emoji: "/images/services/SERVICE - LIFE INSURANCE/Critical Illness Cover.png", title: "Critical Illness Cover", description: "Add-on riders cover 40+ critical illnesses — cancer, heart attack, stroke, kidney failure — paying a lump sum on diagnosis." },
      { iconBg: "bg-orange-100", emoji: "/images/services/SERVICE - LIFE INSURANCE/Low Locked-In Premiums.png", title: "Low Locked-In Premiums", description: "Buy young, pay less for life. Premiums are fixed at the age you buy — waiting even one year can cost thousands more annually." },
      { iconBg: "bg-cyan-100", emoji: "/images/services/SERVICE - LIFE INSURANCE/Wealth Creation.png", title: "Wealth Creation", description: "Endowment and ULIP plans grow your money alongside protecting your life — building a corpus for retirement, marriage, or goals." },
    ],
    stagesBadge: "AT EVERY STAGE OF LIFE",
    stagesTitle: "Your insurance needs",
    stagesTitleAccent: "change as you grow",
    stages: [
      { emoji: "/images/services/SERVICE - LIFE INSURANCE/Just Starting Out.png", age: "AGE 20–30", ageColor: "text-cyan-600", title: "Just Starting Out", description: "Lock in ultra-low premiums. A ₹1 Cr term plan at 25 costs ~₹437/mo. Best time to buy is now.", linkText: "Term Insurance", linkColor: "text-blue-700", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "/images/services/SERVICE - LIFE INSURANCE/Family & Mortgage.png", age: "AGE 30–40", ageColor: "text-orange-500", title: "Family & Mortgage", description: "Protect spouse, kids, home loan. Increase sum assured to cover all liabilities and income replacement.", linkText: "Term + Critical Illness", linkColor: "text-orange-500", bg: "bg-gradient-to-br from-orange-50 to-white" },
      { emoji: "/images/services/SERVICE - LIFE INSURANCE/Peak Earning Years.png", age: "AGE 40–55", ageColor: "text-emerald-600", title: "Peak Earning Years", description: "Focus on wealth creation alongside protection. ULIPs and endowment plans build retirement corpus.", linkText: "ULIP + Endowment", linkColor: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-white" },
      { emoji: "/images/services/SERVICE - LIFE INSURANCE/Legacy Planning.png", age: "AGE 55+", ageColor: "text-cyan-600", title: "Legacy Planning", description: "Pass on wealth to next generation. Whole life policies ensure estate and assets reach nominees tax-free.", linkText: "Whole Life Plan", linkColor: "text-cyan-600", bg: "bg-gradient-to-br from-cyan-50 to-white" },
    ],
    withoutTitle: "Without Life Insurance",
    withoutItems: [
      "Family scrambles to pay rent and EMIs",
      "Children's education disrupted or halted",
      "Home loan leads to property seizure",
      "Spouse forced to sell assets to survive",
      "No tax-saving benefit on income",
      "Ageing parents left without support",
    ],
    withTitle: "With Life Insurance",
    withItems: [
      "Family's lifestyle secured for 10+ years",
      "Education fund fully pre-funded",
      "All loans cleared from policy payout",
      "Spouse receives lump sum immediately",
      "Save ₹1.5L/year in tax under Sec 80C",
      "Parents receive regular income support",
    ],
    ctaHeading: "Still thinking about it?",
    ctaBody: "Talk to a TransIndia expert — free, no pressure, no sales pitch.",
    faqBadge: "COMMON QUESTIONS",
    faqTitle: "Life Insurance",
    faqTitleAccent: "FAQs",
    faqTitleAccentColor: "#EA580C",
    faqs: [
      { question: "How much life cover do I need?", answer: "A common rule of thumb is 10–15x your annual income, but the right cover depends on your debts, dependents, future goals, and lifestyle. Our advisors can help you calculate a personalised number." },
      { question: "What is a claim settlement ratio?", answer: "The claim settlement ratio is the percentage of claims an insurer has successfully paid out against total claims received in a year. A higher ratio (95%+) indicates the insurer is reliable when it comes to honouring claims." },
      { question: "Can I buy life insurance online?", answer: "Yes, most insurers offer a fully digital process — from comparing plans to e-KYC and online payment. For larger sum assured amounts, a medical check-up may be scheduled at your home." },
      { question: "What happens if I miss a premium?", answer: "Most policies offer a grace period (usually 15–30 days) to pay the missed premium without losing coverage. If the grace period lapses, many insurers allow reinstatement by paying due premiums with interest." },
    ],
  },

  // ─── HEALTH INSURANCE ─────────────────────────────────────────────────────
  "health-insurance": {
    slug: "health-insurance",
    heroAccentWord: "your health,",
    heroRestTitle: "We protect",
    heroSubtitle:
      "Individual, family, and senior citizen health plans starting from ₹299/month. Cashless cover at 10,000+ hospitals across India.",
    heroBadgeText: "Health Insurance",
    heroBadgeBg: "#022c22",
    heroBadgeColor: "#34D399",
    heroStats: [
      { value: "10,000+", label: "Customers Protected" },
      { value: "19+", label: "Insurer Partners" },
      { value: "98%", label: "Claim Settlement" },
    ],
    heroCtaLabel: "Talk to an Expert",
    heroCtaBg: "#0D9488",
    heroAccentColor: "#34D399",
    heroAccentColor2: "#38BDF8",
    whyBadge: "WHY HEALTH INSURANCE?",
    whyTitle: "Medical costs are rising.",
    whyTitleAccent: "Your cover should too.",
    whyTitleAccentColor: "#0D9488",
    whyBody: [
      "Healthcare inflation in India is running at 14% per year — far outpacing general inflation. A single hospitalisation can wipe out years of savings if you're underinsured or uninsured.",
      "A comprehensive health plan gives you access to the best hospitals without worrying about the bill. With cashless settlement, your insurer pays the hospital directly so your family can focus on recovery, not paperwork.",
      "Our advisors compare 15+ insurers to find the right balance of premium, network, sub-limits, and room rent — so you're never caught off-guard at the billing counter.",
    ],
    whyImage: "/images/services/SERVICE - HEALTH INSURANCE/Medical costs are rising Your cover should too..png",
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 reasons to get",
    benefitsTitleAccent: "health cover today",
    benefitsTitleAccentColor: "#0D9488",
    benefitsSubtitle:
      "From hospitalisation to day-care procedures, a good health plan pays for what matters most — your recovery.",
    benefits: [
      { iconBg: "bg-teal-100", emoji: "/images/services/SERVICE - HEALTH INSURANCE/8 reasons - Cashless Hospitalisation.png", title: "Cashless Hospitalisation", description: "Get treated at any network hospital without paying upfront. The insurer settles the bill directly with the hospital." },
      { iconBg: "bg-emerald-100", emoji: "/images/services/SERVICE - HEALTH INSURANCE/8 reasons - Family Floater Cover.png", title: "Family Floater Cover", description: "One policy, one premium covers the entire family. The sum insured can be used by any member whenever needed." },
      { iconBg: "bg-blue-100", emoji: "/images/services/SERVICE - HEALTH INSURANCE/8 reasons - Pre & Post Hospitalisation.png", title: "Pre & Post Hospitalisation", description: "Covers doctor consultations, tests, and medicines before admission (60 days) and after discharge (90 days)." },
      { iconBg: "bg-indigo-100", emoji: "/images/services/SERVICE - HEALTH INSURANCE/8 reasons - Day-Care Procedures.png", title: "Day-Care Procedures", description: "Modern treatments like dialysis, chemotherapy, and cataract surgery that take less than 24 hours are fully covered." },
      { iconBg: "bg-rose-100", emoji: "/images/services/SERVICE - HEALTH INSURANCE/8 reasons - Critical Illness Add-on.png", title: "Critical Illness Add-on", description: "Receive a lump sum on diagnosis of cancer, heart attack, stroke, or kidney failure — independent of hospitalisation." },
      { iconBg: "bg-orange-100", emoji: "/images/services/SERVICE - HEALTH INSURANCE/8 reasons - Senior Citizen Plans.png", title: "Senior Citizen Plans", description: "Specialised policies for 60+ with no medical tests up to a certain age, and covers like cataract and joint replacement." },
      { iconBg: "bg-yellow-100", emoji: "/images/services/SERVICE - HEALTH INSURANCE/8 reasons - Tax Savings under 80D.png", title: "Tax Savings under 80D", description: "Save up to ₹25,000/year (₹50,000 for seniors) on health insurance premiums paid under Section 80D." },
      { iconBg: "bg-cyan-100", emoji: "/images/services/SERVICE - HEALTH INSURANCE/8 reasons - No-Claim Bonus.png", title: "No-Claim Bonus", description: "For every claim-free year, your sum insured increases by 10–50% at no extra cost — reward for staying healthy." },
    ],
    stagesBadge: "AT EVERY LIFE STAGE",
    stagesTitle: "Health needs",
    stagesTitleAccent: "evolve with age",
    stages: [
      { emoji: "/images/services/SERVICE - HEALTH INSURANCE/Health needs - Young & Independent.png", age: "AGE 18–30", ageColor: "text-teal-600", title: "Young & Independent", description: "Low premiums, high coverage. Build the habit early. A ₹5L individual plan costs under ₹5,000/year.", linkText: "Individual Health Plan", linkColor: "text-teal-600", bg: "bg-gradient-to-br from-teal-50 to-white" },
      { emoji: "/images/services/SERVICE - HEALTH INSURANCE/Health needs - Growing Family.png", age: "AGE 30–45", ageColor: "text-blue-600", title: "Growing Family", description: "Switch to a family floater or add maternity cover. Protect spouse and children under one plan.", linkText: "Family Floater Plan", linkColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "/images/services/SERVICE - HEALTH INSURANCE/Health needs - Peak Risk Years.png", age: "AGE 45–60", ageColor: "text-orange-500", title: "Peak Risk Years", description: "Add critical illness riders, increase sum insured, and choose a super top-up for extra buffer.", linkText: "Critical Illness + Top-Up", linkColor: "text-orange-500", bg: "bg-gradient-to-br from-orange-50 to-white" },
      { emoji: "/images/services/SERVICE - HEALTH INSURANCE/Health needs - Senior Coverage.png", age: "AGE 60+", ageColor: "text-rose-600", title: "Senior Coverage", description: "Specialised senior plans with domiciliary cover, OPD benefits, and higher day-care coverage.", linkText: "Senior Citizen Plan", linkColor: "text-rose-600", bg: "bg-gradient-to-br from-rose-50 to-white" },
    ],
    withoutTitle: "Without Health Insurance",
    withoutItems: [
      "Emergency surgery drains life savings overnight",
      "Family delays treatment due to cost concerns",
      "High-interest medical loans burden for years",
      "No access to top private hospitals without upfront payment",
      "Pre-existing conditions become a financial trap",
      "Miss ₹50,000 in annual tax deductions",
    ],
    withTitle: "With Health Insurance",
    withItems: [
      "Cashless treatment at 10,000+ network hospitals",
      "Family gets best care without financial anxiety",
      "Insurer settles bills directly — zero out-of-pocket",
      "Free annual health check-ups every year",
      "Pre-existing conditions covered after waiting period",
      "Save up to ₹50,000/year in tax under Section 80D",
    ],
    ctaHeading: "Need help choosing the right plan?",
    ctaBody: "Our advisors compare 15+ insurers and pick the best fit — free of charge.",
    faqBadge: "COMMON QUESTIONS",
    faqTitle: "Health Insurance",
    faqTitleAccent: "FAQs",
    faqTitleAccentColor: "#0D9488",
    faqs: [
      { question: "What is a waiting period in health insurance?", answer: "A waiting period is the time you must wait before a specific benefit becomes available. Initial waiting periods are usually 30 days. Pre-existing diseases typically have 2–4 years. Specific diseases like hernia or cataracts have 1–2 years." },
      { question: "What is a family floater policy?", answer: "A family floater policy covers the entire family — spouse, children, and sometimes parents — under a single sum insured. Any member can use the full sum insured in a policy year. It's cost-effective compared to individual policies for each member." },
      { question: "Does health insurance cover pre-existing diseases?", answer: "Yes, after a waiting period of 2–4 years depending on the insurer and plan. Some plans offer reduced waiting periods for an additional premium, or even no waiting period if you pass a medical examination." },
      { question: "What is a No-Claim Bonus (NCB)?", answer: "NCB is a reward for not filing any claims in a policy year. Your sum insured increases by 10–50% at renewal without any increase in premium. Some policies accumulate NCB up to 100% of the base sum insured over multiple claim-free years." },
    ],
  },

  // ─── MOTOR INSURANCE ──────────────────────────────────────────────────────
  "motor-insurance": {
    slug: "motor-insurance",
    heroAccentWord: "your vehicle",
    heroRestTitle: "Comprehensive cover for",
    heroSubtitle:
      "Compare premiums from 20+ insurers for cars, bikes, and commercial vehicles. Mandatory third-party and comprehensive plans — instant policy issuance.",
    heroBadgeText: "Motor Insurance",
    heroBadgeBg: "#431407",
    heroBadgeColor: "#FB923C",
    heroStats: [
      { value: "20+", label: "Insurer Partners" },
      { value: "3,500+", label: "Cashless Garages" },
      { value: "24/7", label: "Roadside Assistance" },
    ],
    heroCtaLabel: "Get Motor Quote",
    heroCtaBg: "#EA580C",
    heroAccentColor: "#FB923C",
    heroAccentColor2: "#FCD34D",
    whyBadge: "WHY MOTOR INSURANCE?",
    whyTitle: "It's not just the law.",
    whyTitleAccent: "It's financial protection.",
    whyTitleAccentColor: "#EA580C",
    whyBody: [
      "Third-party motor insurance is mandatory under the Motor Vehicles Act, 1988 — driving without it carries fines and imprisonment. But a third-party-only policy won't cover damage to your own vehicle from accidents, theft, floods, or vandalism.",
      "A comprehensive plan covers your car, the third party, and adds optional riders like zero depreciation, engine protection, and roadside assistance — giving you complete peace of mind on every journey.",
      "Our team compares IDV, cashless garage networks, and claim settlement ratios to ensure you get maximum value for every rupee of premium.",
    ],
    whyImage: "/images/services/SERVICE - MOTOR INSURANCE/It's not just the law..png",
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 reasons to get",
    benefitsTitleAccent: "proper motor cover",
    benefitsTitleAccentColor: "#EA580C",
    benefitsSubtitle:
      "An accident, theft, or natural disaster can happen to any vehicle, anywhere. Make sure you're fully covered when it does.",
    benefits: [
      { iconBg: "bg-orange-100", emoji: "/images/services/SERVICE - MOTOR INSURANCE/It's not just the law..png", title: "Own Damage Cover", description: "Covers repair costs for your vehicle after accidents, floods, fire, theft, and natural disasters — regardless of who is at fault." },
      { iconBg: "bg-rose-100", emoji: "/images/services/SERVICE - MOTOR INSURANCE/8 reasons - Third-Party Liability.png", title: "Third-Party Liability", description: "Mandatory by law. Covers bodily injury, death, or property damage caused to a third party by your vehicle." },
      { iconBg: "bg-yellow-100", emoji: "/images/services/SERVICE - MOTOR INSURANCE/8 reasons - Cashless Garages.png", title: "Cashless Garages", description: "Get repairs done at 3,500+ network garages without paying upfront. The insurer settles the bill directly." },
      { iconBg: "bg-blue-100", emoji: "/images/services/SERVICE - MOTOR INSURANCE/8 reasons - Zero Depreciation.png", title: "Zero Depreciation", description: "Claim the full cost of parts without depreciation deduction. Get 100% value on plastic, rubber, and fibre parts." },
      { iconBg: "bg-emerald-100", emoji: "/images/services/SERVICE - MOTOR INSURANCE/8 reasons - Engine Protection.png", title: "Engine Protection", description: "Covers engine damage due to water ingression or oil leakage — scenarios not covered under standard policies." },
      { iconBg: "bg-indigo-100", emoji: "/images/services/SERVICE - MOTOR INSURANCE/8 reasons - Roadside Assistance.png", title: "Roadside Assistance", description: "24/7 support for breakdown, flat tyre, fuel delivery, towing, and locksmith services — wherever you are." },
      { iconBg: "bg-cyan-100", emoji: "/images/services/SERVICE - MOTOR INSURANCE/8 reasons - NCB Protection.png", title: "NCB Protection", description: "Protect your earned No-Claim Bonus even after filing a claim. Don't lose years of accumulated discounts." },
      { iconBg: "bg-purple-100", emoji: "/images/services/SERVICE - MOTOR INSURANCE/8 reasons - Personal Accident Cover.png", title: "Personal Accident Cover", description: "Compulsory personal accident cover of ₹15 lakh for the owner-driver in case of death or permanent disability." },
    ],
    stagesBadge: "FOR EVERY VEHICLE TYPE",
    stagesTitle: "Motor insurance for",
    stagesTitleAccent: "every kind of driver",
    stages: [
      { emoji: "/images/services/SERVICE - MOTOR INSURANCE/Motor insurance for - Bikes & Scooters.png", age: "TWO-WHEELERS", ageColor: "text-orange-500", title: "Bikes & Scooters", description: "New bike? Mandatory third-party + comprehensive to fully protect your ride from day one.", linkText: "Two-Wheeler Plan", linkColor: "text-orange-500", bg: "bg-gradient-to-br from-orange-50 to-white" },
      { emoji: "/images/services/SERVICE - MOTOR INSURANCE/Motor insurance for - Private Cars.png", age: "PRIVATE CARS", ageColor: "text-blue-600", title: "Private Cars", description: "Comprehensive plans with zero depreciation, engine protect, and roadside assistance for complete peace of mind.", linkText: "Comprehensive Car Plan", linkColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "/images/services/SERVICE - MOTOR INSURANCE/Motor insurance for - Commercial Vehicles.png", age: "COMMERCIAL", ageColor: "text-emerald-600", title: "Commercial Vehicles", description: "Goods carriers, passenger vehicles, taxis — specialised policies that cover commercial use and goods in transit.", linkText: "Commercial Vehicle Plan", linkColor: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-white" },
      { emoji: "/images/services/SERVICE - MOTOR INSURANCE/Motor insurance for - Electric Vehicles.png", age: "ELECTRIC VEHICLES", ageColor: "text-cyan-600", title: "Electric Vehicles", description: "Specialised EV insurance covering battery, charging equipment, and roadside assistance for electric mobility.", linkText: "EV Insurance Plan", linkColor: "text-cyan-600", bg: "bg-gradient-to-br from-cyan-50 to-white" },
    ],
    withoutTitle: "Without Comprehensive Cover",
    withoutItems: [
      "Accident repair bills of ₹50,000–₹5 lakh out of pocket",
      "Theft of vehicle with no compensation",
      "Flood or fire damage leaves you stranded",
      "Legal liability for third-party injury is unlimited",
      "Engine failure due to waterlogging — not covered",
      "Fines and legal trouble for mandatory policy lapse",
    ],
    withTitle: "With Comprehensive Cover",
    withItems: [
      "All accident repair costs covered at network garages",
      "Full IDV paid in case of theft or total loss",
      "Natural disaster damage fully reimbursed",
      "Third-party liability fully covered by insurer",
      "Engine protect add-on handles waterlogging costs",
      "Policy renewed in minutes — stay legally compliant",
    ],
    ctaHeading: "Ready to insure your vehicle?",
    ctaBody: "Compare 20+ insurers and get your policy issued in under 5 minutes.",
    faqBadge: "COMMON QUESTIONS",
    faqTitle: "Motor Insurance",
    faqTitleAccent: "FAQs",
    faqTitleAccentColor: "#EA580C",
    faqs: [
      { question: "What is IDV in motor insurance?", answer: "IDV (Insured Declared Value) is the current market value of your vehicle — it's the maximum amount the insurer will pay in case of total loss or theft. A higher IDV means better compensation but slightly higher premiums. Always opt for the correct IDV, not the lowest." },
      { question: "What is zero depreciation cover?", answer: "Normally, insurers deduct depreciation (10–50%) on parts replaced during a claim. Zero depreciation add-on removes this deduction, so you receive the full replacement cost. It's highly recommended for vehicles under 5 years old." },
      { question: "Does motor insurance cover natural disasters?", answer: "Yes, comprehensive motor insurance covers damage caused by floods, cyclones, earthquakes, landslides, and other natural calamities under the 'Act of God' clause. Standalone third-party policies do not cover own damage." },
      { question: "What is NCB in motor insurance?", answer: "NCB (No-Claim Bonus) is a discount on your renewal premium for every claim-free year — ranging from 20% after year 1 to 50% after 5 consecutive claim-free years. You can protect your NCB with an NCB Protection add-on." },
    ],
  },

  // ─── HOME INSURANCE ───────────────────────────────────────────────────────
  "home-insurance": {
    slug: "home-insurance",
    heroAccentWord: "your biggest",
    heroRestTitle: "Protect",
    heroSubtitle:
      "Structure and contents coverage against fire, flood, theft, and earthquakes. Starting from just ₹2,000/year.",
    heroBadgeText: "Home Insurance",
    heroBadgeBg: "#2e1065",
    heroBadgeColor: "#A78BFA",
    heroStats: [
      { value: "₹2K", label: "Starting Premium/Year" },
      { value: "15+", label: "Insurer Partners" },
      { value: "100%", label: "Rebuild Cover Available" },
    ],
    heroCtaLabel: "Get Home Quote",
    heroCtaBg: "#7C3AED",
    heroAccentColor: "#A78BFA",
    heroAccentColor2: "#38BDF8",
    whyBadge: "WHY HOME INSURANCE?",
    whyTitle: "Your home is your",
    whyTitleAccent: "most valuable asset.",
    whyTitleAccentColor: "#7C3AED",
    whyBody: [
      "Most Indian homeowners insure their cars but leave their homes — worth 10–100x more — completely unprotected. A single fire, flood, or burglary can result in losses running into crores.",
      "Home insurance covers the structure (walls, roof, flooring) and/or contents (furniture, electronics, jewellery) against a wide range of perils including natural disasters, electrical faults, and malicious damage.",
      "Remarkably affordable at ₹2,000–₹10,000/year for most homes, it's perhaps the most underused financial safety net available to Indian homeowners.",
    ],
    whyImage: "/images/services/SERVICE - HOME INSURANCE/Home-why-section.png",
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 ways home insurance",
    benefitsTitleAccent: "protects your property",
    benefitsTitleAccentColor: "#7C3AED",
    benefitsSubtitle:
      "From natural disasters to burglary, home insurance covers the risks that could rob you of your biggest investment.",
    benefits: [
      { iconBg: "bg-purple-100", emoji: "/images/services/SERVICE - HOME INSURANCE/Structure Cover.png", title: "Structure Cover", description: "Covers the building — walls, roof, floors, fixed fittings — against fire, earthquake, cyclone, flood, and subsidence." },
      { iconBg: "bg-indigo-100", emoji: "/images/services/SERVICE - HOME INSURANCE/Contents Cover.png", title: "Contents Cover", description: "Protects furniture, appliances, electronics, clothing, and valuables inside your home against damage or theft." },
      { iconBg: "bg-rose-100", emoji: "/images/services/SERVICE - HOME INSURANCE/Fire & Allied Perils.png", title: "Fire & Allied Perils", description: "Covers damage from fire, lightning, explosion, aircraft impact, riot, strike, and malicious acts." },
      { iconBg: "bg-blue-100", emoji: "/images/services/SERVICE - HOME INSURANCE/Natural Disaster Cover.png", title: "Natural Disaster Cover", description: "Floods, cyclones, earthquakes, landslides, storms — all covered under a standard comprehensive home policy." },
      { iconBg: "bg-yellow-100", emoji: "/images/services/SERVICE - HOME INSURANCE/Burglary Protection.png", title: "Burglary Protection", description: "Cash, jewellery, electronics, and other valuables covered against theft and burglary, with or without forced entry." },
      { iconBg: "bg-teal-100", emoji: "/images/services/SERVICE - HOME INSURANCE/Rent Compensation.png", title: "Rent Compensation", description: "If your home becomes uninhabitable due to an insured peril, rent for alternative accommodation is reimbursed." },
      { iconBg: "bg-orange-100", emoji: "/images/services/SERVICE - HOME INSURANCE/Electrical Breakdown.png", title: "Electrical Breakdown", description: "Covers damage to appliances and fixed electrical fittings caused by short circuits and electrical fluctuations." },
      { iconBg: "bg-cyan-100", emoji: "/images/services/SERVICE - HOME INSURANCE/Workmen's Liability.png", title: "Workmen's Liability", description: "Covers accidental injury to domestic workers, delivery personnel, or guests on your property." },
    ],
    stagesBadge: "FOR EVERY HOME TYPE",
    stagesTitle: "Cover tailored to",
    stagesTitleAccent: "your property",
    stages: [
      { emoji: "/images/services/SERVICE - HOME INSURANCE/Apartment Units.png", age: "APARTMENTS", ageColor: "text-purple-600", title: "Apartment Units", description: "Contents-only plans for flat owners. Structure is typically covered by society — insure your interiors and belongings.", linkText: "Contents Plan", linkColor: "text-purple-600", bg: "bg-gradient-to-br from-purple-50 to-white" },
      { emoji: "/images/services/SERVICE - HOME INSURANCE/Independent Houses.png", age: "INDEPENDENT HOUSES", ageColor: "text-blue-600", title: "Independent Houses", description: "Full structure + contents cover. Rebuild cost insurance ensures you can reconstruct if the worst happens.", linkText: "Structure + Contents", linkColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "/images/services/SERVICE - HOME INSURANCE/Tenants.png", age: "RENTED HOMES", ageColor: "text-emerald-600", title: "Tenants", description: "Protect your contents — furniture, appliances, and personal belongings — even if you don't own the property.", linkText: "Tenant Contents Plan", linkColor: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-white" },
      { emoji: "/images/services/SERVICE - HOME INSURANCE/Premium Properties.png", age: "HIGH-VALUE HOMES", ageColor: "text-cyan-600", title: "Premium Properties", description: "Bespoke policies for villas, luxury homes, and high-value contents including art, antiques, and jewellery.", linkText: "High-Value Home Plan", linkColor: "text-cyan-600", bg: "bg-gradient-to-br from-cyan-50 to-white" },
    ],
    withoutTitle: "Without Home Insurance",
    withoutItems: [
      "Fire destroys the house — rebuild cost is yours alone",
      "Flood damage to interiors costs ₹10–50 lakh",
      "Burglary leaves you replacing electronics out of pocket",
      "Earthquake cracks the structure — no compensation",
      "Paying rent elsewhere while home is repaired",
      "Neighbour's water leak ruins your flat — no cover",
    ],
    withTitle: "With Home Insurance",
    withItems: [
      "Full rebuild cost covered — structure and interiors",
      "Flood and storm damage reimbursed by insurer",
      "Stolen electronics and jewellery fully compensated",
      "Earthquake damage assessed and settled promptly",
      "Rent allowance paid while home is being repaired",
      "Third-party liability for accidents on your property covered",
    ],
    ctaHeading: "Your home deserves protection too.",
    ctaBody: "Get comprehensive home cover in minutes — starting at just ₹2,000/year.",
    faqBadge: "COMMON QUESTIONS",
    faqTitle: "Home Insurance",
    faqTitleAccent: "FAQs",
    faqTitleAccentColor: "#7C3AED",
    faqs: [
      { question: "Does home insurance cover tenant damage?", answer: "Standard home insurance does not cover intentional damage by tenants, but it does cover accidental damage, fire, or water damage. Some insurers offer landlord-specific policies that include malicious damage by tenants." },
      { question: "What is the difference between reinstatement value and market value?", answer: "Market value is the current resale price of your property. Reinstatement value (also called rebuild cost) is what it would cost to rebuild the structure from scratch. For insurance purposes, reinstatement value is generally recommended as it provides complete protection." },
      { question: "Are valuables like jewellery and art covered?", answer: "Yes, but typically up to a sub-limit. For high-value items like jewellery, antiques, or art, you may need to declare them separately and pay an additional premium to ensure full coverage." },
      { question: "Does the policy cover damage to a rented property?", answer: "As a tenant, you can insure your contents (furniture, appliances, personal belongings) even if you don't own the property. You cannot insure the structure — that's the landlord's responsibility. Tenant contents plans are available at very affordable premiums." },
    ],
  },

  



  // ─── MARINE INSURANCE ─────────────────────────────────────────────────────
  "marine-insurance": {
    slug: "marine-insurance",
    heroAccentWord: "in transit",
    heroRestTitle: "Protect your cargo",
    heroSubtitle:
      "Cover for goods moving by sea, air, road, or rail — against loss, damage, theft, and general average. Single-transit and annual open policies for importers, exporters, and traders.",
    heroBadgeText: "Marine Insurance",
    heroBadgeBg: "#0c4a6e",
    heroBadgeColor: "#38BDF8",
    heroStats: [
      { value: "150+", label: "Countries Covered" },
      { value: "24/7", label: "Claims Support" },
      { value: "₹100Cr", label: "Max Cargo Value" },
    ],
    heroCtaLabel: "Get Marine Quote",
    heroCtaBg: "#0369A1",
    heroAccentColor: "#38BDF8",
    heroAccentColor2: "#22D3EE",
    whyBadge: "WHY MARINE INSURANCE?",
    whyTitle: "Every shipment is a risk",
    whyTitleAccent: "until it's covered.",
    whyTitleAccentColor: "#0369A1",
    whyBody: [
      "Goods in transit face a long list of hazards — rough seas, mishandling, theft, fire, collision, and natural calamities. A single damaged or lost consignment can wipe out the margin on an entire export order.",
      "Marine insurance covers cargo from warehouse to warehouse, across every leg of the journey, whether moving by ship, aircraft, truck, or train. Open policies cover all your shipments in a period under one contract — no need to insure each one separately.",
      "Our team structures cover around Incoterms, transit routes, and commodity type, so you're protected against the specific perils your goods face — and never overpay for cover you don't need.",
    ],
    whyImage: "/images/services/SERVICE - MARINE INSURANCE/Every shipment is a risk.png",
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 ways marine cover",
    benefitsTitleAccent: "protects your trade",
    benefitsTitleAccentColor: "#0369A1",
    benefitsSubtitle:
      "From a single export consignment to year-round trade flows, marine insurance keeps a damaged shipment from becoming a damaged business.",
    benefits: [
      { iconBg: "bg-sky-100", emoji: "/images/services/SERVICE - MARINE INSURANCE/All-Risk Transit Cover.png", title: "All-Risk Transit Cover", description: "Covers loss or damage to cargo by sea, air, road, or rail — from the supplier's warehouse to the final destination." },
      { iconBg: "bg-blue-100", emoji: "/images/services/SERVICE - MARINE INSURANCE/Open  Annual Policies.png", title: "Open / Annual Policies", description: "Cover every shipment in a year under one contract. Declare consignments as they move — no per-shipment paperwork." },
      { iconBg: "bg-indigo-100", emoji: "/images/services/SERVICE - MARINE INSURANCE/Natural Calamity Cover.png", title: "Natural Calamity Cover", description: "Protection against storms, cyclones, flooding, and other Acts of God that can damage or sink cargo in transit." },
      { iconBg: "bg-cyan-100", emoji: "/images/services/SERVICE - MARINE INSURANCE/General Average.png", title: "General Average", description: "Covers your share of losses when cargo is deliberately sacrificed or expenses incurred to save the whole voyage." },
      { iconBg: "bg-teal-100", emoji: "/images/services/SERVICE - MARINE INSURANCE/Fire, Theft & Pilferage.png", title: "Fire, Theft & Pilferage", description: "Covers loss from fire, theft, non-delivery, and pilferage — common risks in multi-leg international shipping." },
      { iconBg: "bg-emerald-100", emoji: "/images/services/SERVICE - MARINE INSURANCE/Warehouse-to-Warehouse.png", title: "Warehouse-to-Warehouse", description: "Cover begins at the origin warehouse and ends at the destination — the full door-to-door journey is protected." },
      { iconBg: "bg-orange-100", emoji: "/images/services/SERVICE - MARINE INSURANCE/Incoterms Aligned.png", title: "Incoterms Aligned", description: "Cover structured to your CIF, FOB, or EXW terms so the risk is insured by the right party at the right time." },
      { iconBg: "bg-rose-100", emoji: "/images/services/SERVICE - MARINE INSURANCE/Fast Claims Settlement.png", title: "Fast Claims Settlement", description: "Surveyor-backed claims process with global support, so a damaged consignment is assessed and settled quickly." },
    ],
    stagesBadge: "FOR EVERY KIND OF SHIPMENT",
    stagesTitle: "Marine cover for",
    stagesTitleAccent: "how you trade",
    stages: [
      { emoji: "/images/services/SERVICE - MARINE INSURANCE/Imports.png", age: "IMPORTERS", ageColor: "text-sky-600", title: "Imports", description: "Cover incoming consignments from overseas suppliers — sea or air — against transit loss and customs-stage damage.", linkText: "Import Cargo Plan", linkColor: "text-sky-600", bg: "bg-gradient-to-br from-sky-50 to-white" },
      { emoji: "/images/services/SERVICE - MARINE INSURANCE/Exports.png", age: "EXPORTERS", ageColor: "text-blue-600", title: "Exports", description: "Protect outbound shipments to global buyers. CIF cover that meets your buyer's contractual insurance requirements.", linkText: "Export Cargo Plan", linkColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "/images/services/SERVICE - MARINE INSURANCE/Inland Transit.png", age: "DOMESTIC TRADERS", ageColor: "text-indigo-600", title: "Inland Transit", description: "Cover for goods moving within India by road or rail — ideal for manufacturers and distributors with regular dispatches.", linkText: "Inland Transit Plan", linkColor: "text-indigo-600", bg: "bg-gradient-to-br from-indigo-50 to-white" },
      { emoji: "/images/services/SERVICE - MARINE INSURANCE/Open Policies.png", age: "REGULAR SHIPPERS", ageColor: "text-cyan-600", title: "Open Policies", description: "High-volume traders cover all annual shipments under one declared open policy — simple, continuous protection.", linkText: "Open Marine Policy", linkColor: "text-cyan-600", bg: "bg-gradient-to-br from-cyan-50 to-white" },
    ],
    withoutTitle: "Without Marine Insurance",
    withoutItems: [
      "A sunk or damaged consignment is a 100% loss",
      "Theft or pilferage in transit goes uncompensated",
      "Your share of general average falls entirely on you",
      "Buyers may reject CIF orders with no valid cover",
      "Customs or port damage leaves you out of pocket",
      "One bad shipment erases the profit on many good ones",
    ],
    withTitle: "With Marine Insurance",
    withItems: [
      "Lost or damaged cargo reimbursed at insured value",
      "Theft, pilferage, and non-delivery fully covered",
      "General average contributions handled by the insurer",
      "CIF cover meets your export contract obligations",
      "Door-to-door protection across every transit leg",
      "Steady margins — one loss can't sink the business",
    ],
    ctaHeading: "Shipping soon? Insure before it sails.",
    ctaBody: "Get a marine cargo quote tailored to your route, commodity, and Incoterms — fast.",
    faqBadge: "COMMON QUESTIONS",
    faqTitle: "Marine Insurance",
    faqTitleAccent: "FAQs",
    faqTitleAccentColor: "#0369A1",
    faqs: [
      { question: "What is an open marine policy?", answer: "An open policy covers all shipments made during a defined period (usually a year) under a single contract. You declare each consignment as it moves, instead of buying a separate policy per shipment — ideal for businesses with frequent dispatches." },
      { question: "What is 'general average' in marine insurance?", answer: "General average is a maritime principle where all parties in a sea voyage proportionally share losses when cargo is deliberately sacrificed or extra expenses are incurred to save the vessel and remaining cargo. Marine insurance covers your share of this contribution." },
      { question: "Does marine insurance cover inland transit within India?", answer: "Yes. Inland transit (marine) policies cover goods moving within India by road or rail against accidents, fire, theft, and natural calamities — it's not limited to sea voyages despite the name 'marine'." },
      { question: "Who should buy the marine policy — buyer or seller?", answer: "It depends on the Incoterms. Under CIF, the seller arranges insurance; under FOB or EXW, the buyer typically does. We help you align the policy with your trade terms so the risk is always covered by the right party." },
    ],
  },

  // ─── FIRE INSURANCE ───────────────────────────────────────────────────────
  "fire-insurance": {
    slug: "fire-insurance",
    heroAccentWord: "from the ground up",
    heroRestTitle: "Protect your property",
    heroSubtitle:
      "Standard Fire & Special Perils cover for factories, offices, shops, warehouses, and stock — against fire, lightning, explosion, riot, and natural disasters.",
    heroBadgeText: "Fire Insurance",
    heroBadgeBg: "#7c2d12",
    heroBadgeColor: "#FB923C",
    heroStats: [
      { value: "12+", label: "Perils Covered" },
      { value: "₹500Cr", label: "Max Sum Insured" },
      { value: "48hr", label: "Claim Survey" },
    ],
    heroCtaLabel: "Get Fire Quote",
    heroCtaBg: "#DC2626",
    heroAccentColor: "#FB923C",
    heroAccentColor2: "#FCD34D",
    whyBadge: "WHY FIRE INSURANCE?",
    whyTitle: "It takes minutes to lose",
    whyTitleAccent: "what took years to build.",
    whyTitleAccentColor: "#DC2626",
    whyBody: [
      "A single fire can destroy a factory, warehouse, or shop along with the stock and machinery inside it — turning a thriving business into rubble in hours. For most enterprises, the building and inventory represent the bulk of their capital.",
      "The Standard Fire & Special Perils policy covers far more than fire alone. It protects against lightning, explosion, riot and strike, malicious damage, storm, flood, earthquake, and even impact damage — a wide net of named perils under one contract.",
      "Our advisors help you set the correct sum insured (on reinstatement or market value), avoid under-insurance penalties, and add covers like loss of profit so your business survives the recovery period, not just the fire.",
    ],
    whyImage: "/images/services/SERVICE - FIRE INSURANCE/It takes minutes to lose.png",
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 perils fire insurance",
    benefitsTitleAccent: "shields you from",
    benefitsTitleAccentColor: "#DC2626",
    benefitsSubtitle:
      "From an electrical short circuit to a once-in-a-decade flood, fire insurance covers the catastrophes that can erase a business overnight.",
    benefits: [
      { iconBg: "bg-red-100", emoji: "/images/services/SERVICE - FIRE INSURANCE/Fire & Lightning.png", title: "Fire & Lightning", description: "Covers damage to building, plant, machinery, and stock from fire and lightning strikes — the core of the policy." },
      { iconBg: "bg-orange-100", emoji: "/images/services/SERVICE - FIRE INSURANCE/Explosion & Implosion.png", title: "Explosion & Implosion", description: "Damage caused by explosion or implosion of boilers, gas, and other equipment is covered under the standard policy." },
      { iconBg: "bg-yellow-100", emoji: "/images/services/SERVICE - FIRE INSURANCE/Storm, Cyclone & Flood.png", title: "Storm, Cyclone & Flood", description: "Natural perils — storm, tempest, flood, inundation, hurricane, and cyclone — are all covered as named perils." },
      { iconBg: "bg-amber-100", emoji: "/images/services/SERVICE - FIRE INSURANCE/Earthquake (Add-on).png", title: "Earthquake (Add-on)", description: "Earthquake and volcanic eruption cover can be added to protect against seismic damage to property and contents." },
      { iconBg: "bg-rose-100", emoji: "/images/services/SERVICE - FIRE INSURANCE/Riot, Strike & Malicious Damage.png", title: "Riot, Strike & Malicious Damage", description: "Covers damage to property from riots, strikes, and deliberate malicious acts by external parties." },
      { iconBg: "bg-blue-100", emoji: "/images/services/SERVICE - FIRE INSURANCE/Bursting of Water Tanks.png", title: "Bursting of Water Tanks", description: "Damage from bursting or overflowing of water tanks, apparatus, and pipes is included in the cover." },
      { iconBg: "bg-indigo-100", emoji: "/images/services/SERVICE - FIRE INSURANCE/Impact Damage.png", title: "Impact Damage", description: "Covers damage caused by impact from vehicles, aircraft, or other external objects falling on the insured property." },
      { iconBg: "bg-emerald-100", emoji: "/images/services/SERVICE - FIRE INSURANCE/Loss of Profit (Add-on).png", title: "Loss of Profit (Add-on)", description: "Business interruption cover replaces lost profit and standing charges while you rebuild after an insured fire." },
    ],
    stagesBadge: "FOR EVERY KIND OF PREMISES",
    stagesTitle: "Fire cover for",
    stagesTitleAccent: "every business",
    stages: [
      { emoji: "/images/services/SERVICE - FIRE INSURANCE/Manufacturing Units.png", age: "FACTORIES", ageColor: "text-red-600", title: "Manufacturing Units", description: "Cover building, plant, machinery, raw material, and finished stock against fire and allied perils under one policy.", linkText: "Factory Fire Plan", linkColor: "text-red-600", bg: "bg-gradient-to-br from-red-50 to-white" },
      { emoji: "/images/services/SERVICE - FIRE INSURANCE/Shops & Showrooms.png", age: "SHOPS & RETAIL", ageColor: "text-orange-500", title: "Shops & Showrooms", description: "Protect your premises, fittings, and inventory. Essential for retailers carrying high-value stock on the floor.", linkText: "Shopkeeper Fire Plan", linkColor: "text-orange-500", bg: "bg-gradient-to-br from-orange-50 to-white" },
      { emoji: "/images/services/SERVICE - FIRE INSURANCE/Godowns & Warehouses.png", age: "WAREHOUSES", ageColor: "text-amber-600", title: "Godowns & Warehouses", description: "Cover large stockholdings against fire, flood, and theft. Declaration policies handle fluctuating inventory value.", linkText: "Warehouse Fire Plan", linkColor: "text-amber-600", bg: "bg-gradient-to-br from-amber-50 to-white" },
      { emoji: "/images/services/SERVICE - FIRE INSURANCE/Offices & IT Parks.png", age: "OFFICES", ageColor: "text-emerald-600", title: "Offices & IT Parks", description: "Protect office buildings, furniture, electronics, and equipment from fire, electrical faults, and natural perils.", linkText: "Office Fire Plan", linkColor: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-white" },
    ],
    withoutTitle: "Without Fire Insurance",
    withoutItems: [
      "A factory fire destroys building and machinery — total loss",
      "Burnt stock and inventory written off entirely",
      "Flood or storm damage repaired out of pocket",
      "Riot or malicious damage leaves you uncompensated",
      "Business shut for months with no income cover",
      "Lenders may call in loans on uninsured assets",
    ],
    withTitle: "With Fire Insurance",
    withItems: [
      "Building, plant, and machinery rebuilt at insured value",
      "Damaged or destroyed stock fully reimbursed",
      "Storm, flood, and earthquake damage covered",
      "Riot, strike, and malicious damage compensated",
      "Loss-of-profit add-on keeps income flowing during recovery",
      "Assets stay protected — lenders and partners reassured",
    ],
    ctaHeading: "Don't wait for the alarm to ring.",
    ctaBody: "Get the right sum insured and perils covered — talk to a TransIndia advisor today.",
    faqBadge: "COMMON QUESTIONS",
    faqTitle: "Fire Insurance",
    faqTitleAccent: "FAQs",
    faqTitleAccentColor: "#DC2626",
    faqs: [
      { question: "What does a Standard Fire & Special Perils policy cover?", answer: "It covers fire, lightning, explosion/implosion, riot and strike, malicious damage, storm, cyclone, flood, inundation, impact damage, bursting of water tanks, and more — a set of named perils. Earthquake and terrorism are typically optional add-ons." },
      { question: "What is under-insurance and how does it affect claims?", answer: "Under-insurance happens when the sum insured is lower than the actual value of the property. In a claim, the insurer applies the 'average clause' — paying only the proportion that the sum insured bears to the true value. Correct valuation avoids this penalty." },
      { question: "Is earthquake damage covered automatically?", answer: "No. Earthquake (including volcanic eruption and tsunami) is an optional add-on to the Standard Fire policy. In earthquake-prone zones it's strongly recommended, and the additional premium is usually modest relative to the protection." },
      { question: "Can I cover loss of business income after a fire?", answer: "Yes, through a 'Loss of Profit' or Business Interruption add-on. It compensates for lost net profit and ongoing fixed expenses during the period your business cannot operate while premises or machinery are being restored." },
    ],
  },

  // ─── MISCELLANEOUS INSURANCE ──────────────────────────────────────────────
  "miscellaneous-insurance": {
    slug: "miscellaneous-insurance",
    heroAccentWord: "everything else",
    heroRestTitle: "Cover for",
    heroSubtitle:
      "Specialised policies beyond the standard lines — burglary, fidelity guarantee, money in transit, machinery breakdown, professional indemnity, and more. The cover for risks others overlook.",
    heroBadgeText: "Miscellaneous Insurance",
    heroBadgeBg: "#3730a3",
    heroBadgeColor: "#818CF8",
    heroStats: [
      { value: "15+", label: "Specialised Covers" },
      { value: "₹50Cr", label: "Max Liability Cover" },
      { value: "Custom", label: "Tailored Policies" },
    ],
    heroCtaLabel: "Get a Quote",
    heroCtaBg: "#4F46E5",
    heroAccentColor: "#818CF8",
    heroAccentColor2: "#38BDF8",
    whyBadge: "WHY MISCELLANEOUS INSURANCE?",
    whyTitle: "Some risks don't fit",
    whyTitleAccent: "a standard box.",
    whyTitleAccentColor: "#4F46E5",
    whyBody: [
      "Not every risk is a fire, an accident, or an illness. Businesses and individuals face a wide range of exposures — employee dishonesty, burglary, cash in transit, equipment breakdown, professional errors, and liability claims — that fall outside standard policies.",
      "Miscellaneous insurance is a family of specialised covers built for exactly these gaps. From fidelity guarantee that protects against staff fraud, to machinery breakdown that covers equipment failure, each policy targets a specific, often-overlooked risk.",
      "Our advisors map your unique exposures and assemble the right combination of covers — so you're protected against the risks that standard life, health, motor, and property policies simply don't touch.",
    ],
    whyImage: "/images/services/SERVICE - Miscellaneous Insurance/Some risks don't fit.png",
    benefitsBadge: "THE COVERS",
    benefitsTitle: "8 specialised covers",
    benefitsTitleAccent: "under one roof",
    benefitsTitleAccentColor: "#4F46E5",
    benefitsSubtitle:
      "Each of these targets a specific risk that standard policies leave wide open. Pick the ones that match your exposure.",
    benefits: [
      { iconBg: "bg-indigo-100", emoji: "/images/services/SERVICE - Miscellaneous Insurance/Burglary & Housebreaking.png", title: "Burglary & Housebreaking", description: "Covers loss of property, stock, and valuables due to burglary, theft, or housebreaking from your premises." },
      { iconBg: "bg-violet-100", emoji: "/images/services/SERVICE - Miscellaneous Insurance/Fidelity Guarantee.png", title: "Fidelity Guarantee", description: "Protects your business against financial loss from fraud, embezzlement, or dishonesty by your own employees." },
      { iconBg: "bg-blue-100", emoji: "/images/services/SERVICE - Miscellaneous Insurance/Money in Transit.png", title: "Money in Transit", description: "Covers cash, cheques, and valuables against loss or theft while being carried between premises, bank, or sites." },
      { iconBg: "bg-cyan-100", emoji: "/images/services/SERVICE - Miscellaneous Insurance/Machinery Breakdown.png", title: "Machinery Breakdown", description: "Covers sudden, unforeseen mechanical or electrical breakdown of plant and machinery, including repair costs." },
      { iconBg: "bg-emerald-100", emoji: "/images/services/SERVICE - Miscellaneous Insurance/Professional Indemnity.png", title: "Professional Indemnity", description: "Protects doctors, architects, consultants, and CAs against claims of negligence or errors in professional service." },
      { iconBg: "bg-rose-100", emoji: "/images/services/SERVICE - Miscellaneous Insurance/Public Liability.png", title: "Public Liability", description: "Covers legal liability for third-party injury or property damage arising from your business operations or premises." },
      { iconBg: "bg-orange-100", emoji: "/images/services/SERVICE - Miscellaneous Insurance/Electronic Equipment.png", title: "Electronic Equipment", description: "All-risk cover for computers, servers, medical devices, and sensitive electronics against damage and breakdown." },
      { iconBg: "bg-teal-100", emoji: "/images/services/SERVICE - Miscellaneous Insurance/Workmen's Compensation.png", title: "Workmen's Compensation", description: "Covers your statutory liability to pay compensation to employees for work-related injury, disability, or death." },
    ],
    stagesBadge: "WHO NEEDS THESE COVERS",
    stagesTitle: "Tailored protection for",
    stagesTitleAccent: "specific risks",
    stages: [
      { emoji: "/images/services/SERVICE - Miscellaneous Insurance/SMEs & Enterprises.png", age: "BUSINESSES", ageColor: "text-indigo-600", title: "SMEs & Enterprises", description: "Burglary, fidelity, money-in-transit, and public liability — cover the operational risks every business carries.", linkText: "Business Risk Pack", linkColor: "text-indigo-600", bg: "bg-gradient-to-br from-indigo-50 to-white" },
      { emoji: "/images/services/SERVICE - Miscellaneous Insurance/Doctors & Consultants.png", age: "PROFESSIONALS", ageColor: "text-blue-600", title: "Doctors & Consultants", description: "Professional indemnity protects against negligence claims — essential for medical, legal, and advisory practices.", linkText: "Professional Indemnity", linkColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "/images/services/SERVICE - Miscellaneous Insurance/Factories & Plants.png", age: "MANUFACTURERS", ageColor: "text-violet-600", title: "Factories & Plants", description: "Machinery breakdown and electronic equipment cover keep production running when critical equipment fails.", linkText: "Machinery Cover", linkColor: "text-violet-600", bg: "bg-gradient-to-br from-violet-50 to-white" },
      { emoji: "/images/services/SERVICE - Miscellaneous Insurance/Shops & Establishments.png", age: "RETAILERS", ageColor: "text-emerald-600", title: "Shops & Establishments", description: "Burglary and money-in-transit cover protect retail cash, stock, and daily banking from theft and loss.", linkText: "Shopkeeper Pack", linkColor: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-white" },
    ],
    withoutTitle: "Without Specialised Cover",
    withoutItems: [
      "Employee fraud drains accounts with no recovery",
      "Burglary loss falls entirely on the business",
      "Cash stolen in transit is gone for good",
      "A machinery breakdown halts production for weeks",
      "A negligence claim threatens your professional savings",
      "A third-party injury lawsuit is paid from your pocket",
    ],
    withTitle: "With Specialised Cover",
    withItems: [
      "Employee dishonesty losses reimbursed by fidelity cover",
      "Burglary and theft of property fully compensated",
      "Cash in transit protected door to door",
      "Equipment breakdown repairs covered, downtime reduced",
      "Professional indemnity defends and settles negligence claims",
      "Public liability handles third-party injury and damage costs",
    ],
    ctaHeading: "Not sure which cover you need?",
    ctaBody: "Our advisors map your exact exposures and build the right mix — free of charge.",
    faqBadge: "COMMON QUESTIONS",
    faqTitle: "Miscellaneous Insurance",
    faqTitleAccent: "FAQs",
    faqTitleAccentColor: "#4F46E5",
    faqs: [
      { question: "What is fidelity guarantee insurance?", answer: "Fidelity guarantee covers a business against financial loss caused by fraud, theft, embezzlement, or dishonesty committed by its own employees. It's vital for businesses where staff handle cash, stock, or sensitive accounts." },
      { question: "What does machinery breakdown insurance cover?", answer: "It covers sudden and unforeseen physical damage to plant and machinery from internal causes — electrical faults, mechanical failure, short circuits, and similar breakdowns — including the cost of repair or replacement. It complements fire insurance, which excludes such failures." },
      { question: "Who needs professional indemnity insurance?", answer: "Professionals who give advice or provide services — doctors, architects, engineers, lawyers, chartered accountants, and consultants — need it. It protects against claims of negligence, errors, or omissions in their professional work and covers legal defence costs." },
      { question: "Can these covers be combined into one policy?", answer: "Yes. Many of these covers can be bundled into a package policy (such as a shopkeeper's or office package), which is often more cost-effective than buying each separately. We help you assemble the right combination for your risk profile." },
    ],
  },

  // ─── ENTERTAINMENT INSURANCE ──────────────────────────────────────────────
  "entertainment-insurance": {
    slug: "entertainment-insurance",
    heroAccentWord: "the show goes on",
    heroRestTitle: "Make sure",
    heroSubtitle:
      "Cover for films, events, concerts, and productions — against cancellation, equipment loss, cast non-appearance, public liability, and weather disruption. The safety net behind every production.",
    heroBadgeText: "Entertainment Insurance",
    heroBadgeBg: "#581c87",
    heroBadgeColor: "#C084FC",
    heroStats: [
      { value: "500+", label: "Productions Covered" },
      { value: "₹50Cr", label: "Max Production Cover" },
      { value: "24/7", label: "On-Set Support" },
    ],
    heroCtaLabel: "Get Production Quote",
    heroCtaBg: "#9333EA",
    heroAccentColor: "#C084FC",
    heroAccentColor2: "#F0ABFC",
    whyBadge: "WHY ENTERTAINMENT INSURANCE?",
    whyTitle: "One disruption can sink",
    whyTitleAccent: "an entire production.",
    whyTitleAccentColor: "#9333EA",
    whyBody: [
      "Films, concerts, and live events run on tight budgets and immovable dates. A lead actor falling ill, a damaged camera rig, a rained-out concert, or an accident on set can cost lakhs — even crores — in delays, refunds, and re-shoots.",
      "Entertainment insurance covers the specific risks of production and live events — from cast non-appearance and equipment loss to event cancellation, public liability, and weather disruption. It's the difference between a setback and a shutdown.",
      "Our advisors understand production schedules, contracts, and risk windows. We structure cover around your shoot dates, venues, and cast, so a single bad day doesn't derail months of work.",
    ],
    whyImage: "/images/services/SERVICE - Entertainment Insurance/One disruption can sink.png",
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 risks entertainment cover",
    benefitsTitleAccent: "keeps off your set",
    benefitsTitleAccentColor: "#9333EA",
    benefitsSubtitle:
      "From pre-production to the final curtain, entertainment insurance covers the disruptions that no budget can absorb.",
    benefits: [
      { iconBg: "bg-purple-100", emoji: "/images/services/SERVICE - Entertainment Insurance/Production Cancellation.png", title: "Production Cancellation", description: "Covers costs if a shoot or event is cancelled, postponed, or abandoned due to insured causes beyond your control." },
      { iconBg: "bg-violet-100", emoji: "/images/services/SERVICE - Entertainment Insurance/Cast Non-Appearance.png", title: "Cast Non-Appearance", description: "Covers extra costs and losses if a key cast member can't appear due to illness, injury, or death during production." },
      { iconBg: "bg-fuchsia-100", emoji: "/images/services/SERVICE - Entertainment Insurance/Equipment & Gear.png", title: "Equipment & Gear", description: "All-risk cover for cameras, lighting, sound, and rented gear against damage, theft, and loss on set or in transit." },
      { iconBg: "bg-pink-100", emoji: "/images/services/SERVICE - Entertainment Insurance/Weather Disruption.png", title: "Weather Disruption", description: "Covers losses from rain, storm, or adverse weather that forces cancellation of outdoor shoots and live events." },
      { iconBg: "bg-rose-100", emoji: "/images/services/SERVICE - Entertainment Insurance/Public Liability.png", title: "Public Liability", description: "Covers third-party injury or property damage at your event or set — essential for concerts and public venues." },
      { iconBg: "bg-indigo-100", emoji: "/images/services/SERVICE - Entertainment Insurance/Event Cancellation.png", title: "Event Cancellation", description: "Refund and cost cover for concerts, shows, and live events cancelled due to insured perils, including no-shows." },
      { iconBg: "bg-blue-100", emoji: "/images/services/SERVICE - Entertainment Insurance/Negative & Footage Loss.png", title: "Negative & Footage Loss", description: "Covers the cost of re-shooting if exposed film, digital footage, or recordings are lost or damaged before edit." },
      { iconBg: "bg-emerald-100", emoji: "/images/services/SERVICE - Entertainment Insurance/Crew & Workers' Cover.png", title: "Crew & Workers' Cover", description: "Personal accident and workmen's compensation for cast, crew, and technicians working on your production." },
    ],
    stagesBadge: "FOR EVERY PRODUCTION",
    stagesTitle: "Cover designed for",
    stagesTitleAccent: "how you create",
    stages: [
      { emoji: "/images/services/SERVICE - Entertainment Insurance/Film & TV Production.png", age: "FILM & TV", ageColor: "text-purple-600", title: "Film & TV Production", description: "Full production cover — cast, equipment, negative loss, and cancellation — for features, series, and ad films.", linkText: "Film Production Plan", linkColor: "text-purple-600", bg: "bg-gradient-to-br from-purple-50 to-white" },
      { emoji: "/images/services/SERVICE - Entertainment Insurance/Concerts & Shows.png", age: "LIVE EVENTS", ageColor: "text-violet-600", title: "Concerts & Shows", description: "Event cancellation, public liability, and weather cover for concerts, festivals, and live performances.", linkText: "Event Cover Plan", linkColor: "text-violet-600", bg: "bg-gradient-to-br from-violet-50 to-white" },
      { emoji: "/images/services/SERVICE - Entertainment Insurance/Broadcast & Streaming.png", age: "BROADCAST", ageColor: "text-fuchsia-600", title: "Broadcast & Streaming", description: "Cover for studio shoots, live broadcasts, and streaming productions, including equipment and liability.", linkText: "Broadcast Plan", linkColor: "text-fuchsia-600", bg: "bg-gradient-to-br from-fuchsia-50 to-white" },
      { emoji: "/images/services/SERVICE - Entertainment Insurance/Exhibitions & Fairs.png", age: "EXHIBITIONS", ageColor: "text-pink-600", title: "Exhibitions & Fairs", description: "Public liability and cancellation cover for trade shows, exhibitions, weddings, and large public gatherings.", linkText: "Exhibition Plan", linkColor: "text-pink-600", bg: "bg-gradient-to-br from-pink-50 to-white" },
    ],
    withoutTitle: "Without Entertainment Cover",
    withoutItems: [
      "A rained-out concert means refunding every ticket",
      "An injured lead actor halts a costly shoot",
      "Stolen camera gear is replaced from your budget",
      "A cancelled event leaves vendor bills unpaid",
      "Lost footage forces an expensive re-shoot",
      "A spectator injury lawsuit lands on the organiser",
    ],
    withTitle: "With Entertainment Cover",
    withItems: [
      "Cancelled events reimbursed — tickets and costs covered",
      "Cast non-appearance losses recovered from the insurer",
      "Damaged or stolen equipment fully replaced",
      "Weather disruption to outdoor shoots compensated",
      "Re-shoot costs for lost footage paid by the policy",
      "Public liability defends and settles third-party claims",
    ],
    ctaHeading: "Rolling soon? Insure before you shoot.",
    ctaBody: "Get production or event cover structured around your dates, cast, and venue.",
    faqBadge: "COMMON QUESTIONS",
    faqTitle: "Entertainment Insurance",
    faqTitleAccent: "FAQs",
    faqTitleAccentColor: "#9333EA",
    faqs: [
      { question: "What does film production insurance cover?", answer: "It typically bundles several covers: cast non-appearance, equipment (cameras, lighting, sound), negative/footage loss, public liability, third-party property damage, and production cancellation. Cover is usually structured around your shoot schedule and budget." },
      { question: "Is weather disruption to an outdoor event covered?", answer: "Yes, through weather or event cancellation cover. If rain, storm, or adverse weather forces you to cancel or postpone an outdoor shoot or live event, the policy compensates for the resulting losses, subject to the policy terms." },
      { question: "What is cast non-appearance cover?", answer: "It covers the additional costs and financial losses a production suffers if a key insured cast member is unable to start or continue work due to illness, injury, or death — for example, the cost of rescheduling shoots or re-shooting completed scenes." },
      { question: "Do live events need public liability insurance?", answer: "Strongly yes — and many venues require it. Public liability covers legal costs and compensation if an attendee is injured or third-party property is damaged at your event. For concerts and large gatherings, it's often a condition of the venue or permit." },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Services listing card data (for /our-services main page)
// ─────────────────────────────────────────────────────────────────────────────
export interface ServiceCard {
  slug: string;
  image: string;
  iconBg: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonColor: string;
}

export const SERVICE_CARDS: ServiceCard[] = [
  {
    slug: "life-insurance",
    image: "/images/home/HOME/Life Insurance.png",
    iconBg: "bg-slate-100",
    title: "Life Insurance",
    badge: "Popular",
    badgeColor: "bg-indigo-100 text-indigo-700",
    description: "Term plans, endowment, ULIPs, whole life — we compare all options from 20+ insurers and recommend the best fit for your income, age, and goals.",
    features: ["Term Life Insurance", "Endowment Plans", "ULIPs (Market Linked)", "Whole Life Cover"],
    buttonText: "Get Life Quote",
    buttonColor: "bg-blue-700 hover:bg-blue-800",
  },
  {
    slug: "health-insurance",
    image: "/images/home/HOME/Health Insurance.png",
    iconBg: "bg-emerald-50",
    title: "Health Insurance",
    badge: "Critical need",
    badgeColor: "bg-teal-100 text-teal-700",
    description: "Individual, family floater, senior citizen, and critical illness plans. We help you find the right cover with maximum cashless hospital network.",
    features: ["Individual Health Plans", "Family Floater Policies", "Senior Citizen Cover", "Critical Illness Plans"],
    buttonText: "Get Health Quote",
    buttonColor: "bg-teal-600 hover:bg-teal-700",
  },
  {
    slug: "motor-insurance",
    image: "/images/home/HOME/Motor Insurance.png",
    iconBg: "bg-orange-50",
    title: "Motor Insurance",
    badge: "Mandatory",
    badgeColor: "bg-orange-100 text-orange-700",
    description: "Comprehensive and third-party motor plans for cars, bikes, and commercial vehicles. We compare premium, IDV, and cashless garage network.",
    features: ["Comprehensive Car Insurance", "Two-Wheeler Insurance", "Commercial Vehicle Cover", "Zero Depreciation Add-on"],
    buttonText: "Get Motor Quote",
    buttonColor: "bg-orange-500 hover:bg-orange-600",
  },
  {
    slug: "home-insurance",
    image: "/images/home/HOME/Home Insurance.png",
    iconBg: "bg-purple-50",
    title: "Home Insurance",
    badge: "Underrated",
    badgeColor: "bg-purple-100 text-purple-700",
    description: "Structure and contents coverage against fire, flood, theft, earthquakes. Protect your biggest asset starting from ₹2,000/year.",
    features: ["Building / Structure Cover", "Contents Insurance", "Fire & Natural Perils", "Burglary Protection"],
    buttonText: "Get Home Quote",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
  },
  
  {
    slug: "marine-insurance",
    image: "/images/home/HOME/Marine Insurance.png",
    iconBg: "bg-sky-50",
    title: "Marine Insurance",
    badge: "For Traders",
    badgeColor: "bg-sky-100 text-sky-700",
    description: "Cargo and transit cover for importers, exporters, and domestic traders. Single-transit and annual open policies across sea, air, road, and rail.",
    features: ["Import & Export Cargo", "Inland Transit Cover", "Open / Annual Policies", "All-Risk Protection"],
    buttonText: "Get Marine Quote",
    buttonColor: "bg-sky-600 hover:bg-sky-700",
  },
  {
    slug: "fire-insurance",
    image: "/images/home/HOME/Fire Insurance.png",
    iconBg: "bg-red-50",
    title: "Fire Insurance",
    badge: "For Business",
    badgeColor: "bg-red-100 text-red-700",
    description: "Standard Fire & Special Perils cover for factories, warehouses, shops, and offices — against fire, explosion, riot, and natural disasters.",
    features: ["Fire & Lightning Cover", "Storm, Flood & Cyclone", "Riot & Malicious Damage", "Loss of Profit Add-on"],
    buttonText: "Get Fire Quote",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
  {
    slug: "miscellaneous-insurance",
    image: "/images/home/HOME/Miscellaneous Insurance.png",
    iconBg: "bg-indigo-50",
    title: "Miscellaneous Insurance",
    badge: "Specialised",
    badgeColor: "bg-indigo-100 text-indigo-700",
    description: "Specialised covers beyond standard lines — burglary, fidelity guarantee, money in transit, machinery breakdown, professional indemnity, and liability.",
    features: ["Burglary & Fidelity", "Money in Transit", "Machinery Breakdown", "Professional Indemnity"],
    buttonText: "Get a Quote",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
  },
  {
    slug: "entertainment-insurance",
    image: "/images/home/HOME/Entertainment Insurance.png",
    iconBg: "bg-purple-50",
    title: "Entertainment Insurance",
    badge: "For Productions",
    badgeColor: "bg-purple-100 text-purple-700",
    description: "Cover for films, concerts, events, and productions — cast non-appearance, equipment loss, event cancellation, public liability, and weather disruption.",
    features: ["Production Cancellation", "Cast Non-Appearance", "Equipment & Gear Cover", "Event Public Liability"],
    buttonText: "Get Production Quote",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
  },
 
];