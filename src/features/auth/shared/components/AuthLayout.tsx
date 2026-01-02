import Link from "next/link";
import React from "react";
import HeroWrapper from "@/shared/layout/HeroWrapper";
import Image from "next/image";

interface AuthLayoutProps {
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  googleButtonText?: string;
  bottomText?: string;
  bottomLinkText?: string;
  bottomLinkHref?: string;
  heroImageSrc?: string;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  googleButtonText,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
  heroImageSrc = "/images/auth/alvaro.svg",
}: AuthLayoutProps) {
  return (
    <HeroWrapper>
      <div className="max-w-4xl mx-auto flex justify-between gap-12 items-center">
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              kembali ke beranda
            </Link>
          </div>

          <div className="text-2xl text-center font-bold text-primary-dark mb-2 leading-tight">
            {title}
          </div>

          {subtitle && (
            <p className="text-center text-gray-600 mb-8">{subtitle}</p>
          )}

          {children}

          {googleButtonText && (
            <>
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <span className="relative z-10 bg-[#F5F7FA] px-2 text-sm text-gray-500 italic">
                  atau
                </span>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-full hover:bg-gray-50 transition-all shadow-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
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
              <Link
                href={bottomLinkHref}
                className="text-[#27A8F3] hover:underline font-medium"
              >
                {bottomLinkText}
              </Link>
            </p>
          )}
        </div>

        <div className="hidden lg:block relative h-[500px] w-[300px]">
          <div className="absolute inset-0 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
            <Image
              src={heroImageSrc}
              alt="Auth Hero"
              fill
              style={{ objectFit: "cover", objectPosition: "top center" }}
              priority
            />
          </div>

          <div className="absolute -top-8 -right-8 drop-shadow-2xl transform rotate-12">
            <Image
              width={100}
              height={100}
              src="/images/auth/shield.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </HeroWrapper>
  );
}
