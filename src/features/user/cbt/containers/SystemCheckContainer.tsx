"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Camera,
  Monitor,
  Ban,
  MessageSquareOff,
  AppWindow,
} from "lucide-react";
import { CameraCheck } from "../components/CameraCheck";
import { FullscreenCheck } from "../components/FullscreenCheck";
import Button from "@/shared/components/ui/Button";

interface SystemCheckContainerProps {
  examName: string;
  onChecksComplete: () => void;
}

const EXAM_RULES = [
  {
    icon: Monitor,
    text: "Mode layar penuh wajib aktif selama ujian berlangsung",
  },
  {
    icon: Camera,
    text: "Kamera harus aktif dan wajah terlihat jelas selama ujian",
  },
  {
    icon: Ban,
    text: "Dilarang membuka tab, aplikasi, atau jendela lain",
  },
  {
    icon: AppWindow,
    text: "Dilarang keluar dari mode fullscreen tanpa izin",
  },
  {
    icon: MessageSquareOff,
    text: "Dilarang berkomunikasi dengan pihak lain selama ujian",
  },
  {
    icon: FileText,
    text: "Dilarang menggunakan catatan atau materi bantu apapun",
  },
  {
    icon: Clock,
    text: "Waktu ujian berjalan otomatis dan tidak dapat dihentikan",
  },
];

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
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            Persiapan Ujian
          </h1>
          <p className="text-white/60">
            Pastikan semua persyaratan terpenuhi sebelum memulai ujian
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="mb-8 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column - System Checks */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-white">
                <ShieldCheck className="text-secondary" size={22} />
                Verifikasi Sistem
              </h2>
              <p className="mb-6 text-sm text-white/50">
                Aktifkan fitur berikut untuk dapat memulai ujian
              </p>

              <div className="flex flex-col gap-4">
                <FullscreenCheck
                  isFullscreen={isFullscreen}
                  onRequestFullscreen={requestFullscreen}
                />

                <CameraCheck
                  isCameraActive={isCameraActive}
                  onRequestCamera={requestCamera}
                  stream={stream}
                  isLoading={isCameraLoading}
                />
              </div>

              {error && (
                <div className="animate-fade-in mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </div>

            {/* Status Summary */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="mb-4 text-sm font-medium text-white/70">Status Kesiapan</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Mode Layar Penuh</span>
                  {isFullscreen ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-400">
                      <CheckCircle2 size={16} />
                      Aktif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-red-400">
                      <XCircle size={16} />
                      Belum Aktif
                    </span>
                  )}
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Akses Kamera</span>
                  {isCameraActive ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-400">
                      <CheckCircle2 size={16} />
                      Aktif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-red-400">
                      <XCircle size={16} />
                      Belum Aktif
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Exam Rules */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-white">
              <FileText className="text-secondary" size={22} />
              Tata Tertib Ujian
            </h2>
            <p className="mb-6 text-sm text-white/50">
              Baca dan pahami peraturan berikut sebelum memulai ujian
            </p>

            <div className="flex flex-col gap-4">
              {EXAM_RULES.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <rule.icon size={20} className="text-white/70" />
                  </div>
                  <p className="pt-2 text-sm leading-relaxed text-white/70">{rule.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-sm leading-relaxed text-amber-200/80">
                <strong className="text-amber-200">Peringatan:</strong> Pelanggaran terhadap tata
                tertib dapat mengakibatkan pembatalan hasil ujian dan sanksi akademik.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4">
          <Button
            variant="glow"
            size="lg"
            onClick={onChecksComplete}
            disabled={allChecksPassed}
            className="group"
            icon={
              <ArrowRight
                size={24}
                className={`transition-transform duration-300 ${
                  allChecksPassed ? "group-hover:translate-x-2" : ""
                }`}
              />
            }
          >
            Mulai Ujian Sekarang
          </Button>

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
            <Button variant="danger" size="lg" onClick={requestFullscreen} className="w-full">
              Kembali ke Fullscreen
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
