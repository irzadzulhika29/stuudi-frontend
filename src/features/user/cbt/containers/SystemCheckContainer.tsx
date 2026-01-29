"use client";

import { useEffect, useState, useRef } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, FileText, Camera } from "lucide-react";
import Button from "@/shared/components/ui/Button";

import { ExamAccessData } from "@/features/user/dashboard/types/dashboardTypes";

interface SystemCheckContainerProps {
  examData: ExamAccessData;
  onChecksComplete: () => void;
  isLoading?: boolean;
}

const EXAM_RULES = [
  "Mode layar penuh wajib aktif",
  "Kamera harus aktif & wajah terlihat",
  "Dilarang berpindah tab/aplikasi",
  "Dilarang menggunakan catatan",
];

export function SystemCheckContainer({
  examData,
  onChecksComplete,
  isLoading = false,
}: SystemCheckContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [hasEnteredFullscreen, setHasEnteredFullscreen] = useState(false);
  const [showFullscreenOverlay, setShowFullscreenOverlay] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isCameraActive]);

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
      setError("Gagal masuk mode fullscreen.");
    }
  };

  const [isCameraLoading, setIsCameraLoading] = useState(false);

  const requestCamera = async () => {
    try {
      setIsCameraLoading(true);
      setError("");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser API not supported");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }, // Higher res for "Zoom" feel
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.error("Camera error details:", err);
      setError("Gagal mengakses kamera. Pastikan izin telah diberikan.");
      setIsCameraActive(false);
    } finally {
      setIsCameraLoading(false);
    }
  };

  const allChecksPassed = isFullscreen && isCameraActive;

  return (
    <>
      <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
        <div className="grid h-full grid-cols-1 gap-6 lg:h-[calc(100vh-140px)] lg:grid-cols-12 lg:gap-8">
          {/* LEFT COLUMN: Camera & System Checks */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Camera View */}
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-sm">
              {!isCameraActive ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/20">
                    <Camera size={32} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      Akses Kamera Diperlukan
                    </h3>
                    <p className="mx-auto max-w-sm text-sm text-white/50">
                      Kamera wajib aktif selama ujian berlangsung.
                    </p>
                  </div>
                  <Button
                    onClick={requestCamera}
                    disabled={isCameraLoading}
                    variant="secondary"
                    size="md"
                  >
                    {isCameraLoading ? "Menghubungkan..." : "Aktifkan Kamera"}
                  </Button>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full scale-x-[-1] object-cover"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                    <span className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                      REC
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="flex flex-col gap-4">
                {/* Fullscreen Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isFullscreen ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {isFullscreen ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Mode Layar Penuh</h4>
                      <p className="text-sm text-white/50">
                        {isFullscreen ? "Sudah akaif" : "Wajib diaktifkan"}
                      </p>
                    </div>
                  </div>

                  {!isFullscreen && (
                    <Button onClick={requestFullscreen} variant="secondary" size="sm">
                      Aktifkan Fullscreen
                    </Button>
                  )}
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Camera Status */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isCameraActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {isCameraActive ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Kamera Pengawas</h4>
                    <p className="text-sm text-white/50">
                      {isCameraActive ? "Terhubung & Merekam" : "Belum terhubung"}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Info & Rules */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* Exam Details Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <span className="text-secondary mb-2 block text-sm font-medium tracking-wider uppercase">
                {examData.course_name}
              </span>
              <h1 className="mb-4 text-2xl leading-tight font-bold text-white">{examData.title}</h1>

              <div className="flex items-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{examData.duration} Menit</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>{examData.total_questions} Soal</span>
                </div>
              </div>
            </div>

            {/* Rules & Action */}
            <div className="flex flex-1 flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Tata Tertib Ujian</h3>
                <ol className="list-decimal space-y-3 pl-5 text-sm text-white/70 marker:text-white/40">
                  {EXAM_RULES.map((rule, i) => (
                    <li key={i} className="pl-1">
                      {rule}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <p className="text-xs leading-relaxed text-amber-200/80">
                    <strong>Penting:</strong> Waktu akan berjalan otomatis saat tombol diklik.
                  </p>
                </div>

                <Button
                  variant="glow"
                  size="lg"
                  className="w-full"
                  onClick={onChecksComplete}
                  disabled={!allChecksPassed || isLoading}
                >
                  {isLoading ? "Menyiapkan Ujian..." : "Mulai Ujian Sekarang"}
                </Button>
              </div>
            </div>
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
