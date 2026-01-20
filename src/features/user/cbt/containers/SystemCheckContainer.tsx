"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { CameraCheck } from "../components/CameraCheck";
import { FullscreenCheck } from "../components/FullscreenCheck";

interface SystemCheckContainerProps {
  onChecksComplete: () => void;
}

export function SystemCheckContainer({ onChecksComplete }: SystemCheckContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [hasEnteredFullscreen, setHasEnteredFullscreen] = useState(false);
  const [showFullscreenOverlay, setShowFullscreenOverlay] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (hasEnteredFullscreen && !isFull) {
        setShowFullscreenOverlay(true);
      } else if (isFull) {
        setHasEnteredFullscreen(true);
        setShowFullscreenOverlay(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [hasEnteredFullscreen]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error("Fullscreen error:", err);
      setError("Gagal masuk mode fullscreen. Silakan coba lagi atau gunakan browser lain.");
    }
  };

  const [isCameraLoading, setIsCameraLoading] = useState(false);

  const requestCamera = async () => {
    try {
      setIsCameraLoading(true);
      setError("");
      console.log("Requesting camera access...");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser API not supported");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      console.log("Camera access granted, stream:", mediaStream.id);
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.error("Camera error details:", err);
      let errorMessage = "Gagal mengakses kamera.";

      const errorObj = err as Error;

      if (errorObj.name === "NotAllowedError" || errorObj.name === "PermissionDeniedError") {
        errorMessage =
          "Izin kamera ditolak. Mohon izinkan akses kamera di pengaturan browser (ikon gembok di address bar).";
      } else if (errorObj.name === "NotFoundError" || errorObj.name === "DevicesNotFoundError") {
        errorMessage = "Kamera tidak ditemukan. Pastikan kamera terhubung.";
      } else if (errorObj.message === "Browser API not supported") {
        errorMessage = "Browser ini tidak mendukung akses kamera. Gunakan Chrome/Firefox terbaru.";
      } else {
        errorMessage = `Gagal mengakses kamera: ${errorObj.message || "Unknown error"}`;
      }

      setError(errorMessage);
      setIsCameraActive(false);
    } finally {
      setIsCameraLoading(false);
    }
  };

  const allChecksPassed = isFullscreen && isCameraActive;

  return (
    <>
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-12 max-w-2xl text-center">
          <h1 className="mb-4 bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Persiapan Ujian
          </h1>
          <p className="text-lg leading-relaxed text-white/60">
            Sebelum memulai, sistem perlu memverifikasi lingkungan Anda. Mohon aktifkan mode layar
            penuh dan izinkan akses kamera untuk melanjutkan.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mb-12 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <FullscreenCheck isFullscreen={isFullscreen} onRequestFullscreen={requestFullscreen} />

          <CameraCheck
            isCameraActive={isCameraActive}
            onRequestCamera={requestCamera}
            stream={stream}
            isLoading={isCameraLoading}
          />
        </div>

        {error && (
          <div className="animate-fade-in mb-8 flex w-full max-w-2xl items-center gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 backdrop-blur-md">
            <AlertCircle size={24} className="shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onChecksComplete}
            disabled={!allChecksPassed}
            className={`group relative flex items-center justify-center gap-4 rounded-full px-16 py-4 text-lg font-bold transition-all duration-300 ${
              allChecksPassed
                ? "from-secondary to-secondary-light bg-linear-to-r text-white shadow-[0_0_30px_rgba(var(--secondary-rgb),0.5)] hover:scale-105 hover:shadow-[0_0_50px_rgba(var(--secondary-rgb),0.7)]"
                : "cursor-not-allowed border border-white/5 bg-white/10 text-white/40"
            } `}
          >
            <span>Mulai Ujian Sekarang</span>
            <ArrowRight
              size={24}
              className={`transition-transform duration-300 ${
                allChecksPassed ? "group-hover:translate-x-2" : ""
              }`}
            />
          </button>

          <div className="flex items-center gap-2 text-sm font-medium text-white/40">
            <ShieldCheck size={16} />
            <span>Sistem Keamanan Terenkripsi & Terproteksi</span>
          </div>
        </div>
      </div>

      {showFullscreenOverlay && (
        <div className="animate-fade-in fixed inset-0 z-50 flex cursor-not-allowed items-center justify-center bg-neutral-950/90 p-6 text-center backdrop-blur-xl">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl">
            <div className="mx-auto mb-8 flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-red-500/20">
              <AlertTriangle size={48} className="text-red-500" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white">Peringatan Keamanan</h2>
            <p className="mb-10 text-lg leading-relaxed text-white/60">
              Anda terdeteksi keluar dari mode layar penuh. Demi integritas ujian, Anda{" "}
              <strong>wajib</strong> kembali ke mode layar penuh untuk melanjutkan.
            </p>
            <button
              onClick={requestFullscreen}
              className="w-full transform cursor-pointer rounded-xl bg-red-600 px-6 py-4 font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] hover:bg-red-500 active:scale-[0.98]"
            >
              Kembali ke Fullscreen
            </button>
          </div>
        </div>
      )}
    </>
  );
}
