"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import ProgressBar from "@/shared/components/ui/ProgressBar";

interface AuthLayoutProps {
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  googleButtonText?: string;
  bottomText?: string;
  bottomLinkText?: string;
  bottomLinkHref?: string;
  currentStep?: number;
  isLinkDisabled?: boolean;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  googleButtonText,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
  currentStep,
  isLinkDisabled = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-[35%] flex flex-col justify-center px-8 lg:px-16 py-12 bg-white">
        <div className="max-w-[380px] mx-auto w-full">
          <div className="flex justify-center">
            <Image
              src="/images/logo/ARTERI.webp"
              alt="ARTERI"
              width={150}
              height={34}
              priority
            />
          </div>

          {/* Progress Bar - Only show during registration */}
          {currentStep && <ProgressBar currentStep={currentStep} />}

          <h1 className="text-2xl font-bold text-primary-dark text-center mb-2">
            {title}
          </h1>

          {subtitle && (
            <p className="text-center text-gray-600 mb-8 text-sm">{subtitle}</p>
          )}

          {children}

          {googleButtonText && (
            <>
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <span className="relative z-10 bg-white px-3 text-sm text-gray-500">
                  atau
                </span>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-full hover:bg-gray-50 transition-all shadow-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {googleButtonText}
              </button>
            </>
          )}

          {bottomText && bottomLinkHref && (
            <p className="mt-8 text-center text-sm text-gray-600">
              {bottomText}{" "}
              {isLinkDisabled ? (
                <span className="text-(--secondary-light) opacity-70 cursor-not-allowed font-medium">
                  {bottomLinkText}
                </span>
              ) : (
                <Link
                  href={bottomLinkHref}
                  className="text-(--secondary-light) hover:text-secondary hover:underline font-medium"
                >
                  {bottomLinkText}
                </Link>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[65%] relative overflow-hidden">
        <Image
          src="/images/auth/bgAuth.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />

        <div className="absolute left-1/2 top-1/2  -translate-x-72 -translate-y-1/2 flex flex-col items-center justify-center z-10 pl-20 pb-20">
          <div className="relative">
            <div className="absolute -top-8 -left-2 animate-float-gentle z-10">
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
