// lib/insuranceData.ts  (or place in /data/insuranceData.ts — adjust import paths as needed)

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LifeStage {
  emoji: string;
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
  emoji: string;
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
  "travel-insurance": {
    slug: "travel-insurance",
    cardTitle: "Plan your travel cover",
    submitLabel: "Get Travel Quote",
    submitBg: "#0891B2",
    fields: [
      { label: "Travel Type", type: "select", options: ["International", "Domestic"], stateKey: "travelType", defaultValue: "International" },
      { label: "Trip Type", type: "select", options: ["Single Trip", "Multi-Trip Annual"], stateKey: "tripType", defaultValue: "Single Trip" },
      { label: "Traveller Type", type: "select", options: ["Individual", "Family", "Senior Citizen", "Student"], stateKey: "travellerType", defaultValue: "Individual" },
      { label: "Destination Region", type: "select", options: ["Asia", "Europe", "USA/Canada", "Worldwide"], stateKey: "destination", defaultValue: "Asia" },
      { label: "Trip Duration", type: "select", options: ["1–7 days", "8–15 days", "16–30 days", "31–90 days"], stateKey: "duration", defaultValue: "8–15 days" },
    ],
  },
  "risk-consultation": {
    slug: "risk-consultation",
    cardTitle: "Book your free assessment",
    submitLabel: "Book Free Session",
    submitBg: "#1E293B",
    fields: [
      { label: "Assessment Type", type: "select", options: ["Personal Portfolio", "Business Risk", "Both"], stateKey: "assessmentType", defaultValue: "Personal Portfolio" },
      { label: "Current Policies", type: "select", options: ["None", "1–2 policies", "3–5 policies", "6+"], stateKey: "currentPolicies", defaultValue: "1–2 policies" },
      { label: "Annual Premium Spend", type: "select", options: ["Below ₹10K", "₹10–50K", "₹50K–2L", "Above ₹2L"], stateKey: "premiumSpend", defaultValue: "₹10–50K" },
      { label: "Preferred Slot", type: "select", options: ["Morning (9–12)", "Afternoon (12–5)", "Evening (5–8)"], stateKey: "slot", defaultValue: "Morning (9–12)" },
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
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 reasons life insurance is",
    benefitsTitleAccent: "non-negotiable",
    benefitsTitleAccentColor: "#F97316",
    benefitsSubtitle:
      "Life insurance isn't just about death. It's about making sure the people who depend on you never have to struggle — no matter what happens.",
    benefits: [
      { iconBg: "bg-blue-100", emoji: "💰", title: "Income Replacement", description: "Your family maintains their standard of living. Monthly expenses, EMIs, school fees — all covered even when you're not around." },
      { iconBg: "bg-emerald-100", emoji: "🎓", title: "Children's Education", description: "Lock in your child's education goals — school, college, or professional courses — regardless of what life throws at you." },
      { iconBg: "bg-yellow-100", emoji: "🏦", title: "Debt Clearance", description: "Home loans, car loans, personal debts — the payout clears them all. Your family inherits your assets, not your liabilities." },
      { iconBg: "bg-pink-100", emoji: "💑", title: "Spouse Protection", description: "Ensure your partner is financially secure and independent for life — especially if they're a homemaker or dependent on your income." },
      { iconBg: "bg-indigo-100", emoji: "📋", title: "Tax Benefits", description: "Save up to ₹1.5 Lakh/year under Section 80C on premiums paid. Maturity and death proceeds are fully tax-exempt under 10(10D)." },
      { iconBg: "bg-rose-100", emoji: "🏥", title: "Critical Illness Cover", description: "Add-on riders cover 40+ critical illnesses — cancer, heart attack, stroke, kidney failure — paying a lump sum on diagnosis." },
      { iconBg: "bg-orange-100", emoji: "🔒", title: "Low Locked-In Premiums", description: "Buy young, pay less for life. Premiums are fixed at the age you buy — waiting even one year can cost thousands more annually." },
      { iconBg: "bg-cyan-100", emoji: "📈", title: "Wealth Creation", description: "Endowment and ULIP plans grow your money alongside protecting your life — building a corpus for retirement, marriage, or goals." },
    ],
    stagesBadge: "AT EVERY STAGE OF LIFE",
    stagesTitle: "Your insurance needs",
    stagesTitleAccent: "change as you grow",
    stages: [
      { emoji: "🎓", age: "AGE 20–30", ageColor: "text-cyan-600", title: "Just Starting Out", description: "Lock in ultra-low premiums. A ₹1 Cr term plan at 25 costs ~₹437/mo. Best time to buy is now.", linkText: "Term Insurance", linkColor: "text-blue-700", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "💍", age: "AGE 30–40", ageColor: "text-orange-500", title: "Family & Mortgage", description: "Protect spouse, kids, home loan. Increase sum assured to cover all liabilities and income replacement.", linkText: "Term + Critical Illness", linkColor: "text-orange-500", bg: "bg-gradient-to-br from-orange-50 to-white" },
      { emoji: "📈", age: "AGE 40–55", ageColor: "text-emerald-600", title: "Peak Earning Years", description: "Focus on wealth creation alongside protection. ULIPs and endowment plans build retirement corpus.", linkText: "ULIP + Endowment", linkColor: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-white" },
      { emoji: "🏠", age: "AGE 55+", ageColor: "text-cyan-600", title: "Legacy Planning", description: "Pass on wealth to next generation. Whole life policies ensure estate and assets reach nominees tax-free.", linkText: "Whole Life Plan", linkColor: "text-cyan-600", bg: "bg-gradient-to-br from-cyan-50 to-white" },
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
      { value: "10,000+", label: "Cashless Hospitals" },
      { value: "15+", label: "Insurer Partners" },
      { value: "₹1Cr", label: "Max Sum Insured" },
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
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 reasons to get",
    benefitsTitleAccent: "health cover today",
    benefitsTitleAccentColor: "#0D9488",
    benefitsSubtitle:
      "From hospitalisation to day-care procedures, a good health plan pays for what matters most — your recovery.",
    benefits: [
      { iconBg: "bg-teal-100", emoji: "🏥", title: "Cashless Hospitalisation", description: "Get treated at any network hospital without paying upfront. The insurer settles the bill directly with the hospital." },
      { iconBg: "bg-emerald-100", emoji: "👨‍👩‍👧", title: "Family Floater Cover", description: "One policy, one premium covers the entire family. The sum insured can be used by any member whenever needed." },
      { iconBg: "bg-blue-100", emoji: "🩺", title: "Pre & Post Hospitalisation", description: "Covers doctor consultations, tests, and medicines before admission (60 days) and after discharge (90 days)." },
      { iconBg: "bg-indigo-100", emoji: "💊", title: "Day-Care Procedures", description: "Modern treatments like dialysis, chemotherapy, and cataract surgery that take less than 24 hours are fully covered." },
      { iconBg: "bg-rose-100", emoji: "❤️", title: "Critical Illness Add-on", description: "Receive a lump sum on diagnosis of cancer, heart attack, stroke, or kidney failure — independent of hospitalisation." },
      { iconBg: "bg-orange-100", emoji: "👴", title: "Senior Citizen Plans", description: "Specialised policies for 60+ with no medical tests up to a certain age, and covers like cataract and joint replacement." },
      { iconBg: "bg-yellow-100", emoji: "📋", title: "Tax Savings under 80D", description: "Save up to ₹25,000/year (₹50,000 for seniors) on health insurance premiums paid under Section 80D." },
      { iconBg: "bg-cyan-100", emoji: "🔄", title: "No-Claim Bonus", description: "For every claim-free year, your sum insured increases by 10–50% at no extra cost — reward for staying healthy." },
    ],
    stagesBadge: "AT EVERY LIFE STAGE",
    stagesTitle: "Health needs",
    stagesTitleAccent: "evolve with age",
    stages: [
      { emoji: "🧑", age: "AGE 18–30", ageColor: "text-teal-600", title: "Young & Independent", description: "Low premiums, high coverage. Build the habit early. A ₹5L individual plan costs under ₹5,000/year.", linkText: "Individual Health Plan", linkColor: "text-teal-600", bg: "bg-gradient-to-br from-teal-50 to-white" },
      { emoji: "👨‍👩‍👧", age: "AGE 30–45", ageColor: "text-blue-600", title: "Growing Family", description: "Switch to a family floater or add maternity cover. Protect spouse and children under one plan.", linkText: "Family Floater Plan", linkColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "🧑‍💼", age: "AGE 45–60", ageColor: "text-orange-500", title: "Peak Risk Years", description: "Add critical illness riders, increase sum insured, and choose a super top-up for extra buffer.", linkText: "Critical Illness + Top-Up", linkColor: "text-orange-500", bg: "bg-gradient-to-br from-orange-50 to-white" },
      { emoji: "👴", age: "AGE 60+", ageColor: "text-rose-600", title: "Senior Coverage", description: "Specialised senior plans with domiciliary cover, OPD benefits, and higher day-care coverage.", linkText: "Senior Citizen Plan", linkColor: "text-rose-600", bg: "bg-gradient-to-br from-rose-50 to-white" },
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
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 reasons to get",
    benefitsTitleAccent: "proper motor cover",
    benefitsTitleAccentColor: "#EA580C",
    benefitsSubtitle:
      "An accident, theft, or natural disaster can happen to any vehicle, anywhere. Make sure you're fully covered when it does.",
    benefits: [
      { iconBg: "bg-orange-100", emoji: "🚗", title: "Own Damage Cover", description: "Covers repair costs for your vehicle after accidents, floods, fire, theft, and natural disasters — regardless of who is at fault." },
      { iconBg: "bg-rose-100", emoji: "⚖️", title: "Third-Party Liability", description: "Mandatory by law. Covers bodily injury, death, or property damage caused to a third party by your vehicle." },
      { iconBg: "bg-yellow-100", emoji: "🔧", title: "Cashless Garages", description: "Get repairs done at 3,500+ network garages without paying upfront. The insurer settles the bill directly." },
      { iconBg: "bg-blue-100", emoji: "🛡️", title: "Zero Depreciation", description: "Claim the full cost of parts without depreciation deduction. Get 100% value on plastic, rubber, and fibre parts." },
      { iconBg: "bg-emerald-100", emoji: "🔑", title: "Engine Protection", description: "Covers engine damage due to water ingression or oil leakage — scenarios not covered under standard policies." },
      { iconBg: "bg-indigo-100", emoji: "🚨", title: "Roadside Assistance", description: "24/7 support for breakdown, flat tyre, fuel delivery, towing, and locksmith services — wherever you are." },
      { iconBg: "bg-cyan-100", emoji: "📦", title: "NCB Protection", description: "Protect your earned No-Claim Bonus even after filing a claim. Don't lose years of accumulated discounts." },
      { iconBg: "bg-purple-100", emoji: "💼", title: "Personal Accident Cover", description: "Compulsory personal accident cover of ₹15 lakh for the owner-driver in case of death or permanent disability." },
    ],
    stagesBadge: "FOR EVERY VEHICLE TYPE",
    stagesTitle: "Motor insurance for",
    stagesTitleAccent: "every kind of driver",
    stages: [
      { emoji: "🛵", age: "TWO-WHEELERS", ageColor: "text-orange-500", title: "Bikes & Scooters", description: "New bike? Mandatory third-party + comprehensive to fully protect your ride from day one.", linkText: "Two-Wheeler Plan", linkColor: "text-orange-500", bg: "bg-gradient-to-br from-orange-50 to-white" },
      { emoji: "🚗", age: "PRIVATE CARS", ageColor: "text-blue-600", title: "Private Cars", description: "Comprehensive plans with zero depreciation, engine protect, and roadside assistance for complete peace of mind.", linkText: "Comprehensive Car Plan", linkColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "🚌", age: "COMMERCIAL", ageColor: "text-emerald-600", title: "Commercial Vehicles", description: "Goods carriers, passenger vehicles, taxis — specialised policies that cover commercial use and goods in transit.", linkText: "Commercial Vehicle Plan", linkColor: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-white" },
      { emoji: "⚡", age: "ELECTRIC VEHICLES", ageColor: "text-cyan-600", title: "Electric Vehicles", description: "Specialised EV insurance covering battery, charging equipment, and roadside assistance for electric mobility.", linkText: "EV Insurance Plan", linkColor: "text-cyan-600", bg: "bg-gradient-to-br from-cyan-50 to-white" },
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
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 ways home insurance",
    benefitsTitleAccent: "protects your property",
    benefitsTitleAccentColor: "#7C3AED",
    benefitsSubtitle:
      "From natural disasters to burglary, home insurance covers the risks that could rob you of your biggest investment.",
    benefits: [
      { iconBg: "bg-purple-100", emoji: "🏗️", title: "Structure Cover", description: "Covers the building — walls, roof, floors, fixed fittings — against fire, earthquake, cyclone, flood, and subsidence." },
      { iconBg: "bg-indigo-100", emoji: "📺", title: "Contents Cover", description: "Protects furniture, appliances, electronics, clothing, and valuables inside your home against damage or theft." },
      { iconBg: "bg-rose-100", emoji: "🔥", title: "Fire & Allied Perils", description: "Covers damage from fire, lightning, explosion, aircraft impact, riot, strike, and malicious acts." },
      { iconBg: "bg-blue-100", emoji: "🌊", title: "Natural Disaster Cover", description: "Floods, cyclones, earthquakes, landslides, storms — all covered under a standard comprehensive home policy." },
      { iconBg: "bg-yellow-100", emoji: "🔐", title: "Burglary Protection", description: "Cash, jewellery, electronics, and other valuables covered against theft and burglary, with or without forced entry." },
      { iconBg: "bg-teal-100", emoji: "🏠", title: "Rent Compensation", description: "If your home becomes uninhabitable due to an insured peril, rent for alternative accommodation is reimbursed." },
      { iconBg: "bg-orange-100", emoji: "⚡", title: "Electrical Breakdown", description: "Covers damage to appliances and fixed electrical fittings caused by short circuits and electrical fluctuations." },
      { iconBg: "bg-cyan-100", emoji: "🛠️", title: "Workmen's Liability", description: "Covers accidental injury to domestic workers, delivery personnel, or guests on your property." },
    ],
    stagesBadge: "FOR EVERY HOME TYPE",
    stagesTitle: "Cover tailored to",
    stagesTitleAccent: "your property",
    stages: [
      { emoji: "🏢", age: "APARTMENTS", ageColor: "text-purple-600", title: "Apartment Units", description: "Contents-only plans for flat owners. Structure is typically covered by society — insure your interiors and belongings.", linkText: "Contents Plan", linkColor: "text-purple-600", bg: "bg-gradient-to-br from-purple-50 to-white" },
      { emoji: "🏠", age: "INDEPENDENT HOUSES", ageColor: "text-blue-600", title: "Independent Houses", description: "Full structure + contents cover. Rebuild cost insurance ensures you can reconstruct if the worst happens.", linkText: "Structure + Contents", linkColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "🏡", age: "RENTED HOMES", ageColor: "text-emerald-600", title: "Tenants", description: "Protect your contents — furniture, appliances, and personal belongings — even if you don't own the property.", linkText: "Tenant Contents Plan", linkColor: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-white" },
      { emoji: "💎", age: "HIGH-VALUE HOMES", ageColor: "text-cyan-600", title: "Premium Properties", description: "Bespoke policies for villas, luxury homes, and high-value contents including art, antiques, and jewellery.", linkText: "High-Value Home Plan", linkColor: "text-cyan-600", bg: "bg-gradient-to-br from-cyan-50 to-white" },
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

  // ─── TRAVEL INSURANCE ─────────────────────────────────────────────────────
  "travel-insurance": {
    slug: "travel-insurance",
    heroAccentWord: "anywhere",
    heroRestTitle: "Travel confidently,",
    heroSubtitle:
      "Domestic & international travel plans for individuals, families, students, and senior citizens. Medical emergencies, trip cancellations, and baggage covered.",
    heroBadgeText: "Travel Insurance",
    heroBadgeBg: "#083344",
    heroBadgeColor: "#22D3EE",
    heroStats: [
      { value: "150+", label: "Countries Covered" },
      { value: "24/7", label: "Emergency Helpline" },
      { value: "₹1Cr", label: "Max Medical Cover" },
    ],
    heroCtaLabel: "Get Travel Quote",
    heroCtaBg: "#0891B2",
    heroAccentColor: "#22D3EE",
    heroAccentColor2: "#38BDF8",
    whyBadge: "WHY TRAVEL INSURANCE?",
    whyTitle: "Because the unexpected",
    whyTitleAccent: "doesn't respect your itinerary.",
    whyTitleAccentColor: "#0891B2",
    whyBody: [
      "A medical emergency abroad can cost ₹20–80 lakh without insurance. Hospital bills in the USA, UK, and Europe can bankrupt an entire family. Travel insurance ensures you receive the best medical care without financial devastation.",
      "Beyond medical, it covers trip cancellation due to illness, job loss, or natural disasters; lost or delayed baggage; passport loss; missed connections; and personal liability — all the unpredictable hiccups that can derail a trip.",
      "Starting at just ₹150 for a 7-day domestic trip or ₹500 for a 10-day international trip, it's the cheapest risk management tool in travel.",
    ],
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 reasons travel insurance",
    benefitsTitleAccent: "is non-negotiable",
    benefitsTitleAccentColor: "#0891B2",
    benefitsSubtitle:
      "From visa rejections to medical evacuations, travel insurance handles the situations you can't predict — and can't afford to ignore.",
    benefits: [
      { iconBg: "bg-cyan-100", emoji: "🏥", title: "Medical Emergency Cover", description: "Covers hospitalisation, surgery, doctor visits, and medicines abroad — up to ₹1 crore depending on the plan." },
      { iconBg: "bg-blue-100", emoji: "✈️", title: "Trip Cancellation", description: "Reimbursed for non-refundable bookings if you cancel due to illness, injury, job loss, or natural disaster." },
      { iconBg: "bg-indigo-100", emoji: "🧳", title: "Baggage Loss & Delay", description: "Compensation for lost, stolen, or delayed checked-in baggage, including emergency purchase of essentials." },
      { iconBg: "bg-teal-100", emoji: "🚁", title: "Medical Evacuation", description: "Covers air ambulance and evacuation to the nearest suitable hospital or back to India if medically necessary." },
      { iconBg: "bg-emerald-100", emoji: "🛂", title: "Passport & Document Loss", description: "Emergency expenses for replacing a lost passport or important travel documents during the trip." },
      { iconBg: "bg-orange-100", emoji: "⏰", title: "Trip Delay", description: "Compensation for hotel, meals, and transport if your flight is delayed by more than the stipulated hours." },
      { iconBg: "bg-rose-100", emoji: "⚖️", title: "Personal Liability", description: "Covers legal costs if you accidentally injure someone or damage property during your trip abroad." },
      { iconBg: "bg-yellow-100", emoji: "🎓", title: "Student Travel Plans", description: "Extended annual plans for students studying abroad — covering semester gaps, sponsor protection, and study interruption." },
    ],
    stagesBadge: "FOR EVERY KIND OF TRAVELLER",
    stagesTitle: "Cover designed for",
    stagesTitleAccent: "how you travel",
    stages: [
      { emoji: "👤", age: "SOLO TRAVELLERS", ageColor: "text-cyan-600", title: "Individual Plans", description: "Single-trip or annual multi-trip plans for frequent travellers. Best value for those who travel 3+ times a year.", linkText: "Individual Travel Plan", linkColor: "text-cyan-600", bg: "bg-gradient-to-br from-cyan-50 to-white" },
      { emoji: "👨‍👩‍👧", age: "FAMILIES", ageColor: "text-blue-600", title: "Family Plans", description: "One policy covers the entire family on the same trip. Children often covered at no extra cost in family plans.", linkText: "Family Travel Plan", linkColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "🎓", age: "STUDENTS", ageColor: "text-indigo-600", title: "Student Abroad", description: "Annual plans for students studying overseas — with sponsor protection, academic interruption, and mental health cover.", linkText: "Student Travel Plan", linkColor: "text-indigo-600", bg: "bg-gradient-to-br from-indigo-50 to-white" },
      { emoji: "👴", age: "SENIOR CITIZENS", ageColor: "text-rose-600", title: "Senior Plans", description: "Specialised senior travel insurance with higher medical limits, pre-existing disease cover, and 24/7 assistance.", linkText: "Senior Citizen Travel Plan", linkColor: "text-rose-600", bg: "bg-gradient-to-br from-rose-50 to-white" },
    ],
    withoutTitle: "Without Travel Insurance",
    withoutItems: [
      "Overseas hospital bill of ₹30L lands on your credit card",
      "Flight cancellation means losing ₹50,000 in bookings",
      "Lost baggage forces expensive emergency purchases",
      "Missed connection strands you — all costs are yours",
      "Medical evacuation to India costs ₹15–50 lakh",
      "Visa rejection — non-refundable bookings lost forever",
    ],
    withTitle: "With Travel Insurance",
    withItems: [
      "Medical bills paid directly — cashless worldwide",
      "Trip cancellation refund up to the insured amount",
      "Baggage delay allowance for immediate essentials",
      "Missed connection expenses reimbursed by insurer",
      "Air ambulance and evacuation fully covered",
      "Visa rejection cover for reimbursement of trip costs",
    ],
    ctaHeading: "About to travel? Get covered in 2 minutes.",
    ctaBody: "Instant policy issuance — domestic from ₹150, international from ₹500.",
    faqBadge: "COMMON QUESTIONS",
    faqTitle: "Travel Insurance",
    faqTitleAccent: "FAQs",
    faqTitleAccentColor: "#0891B2",
    faqs: [
      { question: "Can I buy travel insurance after booking my tickets?", answer: "Yes, you can buy travel insurance any time before your departure date. However, for trip cancellation cover to be effective, it's recommended to buy insurance as soon as you book your tickets — not at the last minute." },
      { question: "Does travel insurance cover Covid-19?", answer: "Most current travel insurance plans include Covid-19 related medical expenses — hospitalisation, treatment, and quarantine costs. Trip cancellation due to Covid-19 is covered in some plans. Check the policy wording carefully, as coverage varies by insurer." },
      { question: "What documents do I need to make a travel insurance claim?", answer: "For medical claims: hospital bills, discharge summary, prescriptions, and doctor's report. For trip cancellation: cancellation notice, booking receipts, and the reason for cancellation. For baggage loss: PIR (Property Irregularity Report) from the airline and purchase receipts." },
      { question: "Is pre-existing disease covered in travel insurance?", answer: "Standard travel plans cover life-threatening emergencies related to pre-existing conditions. Routine treatment or elective procedures for pre-existing diseases are typically not covered. Senior citizen plans and some premium plans offer broader pre-existing disease coverage." },
    ],
  },

  // ─── RISK CONSULTATION ────────────────────────────────────────────────────
  "risk-consultation": {
    slug: "risk-consultation",
    heroAccentWord: "insurance gaps",
    heroRestTitle: "Find and fix your",
    heroSubtitle:
      "Free portfolio audit, gap analysis, and premium optimisation by certified risk advisors. Most clients reduce their total premium spend by 15–30% while improving coverage.",
    heroBadgeText: "Risk Consultation",
    heroBadgeBg: "#0f172a",
    heroBadgeColor: "#94A3B8",
    heroStats: [
      { value: "Free", label: "First Consultation" },
      { value: "15–30%", label: "Avg. Premium Savings" },
      { value: "500+", label: "Portfolios Audited" },
    ],
    heroCtaLabel: "Book Free Assessment",
    heroCtaBg: "#1E293B",
    heroAccentColor: "#94A3B8",
    heroAccentColor2: "#38BDF8",
    whyBadge: "WHY RISK CONSULTATION?",
    whyTitle: "Most people are",
    whyTitleAccent: "overcharged and underinsured.",
    whyTitleAccentColor: "#1E293B",
    whyBody: [
      "The average Indian household has 2–3 insurance policies with significant coverage gaps, duplicate benefits, and premiums that could be cut by 15–30% without reducing protection.",
      "A risk consultation is a comprehensive audit of everything you currently hold — life, health, motor, home, travel — mapped against your actual financial exposure, family situation, and future goals.",
      "Our IRDAI-licensed advisors don't earn commissions from specific insurers. They recommend the best products for you, period — and then help you implement the recommendations at no cost.",
    ],
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 ways our advisors",
    benefitsTitleAccent: "improve your coverage",
    benefitsTitleAccentColor: "#1E293B",
    benefitsSubtitle:
      "An hour with a risk advisor can save you lakhs in premiums and ensure you're never caught underinsured when it matters most.",
    benefits: [
      { iconBg: "bg-slate-100", emoji: "🔍", title: "Portfolio Gap Analysis", description: "We map every policy you hold against your real financial exposure — income, debts, dependents, assets — and identify unprotected risks." },
      { iconBg: "bg-blue-100", emoji: "💰", title: "Premium Optimisation", description: "Identify duplicate covers, unnecessary riders, and overpriced plans. Most clients save ₹10,000–₹50,000/year after optimisation." },
      { iconBg: "bg-emerald-100", emoji: "📋", title: "Policy Review & Rewrite", description: "We review policy documents for hidden exclusions, restrictive clauses, and sub-limits that could hurt you at claim time." },
      { iconBg: "bg-orange-100", emoji: "📅", title: "Annual Policy Audit", description: "An annual review as your life changes — new baby, new home, salary hike, retirement — keeps your cover always aligned with reality." },
      { iconBg: "bg-rose-100", emoji: "⚠️", title: "Risk Identification", description: "Beyond standard policies, we identify risks specific to your profession, lifestyle, and business that need specialised coverage." },
      { iconBg: "bg-indigo-100", emoji: "🤝", title: "Claims Assistance", description: "We stand by you during claims — helping prepare documents, liaise with insurers, and fight for fair settlements." },
      { iconBg: "bg-cyan-100", emoji: "🏢", title: "Corporate Risk Review", description: "Group health, keyman insurance, D&O, and trade credit — complete business risk coverage for founders and SME owners." },
      { iconBg: "bg-yellow-100", emoji: "🎯", title: "Goal-Based Insurance", description: "Match insurance products to specific life goals — child's education, retirement corpus, home purchase — ensuring you're financially ready." },
    ],
    stagesBadge: "WHO SHOULD GET A REVIEW",
    stagesTitle: "A risk audit is right",
    stagesTitleAccent: "for everyone",
    stages: [
      { emoji: "👨‍👩‍👧", age: "FAMILIES", ageColor: "text-blue-600", title: "Families with Dependants", description: "Ensure spouse, children, and parents are all adequately covered. Find the gaps before an emergency reveals them.", linkText: "Family Risk Review", linkColor: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-white" },
      { emoji: "🏢", age: "BUSINESS OWNERS", ageColor: "text-slate-600", title: "SME & Startup Founders", description: "Keyman cover, D&O liability, group health, fire and burglary — ensure your business is protected on all sides.", linkText: "Business Risk Review", linkColor: "text-slate-600", bg: "bg-gradient-to-br from-slate-50 to-white" },
      { emoji: "🧳", age: "NRIs", ageColor: "text-indigo-600", title: "NRIs with India Assets", description: "Home, investment property, and financial assets in India need the right cover even when you're abroad. We manage it all.", linkText: "NRI Portfolio Review", linkColor: "text-indigo-600", bg: "bg-gradient-to-br from-indigo-50 to-white" },
      { emoji: "👴", age: "PRE-RETIREMENT", ageColor: "text-emerald-600", title: "Near-Retirement Adults", description: "Review whether your life cover should reduce or shift. Ensure health and critical illness cover extends well into retirement.", linkText: "Pre-Retirement Review", linkColor: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-white" },
    ],
    withoutTitle: "Without a Risk Review",
    withoutItems: [
      "Paying ₹30,000/year more than you need to",
      "Major risks like flood, cyber, or keyman left uncovered",
      "Overlapping covers waste premium budget every year",
      "Hidden policy exclusions emerge only at claim time",
      "No one to fight your corner during a disputed claim",
      "Insurance portfolio drifts out of sync with life changes",
    ],
    withTitle: "After Our Risk Review",
    withItems: [
      "Premiums optimised — average saving of ₹15,000+/year",
      "Every major risk identified and covered appropriately",
      "Duplicate covers removed, budget reallocated smartly",
      "Policy documents reviewed for exclusions before you sign",
      "Dedicated advisor in your corner for every claim",
      "Annual review keeps your cover aligned as life evolves",
    ],
    ctaHeading: "Ready for your free audit?",
    ctaBody: "No sales pitch, no commitment — just a clear picture of your insurance health.",
    faqBadge: "COMMON QUESTIONS",
    faqTitle: "Risk Consultation",
    faqTitleAccent: "FAQs",
    faqTitleAccentColor: "#1E293B",
    faqs: [
      { question: "Is the risk consultation really free?", answer: "Yes, the first consultation is completely free — no hidden charges, no obligation to buy. Our advisors are paid a fee by us, not by commission from insurers, so their advice is always in your interest." },
      { question: "How long does a consultation take?", answer: "A standard portfolio review takes 45–60 minutes, either in-person at our office or via video call. We'll ask you to share your existing policy documents in advance so we can prepare a proper analysis before the session." },
      { question: "Do I need to switch all my policies after a review?", answer: "Not necessarily. Many clients find their existing policies are adequate with minor adjustments. We only recommend changes when the benefit — in better coverage or lower cost — clearly justifies any switching costs or waiting periods." },
      { question: "Can you help me during a claim?", answer: "Yes. Claims support is one of our core services. We help you prepare documents, calculate rightful claim amounts, follow up with insurers, and if needed, represent you in disputes — all at no additional charge for existing clients." },
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
    image: "/images/services/life.svg",
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
    image: "/images/services/health.svg",
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
    image: "/images/services/motor.svg",
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
    image: "/images/services/home.svg",
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
    slug: "travel-insurance",
    image: "/images/services/travel.svg",
    iconBg: "bg-cyan-50",
    title: "Travel Insurance",
    badge: "Domestic & International",
    badgeColor: "bg-cyan-100 text-cyan-700",
    description: "Single trip, multi-trip, student travel, and senior citizen travel plans. Medical emergencies abroad, trip cancellation, and baggage cover.",
    features: ["Single & Multi-Trip Plans", "Medical Emergency Abroad", "Trip Cancellation", "Student Travel Cover"],
    buttonText: "Get Travel Quote",
    buttonColor: "bg-cyan-500 hover:bg-cyan-600",
  },
  {
    slug: "risk-consultation",
    image: "/images/services/risk.svg",
    iconBg: "bg-slate-100",
    title: "Risk Consultation",
    badge: "Free Assessment",
    badgeColor: "bg-slate-200 text-slate-700",
    description: "Our advisers review your entire insurance portfolio, identify gaps, and recommend optimisations — often reducing your total premium spend while improving coverage.",
    features: ["Portfolio Gap Analysis", "Premium Optimisation", "Policy Review & Advice", "Annual Policy Audit"],
    buttonText: "Book Free Assessment",
    buttonColor: "bg-slate-800 hover:bg-slate-900",
  },
];