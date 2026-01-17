import HeroSection from "@/features/public/landing/components/HeroSection";
import CollaboratorsSection from "@/features/public/landing/components/CollaboratorsSection";
import HowItWorksSection from "@/features/public/landing/components/HowItWorksSection";
import TrustedSection from "@/features/public/landing/components/TrustedSection";
import CTASection from "@/features/public/landing/components/CTASection";

import { delay } from "@/shared/utils/delay";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Platform pembelajaran adaptif untuk pengembangan tim modern dan kompetisi.",
};

export default async function HomePage() {
  await delay(1500);

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
