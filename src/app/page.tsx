import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/features/landing/components/HeroSection";
import CollaboratorsSection from "@/features/landing/components/CollaboratorsSection";
import HowItWorksSection from "@/features/landing/components/HowItWorksSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main >
        <HeroSection />
        <CollaboratorsSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}
