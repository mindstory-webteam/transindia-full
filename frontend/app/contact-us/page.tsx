import Navbar from "@/components/Navbar";
import TransindiaFooter from "@/components/Transindiafooter";
import ConsultationCTA from "@/components/about/ConsultationCTA";
import ContactFormSection from "@/components/contact-us/ContactFormSection";
import FaqSection from "@/components/contact-us/FaqSection";
import ContactHero from "@/components/contact-us/ContactHero";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <div style={{ overflowX: "hidden", width: "100%" }}>
       <Preloader/>
    <Navbar />
    <ContactHero />
    <ContactFormSection/>
    <FaqSection/>
     <ConsultationCTA/>
     <TransindiaFooter />
    </div>
  );
}