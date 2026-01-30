"use client";

import { RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-900 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-red-500/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl"></div>
            <RefreshCw size={40} className="relative z-10 rotate-180 text-red-400" />
            {/* Using RefreshCw as a 'system reset' metaphor or AlertTriangle if imported */}
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl">
          Terjadi Kendala
        </h1>

        <p className="mb-8 leading-relaxed text-white/60">
          Sistem mengalami sedikit gangguan saat memuat halaman ini. Cobalah menyegarkan kembali.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3 font-semibold text-neutral-900 transition-all hover:bg-neutral-200"
          >
            <RefreshCw size={18} className="transition-transform group-hover:rotate-180" />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/dashboard/home"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3 font-semibold text-white transition-all hover:bg-white/10"
          >
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
