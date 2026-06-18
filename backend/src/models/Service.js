const mongoose = require("mongoose");

const CalcFieldSchema = new mongoose.Schema(
  { label: { type: String, default: "" }, type: { type: String, enum: ["date","select"], default: "select" }, options: [{ type: String }], stateKey: { type: String, default: "" }, defaultValue: { type: String, default: "" } },
  { _id: false }
);

const BenefitSchema = new mongoose.Schema(
  { iconBg: { type: String, default: "bg-blue-100" }, emoji: { type: String, default: "🛡️" },
    icon: { type: String, default: "" },  // ← Cloudinary image URL for icon
    title: { type: String, default: "" }, description: { type: String, default: "" } },
  { _id: false }
);

const StageSchema = new mongoose.Schema(
  { emoji: { type: String, default: "📋" }, icon: { type: String, default: "" }, // ← Cloudinary image URL
    age: { type: String, default: "" }, ageColor: { type: String, default: "text-blue-600" },
    title: { type: String, default: "" }, description: { type: String, default: "" },
    linkText: { type: String, default: "" }, linkColor: { type: String, default: "text-blue-700" },
    bg: { type: String, default: "bg-gradient-to-br from-blue-50 to-white" } },
  { _id: false }
);

const FAQSchema = new mongoose.Schema(
  { question: { type: String, default: "" }, answer: { type: String, default: "" } },
  { _id: false }
);

const HeroStatSchema = new mongoose.Schema(
  { value: { type: String, default: "" }, label: { type: String, default: "" } },
  { _id: false }
);

const ServiceSchema = new mongoose.Schema(
  {
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    title:       { type: String, required: true, trim: true },
    badge:       { type: String, default: "" },
    badgeColor:  { type: String, default: "bg-indigo-100 text-indigo-700" },
    description: { type: String, required: true },
    features:    [{ type: String }],
    buttonText:  { type: String, default: "Get Quote" },
    buttonColor: { type: String, default: "bg-blue-700 hover:bg-blue-800" },
    iconBg:      { type: String, default: "bg-slate-100" },
    image:       { type: String, default: "" },  // ← main card image (Cloudinary URL)

    heroRestTitle: { type: String, default: "" }, heroAccentWord: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" }, heroBadgeText: { type: String, default: "" },
    heroBadgeBg: { type: String, default: "#001250" }, heroBadgeColor: { type: String, default: "#38BDF8" },
    heroStats: [HeroStatSchema], heroCtaLabel: { type: String, default: "Talk to an Expert" },
    heroCtaBg: { type: String, default: "#F4622A" }, heroAccentColor: { type: String, default: "#F4622A" },
    heroAccentColor2: { type: String, default: "#38BDF8" },

    whyBadge: { type: String, default: "" }, whyTitle: { type: String, default: "" },
    whyTitleAccent: { type: String, default: "" }, whyTitleAccentColor: { type: String, default: "#F4622A" },
    whyBody: [{ type: String }],
    whyImage: { type: String, default: "" },  // ← illustration for why section

    benefitsBadge: { type: String, default: "THE BENEFITS" }, benefitsTitle: { type: String, default: "" },
    benefitsTitleAccent: { type: String, default: "" }, benefitsTitleAccentColor: { type: String, default: "#F97316" },
    benefitsSubtitle: { type: String, default: "" }, benefits: [BenefitSchema],

    stagesBadge: { type: String, default: "" }, stagesTitle: { type: String, default: "" },
    stagesTitleAccent: { type: String, default: "" }, stages: [StageSchema],

    withoutTitle: { type: String, default: "" }, withoutItems: [{ type: String }],
    withTitle: { type: String, default: "" }, withItems: [{ type: String }],
    ctaHeading: { type: String, default: "" }, ctaBody: { type: String, default: "" },

    faqBadge: { type: String, default: "COMMON QUESTIONS" }, faqTitle: { type: String, default: "" },
    faqTitleAccent: { type: String, default: "FAQs" }, faqTitleAccentColor: { type: String, default: "#EA580C" },
    faqs: [FAQSchema],

    calcCardTitle: { type: String, default: "Get a quote" }, calcSubmitLabel: { type: String, default: "Get My Quote" },
    calcSubmitBg: { type: String, default: "#1B8A3A" }, calcFields: [CalcFieldSchema],

    isActive: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 },
    serviceType: { type: String, enum: ["personal","corporate"], default: "personal" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);