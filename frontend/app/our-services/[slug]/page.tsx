// FILE LOCATION: app/our-services/[slug]/page.tsx

import { notFound } from "next/navigation";
import { InsuranceDetailData } from "../insuranceData";
import InsuranceDetailPage from "./InsuranceDetailPage";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:5000/api";

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchServiceBySlug(slug: string): Promise<InsuranceDetailData | null> {
  try {
    const res = await fetch(`${API_BASE}/services/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    // API returns { success: true, data: { ...service } }
    return (json?.data ?? null) as InsuranceDetailData | null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/services`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    const list: Array<{ slug: string }> = Array.isArray(json?.data) ? json.data : [];
    return list.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await fetchServiceBySlug(slug);
  if (!data) return {};
  return {
    title: `${data.heroBadgeText} | TransIndia Insurance`,
    description: data.heroSubtitle,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const data = await fetchServiceBySlug(slug);
  if (!data) notFound();
  return <InsuranceDetailPage data={data} slug={slug} />;
}