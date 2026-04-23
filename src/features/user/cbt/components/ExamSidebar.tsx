"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef } from "react";

interface ExamSidebarProps {
  stream: MediaStream | null;
}

export function ExamSidebar({ stream }: ExamSidebarProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-full max-w-[172px]">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950">
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full scale-x-[-1] object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/40">
              <Camera size={20} />
            </div>
          )}

          <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/[0.55] px-2 py-1 text-[10px] font-medium tracking-[0.18em] text-white uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            Live
          </div>
        </div>
      </div>
    </div>
  );
}
