"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import HeroWrapper from "@/components/layout/HeroWrapper";

export default function HeroSection() {
  return (
    <HeroWrapper>
      <div className="flex items-center">
        <div className="w-2/3 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="text-[#27a8f3] font-bold">#1</span>
            <span className="text-[#1a1a2e] font-medium">
              Pertama di Indonesia
            </span>
          </div>

          <h1 className="text-xl sm:text-5xl lg:text-5xl font-bold leading-tight">
            <span className="text-[#1A1A2E]">Elegansi dalam </span>
            <span className="text-[#27A8F3]">Pembelajaran</span>
            <span className="text-[#1A1A2E]">,</span>
            <br />
            <span className="text-[#1A1A2E]">Integritas dalam </span>
            <span className="text-[#C83131]">Kompetisi</span>
            <span className="text-[#1A1A2E]">.</span>
          </h1>

          <p className="text-lg text-[#4A5568] leading-relaxed">
            Platform adaptif berbasis gamifikasi untuk pelatihan tim modern dan
            penyelenggaraan olimpiade berskala masif.
          </p>

          <Button
            variant="primary"
            size="lg"
            href="/demo"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            }
          >
            Coba Demo
          </Button>
        </div>

        <div className="w-1/3 relative h-[400px] lg:h-[500px]">
          <Image
            src="/images/graduation-cap.svg"
            alt="Graduation Cap"
            width={640}
            height={640}
            className="absolute animate-float top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </HeroWrapper>
  );
}
