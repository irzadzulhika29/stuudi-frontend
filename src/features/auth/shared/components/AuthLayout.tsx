"use client";

import React from "react";
import Image from "next/image";
import ProgressBar from "@/shared/components/ui/ProgressBar";

interface AuthLayoutProps {
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  currentStep?: number;
}

export default function AuthLayout({ title, subtitle, children, currentStep }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-[35%] lg:px-16">
        <div className="mx-auto w-full max-w-[380px]">
          <div className="flex justify-center">
            <Image src="/images/logo/ARTERI.webp" alt="ARTERI" width={150} height={34} priority />
          </div>

          {currentStep && <ProgressBar currentStep={currentStep} />}

          <h1 className="text-primary-dark mb-2 text-center text-2xl font-bold">{title}</h1>

          {subtitle && <p className="mb-8 text-center text-sm text-gray-600">{subtitle}</p>}

          {children}
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:flex lg:w-[65%]">
        <Image src="/images/auth/bgAuth.webp" alt="" fill className="object-cover" priority />

        <div className="absolute top-1/2 left-1/2 z-10 flex -translate-x-72 -translate-y-1/2 flex-col items-center justify-center pb-20 pl-20">
          <div className="relative">
            <div className="animate-float-gentle absolute -top-8 -left-2 z-10">
              <Image
                src="/images/mascot/chibiflying.webp"
                alt="Arterians Mascot"
                width={170}
                height={170}
                priority
              />
            </div>

            <div className="relative z-0">
              <Image
                src="/images/logo/ARTERI.webp"
                alt="ARTERI"
                width={380}
                height={130}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
