const mongoose = require("mongoose");

// ── Calculator field sub-schema ───────────────────────────────────────────
const CalcFieldSchema = new mongoose.Schema(
  {
    label:        { type: String, required: true },
    type:         { type: String, enum: ["date", "select"], required: true },
    options:      [{ type: String }],
    stateKey:     { type: String, required: true },
    defaultValue: { type: String, default: "" },
  },
  { _id: false }
);

// ── Benefit sub-schema ────────────────────────────────────────────────────
const BenefitSchema = new mongoose.Schema(
  {
    iconBg:      { type: String, default: "bg-blue-100" },
    emoji:       { type: String, default: "🛡️" },
    title:       { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

// ── Life stage sub-schema ─────────────────────────────────────────────────
const StageSchema = new mongoose.Schema(
  {
    emoji:       { type: String, default: "📋" },
    age:         { type: String, required: true },
    ageColor:    { type: String, default: "text-blue-600" },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    linkText:    { type: String, required: true },
    linkColor:   { type: String, default: "text-blue-700" },
    bg:          { type: String, default: "bg-gradient-to-br from-blue-50 to-white" },
  },
  { _id: false }
);

// ── FAQ sub-schema ────────────────────────────────────────────────────────
const FAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer:   { type: String, required: true },
  },
  { _id: false }
);

// ── Hero stat sub-schema ──────────────────────────────────────────────────
const HeroStatSchema = new mongoose.Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

// ── Main Service Schema ───────────────────────────────────────────────────
const ServiceSchema = new mongoose.Schema(
  {
    // ── Listing card fields (used on /our-services main page) ──────────
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    title:       { type: String, required: true, trim: true },
    badge:       { type: String, default: "" },
    badgeColor:  { type: String, default: "bg-indigo-100 text-indigo-700" },
    description: { type: String, required: true },
    features:    [{ type: String }],
    buttonText:  { type: String, default: "Get Quote" },
    buttonColor: { type: String, default: "bg-blue-700 hover:bg-blue-800" },
    iconBg:      { type: String, default: "bg-slate-100" },
    image:       { type: String, default: "" },  // path or URL

    // ── Hero section ────────────────────────────────────────────────────
    heroRestTitle:   { type: String, default: "" },
    heroAccentWord:  { type: String, default: "" },
    heroSubtitle:    { type: String, default: "" },
    heroBadgeText:   { type: String, default: "" },
    heroBadgeBg:     { type: String, default: "#001250" },
    heroBadgeColor:  { type: String, default: "#38BDF8" },
    heroStats:       [HeroStatSchema],
    heroCtaLabel:    { type: String, default: "Talk to an Expert" },
    heroCtaBg:       { type: String, default: "#F4622A" },
    heroAccentColor: { type: String, default: "#F4622A" },
    heroAccentColor2:{ type: String, default: "#38BDF8" },

    // ── Why section ─────────────────────────────────────────────────────
    whyBadge:            { type: String, default: "" },
    whyTitle:            { type: String, default: "" },
    whyTitleAccent:      { type: String, default: "" },
    whyTitleAccentColor: { type: String, default: "#F4622A" },
    whyBody:             [{ type: String }],

    // ── Benefits ────────────────────────────────────────────────────────
    benefitsBadge:            { type: String, default: "THE BENEFITS" },
    benefitsTitle:            { type: String, default: "" },
    benefitsTitleAccent:      { type: String, default: "" },
    benefitsTitleAccentColor: { type: String, default: "#F97316" },
    benefitsSubtitle:         { type: String, default: "" },
    benefits:                 [BenefitSchema],

    // ── Stages ──────────────────────────────────────────────────────────
    stagesBadge:      { type: String, default: "" },
    stagesTitle:      { type: String, default: "" },
    stagesTitleAccent:{ type: String, default: "" },
    stages:           [StageSchema],

    // ── Comparison ──────────────────────────────────────────────────────
    withoutTitle: { type: String, default: "" },
    withoutItems: [{ type: String }],
    withTitle:    { type: String, default: "" },
    withItems:    [{ type: String }],
    ctaHeading:   { type: String, default: "" },
    ctaBody:      { type: String, default: "" },

    // ── FAQ ─────────────────────────────────────────────────────────────
    faqBadge:            { type: String, default: "COMMON QUESTIONS" },
    faqTitle:            { type: String, default: "" },
    faqTitleAccent:      { type: String, default: "FAQs" },
    faqTitleAccentColor: { type: String, default: "#EA580C" },
    faqs:                [FAQSchema],

    // ── Calculator ──────────────────────────────────────────────────────
    calcCardTitle:   { type: String, default: "Get a quote" },
    calcSubmitLabel: { type: String, default: "Get My Quote" },
    calcSubmitBg:    { type: String, default: "#1B8A3A" },
    calcFields:      [CalcFieldSchema],

    // ── Meta ────────────────────────────────────────────────────────────
    isActive:    { type: Boolean, default: true },
    sortOrder:   { type: Number, default: 0 },
    serviceType: { type: String, enum: ["personal", "corporate"], default: "personal" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);