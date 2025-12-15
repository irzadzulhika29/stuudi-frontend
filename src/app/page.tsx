import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/features/landing/components/HeroSection";
import CollaboratorsSection from "@/features/landing/components/CollaboratorsSection";
import HowItWorksSection from "@/features/landing/components/HowItWorksSection";
import TrustedSection from "@/features/landing/components/TrustedSection";
import CTASection from "@/features/landing/components/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CollaboratorsSection />
        <HowItWorksSection />
        <TrustedSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
