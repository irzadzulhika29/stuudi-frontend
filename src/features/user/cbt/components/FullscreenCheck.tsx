"use client";

import { Maximize, CheckCircle2 } from "lucide-react";
import Button from "@/shared/components/ui/Button";

interface FullscreenCheckProps {
  isFullscreen: boolean;
  onRequestFullscreen: () => void;
}

export function FullscreenCheck({ isFullscreen, onRequestFullscreen }: FullscreenCheckProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-px transition-all duration-300 ${
        isFullscreen
          ? "bg-linear-to-r from-green-500/50 to-emerald-600/50"
          : "bg-linear-to-r from-white/10 to-white/5"
      } `}
    >
      <div className="flex items-center gap-4 rounded-[11px] bg-neutral-900/95 p-4 backdrop-blur-xl">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
            isFullscreen
              ? "bg-linear-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20"
              : "bg-white/10 text-white/50"
          } `}
        >
          {isFullscreen ? (
            <CheckCircle2 size={24} className="text-white" />
          ) : (
            <Maximize size={24} />
          )}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white">Mode Layar Penuh</h3>
          <p className="text-xs text-white/50">Wajib aktif untuk menjaga fokus ujian</p>
        </div>

        {/* Action */}
        <div className="shrink-0">
          {!isFullscreen ? (
            <Button
              variant="primary"
              size="xs"
              onClick={onRequestFullscreen}
              icon={<Maximize size={16} />}
              iconPosition="left"
            >
              Aktifkan
            </Button>
          ) : (
            <Button
              variant="success"
              size="xs"
              icon={<CheckCircle2 size={16} />}
              iconPosition="left"
            >
              Aktif
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
