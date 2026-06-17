import Banner from "@/components/Banner";
import CtaSection from "@/components/Ctasection";
import ExploreToolsSection from "@/components/ExploreTools";
import InsurancePlansSection from "@/components/InsurancePlansSection";
import InsuranceSection from "@/components/InsuranceSection";
import InsuranceSections from "@/components/InsuranceSections";
import Navbar from "@/components/Navbar";
import TestimonialsSection from "@/components/TestimonialsSection";
import TransindiaFooter from "@/components/Transindiafooter";

export default function Home() {
  return (
    <div style={{ overflowX: "hidden", width: "100%" }}>
      <Navbar />
      <Banner />
      <InsuranceSection />
      <InsurancePlansSection />
      <ExploreToolsSection />
      <InsuranceSections />
      <TestimonialsSection />
      <CtaSection />
      <TransindiaFooter />
    </div>
  );
}