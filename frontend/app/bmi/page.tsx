import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import BmiCalculator from "@/components/bmi/BmiCalculator";
import WellnessTips from "@/components/bmi/Wellnesstips";
import BmiFaq from "@/components/bmi/BmiFaq";

export default function Home() {
  return (
    <div style={{ overflowX: "hidden", width: "100%" }}>
      <Navbar alwaysSolid={true} />
      <BmiCalculator />
      <WellnessTips />
      <BmiFaq />
      <TransindiaFooter/>
    </div>
  );
}