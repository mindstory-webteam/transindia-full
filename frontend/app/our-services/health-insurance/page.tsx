// FILE LOCATION: app/our-services/health-insurance/page.tsx

import type { Metadata } from "next";
import { INSURANCE_DATA } from "../insuranceData";
import InsuranceDetailPage from "../InsuranceDetailPage";

const SLUG = "health-insurance";
const data = INSURANCE_DATA[SLUG];

export const metadata: Metadata = {
  title: `${data.heroBadgeText} | TransIndia Insurance`,
  description: data.heroSubtitle,
};

export default function HealthInsurancePage() {
  return <InsuranceDetailPage data={data} slug={SLUG} />;
}