"use client";

import { useCallback, useEffect, useState } from "react";
import { ExamHeader } from "../components/ExamHeader";
import { ExamTimerBar } from "../components/ExamTimerBar";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionNavigation } from "../components/QuestionNavigation";
import { ExamFooter } from "../components/ExamFooter";
import { ExamSummary } from "../components/ExamSummary";
import { dummyExamData } from "../data/dummyExamData";
import { AlertTriangle, CheckCircle2, Maximize } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import {
  initializeExam,
  setView,
  setCurrentIndex,
  setAnswer,
  toggleFlag,
  decrementLife,
  decrementTime,
  finishExam,
} from "@/shared/store/slices/examSlice";

interface ExamContainerProps {
  stream: MediaStream | null;
}

export function ExamContainer({ stream }: ExamContainerProps) {
  const dispatch = useAppDispatch();

  const {
    view,
    currentIndex,
    answers,
    flaggedQuestions,
    lives,
    maxLives,
    timeRemaining,
    isInitialized,
  } = useAppSelector((state) => state.exam);

  const currentQuestion = dummyExamData.questions[currentIndex];
  const currentQuestionId = currentQuestion?.id;
  const flaggedSet = new Set(flaggedQuestions);

  // Fullscreen state tracking
  const [showFullscreenOverlay, setShowFullscreenOverlay] = useState(false);
  const [isReenteringFullscreen, setIsReenteringFullscreen] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeExam({ duration: dummyExamData.duration, maxLives: 3 }));
    }
  }, [dispatch, isInitialized]);

  const handleViolation = useCallback(() => {
    if (lives > 0 && view !== "finished") {
      dispatch(decrementLife());
    }
  }, [lives, view, dispatch]);

  useEffect(() => {
    if (view === "finished") return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // User exited fullscreen - show overlay and decrement life
        setShowFullscreenOverlay(true);
        handleViolation();

        // Auto-attempt to re-enter fullscreen (will fail without user interaction, but we try)
        document.documentElement.requestFullscreen().catch(() => {
          // Expected to fail - browser requires user interaction
          console.log("[CBT] Auto-fullscreen blocked - requires user click");
        });
      } else if (document.fullscreenElement) {
        // User re-entered fullscreen
        setShowFullscreenOverlay(false);
        setIsReenteringFullscreen(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    // Polling: Check fullscreen status every 500ms as backup detection
    const fullscreenPolling = setInterval(() => {
      if (!document.fullscreenElement && !showFullscreenOverlay) {
        setShowFullscreenOverlay(true);
        // Don't decrement life here - only on actual fullscreenchange event
      }
    }, 500);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // Safari
    document.addEventListener("mozfullscreenchange", handleFullscreenChange); // Firefox
    document.addEventListener("MSFullscreenChange", handleFullscreenChange); // IE/Edge
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(fullscreenPolling);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleViolation, view, showFullscreenOverlay]);

  useEffect(() => {
    if (timeRemaining <= 0 || lives <= 0 || view === "finished") return;

    const timer = setInterval(() => {
      dispatch(decrementTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, lives, view, dispatch]);

  const handleSelectAnswer = (answer: string) => {
    dispatch(setAnswer({ questionId: currentQuestionId, answer }));
  };

  const handleNavigate = (index: number) => {
    dispatch(setCurrentIndex(index));
    if (view === "summary") {
      dispatch(setView("exam"));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      dispatch(setCurrentIndex(currentIndex - 1));
    }
  };

  const handleNext = () => {
    if (currentIndex < dummyExamData.questions.length - 1) {
      dispatch(setCurrentIndex(currentIndex + 1));
    }
  };

  const handleToggleFlag = () => {
    dispatch(toggleFlag(currentQuestionId));
  };

  const handleFinishAttempt = () => {
    dispatch(setView("summary"));
  };

  const handleBackToExam = () => {
    dispatch(setView("exam"));
  };

  const handleConfirmSubmit = () => {
    dispatch(finishExam());
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  // Re-enter fullscreen function
  const handleReenterFullscreen = async () => {
    setIsReenteringFullscreen(true);
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error("Failed to enter fullscreen:", err);
      setIsReenteringFullscreen(false);
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
            {answeredCount} dari {dummyExamData.questions.length} soal terjawab
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
        questions={dummyExamData.questions}
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
      <ExamHeader title={dummyExamData.title} subject={dummyExamData.subject} stream={stream} />

      <ExamTimerBar
        currentQuestion={currentIndex + 1}
        timeRemaining={timeRemaining}
        lives={lives}
        maxLives={maxLives}
      />

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={answers[currentQuestionId] || null}
            onSelectAnswer={handleSelectAnswer}
          />
        </div>

        <div>
          <QuestionNavigation
            totalQuestions={dummyExamData.questions.length}
            currentIndex={currentIndex}
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
        currentIndex={currentIndex}
        totalQuestions={dummyExamData.questions.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {lives < maxLives && lives > 0 && !showFullscreenOverlay && (
        <div className="animate-fade-in fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-red-500/50 bg-red-500/90 px-6 py-3 text-white shadow-2xl">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="font-semibold">Perhatian! Sisa nyawa: {lives}</span>
          </div>
        </div>
      )}

      {/* Fullscreen Re-entry Overlay - BLOCKING */}
      {showFullscreenOverlay && lives > 0 && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black p-6"
          style={{
            // Ensure complete coverage
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div className="w-full max-w-lg text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-red-600">
              <Maximize size={48} className="text-white" />
            </div>

            <h1 className="mb-4 text-3xl font-bold text-white">MODE FULLSCREEN DIPERLUKAN</h1>

            <p className="mb-3 text-lg text-white/80">
              Ujian hanya dapat dilanjutkan dalam mode layar penuh.
            </p>

            <p className="mb-8 rounded-lg bg-red-900/50 p-3 text-red-400">
              ⚠️ Pelanggaran terdeteksi! Sisa nyawa:{" "}
              <strong className="text-red-300">{lives}</strong>
            </p>

            <Button
              variant="glow"
              size="lg"
              onClick={handleReenterFullscreen}
              disabled={isReenteringFullscreen}
              icon={<Maximize size={24} />}
              iconPosition="left"
              className="w-full py-4 text-lg"
            >
              {isReenteringFullscreen ? "Memuat..." : "KLIK UNTUK FULLSCREEN"}
            </Button>

            <p className="mt-6 text-sm text-white/40">
              Tekan tombol di atas untuk melanjutkan ujian
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
