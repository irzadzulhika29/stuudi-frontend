"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { SystemCheckContainer } from "@/features/user/cbt/containers/SystemCheckContainer";
import { ArrowLeft } from "lucide-react";
import Loading from "@/app/loading";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { dashboardService } from "@/features/user/dashboard/services/dashboardService";
import { ExamAccessData } from "@/features/user/dashboard/types/dashboardTypes";
import { useAppDispatch } from "@/shared/store/hooks";
import { initializeExam } from "@/shared/store/slices/examSlice";

function CheckContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const examCode = searchParams.get("code");

  const [examData, setExamData] = useState<ExamAccessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // ... same useEffect ...
    const fetchExamData = async () => {
      if (!examCode) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await dashboardService.accessExam(examCode);
        setExamData(data);
      } catch (err: unknown) {
        console.error("Failed to fetch exam data:", err);
        const errorMessage =
          (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Gagal memuat informasi ujian.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamData();
  }, [examCode]);

  const handleChecksComplete = async () => {
    if (!examData) return;

    setIsStarting(true);
    try {
      console.log("[CBT] Starting exam for:", examData.exam_id);
      const response = await dashboardService.startExam(examData.exam_id);
      console.log("[CBT] Exam started successfully:", response);

      // Initialize Redux state with exam data
      dispatch(
        initializeExam({
          examData: response,
          maxLives: 3, // Default or from API if available
        })
      );

      router.push(`/cbt/exam?code=${examCode}`);
    } catch (err) {
      console.error("Failed to start exam:", err);
      // Show error toast or alert
      alert("Gagal memulai ujian. Silakan coba lagi.");
      setIsStarting(false);
    }
  };

  if (!examCode) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Kode Ujian Tidak Valid</h1>
          <Link
            href="/dashboard"
            className="text-secondary flex items-center justify-center gap-2 hover:underline"
          >
            <ArrowLeft size={16} /> Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error || !examData) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Terjadi Kesalahan</h1>
          <p className="mb-6 text-white/60">{error}</p>
          <Link
            href="/dashboard"
            className="text-secondary flex items-center justify-center gap-2 hover:underline"
          >
            <ArrowLeft size={16} /> Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="fixed top-0 left-0 z-10 flex w-full items-center justify-between border-b border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-white/20"></div>
          <div>
            <span className="block text-xs text-neutral-400">Nama Ujian</span>
            <span className="font-semibold text-white">{examData.title}</span>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up relative z-0 mt-16 w-full">
        <SystemCheckContainer
          examData={examData}
          onChecksComplete={handleChecksComplete}
          isLoading={isStarting}
        />
      </div>
    </div>
  );
}

export default function CBTCheckPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900" />}>
      <CheckContent />
    </Suspense>
  );
}
