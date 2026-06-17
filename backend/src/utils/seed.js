require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Service = require("../models/Service");

const SERVICES = [
  {
    slug: "life-insurance", title: "Life Insurance",
    badge: "Popular", badgeColor: "bg-indigo-100 text-indigo-700",
    description: "Term plans, endowment, ULIPs, whole life — we compare all options from 20+ insurers.",
    features: ["Term Life Insurance","Endowment Plans","ULIPs (Market Linked)","Whole Life Cover"],
    buttonText: "Get Life Quote", buttonColor: "bg-blue-700 hover:bg-blue-800",
    iconBg: "bg-slate-100", image: "/images/services/life.svg",
    heroRestTitle: "Protect the people", heroAccentWord: "who matter",
    heroSubtitle: "Comprehensive life insurance plans starting from ₹437/month.",
    heroBadgeText: "Life Insurance", heroCtaBg: "#F4622A",
    heroAccentColor: "#F4622A", heroAccentColor2: "#38BDF8",
    heroStats: [
      { value: "98.7%", label: "Claims Settlement Ratio" },
      { value: "20+",   label: "Insurer Partners" },
      { value: "₹5Cr",  label: "Max Sum Assured" },
    ],
    whyBadge: "WHY LIFE INSURANCE?",
    whyTitle: "One decision that protects",
    whyTitleAccent: "everything you've built",
    whyTitleAccentColor: "#F4622A",
    whyBody: [
      "With the pandemic and untimely death of sole breadwinners of many Indian families, more people have begun to realise how insurance policies act as a safety net.",
      "While estimating the ideal life insurance cover, one needs to account for different factors — accumulated debts, children's higher education, and inflation.",
      "Our risk managers handle these concerns every day. Allow them to guide you towards a life insurance cover that serves you best.",
    ],
    benefitsBadge: "THE BENEFITS",
    benefitsTitle: "8 reasons life insurance is",
    benefitsTitleAccent: "non-negotiable",
    benefitsTitleAccentColor: "#F97316",
    benefitsSubtitle: "Life insurance isn't just about death. It's about making sure people who depend on you never have to struggle.",
    benefits: [
      { iconBg: "bg-blue-100",   emoji: "💰", title: "Income Replacement",    description: "Your family maintains their standard of living even when you're not around." },
      { iconBg: "bg-emerald-100",emoji: "🎓", title: "Children's Education",  description: "Lock in your child's education goals regardless of what life throws at you." },
      { iconBg: "bg-yellow-100", emoji: "🏦", title: "Debt Clearance",        description: "Home loans, car loans, personal debts — the payout clears them all." },
      { iconBg: "bg-pink-100",   emoji: "💑", title: "Spouse Protection",     description: "Ensure your partner is financially secure and independent for life." },
      { iconBg: "bg-indigo-100", emoji: "📋", title: "Tax Benefits",          description: "Save up to ₹1.5 Lakh/year under Section 80C on premiums paid." },
      { iconBg: "bg-rose-100",   emoji: "🏥", title: "Critical Illness Cover",description: "Add-on riders cover 40+ critical illnesses paying a lump sum on diagnosis." },
      { iconBg: "bg-orange-100", emoji: "🔒", title: "Low Locked-In Premiums",description: "Buy young, pay less for life. Premiums are fixed at the age you buy." },
      { iconBg: "bg-cyan-100",   emoji: "📈", title: "Wealth Creation",       description: "Endowment and ULIP plans grow your money alongside protecting your life." },
    ],
    stagesBadge: "AT EVERY STAGE OF LIFE",
    stagesTitle: "Your insurance needs", stagesTitleAccent: "change as you grow",
    stages: [
      { emoji:"🎓", age:"AGE 20–30", ageColor:"text-cyan-600",   title:"Just Starting Out",   description:"Lock in ultra-low premiums.", linkText:"Term Insurance",       linkColor:"text-blue-700",   bg:"bg-gradient-to-br from-blue-50 to-white" },
      { emoji:"💍", age:"AGE 30–40", ageColor:"text-orange-500", title:"Family & Mortgage",   description:"Protect spouse, kids, home loan.", linkText:"Term + Critical Illness", linkColor:"text-orange-500", bg:"bg-gradient-to-br from-orange-50 to-white" },
      { emoji:"📈", age:"AGE 40–55", ageColor:"text-emerald-600",title:"Peak Earning Years",  description:"Focus on wealth creation alongside protection.", linkText:"ULIP + Endowment",     linkColor:"text-emerald-600",bg:"bg-gradient-to-br from-emerald-50 to-white" },
      { emoji:"🏠", age:"AGE 55+",   ageColor:"text-cyan-600",   title:"Legacy Planning",     description:"Pass on wealth to next generation.", linkText:"Whole Life Plan",     linkColor:"text-cyan-600",   bg:"bg-gradient-to-br from-cyan-50 to-white" },
    ],
    withoutTitle: "Without Life Insurance",
    withoutItems: ["Family scrambles to pay rent and EMIs","Children's education disrupted","Home loan leads to property seizure","Spouse forced to sell assets","No tax-saving benefit","Ageing parents left without support"],
    withTitle: "With Life Insurance",
    withItems: ["Family's lifestyle secured for 10+ years","Education fund fully pre-funded","All loans cleared from policy payout","Spouse receives lump sum immediately","Save ₹1.5L/year in tax","Parents receive regular income support"],
    ctaHeading: "Still thinking about it?",
    ctaBody: "Talk to a TransIndia expert — free, no pressure, no sales pitch.",
    faqBadge: "COMMON QUESTIONS", faqTitle: "Life Insurance", faqTitleAccent: "FAQs", faqTitleAccentColor: "#EA580C",
    faqs: [
      { question: "How much life cover do I need?", answer: "A common rule of thumb is 10–15x your annual income depending on debts and dependents." },
      { question: "What is a claim settlement ratio?", answer: "The percentage of claims an insurer has successfully paid out. A higher ratio (95%+) is better." },
      { question: "Can I buy life insurance online?", answer: "Yes, most insurers offer a fully digital process including e-KYC and online payment." },
      { question: "What happens if I miss a premium?", answer: "Most policies offer a grace period of 15–30 days before the policy lapses." },
    ],
    calcCardTitle: "Calculate your premium", calcSubmitLabel: "Get My Instant Quote", calcSubmitBg: "#1B8A3A",
    calcFields: [
      { label: "Date of Birth",        type: "date",   stateKey: "dob",         defaultValue: "" },
      { label: "Gender",               type: "select", options: ["Male","Female","Other"],                                                    stateKey: "gender",      defaultValue: "Male" },
      { label: "Smoker",               type: "select", options: ["No","Yes"],                                                                 stateKey: "smoker",      defaultValue: "No" },
      { label: "Sum Assured Required", type: "select", options: ["₹25 lakh","₹50 lakh","₹75 lakh","₹1 crore","₹2 crore","₹5 crore"],         stateKey: "sumAssured",  defaultValue: "₹1 crore" },
      { label: "Policy Term",          type: "select", options: ["10 years","15 years","20 years","25 years","30 years"],                     stateKey: "policyTerm",  defaultValue: "30 years" },
      { label: "Annual Income",        type: "select", options: ["Below ₹3 Lakh","₹3–6 Lakh","₹6–12 Lakh","₹12–25 Lakh","Above ₹25 Lakh"], stateKey: "annualIncome",defaultValue: "₹6–12 Lakh" },
    ],
    sortOrder: 1, serviceType: "personal",
  },
  {
    slug: "health-insurance", title: "Health Insurance",
    badge: "Critical need", badgeColor: "bg-teal-100 text-teal-700",
    description: "Individual, family floater, senior citizen, and critical illness plans.",
    features: ["Individual Health Plans","Family Floater Policies","Senior Citizen Cover","Critical Illness Plans"],
    buttonText: "Get Health Quote", buttonColor: "bg-teal-600 hover:bg-teal-700",
    iconBg: "bg-emerald-50", image: "/images/services/health.svg",
    heroRestTitle: "We protect", heroAccentWord: "your health,",
    heroSubtitle: "Individual, family, and senior citizen health plans starting from ₹299/month.",
    heroBadgeText: "Health Insurance", heroCtaBg: "#0D9488",
    heroAccentColor: "#34D399", heroAccentColor2: "#38BDF8",
    heroStats: [
      { value: "10,000+", label: "Cashless Hospitals" },
      { value: "15+",     label: "Insurer Partners" },
      { value: "₹1Cr",    label: "Max Sum Insured" },
    ],
    whyBadge: "WHY HEALTH INSURANCE?", whyTitle: "Medical costs are rising.", whyTitleAccent: "Your cover should too.", whyTitleAccentColor: "#0D9488",
    whyBody: ["Healthcare inflation in India is running at 14% per year. A single hospitalisation can wipe out years of savings.", "A comprehensive health plan gives you access to the best hospitals without worrying about the bill.", "Our advisors compare 15+ insurers to find the right balance of premium, network, and sub-limits."],
    benefitsBadge: "THE BENEFITS", benefitsTitle: "8 reasons to get", benefitsTitleAccent: "health cover today", benefitsTitleAccentColor: "#0D9488",
    benefitsSubtitle: "From hospitalisation to day-care procedures, a good health plan pays for what matters most.",
    benefits: [
      { iconBg:"bg-teal-100",   emoji:"🏥", title:"Cashless Hospitalisation",  description:"Get treated at any network hospital without paying upfront." },
      { iconBg:"bg-emerald-100",emoji:"👨‍👩‍👧", title:"Family Floater Cover",      description:"One policy, one premium covers the entire family." },
      { iconBg:"bg-blue-100",   emoji:"🩺", title:"Pre & Post Hospitalisation",description:"Covers doctor consultations and medicines before and after admission." },
      { iconBg:"bg-indigo-100", emoji:"💊", title:"Day-Care Procedures",       description:"Modern treatments that take less than 24 hours are fully covered." },
      { iconBg:"bg-rose-100",   emoji:"❤️", title:"Critical Illness Add-on",  description:"Receive a lump sum on diagnosis of cancer, heart attack, or stroke." },
      { iconBg:"bg-orange-100", emoji:"👴", title:"Senior Citizen Plans",      description:"Specialised policies for 60+ with no medical tests up to a certain age." },
      { iconBg:"bg-yellow-100", emoji:"📋", title:"Tax Savings under 80D",    description:"Save up to ₹25,000/year on health insurance premiums." },
      { iconBg:"bg-cyan-100",   emoji:"🔄", title:"No-Claim Bonus",           description:"For every claim-free year, your sum insured increases at no extra cost." },
    ],
    stagesBadge: "AT EVERY LIFE STAGE", stagesTitle: "Health needs", stagesTitleAccent: "evolve with age",
    stages: [
      { emoji:"🧑",    age:"AGE 18–30", ageColor:"text-teal-600",  title:"Young & Independent",description:"Low premiums, high coverage.",          linkText:"Individual Health Plan",  linkColor:"text-teal-600",  bg:"bg-gradient-to-br from-teal-50 to-white" },
      { emoji:"👨‍👩‍👧", age:"AGE 30–45", ageColor:"text-blue-600",  title:"Growing Family",     description:"Switch to a family floater.",          linkText:"Family Floater Plan",     linkColor:"text-blue-600",  bg:"bg-gradient-to-br from-blue-50 to-white" },
      { emoji:"🧑‍💼",  age:"AGE 45–60", ageColor:"text-orange-500",title:"Peak Risk Years",     description:"Add critical illness riders.",         linkText:"Critical Illness + Top-Up",linkColor:"text-orange-500",bg:"bg-gradient-to-br from-orange-50 to-white" },
      { emoji:"👴",    age:"AGE 60+",   ageColor:"text-rose-600",  title:"Senior Coverage",    description:"Specialised senior plans with OPD.",  linkText:"Senior Citizen Plan",     linkColor:"text-rose-600",  bg:"bg-gradient-to-br from-rose-50 to-white" },
    ],
    withoutTitle: "Without Health Insurance", withoutItems: ["Emergency surgery drains savings","Family delays treatment","High-interest medical loans","No access to top hospitals","Pre-existing conditions trap","Miss ₹50,000 in tax deductions"],
    withTitle: "With Health Insurance",      withItems:    ["Cashless treatment at 10,000+ hospitals","Family gets best care","Insurer settles bills directly","Free annual health check-ups","Pre-existing covered after waiting period","Save ₹50,000/year in tax"],
    ctaHeading: "Need help choosing the right plan?", ctaBody: "Our advisors compare 15+ insurers and pick the best fit.",
    faqBadge: "COMMON QUESTIONS", faqTitle: "Health Insurance", faqTitleAccent: "FAQs", faqTitleAccentColor: "#0D9488",
    faqs: [
      { question: "What is a waiting period?", answer: "The time before a specific benefit becomes available. Initial waiting is 30 days; pre-existing diseases 2–4 years." },
      { question: "What is a family floater policy?", answer: "Covers the entire family under a single sum insured. Any member can use the full cover in a policy year." },
      { question: "Does health insurance cover pre-existing diseases?", answer: "Yes, after a waiting period of 2–4 years depending on the insurer and plan." },
      { question: "What is No-Claim Bonus (NCB)?", answer: "A reward for not filing claims — your sum insured increases by 10–50% at renewal at no extra cost." },
    ],
    calcCardTitle: "Get your health quote", calcSubmitLabel: "Get My Health Quote", calcSubmitBg: "#0D9488",
    calcFields: [
      { label:"Date of Birth",          type:"date",   stateKey:"dob",        defaultValue:"" },
      { label:"Cover Type",             type:"select", options:["Individual","Family Floater","Senior Citizen"], stateKey:"coverType",   defaultValue:"Individual" },
      { label:"Sum Insured",            type:"select", options:["₹3 lakh","₹5 lakh","₹10 lakh","₹25 lakh","₹50 lakh"],                  stateKey:"sumInsured",  defaultValue:"₹5 lakh" },
      { label:"Pre-existing Conditions",type:"select", options:["None","Diabetes","Hypertension","Both"],        stateKey:"conditions",  defaultValue:"None" },
      { label:"City Tier",              type:"select", options:["Tier 1 (Metro)","Tier 2","Tier 3"],             stateKey:"city",        defaultValue:"Tier 1 (Metro)" },
    ],
    sortOrder: 2, serviceType: "personal",
  },
  // Add motor, home, travel, risk-consultation similarly — keeping seed shorter for brevity
  {
    slug: "motor-insurance", title: "Motor Insurance",
    badge: "Mandatory", badgeColor: "bg-orange-100 text-orange-700",
    description: "Comprehensive and third-party motor plans for cars, bikes, and commercial vehicles.",
    features: ["Comprehensive Car Insurance","Two-Wheeler Insurance","Commercial Vehicle Cover","Zero Depreciation Add-on"],
    buttonText: "Get Motor Quote", buttonColor: "bg-orange-500 hover:bg-orange-600",
    iconBg: "bg-orange-50", image: "/images/services/motor.svg",
    heroRestTitle: "Comprehensive cover for", heroAccentWord: "your vehicle",
    heroSubtitle: "Compare premiums from 20+ insurers. Instant policy issuance.",
    heroBadgeText: "Motor Insurance", heroCtaBg: "#EA580C",
    heroAccentColor: "#FB923C", heroAccentColor2: "#FCD34D",
    heroStats: [{ value:"20+", label:"Insurer Partners" },{ value:"3,500+", label:"Cashless Garages" },{ value:"24/7", label:"Roadside Assistance" }],
    whyBadge:"WHY MOTOR INSURANCE?", whyTitle:"It's not just the law.", whyTitleAccent:"It's financial protection.", whyTitleAccentColor:"#EA580C",
    whyBody:["Third-party motor insurance is mandatory under the Motor Vehicles Act, 1988.","A comprehensive plan covers your car, the third party, and adds optional riders.","Our team compares IDV, cashless garage networks, and claim settlement ratios."],
    benefitsBadge:"THE BENEFITS", benefitsTitle:"8 reasons to get", benefitsTitleAccent:"proper motor cover", benefitsTitleAccentColor:"#EA580C",
    benefitsSubtitle:"An accident, theft, or natural disaster can happen to any vehicle. Make sure you're fully covered.",
    benefits:[
      { iconBg:"bg-orange-100",emoji:"🚗", title:"Own Damage Cover",     description:"Covers repair costs after accidents, floods, fire, and theft." },
      { iconBg:"bg-rose-100",  emoji:"⚖️", title:"Third-Party Liability",description:"Mandatory by law. Covers injury, death, or property damage to a third party." },
      { iconBg:"bg-yellow-100",emoji:"🔧", title:"Cashless Garages",     description:"Get repairs at 3,500+ network garages without upfront payment." },
      { iconBg:"bg-blue-100",  emoji:"🛡️", title:"Zero Depreciation",    description:"Claim the full cost of parts without depreciation deduction." },
      { iconBg:"bg-emerald-100",emoji:"🔑",title:"Engine Protection",    description:"Covers engine damage due to water ingression or oil leakage." },
      { iconBg:"bg-indigo-100",emoji:"🚨", title:"Roadside Assistance",  description:"24/7 support for breakdown, flat tyre, fuel delivery, and towing." },
      { iconBg:"bg-cyan-100",  emoji:"📦", title:"NCB Protection",       description:"Protect your earned No-Claim Bonus even after filing a claim." },
      { iconBg:"bg-purple-100",emoji:"💼", title:"Personal Accident Cover",description:"₹15 lakh cover for the owner-driver in case of death or permanent disability." },
    ],
    stagesBadge:"FOR EVERY VEHICLE TYPE", stagesTitle:"Motor insurance for", stagesTitleAccent:"every kind of driver",
    stages:[
      { emoji:"🛵",age:"TWO-WHEELERS",  ageColor:"text-orange-500",title:"Bikes & Scooters",     description:"Mandatory third-party + comprehensive from day one.", linkText:"Two-Wheeler Plan",      linkColor:"text-orange-500",bg:"bg-gradient-to-br from-orange-50 to-white" },
      { emoji:"🚗",age:"PRIVATE CARS",  ageColor:"text-blue-600",  title:"Private Cars",         description:"Comprehensive plans with zero depreciation add-ons.", linkText:"Comprehensive Car Plan", linkColor:"text-blue-600",  bg:"bg-gradient-to-br from-blue-50 to-white" },
      { emoji:"🚌",age:"COMMERCIAL",    ageColor:"text-emerald-600",title:"Commercial Vehicles",  description:"Specialised policies for goods carriers and taxis.",  linkText:"Commercial Vehicle Plan",linkColor:"text-emerald-600",bg:"bg-gradient-to-br from-emerald-50 to-white" },
      { emoji:"⚡",age:"ELECTRIC VEHICLES",ageColor:"text-cyan-600",title:"Electric Vehicles",   description:"EV insurance covering battery and charging equipment.", linkText:"EV Insurance Plan",     linkColor:"text-cyan-600",  bg:"bg-gradient-to-br from-cyan-50 to-white" },
    ],
    withoutTitle:"Without Comprehensive Cover", withoutItems:["Repair bills ₹50K–5L out of pocket","Theft with no compensation","Flood damage leaves you stranded","Unlimited third-party liability","Engine failure not covered","Fines for policy lapse"],
    withTitle:"With Comprehensive Cover",       withItems:   ["All repair costs at network garages","Full IDV paid for theft or total loss","Natural disaster damage reimbursed","Third-party liability covered","Engine protect add-on handles waterlogging","Policy renewed in minutes"],
    ctaHeading:"Ready to insure your vehicle?", ctaBody:"Compare 20+ insurers and get your policy in under 5 minutes.",
    faqBadge:"COMMON QUESTIONS", faqTitle:"Motor Insurance", faqTitleAccent:"FAQs", faqTitleAccentColor:"#EA580C",
    faqs:[
      { question:"What is IDV in motor insurance?", answer:"IDV is the current market value of your vehicle — the maximum payout in case of total loss or theft." },
      { question:"What is zero depreciation cover?", answer:"Removes the depreciation deduction on replaced parts so you receive the full replacement cost." },
      { question:"Does motor insurance cover natural disasters?", answer:"Yes, comprehensive plans cover floods, cyclones, earthquakes, and other natural calamities." },
      { question:"What is NCB?", answer:"No-Claim Bonus is a discount on your renewal premium for every claim-free year — up to 50% after 5 years." },
    ],
    calcCardTitle:"Calculate motor premium", calcSubmitLabel:"Get My Motor Quote", calcSubmitBg:"#EA580C",
    calcFields:[
      { label:"Vehicle Type",        type:"select",options:["Car","Two-Wheeler","Commercial Vehicle"],        stateKey:"vehicleType",defaultValue:"Car" },
      { label:"Registration Year",   type:"select",options:["2024","2023","2022","2021","2020","2019 or older"],stateKey:"regYear",   defaultValue:"2023" },
      { label:"Fuel Type",           type:"select",options:["Petrol","Diesel","CNG","Electric"],              stateKey:"fuelType",   defaultValue:"Petrol" },
      { label:"NCB",                 type:"select",options:["0%","20%","25%","35%","45%","50%"],              stateKey:"ncb",        defaultValue:"0%" },
      { label:"Add-ons Required",    type:"select",options:["None","Zero Depreciation","Engine Protect","Both"],stateKey:"addons",  defaultValue:"None" },
    ],
    sortOrder:3, serviceType:"personal",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // Create superadmin
  const existing = await Admin.findOne({ email: "admin@transindia.com" });
  if (!existing) {
    await Admin.create({
      name: "Super Admin",
      email: "admin@transindia.com",
      password: "Admin@123",
      role: "superadmin",
    });
    console.log("✅ Superadmin created — email: admin@transindia.com | password: Admin@123");
  } else {
    console.log("ℹ️  Admin already exists");
  }

  // Seed services
  for (const svc of SERVICES) {
    const exists = await Service.findOne({ slug: svc.slug });
    if (!exists) {
      await Service.create(svc);
      console.log(`✅ Created service: ${svc.title}`);
    } else {
      console.log(`ℹ️  Service exists: ${svc.title}`);
    }
  }

  console.log("🌱 Seed complete");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });