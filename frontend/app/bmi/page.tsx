import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import BmiCalculator from "@/components/bmi/BmiCalculator";
import WellnessTips from "@/components/bmi/Wellnesstips";

export default function Home() {
  return (
    <div style={{ overflowX: "hidden", width: "100%" }}>
      <Navbar alwaysSolid={true} />
      <BmiCalculator />
      <WellnessTips />
      <TransindiaFooter/>
    </div>
  );
}