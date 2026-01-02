"use client";

import Button from "@/shared/ui/Button";
import Image from "next/image";
import HeroWrapper from "@/shared/layout/HeroWrapper";

export default function HeroSection() {
  return (
    <HeroWrapper>
      <div className="flex items-center">
        <div className="w-2/3 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="text-secondary-default font-bold">#1</span>
            <span className="text-primary-dark font-medium">
              Pertama di Indonesia
            </span>
          </div>

          <h1 className="text-xl sm:text-5xl lg:text-5xl font-bold leading-tight">
            <span className="text-primary-dark">Elegansi dalam </span>
            <span className="text-secondary-default">Pembelajaran</span>
            <span className="text-primary-dark">,</span>
            <br />
            <span className="text-primary-dark">Integritas dalam </span>
            <span className="text-primary">Kompetisi</span>
            <span className="text-primary-dark">.</span>
          </h1>

          <p className="text-lg text-neutral-gray leading-relaxed">
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
            src="/images/mascot/chiby.webp"
            alt="Arteri Mascot"
            width={400}
            height={400}
            className="absolute animate-float top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </HeroWrapper>
  );
}
