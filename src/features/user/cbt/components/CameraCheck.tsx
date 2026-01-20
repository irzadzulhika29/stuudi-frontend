"use client";

import { useEffect, useRef } from "react";
import { Camera, CheckCircle2, Loader2, Video } from "lucide-react";

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
    console.log("Button clicked: Requesting camera in CameraCheck component");
    onRequestCamera();
  };

  return (
    <div
      className={`relative h-full overflow-hidden rounded-3xl p-1 transition-all duration-500 ${
        isCameraActive
          ? "bg-gradient-to-br from-green-500/50 to-emerald-600/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          : "border border-white/10 bg-gradient-to-br from-white/10 to-white/5 hover:border-white/30"
      } `}
    >
      <div className="flex h-full flex-col items-center rounded-[22px] bg-neutral-900/90 p-6 text-center backdrop-blur-xl sm:p-8">
        {/* Icon Header */}
        <div className="relative mb-6">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 ${
              isCameraActive
                ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
                : "bg-white/10 text-white/50"
            } `}
          >
            {isCameraActive ? (
              <CheckCircle2 size={32} className="text-white" />
            ) : (
              <Video size={32} />
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="mb-2 text-2xl font-bold">Akses Kamera</h3>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-white/50">
            Diperlukan untuk verifikasi identitas dan pengawasan real-time.
          </p>
        </div>

        {/* Video Preview Area */}
        <div
          className={`relative mb-8 aspect-video w-full overflow-hidden rounded-xl transition-all duration-500 ${
            isCameraActive
              ? "shadow-2xl ring-2 ring-green-500/50"
              : "border-2 border-dashed border-white/10 bg-black/40"
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
              <div className="absolute top-3 right-3 flex animate-pulse items-center gap-1.5 rounded-full bg-red-600/80 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                REC
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/20">
              <Camera size={48} className="opacity-50" />
              <span className="uppercse text-sm font-medium tracking-wide">
                Preview Tidak Tersedia
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto w-full">
          {!isCameraActive ? (
            <button
              onClick={handleCreateRequest}
              disabled={isLoading}
              className={`from-secondary to-secondary-light hover:shadow-secondary/30 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r px-6 py-4 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Menghubungkan...</span>
                </>
              ) : (
                <>
                  <Camera size={20} />
                  <span>Izinkan Kamera</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-6 py-4 font-bold text-green-400">
              <CheckCircle2 size={20} />
              <span>Akses Diberikan</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
