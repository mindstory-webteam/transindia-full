import ClaimsFaqSection from "@/components/claims/ClaimFaqSection";
import ClaimHero from "@/components/claims/ClaimHero";
import ClaimsProcessSection from "@/components/claims/ClaimProcessSection";
import DocumentsChecklistSection from "@/components/claims/Documentschecklistsection";
import InsuranceClaimsSection from "@/components/claims/InsuranceClaimSection";
import TrackClaimSection from "@/components/claims/Trackclaimsection";
import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";


export default function Home() {
  return (
    <div style={{ overflowX: "hidden", width: "100%" }}>
      <Navbar/>
      <ClaimHero/>
      <InsuranceClaimsSection/>
      <ClaimsProcessSection/>
      <DocumentsChecklistSection/>
      <TrackClaimSection/>
      <ClaimsFaqSection/>
      <TransindiaFooter/>
    </div>
  );
}