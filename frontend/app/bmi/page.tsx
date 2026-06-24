import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import BmiCalculator from "@/components/bmi/BmiCalculator";
import WellnessTips from "@/components/bmi/Wellnesstips";
import BmiFaq from "@/components/bmi/BmiFaq";
import ConsultationCTA from "@/components/about/ConsultationCTA";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <div style={{ overflowX: "hidden", width: "100%" }}>
       <Preloader/>
      <Navbar alwaysSolid={true} />
      <BmiCalculator />
      <WellnessTips />
      <BmiFaq />
      <ConsultationCTA/>
      <TransindiaFooter/>
    </div>
  );
}