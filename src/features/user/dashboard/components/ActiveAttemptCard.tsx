"use client";

import { ExamAttempt } from "../types/dashboardTypes";
import { useRouter } from "next/navigation";
import { dashboardService } from "../services/dashboardService";
import { examService } from "@/features/user/cbt/services/examService";
import { Loader2, Play } from "lucide-react";
import { useAppDispatch } from "@/shared/store/hooks";
import { initializeExam } from "@/shared/store/slices/examSlice";
import { useState, useEffect } from "react";

interface ActiveAttemptCardProps {
  attempt: ExamAttempt;
}

const formatTimeRemaining = (endsAt?: string) => {
  if (!endsAt) return "00:00:00";
  const end = new Date(endsAt).getTime();
  const now = new Date().getTime();
  const diff = end - now;

  if (diff <= 0) return "00:00:00";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export function ActiveAttemptCard({ attempt }: ActiveAttemptCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetTime = attempt.ends_at || attempt.ended_at;

    if (targetTime) {
      setTimeLeft(formatTimeRemaining(targetTime));

      const timer = setInterval(() => {
        const remaining = formatTimeRemaining(targetTime);
        setTimeLeft(remaining);
        if (remaining === "00:00:00") clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // Fallback if no time data
      setTimeLeft("--:--:--");
    }
  }, [attempt.ends_at, attempt.ended_at]);

  const handleResume = async () => {
    setIsLoading(true);
    try {
      // User confirmed using exam_id for resume
      const response = await dashboardService.resumeExam(attempt.exam_id);

      // Use helper to transform response for Redux
      const payload = examService.transformExamToReduxPayload(response);
      dispatch(initializeExam(payload));

      router.push(`/cbt/exam?code=${response.exam_id}`);
    } catch (error) {
      console.error("Failed to resume exam", error);
      // We could add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 flex w-full max-w-lg items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02]">
      <div className="flex flex-col overflow-hidden">
        <div className="mb-1 flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold tracking-wider uppercase ${
              attempt.status === "passed"
                ? "bg-green-500/20 text-green-200"
                : attempt.status === "failed"
                  ? "bg-red-500/20 text-red-200"
                  : "bg-orange-500/20 text-orange-200"
            }`}
          >
            {attempt.status.replace(/_/g, " ")}
          </span>
          <span className="text-xs text-white/50">• Sisa Waktu: {timeLeft}</span>
        </div>

        <h3
          className="truncate text-lg leading-tight font-bold text-white"
          title={attempt.exam_title}
        >
          {attempt.exam_title}
        </h3>
        <p className="truncate text-sm text-white/70">{attempt.course_name}</p>
      </div>

      <button
        onClick={handleResume}
        disabled={isLoading}
        className="group flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Play
            size={18}
            fill="currentColor"
            className="transition-transform group-hover:translate-x-0.5"
          />
        )}
        <span className="hidden sm:inline">Lanjutkan</span>
      </button>
    </div>
  );
}
