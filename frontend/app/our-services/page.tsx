// FILE LOCATION: app/our-services/page.tsx

import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import ConsultationCTA from "@/components/about/ConsultationCTA";
import ServicesHero from "@/components/Services/ServicesHero";
import PersonalInsuranceServices from "@/components/Services/PersonalInsuranceServices";
import CorporateRiskManagement from "@/components/Services/Corporateriskmanagement";

export const metadata = {
  title: "Our Services | TransIndia Insurance",
  description:
    "Life, health, motor, home, and travel insurance — compare 20+ insurers and get the right cover for you.",
};

export default function OurServicesPage() {
  return (
    <div style={{ overflowX: "hidden", width: "100%" }}>
      <Navbar />
      <ServicesHero />
      <PersonalInsuranceServices />
      <CorporateRiskManagement />
      <ConsultationCTA />
      <TransindiaFooter />
    </div>
  );
}