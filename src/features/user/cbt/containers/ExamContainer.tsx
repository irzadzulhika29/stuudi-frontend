"use client";

import { useEffect } from "react";
import { ExamHeader } from "../components/ExamHeader";
import { ExamTimerBar } from "../components/ExamTimerBar";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionNavigation } from "../components/QuestionNavigation";
import { ExamFooter } from "../components/ExamFooter";
import { ExamSummary } from "../components/ExamSummary";
import { ExamSkeleton } from "../components/ExamSkeleton";
import { ExamSuccessScreen } from "../components/ExamSuccessScreen";
import { ViolationWarning } from "../components/ViolationWarning";
import { AlertTriangle, Maximize } from "lucide-react";
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
  finishExam,
} from "@/shared/store/slices/examSlice";
import { examService } from "../services/examService";
import { dashboardService } from "@/features/user/dashboard/services/dashboardService";
import { useRouter } from "next/navigation";

// Custom hooks for cleaner code
import { useExamTimer, useFullscreenGuard, useExamPersistence } from "../hooks";

interface ExamContainerProps {
  stream: MediaStream | null;
}

export function ExamContainer({ stream }: ExamContainerProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    view,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    lives,
    maxLives,
    isInitialized,
    examData,
  } = useAppSelector((state) => state.exam);

  // Use custom hooks
  const { timeRemaining } = useExamTimer();
  const { showOverlay, enterFullscreen } = useFullscreenGuard({ enabled: view !== "finished" });
  const { clearCache } = useExamPersistence();

  // Hydrate exam data on refresh
  useEffect(() => {
    if (!isInitialized || !examData) {
      const searchParams = new URLSearchParams(window.location.search);
      const examId = searchParams.get("code");

      if (examId) {
        const fetchExam = async () => {
          try {
            console.log("[ExamContainer] Fetching/Resuming exam with ID:", examId);
            const response = await dashboardService.resumeExam(examId);
            console.log("[ExamContainer] Exam data fetched successfully", response);
            const payload = examService.transformExamToReduxPayload(response);
            dispatch(initializeExam(payload));
          } catch (error) {
            console.error("[ExamContainer] Failed to restore exam session", error);
          }
        };
        fetchExam();
      } else {
        console.warn("[ExamContainer] No exam code found in URL params");
      }
    }
  }, [dispatch, isInitialized, examData]);

  // Loading / Hydrating UI
  if (!isInitialized || !examData) {
    return <ExamSkeleton />;
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const currentQuestionId = currentQuestion?.question_id; // Using string ID
  const flaggedSet = new Set(flaggedQuestions); // flaggedQuestions is string[]

  const handleNavigate = (index: number) => {
    console.log("[ExamContainer] Navigating to question index:", index);
    dispatch(setCurrentIndex(index));
    if (view === "summary") {
      dispatch(setView("exam"));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      handleNavigate(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      handleNavigate(currentQuestionIndex + 1);
    }
  };

  const handleSelectAnswer = async (answer: QuestionAnswer) => {
    console.log("[ExamContainer] Answer selected:", { questionId: currentQuestionId, answer });
    dispatch(setAnswer({ questionId: currentQuestionId, answer }));

    // Background save to API
    if (examData?.attempt_id) {
      try {
        await examService.saveAnswer(examData.attempt_id, currentQuestionId, answer);
        console.log("[ExamContainer] Answer saved to API successfully");
      } catch (error) {
        console.error("[ExamContainer] Failed to save answer to API", error);
      }
    }
  };

  const handleClearAnswer = async () => {
    console.log("[ExamContainer] Clearing answer for:", currentQuestionId);

    // 1. Update local state immediately
    dispatch(setAnswer({ questionId: currentQuestionId, answer: null }));

    // 2. Call API to clear answer
    if (examData?.attempt_id) {
      try {
        await examService.clearAnswer(examData.attempt_id, currentQuestionId);
        console.log("[ExamContainer] Answer cleared from API successfully");
      } catch (error) {
        console.error("[ExamContainer] Failed to clear answer from API", error);
        // Optional: We could revert state here if needed, but for now we trust the optimistic update
      }
    }
  };

  const handleToggleFlag = () => {
    console.log("[ExamContainer] Toggling flag for question:", currentQuestionId);
    dispatch(toggleFlag(currentQuestionId));
  };

  // ... rest of the handlers ...

  // (Assuming handleFinishAttempt, handleBackToExam, handleConfirmSubmit are here as before)
  const handleFinishAttempt = () => {
    console.log("[ExamContainer] Finishing attempt, viewing summary");
    dispatch(setView("summary"));
  };

  const handleBackToExam = () => {
    console.log("[ExamContainer] Returning to exam from summary");
    dispatch(setView("exam"));
  };

  const handleConfirmSubmit = async () => {
    if (!examData?.attempt_id) return;

    console.log("[ExamContainer] Submitting exam...", { attemptId: examData.attempt_id });

    try {
      const result = await examService.submitExam(examData.attempt_id);
      console.log("[ExamContainer] Exam submitted successfully", result);

      // Clear cached data using hook
      if (examData.exam_id) {
        clearCache(examData.exam_id);
      }

      dispatch(finishExam());

      router.replace("/dashboard");
    } catch (error) {
      console.error("[ExamContainer] Failed to submit exam", error);
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
      <ExamSuccessScreen
        answeredCount={answeredCount}
        totalQuestions={examData.questions.length}
        examTitle={examData.title}
      />
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
            selectedAnswer={answers[currentQuestionId] || null}
            onSelectAnswer={handleSelectAnswer}
            onClearAnswer={handleClearAnswer}
          />
        </div>

        <div className="flex h-fit justify-center">
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

      <ViolationWarning lives={lives} maxLives={maxLives} isVisible={!showOverlay} />

      {showOverlay && lives > 0 && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-neutral-950 p-6"
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
              onClick={enterFullscreen}
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
