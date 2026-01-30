"use client";

import { useEffect, useState } from "react";
import { ExamHeader } from "../components/ExamHeader";
import { ExamTimerBar } from "../components/ExamTimerBar";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionNavigation } from "../components/QuestionNavigation";
import { ExamFooter } from "../components/ExamFooter";
import { ExamSummary } from "../components/ExamSummary";
import { AlertTriangle, CheckCircle2, Maximize } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { QuestionAnswer } from "@/shared/types/questionTypes";
import {
  initializeExam,
  setView,
  setCurrentIndex,
  setAnswer,
  toggleFlag,
  setLives,
  decrementTime,
  finishExam,
} from "@/shared/store/slices/examSlice";
import { examService } from "../services/examService";
import { dashboardService } from "@/features/user/dashboard/services/dashboardService";

interface ExamContainerProps {
  stream: MediaStream | null;
}

import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export function ExamContainer({ stream }: ExamContainerProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    view,
    currentQuestionIndex, // Updated name
    answers,
    flaggedQuestions,
    lives,
    maxLives,
    timeRemaining,
    isInitialized,
    examData, // Use real data
  } = useAppSelector((state) => state.exam);

  // Fullscreen state tracking
  const [showFullscreenOverlay, setShowFullscreenOverlay] = useState(false);

  // Track if user has interacted/started to prevent initial penalty
  const [hasInteracted, setHasInteracted] = useState(false);

  // Hydrate exam data on refresh
  useEffect(() => {
    if (!isInitialized || !examData) {
      const searchParams = new URLSearchParams(window.location.search);
      const examId = searchParams.get("code");

      if (examId) {
        const fetchExam = async () => {
          try {
            const response = await dashboardService.resumeExam(examId);
            const payload = examService.transformExamToReduxPayload(response);
            dispatch(initializeExam(payload));
          } catch (error) {
            console.error("Failed to restore exam session", error);
            // Handle error (e.g., redirect to dashboard or show error)
          }
        };
        fetchExam();
      }
    }
  }, [dispatch, isInitialized, examData]);

  // Sync flags to LocalStorage
  useEffect(() => {
    if (examData?.exam_id && flaggedQuestions) {
      localStorage.setItem(`exam_flags_${examData.exam_id}`, JSON.stringify(flaggedQuestions));
    }
  }, [flaggedQuestions, examData?.exam_id]);

  useEffect(() => {
    if (view === "finished") return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowFullscreenOverlay(true);
        // Only enforce fullscreen, do not penalize here.
        // Penalty is strictly for visibility change (tab switch).
      } else if (document.fullscreenElement) {
        setShowFullscreenOverlay(false);
        setHasInteracted(true);
      }
    };

    const handleVisibilityChange = async () => {
      if (document.hidden && hasInteracted && examData?.attempt_id) {
        // Tab Switched -> Record Violation
        try {
          // Optimistic update? No, let's wait for API to be accurate.
          const result = await examService.recordTabSwitch(examData.attempt_id);

          if (result) {
            dispatch(setLives(result.lives_remaining));

            // Show warning toast if available and not disqualified
            if (result.warning_message && !result.is_disqualified) {
              // Using built-in alert/toast or custom UI?
              // Since we don't have a global toast setup visible, let's use a temporary console log or simple alert for now
              // Better: Use a small local state to show a "Toast" component
              console.warn(result.warning_message);
              // alert(result.warning_message); // Alert pauses execution, bad for UX.
              // TODO: Implement proper toast. For now, we rely on the Red Flash or the overlay.
            }

            if (result.is_disqualified) {
              // Handle disqualification if needed, usually lives <= 0 handles it
            }
          }
        } catch (e) {
          console.error("Failed to record tab switch", e);
        }
      }
    };

    // Polling backup
    const fullscreenPolling = setInterval(() => {
      if (!document.fullscreenElement && !showFullscreenOverlay && view !== "intro") {
        setShowFullscreenOverlay(true);
      }
    }, 1000);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(fullscreenPolling);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [view, showFullscreenOverlay, hasInteracted, examData?.attempt_id, dispatch]);

  useEffect(() => {
    if (timeRemaining <= 0 || lives <= 0 || view === "finished") return;

    const timer = setInterval(() => {
      dispatch(decrementTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, lives, view, dispatch]);

  // Loading / Hydrating UI
  if (!isInitialized || !examData) {
    return (
      <div className="relative flex min-h-screen flex-col gap-6 overflow-hidden p-6">
        {/* Blurred Background Skeleton */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-50 blur-xl">
          <div className="flex h-full flex-col gap-6 p-6">
            <div className="h-20 w-full animate-pulse rounded-2xl bg-white/10"></div>
            <div className="h-16 w-full animate-pulse rounded-2xl bg-white/10"></div>
            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="h-full animate-pulse rounded-3xl bg-white/10 lg:col-span-3"></div>
              <div className="h-64 animate-pulse rounded-2xl bg-white/10"></div>
            </div>
          </div>
        </div>

        {/* Loading Spinner Overlay */}
        <Loading />
      </div>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const currentQuestionId = currentQuestion?.question_id; // Using string ID
  const flaggedSet = new Set(flaggedQuestions); // flaggedQuestions is string[]

  const handleNavigate = (index: number) => {
    dispatch(setCurrentIndex(index));
    if (view === "summary") {
      dispatch(setView("exam"));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentIndex(currentQuestionIndex - 1));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      dispatch(setCurrentIndex(currentQuestionIndex + 1));
    }
  };

  const handleSelectAnswer = async (answer: QuestionAnswer) => {
    dispatch(setAnswer({ questionId: currentQuestionId, answer }));

    // Background save to API
    if (examData?.attempt_id) {
      await examService.saveAnswer(examData.attempt_id, currentQuestionId, answer);
    }
  };

  const handleToggleFlag = () => {
    dispatch(toggleFlag(currentQuestionId));
  };

  // ... rest of the handlers ...
  const handleFinishAttempt = () => {
    dispatch(setView("summary"));
  };

  const handleBackToExam = () => {
    dispatch(setView("exam"));
  };

  const handleConfirmSubmit = async () => {
    if (!examData?.attempt_id) return;

    console.log("Submitting exam...", { attemptId: examData.attempt_id });

    try {
      const result = await examService.submitExam(examData.attempt_id);
      console.log("Exam submitted successfully", result);

      if (examData.exam_id) {
        localStorage.removeItem(`exam_flags_${examData.exam_id}`);
      }

      dispatch(finishExam());

      router.replace("/dashboard");
    } catch (error) {
      console.error("Failed to submit exam", error);
    }
  };

  const handleReenterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error("Failed to enter fullscreen:", err);
    }
  };

  if (lives <= 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-lg rounded-3xl border border-red-500/30 bg-red-500/10 p-10 text-center">
          <AlertTriangle size={64} className="mx-auto mb-6 text-red-500" />
          <h2 className="mb-4 text-3xl font-bold text-white">Ujian Dibatalkan</h2>
          <p className="mb-8 text-lg text-white/70">
            Anda telah melakukan terlalu banyak pelanggaran. Ujian Anda dibatalkan.
          </p>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (view === "finished") {
    const answeredCount = Object.keys(answers).length;
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-lg rounded-3xl border border-green-500/30 bg-green-500/10 p-10 text-center">
          <CheckCircle2 size={64} className="mx-auto mb-6 text-green-500" />
          <h2 className="mb-4 text-3xl font-bold text-white">Ujian Selesai!</h2>
          <p className="mb-2 text-lg text-white/70">Jawaban Anda telah berhasil dikumpulkan.</p>
          <p className="mb-8 text-white/50">
            {answeredCount} dari {examData.questions.length} soal terjawab
          </p>
          <Link href="/dashboard">
            <Button variant="glow" size="lg">
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (view === "summary") {
    return (
      <ExamSummary
        questions={examData.questions}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        onNavigateToQuestion={handleNavigate}
        onBackToExam={handleBackToExam}
        onConfirmSubmit={handleConfirmSubmit}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">
      <ExamHeader title={examData.title} subject={examData.subject || ""} stream={stream} />

      <ExamTimerBar
        currentQuestion={currentQuestionIndex + 1}
        timeRemaining={timeRemaining}
        lives={lives}
      />

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={answers[currentQuestionId] || null} // selectedAnswer might be complex object
            onSelectAnswer={handleSelectAnswer}
          />
        </div>

        <div>
          <QuestionNavigation
            questions={examData.questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            flaggedQuestions={flaggedSet}
            isFlagged={flaggedSet.has(currentQuestionId)}
            onNavigate={handleNavigate}
            onToggleFlag={handleToggleFlag}
            onFinishAttempt={handleFinishAttempt}
          />
        </div>
      </div>

      <ExamFooter
        currentIndex={currentQuestionIndex}
        totalQuestions={examData.questions.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {/* Lives Warning & Overlay (Keep same logic) */}
      {lives < maxLives && lives > 0 && !showFullscreenOverlay && (
        <div className="animate-fade-in fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-red-500/50 bg-red-500/90 px-6 py-3 text-white shadow-2xl">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="font-semibold">Perhatian! Sisa nyawa: {lives}</span>
          </div>
        </div>
      )}

      {showFullscreenOverlay && lives > 0 && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950 p-6"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl">
              <Maximize size={32} className="text-white/80" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">Mode Fullscreen</h1>
              <p className="text-neutral-400">Ujian harus dilakukan dalam mode layar penuh.</p>
            </div>

            <Button
              variant="glow"
              size="lg"
              onClick={handleReenterFullscreen}
              className="w-full py-6 text-base font-semibold"
            >
              Aktifkan Fullscreen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
