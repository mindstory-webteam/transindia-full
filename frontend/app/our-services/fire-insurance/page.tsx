// FILE LOCATION: app/our-services/fire-insurance/page.tsx
import type { Metadata } from "next";
import { INSURANCE_DATA } from "../insuranceData";
import InsuranceDetailPage from "../InsuranceDetailPage";
const SLUG = "fire-insurance";
const data = INSURANCE_DATA[SLUG];
export const metadata: Metadata = {
  title: `${data.heroBadgeText} | TransIndia Insurance`,
  description: data.heroSubtitle,
};
export default function FireInsurancePage() {
  return <InsuranceDetailPage data={data} slug={SLUG} />;
}