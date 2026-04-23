"use client";

import {
  AlertCircle,
  AlertTriangle,
  CalendarRange,
  Camera,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Button from "@/shared/components/ui/Button";

import { ExamAccessData } from "@/features/user/dashboard/types/dashboardTypes";
import { useSystemCheck } from "../hooks/useSystemCheck";

interface SystemCheckContainerProps {
  examData: ExamAccessData;
  onChecksComplete: () => void;
  isLoading?: boolean;
}

const EXAM_RULES = [
  "Aktifkan fullscreen selama ujian.",
  "Pastikan kamera tetap menyala dan wajah terlihat.",
  "Jangan berpindah tab atau aplikasi lain.",
  "Periksa jawaban sebelum mengakhiri ujian.",
];

export function SystemCheckContainer({
  examData,
  onChecksComplete,
  isLoading = false,
}: SystemCheckContainerProps) {
  const {
    videoRef,
    error,
    isCameraActive,
    isCameraLoading,
    showFullscreenOverlay,
    accessStatus,
    canStartExam,
    accessWindow,
    statusItems,
    requestFullscreen,
    requestCamera,
  } = useSystemCheck({
    examData,
    isLoading,
  });

  return (
    <>
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 xl:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
            <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-neutral-400 uppercase">
                    Pemeriksaan Kamera
                  </p>
                  <h2 className="mt-2 text-[22px] leading-tight font-semibold text-neutral-950">
                    Pastikan perangkat siap sebelum mulai
                  </h2>
                  <p className="mt-2 text-[15px] leading-7 text-neutral-600">
                    Aktifkan kamera dan fullscreen untuk melanjutkan ke sesi ujian.
                  </p>
                </div>
                <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                  <Clock3 size={14} className="text-secondary" />
                  <span>{examData.duration} menit</span>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-neutral-200 bg-neutral-950">
                {!isCameraActive ? (
                  <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white/40">
                      <Camera size={28} />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white">Aktifkan kamera</p>
                      <p className="mt-2 text-sm leading-7 text-white/[0.55]">
                        Preview akan muncul setelah izin diberikan.
                      </p>
                    </div>
                    <Button
                      onClick={requestCamera}
                      disabled={isCameraLoading}
                      variant="secondary"
                      size="sm"
                      className="min-w-52 rounded-2xl px-5 py-3 text-sm"
                    >
                      {isCameraLoading ? "Menghubungkan..." : "Aktifkan Kamera"}
                    </Button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full scale-x-[-1] object-cover"
                    />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/[0.55] px-2.5 py-1 text-[10px] font-medium tracking-[0.18em] text-white uppercase">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                      Live
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {statusItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-neutral-200 bg-neutral-50 px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          item.isComplete
                            ? "bg-green-100 text-green-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {item.isComplete ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-neutral-500 uppercase">
                          {item.label}
                        </p>
                        <p className="mt-1 text-[17px] leading-5 font-semibold text-neutral-900">
                          {item.value}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {item.action === "fullscreen" ? (
                          <Button
                            onClick={requestFullscreen}
                            variant="secondary"
                            size="sm"
                            className="w-28 rounded-2xl px-4 py-2.5 text-sm"
                          >
                            Aktifkan
                          </Button>
                        ) : (
                          <Button
                            onClick={requestCamera}
                            disabled={isCameraLoading}
                            variant="secondary"
                            size="sm"
                            className="w-28 rounded-2xl px-4 py-2.5 text-sm"
                          >
                            {isCameraLoading ? "Loading..." : "Aktifkan"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-5 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="space-y-4 border-b border-neutral-200 pb-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-neutral-500 uppercase">
                  <ShieldCheck size={14} className="text-secondary" />
                  Sebelum Mulai
                </div>
                <div>
                  <p className="text-[15px] font-medium text-neutral-500">{examData.course_name}</p>
                  <h1 className="mt-2 text-[2.75rem] leading-[1.05] font-semibold tracking-[-0.03em] text-neutral-950">
                    {examData.title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-[15px] leading-7 text-neutral-600">
                    {examData.description || "Periksa akses ujian dan perangkat sebelum memulai."}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="min-h-32 rounded-[22px] border border-neutral-200 bg-neutral-50 px-5 py-4">
                  <div className="mb-3 flex items-center gap-2 text-[15px] text-neutral-500">
                    <FileText size={16} />
                    <span>Status akses</span>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      accessStatus.isEligible
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {accessStatus.statusLabel}
                  </span>
                </div>

                <div className="min-h-32 rounded-[22px] border border-neutral-200 bg-neutral-50 px-5 py-4">
                  <p className="text-[15px] text-neutral-500">Sisa percobaan</p>
                  <p className="mt-4 text-4xl leading-none font-semibold text-neutral-950">
                    {examData.attempts_left}
                    <span className="ml-1 text-lg font-medium text-neutral-500">
                      / {examData.max_attempts}
                    </span>
                  </p>
                </div>

                <div className="min-h-32 rounded-[22px] border border-neutral-200 bg-neutral-50 px-5 py-4">
                  <div className="mb-3 flex items-center gap-2 text-[15px] text-neutral-500">
                    <CalendarRange size={16} />
                    <span>Jadwal ujian</span>
                  </div>
                  <p className="text-[15px] leading-7 text-neutral-800">{accessWindow}</p>
                </div>
              </div>

              <div className="rounded-[24px] border border-neutral-200 bg-neutral-50 px-5 py-5">
                <p className="text-[15px] leading-7 text-neutral-700">{accessStatus.message}</p>

                {error && (
                  <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  variant="glow"
                  size="lg"
                  className="mt-5 w-full rounded-[20px] py-4 text-[19px] font-semibold"
                  onClick={onChecksComplete}
                  disabled={!canStartExam}
                >
                  {isLoading ? "Menyiapkan Ujian..." : "Mulai Ujian Sekarang"}
                </Button>

                {!accessStatus.isEligible && (
                  <p className="mt-3 text-[13px] leading-6 text-neutral-500">
                    System check tetap bisa selesai, tetapi ujian baru bisa dimulai saat backend
                    mengizinkan akses.
                  </p>
                )}
              </div>
            </section>
          </div>

          <section className="rounded-[28px] border border-neutral-200 bg-white px-6 py-6 shadow-sm">
            <h3 className="text-[11px] font-semibold tracking-[0.14em] text-neutral-500 uppercase">
              Tata Tertib
            </h3>
            <ul className="mt-5 space-y-4">
              {EXAM_RULES.map((rule) => (
                <li
                  key={rule}
                  className="flex items-start gap-3 text-[15px] leading-8 text-neutral-700"
                >
                  <span className="bg-secondary mt-3 h-1.5 w-1.5 shrink-0 rounded-full" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {showFullscreenOverlay && (
        <div className="animate-fade-in fixed inset-0 z-50 flex cursor-not-allowed items-center justify-center bg-neutral-950/90 p-6 text-center backdrop-blur-xl">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={30} />
            </div>
            <h2 className="mb-3 text-2xl font-semibold text-neutral-950">Kembali ke Fullscreen</h2>
            <p className="mb-8 text-sm leading-relaxed text-neutral-600">
              Ujian hanya bisa dilanjutkan dalam mode fullscreen. Aktifkan kembali untuk
              melanjutkan.
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
