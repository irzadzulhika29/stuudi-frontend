"use client";

import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen relative flex items-center justify-center overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/bgGlobal.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        <div className="relative w-32 h-40 mb-4 animate-drop-in-slower animate-float-hover">
          <Image
            src="/images/mascot/chiby.webp"
            alt="Lost"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        <div
          className="relative w-40 h-18 mb-4 opacity-0 animate-fade-in-delayed"
          style={{ animationDelay: "1.2s" }}
        >
          <Image
            src="/images/logo/ARTERI.webp"
            alt="ARTERI"
            fill
            className="object-contain"
          />
        </div>

        <div
          className="relative mb-4 opacity-0 animate-fade-in-delayed"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="absolute inset-0 blur-[60px] bg-gradient-to-r from-orange-500/30 via-amber-500/30 to-orange-600/30 scale-125" />

          <h1 className="relative text-8xl md:text-9xl font-black leading-none tracking-tight">
            <span className="bg-gradient-to-b from-white via-orange-50 to-orange-200 bg-clip-text text-transparent drop-shadow-2xl">
              404
            </span>
          </h1>
        </div>

        <div
          className="space-y-2 mb-6 opacity-0 animate-fade-in-delayed"
          style={{ animationDelay: "1.8s" }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
            Sepertinya halaman yang kamu cari tidak ada atau sudah dipindahkan.
          </p>
        </div>

        <div
          className="opacity-0 animate-fade-in-delayed"
          style={{ animationDelay: "2.1s" }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-secondary-light to-secondary-default hover:from-secondary-default hover:to-primary-light text-white font-semibold px-6 py-3 rounded-full transition-all duration-500 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 text-sm hover:scale-105"
          >
            <Home
              size={18}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
