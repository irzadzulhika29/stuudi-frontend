"use client";

import { useCallback, useEffect } from "react";
import { ExamHeader } from "../components/ExamHeader";
import { ExamTimerBar } from "../components/ExamTimerBar";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionNavigation } from "../components/QuestionNavigation";
import { ExamFooter } from "../components/ExamFooter";
import { ExamSummary } from "../components/ExamSummary";
import { dummyExamData } from "../data/dummyExamData";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
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
    currentQuestionIndex: currentIndex,
    answers,
    flaggedQuestions,
    lives,
    maxLives,
    timeRemaining,
    isInitialized,
  } = useAppSelector((state) => state.exam);

  const currentQuestion = dummyExamData.questions[currentIndex];
  const currentQuestionId = currentQuestion?.question_id;
  const flaggedSet = new Set(flaggedQuestions);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeExam({ examData: dummyExamData, maxLives: 3 }));
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
        handleViolation();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleViolation, view]);

  useEffect(() => {
    if (timeRemaining <= 0 || lives <= 0 || view === "finished") return;

    const timer = setInterval(() => {
      dispatch(decrementTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, lives, view, dispatch]);

  const handleSelectAnswer = (answer: QuestionAnswer) => {
    dispatch(setAnswer({ questionId: currentQuestionId, answer }));
  };

  const handleClearAnswer = () => {
    dispatch(setAnswer({ questionId: currentQuestionId, answer: null }));
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
      />

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={answers[currentQuestionId] ?? null}
            onSelectAnswer={handleSelectAnswer}
            onClearAnswer={handleClearAnswer}
          />
        </div>

        <div>
          <QuestionNavigation
            questions={dummyExamData.questions}
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

      {lives < maxLives && lives > 0 && (
        <div className="animate-fade-in fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-red-500/50 bg-red-500/90 px-6 py-3 text-white shadow-2xl">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="font-semibold">Perhatian! Sisa nyawa: {lives}</span>
          </div>
        </div>
      )}
    </div>
  );
}
