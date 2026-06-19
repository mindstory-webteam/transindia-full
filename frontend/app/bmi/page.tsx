import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import BmiCalculator from "@/components/BmiCalculator";

export default function Home() {
  return (
    <div style={{ overflowX: "hidden", width: "100%" }}>
      <Navbar alwaysSolid={true} />
      <BmiCalculator />
      <TransindiaFooter/>
    </div>
  );
}