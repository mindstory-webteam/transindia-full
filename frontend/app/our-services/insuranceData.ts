// ADD these fields to your existing InsuranceDetailData interface
// (the rest of insuranceData.ts stays completely unchanged)

export interface CalcField {
  label: string;
  type: "date" | "select";
  options?: string[];
  stateKey: string;
  defaultValue: string;
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
  heroAccentColor: string;
  heroAccentColor2: string;
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
  // ← NEW: Calculator fields from API
  calcCardTitle?: string;
  calcSubmitLabel?: string;
  calcSubmitBg?: string;
  calcFields?: CalcField[];
}