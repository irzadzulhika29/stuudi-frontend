"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { SystemCheckContainer } from "@/features/user/cbt/containers/SystemCheckContainer";
import { ExamSkeleton } from "@/features/user/cbt/components/ExamSkeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { dashboardService } from "@/features/user/dashboard/services/dashboardService";
import { ExamAccessData } from "@/features/user/dashboard/types/dashboardTypes";
import { useToast } from "@/shared/components/ui/Toast";
import { buildExamRoute } from "@/features/user/cbt/utils/examRoute";
import { getExamAccessStatus } from "@/features/user/cbt/utils/accessExamStatus";
import { useAppDispatch } from "@/shared/store/hooks";
import { initializeExam } from "@/shared/store/slices/examSlice";
import { examService } from "@/features/user/cbt/services/examService";

function CheckContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
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
    if (!examData || !examCode) return;

    setIsStarting(true);
    try {
      const latestExamData = await dashboardService.accessExam(examCode);
      setExamData(latestExamData);

      const accessStatus = getExamAccessStatus(latestExamData);
      if (!accessStatus.isEligible) {
        showToast(accessStatus.message, "warning");
        return;
      }

      const response = await dashboardService.startExam(latestExamData.exam_id);
      examService.cacheAttemptQuestionSnapshot(response);
      dispatch(initializeExam(examService.transformStartExamToReduxPayload(response)));
      router.push(buildExamRoute({ examId: response.exam_id }));
    } catch (err: unknown) {
      console.error("Failed to start exam:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Gagal memulai ujian. Silakan coba lagi.";
      showToast(errorMessage, "error");
    } finally {
      setIsStarting(false);
    }
  };

  if (!examCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] text-neutral-900">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-8 text-center shadow-sm">
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
    return (
      <ExamSkeleton
        title="Memuat system check"
        description="Menyiapkan informasi ujian dan perangkat."
      />
    );
  }

  if (error || !examData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] text-neutral-900">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">Terjadi Kesalahan</h1>
          <p className="mb-6 text-neutral-500">{error}</p>
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
    <div className="min-h-screen bg-[#f5f4ef] px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <div className="flex items-center justify-between rounded-[24px] border border-neutral-200 bg-white px-4 py-3 shadow-sm md:px-5">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="h-5 w-px bg-neutral-200" />
            <div className="min-w-0">
              <span className="block text-[11px] tracking-[0.18em] text-neutral-400 uppercase">
                CBT Check
              </span>
              <span className="block truncate font-medium text-neutral-900">{examData.title}</span>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up">
          <SystemCheckContainer
            examData={examData}
            onChecksComplete={handleChecksComplete}
            isLoading={isStarting}
          />
        </div>
      </div>
    </div>
  );
}

export default function CBTCheckPage() {
  return (
    <Suspense
      fallback={
        <ExamSkeleton
          title="Memuat system check"
          description="Menyiapkan informasi ujian dan perangkat."
        />
      }
    >
      <CheckContent />
    </Suspense>
  );
}
