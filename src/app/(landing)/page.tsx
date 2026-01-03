import HeroSection from "@/features/public/landing/components/HeroSection";
import CollaboratorsSection from "@/features/public/landing/components/CollaboratorsSection";
import HowItWorksSection from "@/features/public/landing/components/HowItWorksSection";
import TrustedSection from "@/features/public/landing/components/TrustedSection";
import CTASection from "@/features/public/landing/components/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CollaboratorsSection />
      <HowItWorksSection />
      <TrustedSection />
      <CTASection />
    </>
  );
}
