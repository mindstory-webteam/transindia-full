// FILE LOCATION: app/our-services/[slug]/page.tsx
// insuranceData.ts is ONE level up at:  app/our-services/insuranceData.ts
// InsuranceDetailPage.tsx is SAME folder: app/our-services/[slug]/InsuranceDetailPage.tsx

import { notFound } from "next/navigation";
import { INSURANCE_DATA } from "../insuranceData";          // ← ONE level up
import InsuranceDetailPage from "./InsuranceDetailPage";    // ← same folder

// ── Next.js 15: params is now a Promise ──────────────────────────────────
interface Props {
  params: Promise<{ slug: string }>;
}

// ── Static params for SSG ─────────────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(INSURANCE_DATA).map((slug) => ({ slug }));
}

// ── SEO metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = INSURANCE_DATA[slug];
  if (!data) return {};
  return {
    title: `${data.heroBadgeText} | TransIndia Insurance`,
    description: data.heroSubtitle,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const data = INSURANCE_DATA[slug];
  if (!data) notFound();
  return <InsuranceDetailPage data={data} slug={slug} />;
}