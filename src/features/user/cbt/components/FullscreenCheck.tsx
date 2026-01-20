"use client";

import { Maximize, CheckCircle2 } from "lucide-react";

interface FullscreenCheckProps {
  isFullscreen: boolean;
  onRequestFullscreen: () => void;
}

export function FullscreenCheck({ isFullscreen, onRequestFullscreen }: FullscreenCheckProps) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-3xl p-1 transition-all duration-500 ${
        isFullscreen
          ? "bg-gradient-to-br from-green-500/50 to-emerald-600/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          : "border border-white/10 bg-gradient-to-br from-white/10 to-white/5 hover:border-white/30"
      } `}
    >
      <div className="flex h-full flex-col items-center rounded-[22px] bg-neutral-900/90 p-6 text-center backdrop-blur-xl sm:p-8">
        {/* Icon Header */}
        <div className="relative mb-6">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 ${
              isFullscreen
                ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
                : "bg-white/10 text-white/50"
            } `}
          >
            {isFullscreen ? (
              <CheckCircle2 size={32} className="text-white" />
            ) : (
              <Maximize size={32} />
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-2 text-2xl font-bold">Mode Layar Penuh</h3>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-white/50">
            Wajib diaktifkan untuk menjaga fokus dan mencegah perpindahan window aplikasi.
          </p>
        </div>

        {/* Visual Decoration Area */}
        <div
          className={`relative mb-8 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl ${
            isFullscreen
              ? "border border-green-500/20 bg-green-500/5"
              : "border border-white/10 bg-white/5"
          } `}
        >
          {isFullscreen ? (
            <div className="animate-fade-in flex flex-col items-center gap-3 text-green-400">
              <div className="relative flex h-12 w-16 items-center justify-center rounded-lg border-2 border-green-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={24} className="text-green-500" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase">Active Mode</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-white/20">
              <div className="flex h-12 w-16 items-center justify-center rounded-lg border-2 border-dashed border-current">
                <Maximize size={24} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase">Inactive</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto w-full">
          {!isFullscreen ? (
            <button
              onClick={onRequestFullscreen}
              className={`from-primary to-primary-light hover:shadow-primary/30 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r px-6 py-4 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
            >
              <Maximize size={20} />
              <span>Aktifkan Fullscreen</span>
            </button>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-6 py-4 font-bold text-green-400">
              <CheckCircle2 size={20} />
              <span>Sudah Aktif</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
