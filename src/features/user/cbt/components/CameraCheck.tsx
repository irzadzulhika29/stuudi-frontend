"use client";

import { useEffect, useRef } from "react";
import { Camera, CheckCircle2, Loader2, Video } from "lucide-react";
import Button from "@/shared/components/ui/Button";

interface CameraCheckProps {
  isCameraActive: boolean;
  onRequestCamera: () => void;
  stream: MediaStream | null;
  isLoading?: boolean;
}

export function CameraCheck({
  isCameraActive,
  onRequestCamera,
  stream,
  isLoading = false,
}: CameraCheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isCameraActive]);

  const handleCreateRequest = () => {
    onRequestCamera();
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-px transition-all duration-300 ${
        isCameraActive
          ? "bg-linear-to-r from-green-500/50 to-emerald-600/50"
          : "bg-linear-to-r from-white/10 to-white/5"
      } `}
    >
      <div className="flex items-center gap-4 rounded-[11px] bg-neutral-900/95 p-4 backdrop-blur-xl">
        {/* Video Preview / Icon */}
        <div
          className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
            isCameraActive
              ? "ring-2 ring-green-500/50"
              : "border border-dashed border-white/20 bg-white/5"
          } `}
        >
          {isCameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full scale-x-[-1] transform object-cover"
              />
              <div className="absolute top-1.5 right-1.5 flex animate-pulse items-center gap-1 rounded-full bg-red-600/90 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase">
                <span className="h-1 w-1 rounded-full bg-white"></span>
                REC
              </div>
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-white/30">
              <Camera size={24} />
              <span className="text-[10px]">Preview</span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white">Akses Kamera</h3>
          <p className="text-xs text-white/50">Untuk verifikasi identitas dan pengawasan</p>
        </div>

        {/* Action */}
        <div className="shrink-0">
          {!isCameraActive ? (
            <Button
              variant="secondary"
              size="xs"
              onClick={handleCreateRequest}
              disabled={isLoading}
              icon={
                isLoading ? <Loader2 className="animate-spin" size={16} /> : <Video size={16} />
              }
              iconPosition="left"
            >
              {isLoading ? "Loading..." : "Izinkan"}
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
