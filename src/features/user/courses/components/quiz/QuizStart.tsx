"use client";

import { useEffect, useState } from "react";
import { QuizData, QuizResultResponse, QuizAttemptHistory } from "../../types/cTypes";
import { quizService } from "../../services/quizService";

import { ArrowRight, CheckCircle, Clock, Play, RotateCcw, XCircle } from "lucide-react";
import Button from "@/shared/components/ui/Button";

interface QuizStartProps {
  quiz: QuizData;
  lastResult?: QuizResultResponse;
  onStart: () => void;
  onResume?: (attemptId: string, startedAt?: string) => void;
  onContinue: () => void;
}

export function QuizStart({ quiz, onStart, onResume, onContinue }: QuizStartProps) {
  const [attempts, setAttempts] = useState<QuizAttemptHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [bestAttemptResult, setBestAttemptResult] = useState<QuizResultResponse | null>(null);
  const [latestAttemptResult, setLatestAttemptResult] = useState<QuizResultResponse | null>(null);

  const [isLoadingStats, setIsLoadingStats] = useState(false); // For Best Attempt
  const [isLoadingLatestStats, setIsLoadingLatestStats] = useState(false); // For Latest Attempt

  const [bestAttemptId, setBestAttemptId] = useState<string | null>(null);
  const [latestAttemptId, setLatestAttemptId] = useState<string | null>(null);

  // Load Attempts and Determine Best/Last IDs
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const data = await quizService.getQuizAttempts(quiz.id);

        // Filter and Sort by Date Descending (Latest first)
        const sorted = data
          .filter((a) => a.content_id === quiz.id)
          .map((a) => ({ ...a, status: a.status.toLowerCase() as QuizAttemptHistory["status"] }))
          .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());

        setAttempts(sorted);

        // Find Latest Attempt ID
        if (sorted.length > 0) {
          setLatestAttemptId(sorted[0].attempt_id);
        }

        // Find Best Attempt (Highest Score)
        if (sorted.length > 0) {
          const finishedAttempts = sorted.filter((a) => a.status !== "in_progress");

          if (finishedAttempts.length > 0) {
            const best = finishedAttempts.reduce((prev, current) => {
              const prevScore = Number(prev.score) || 0;
              const currentScore = Number(current.score) || 0;
              return prevScore >= currentScore ? prev : current;
            });
            setBestAttemptId(best.attempt_id);
          }
        }
      } catch (error) {
        console.error("[QuizStart] Failed to fetch attempts:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchAttempts();
  }, [quiz.id]);

  // Load Best Attempt Detailed Stats
  useEffect(() => {
    const fetchBestStats = async () => {
      if (!bestAttemptId) return;

      setIsLoadingStats(true);
      try {
        const result = await quizService.getQuizResult(bestAttemptId);
        setBestAttemptResult(result);
      } catch (err) {
        console.error("Failed to fetch best attempt result:", err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchBestStats();
  }, [bestAttemptId]);

  // Load Latest Attempt Detailed Stats (for right card details)
  useEffect(() => {
    const fetchLatestStats = async () => {
      if (!latestAttemptId) return;

      // If latest is same as best, reuse the result if available to save bandwidth?
      // But they might load asynchronously. Let's just fetch safely.
      // Optimization: Check if latestAttempt IS bestAttempt and we already have bestAttemptResult
      if (latestAttemptId === bestAttemptId && bestAttemptResult) {
        setLatestAttemptResult(bestAttemptResult);
        return;
      }

      setIsLoadingLatestStats(true);
      try {
        // Check if the latest attempt is actually finished.
        // If "in_progress", getQuizResult might return partial or fail?
        // Usually we only want stats for finished.
        const latest = attempts.find((a) => a.attempt_id === latestAttemptId);
        if (latest && latest.status === "in_progress") {
          // If in progress, we can't show result stats like avg time yet.
          setLatestAttemptResult(null);
        } else {
          const result = await quizService.getQuizResult(latestAttemptId);
          setLatestAttemptResult(result);
        }
      } catch (err) {
        console.error("Failed to fetch latest attempt result:", err);
      } finally {
        setIsLoadingLatestStats(false);
      }
    };

    fetchLatestStats();
  }, [latestAttemptId, bestAttemptId, bestAttemptResult, attempts]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "passed":
        return "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400";
      case "failed":
        return "border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400";
      default:
        // For in_progress
        return "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "passed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Logic: "Last Attempt" is simply the first one in the sorted list
  const lastAttempt = attempts.length > 0 ? attempts[0] : null;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Left Column: Info & Actions */}
      <div className="flex-1">
        <h1 className="mb-4 text-2xl font-bold text-white md:text-3xl">{quiz.title}</h1>
        <p className="mb-8 leading-relaxed text-white/80">{quiz.description}</p>

        <div className="flex flex-wrap gap-4">
          <Button
            onClick={onStart}
            variant="secondary"
            className="rounded-full"
            icon={<Play className="h-4 w-4 fill-current" />}
            iconPosition="left"
          >
            Mulai Quiz
          </Button>

          {onResume && attempts.some((a) => a.status === "in_progress") && (
            <Button
              onClick={() => {
                const inProgressAttempt = attempts.find((a) => a.status === "in_progress");
                if (inProgressAttempt && onResume) {
                  onResume(inProgressAttempt.attempt_id, inProgressAttempt.started_at);
                }
              }}
              variant="primary"
              className="rounded-full"
              icon={<RotateCcw className="h-4 w-4" />}
              iconPosition="left"
            >
              Lanjutkan
            </Button>
          )}
        </div>

        {/* Best Attempt Stats */}
        <div className="mt-12">
          <h3 className="mb-6 text-lg font-semibold text-white">Hasil Percobaan Terbaik</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20">
              <p className="mb-2 text-sm font-medium text-white/60 transition-colors group-hover:text-white/80">
                Best Score
              </p>
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="text-3xl font-bold text-white lg:text-4xl">
                  {bestAttemptResult ? bestAttemptResult.score : bestAttemptId ? "..." : "-"}
                </span>
                <span className="text-sm text-white/40 transition-colors group-hover:text-white/60">
                  points
                </span>
              </div>
            </div>

            <div className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20">
              <p className="mb-2 text-sm font-medium text-white/60 transition-colors group-hover:text-white/80">
                Correct Answer
              </p>
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="text-3xl font-bold text-white lg:text-4xl">
                  {bestAttemptResult
                    ? `${bestAttemptResult.correct_answers}/${bestAttemptResult.total_questions}`
                    : bestAttemptId
                      ? "..."
                      : "-"}
                </span>
                <span className="text-sm text-white/40 transition-colors group-hover:text-white/60">
                  questions
                </span>
              </div>
            </div>

            <div className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20">
              <p className="mb-2 text-sm font-medium text-white/60 transition-colors group-hover:text-white/80">
                Avg. Time
              </p>
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="truncate text-3xl font-bold text-white lg:text-4xl">
                  {bestAttemptResult?.average_answer_time
                    ? bestAttemptResult.average_answer_time.split(" ")[0]
                    : bestAttemptId
                      ? "..."
                      : "-"}
                </span>
                <span className="text-sm text-white/40 transition-colors group-hover:text-white/60">
                  sec/q
                </span>
              </div>
            </div>
          </div>

          {!bestAttemptId && !isLoadingStats && (
            <p className="mt-4 text-sm text-white/40">Belum ada percobaan yang selesai.</p>
          )}
        </div>

        <button
          onClick={onContinue}
          className="mt-8 flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
        >
          Lewati ke materi selanjutnya
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Right Column: Last Attempt (Replacing History List) */}
      <div className="w-full lg:w-[400px]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">Riwayat Percobaan</h3>

          <div className="space-y-3">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Clock className="h-6 w-6 animate-spin text-white/40" />
              </div>
            ) : lastAttempt ? (
              // Only showing the single latest attempt as requested ("ambil attempt yang terakhir aja")
              <div
                key={lastAttempt.attempt_id}
                className={`relative overflow-hidden rounded-xl border p-4 transition-all ${getStatusColor(
                  lastAttempt.status
                )} backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 rounded-full p-2 ${
                        ["completed", "passed"].includes(lastAttempt.status)
                          ? "bg-emerald-500/10 text-emerald-500"
                          : lastAttempt.status === "failed"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {getStatusIcon(lastAttempt.status)}
                    </div>
                    <div>
                      <p className="font-medium text-white capitalize">
                        {lastAttempt.status === "in_progress"
                          ? "Sedang Berjalan"
                          : lastAttempt.status}
                      </p>
                      <p className="text-xs text-white/60">
                        {new Date(lastAttempt.started_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {lastAttempt.status !== "in_progress" && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{lastAttempt.score}</p>
                      <p className="text-xs text-white/60">Poin</p>
                    </div>
                  )}
                </div>

                {/* Additional Stats for Latest Attempt (if available) */}
                {lastAttempt.status !== "in_progress" && latestAttemptResult && (
                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div>
                      <p className="text-xs text-white/50">Correct Answers</p>
                      <p className="text-sm font-semibold text-white">
                        {latestAttemptResult.correct_answers}/{latestAttemptResult.total_questions}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Avg. Time</p>
                      <p className="text-sm font-semibold text-white">
                        {latestAttemptResult.average_answer_time?.split(" ")[0] || "-"}s
                      </p>
                    </div>
                  </div>
                )}

                {lastAttempt.status !== "in_progress" &&
                  !latestAttemptResult &&
                  isLoadingLatestStats && (
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <div className="h-8 w-full animate-pulse rounded bg-white/5"></div>
                    </div>
                  )}

                {lastAttempt.status === "in_progress" && onResume && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onResume(lastAttempt.attempt_id, lastAttempt.started_at)}
                      className="text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
                      icon={<Play className="h-3 w-3" />}
                    >
                      Lanjutkan
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-12 text-center">
                <Clock className="mb-3 h-10 w-10 text-white/20" />
                <p className="text-sm font-medium text-white/60">Belum ada riwayat</p>
                <p className="text-xs text-white/40">Mulai quiz untuk melihat riwayatmu di sini</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
