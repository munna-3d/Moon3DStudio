import HeroSection from "@/components/home/HeroSection";
import StatementSection from "@/components/home/StatementSection";
import SelectedWorkSection from "@/components/home/SelectedWorkSection";
import ServicesSection from "@/components/home/ServicesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import StudioFounderSection from "@/components/home/StudioFounderSection";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatementSection />
      <SelectedWorkSection />
      <ServicesSection />
      <HowItWorksSection />
      <WhyUsSection />
      <StudioFounderSection />
      <ContactSection />
    </>
  );
}
