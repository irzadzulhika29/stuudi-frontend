"use client";

import Image from "next/image";
import Link from "next/link";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import "@/styles/pages/not-found.css";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    alert("Dashboard Error:" + error);
  }, [error]);

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/bgGlobal.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="animate-drop-in-slower animate-float-hover relative mb-4 h-40 w-32">
          <Image
            src="/images/mascot/chiby.webp"
            alt="Error"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        <div
          className="animate-fade-in-delayed relative mb-4 h-18 w-40 opacity-0"
          style={{ animationDelay: "1.2s" }}
        >
          <Image src="/images/logo/ARTERI.webp" alt="ARTERI" fill className="object-contain" />
        </div>

        <div
          className="animate-fade-in-delayed relative mb-4 opacity-0"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="absolute inset-0 scale-125 bg-linear-to-r from-red-500/30 via-orange-500/30 to-red-600/30 blur-[60px]" />

          <h1 className="relative text-6xl leading-none font-black tracking-tight md:text-7xl">
            <span className="bg-linear-to-b from-white via-red-50 to-red-200 bg-clip-text text-transparent drop-shadow-2xl">
              Oops!
            </span>
          </h1>
        </div>

        <div
          className="animate-fade-in-delayed mb-6 space-y-2 opacity-0"
          style={{ animationDelay: "1.8s" }}
        >
          <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
            Terjadi Kesalahan
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/80 md:text-base">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau kembali ke dashboard.
          </p>
        </div>

        <div
          className="animate-fade-in-delayed flex flex-col gap-3 opacity-0 sm:flex-row"
          style={{ animationDelay: "2.1s" }}
        >
          <button
            onClick={reset}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white/20"
          >
            <RefreshCw
              size={18}
              className="transition-transform duration-500 group-hover:rotate-180"
            />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/dashboard"
            className="group bg-secondary-light hover:from-secondary-default hover:to-primary-light inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-500/20 transition-all duration-500 hover:scale-105 hover:shadow-orange-500/40"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>Ke Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
