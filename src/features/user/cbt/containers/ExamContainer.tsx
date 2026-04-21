"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExamHeader } from "../components/ExamHeader";
import { ExamTimerBar } from "../components/ExamTimerBar";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionNavigation } from "../components/QuestionNavigation";
import { ExamFooter } from "../components/ExamFooter";
import { ExamSummary } from "../components/ExamSummary";
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
import { dashboardService } from "@/features/user/dashboard/services/dashboardService";
import { examService } from "../services/examService";
import { ExamSkeleton } from "../components/ExamSkeleton";

interface ExamContainerProps {
  stream: MediaStream | null;
  examCode: string;
}

export function ExamContainer({ stream, examCode }: ExamContainerProps) {
  const dispatch = useAppDispatch();
  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    view,
    currentQuestionIndex: currentIndex,
    answers,
    flaggedQuestions,
    lives,
    maxLives,
    timeRemaining,
    isInitialized,
    examData,
  } = useAppSelector((state) => state.exam);

  const questionCount = examData?.questions.length ?? 0;
  const currentQuestion = examData?.questions[currentIndex];
  const currentQuestionId = currentQuestion?.question_id;
  const flaggedSet = useMemo(() => new Set(flaggedQuestions), [flaggedQuestions]);

  useEffect(() => {
    const loadExamFromApi = async () => {
      if (!examCode || (isInitialized && examData?.questions.length)) return;

      setIsLoadingExam(true);
      setLoadError(null);

      try {
        const accessData = await dashboardService.accessExam(examCode);
        const response = await dashboardService.resumeExam(accessData.exam_id);
        const payload = examService.transformExamToReduxPayload(response);
        dispatch(initializeExam(payload));
      } catch (err: unknown) {
        console.error("Failed to load exam from API:", err);
        const errorMessage =
          (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Gagal memuat soal ujian.";
        setLoadError(errorMessage);
      } finally {
        setIsLoadingExam(false);
      }
    };

    loadExamFromApi();
  }, [dispatch, examCode, examData?.questions.length, isInitialized]);

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
    if (!currentQuestionId) return;
    dispatch(setAnswer({ questionId: currentQuestionId, answer }));
  };

  const handleClearAnswer = () => {
    if (!currentQuestionId) return;
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
    if (currentIndex < questionCount - 1) {
      dispatch(setCurrentIndex(currentIndex + 1));
    }
  };

  const handleToggleFlag = () => {
    if (!currentQuestionId) return;
    dispatch(toggleFlag(currentQuestionId));
  };

  const handleFinishAttempt = () => {
    setSubmitError(null);
    dispatch(setView("summary"));
  };

  const handleBackToExam = () => {
    dispatch(setView("exam"));
  };

  const handleConfirmSubmit = async () => {
    if (!examData?.attempt_id || isSubmittingExam) {
      setSubmitError("Attempt ujian tidak ditemukan. Silakan muat ulang halaman.");
      return;
    }

    setIsSubmittingExam(true);
    setSubmitError(null);

    try {
      await examService.submitExam(examData.attempt_id);
      dispatch(finishExam());
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err: unknown) {
      console.error("Failed to submit exam:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Gagal mengirim ujian. Silakan coba lagi.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmittingExam(false);
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
            {answeredCount} dari {questionCount} soal terjawab
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

  if (isLoadingExam || !examData) {
    return <ExamSkeleton />;
  }

  if (loadError || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-lg rounded-3xl border border-red-500/30 bg-red-500/10 p-10 text-center">
          <AlertTriangle size={64} className="mx-auto mb-6 text-red-500" />
          <h2 className="mb-4 text-3xl font-bold text-white">Soal Tidak Tersedia</h2>
          <p className="mb-8 text-lg text-white/70">
            {loadError || "Data ujian belum berhasil dimuat."}
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

  const activeQuestionId = currentQuestion.question_id;

  if (view === "summary") {
    return (
      <ExamSummary
        questions={examData.questions}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        onNavigateToQuestion={handleNavigate}
        onBackToExam={handleBackToExam}
        onConfirmSubmit={handleConfirmSubmit}
        isSubmitting={isSubmittingExam}
        submitError={submitError}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">
      <ExamHeader title={examData.title} subject={examData.subject} stream={stream} />

      <ExamTimerBar
        currentQuestion={currentIndex + 1}
        timeRemaining={timeRemaining}
        lives={lives}
      />

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={answers[activeQuestionId] ?? null}
            onSelectAnswer={handleSelectAnswer}
            onClearAnswer={handleClearAnswer}
          />
        </div>

        <div>
          <QuestionNavigation
            questions={examData.questions}
            currentIndex={currentIndex}
            answers={answers}
            flaggedQuestions={flaggedSet}
            isFlagged={flaggedSet.has(activeQuestionId)}
            onNavigate={handleNavigate}
            onToggleFlag={handleToggleFlag}
            onFinishAttempt={handleFinishAttempt}
          />
        </div>
      </div>

      <ExamFooter
        currentIndex={currentIndex}
        totalQuestions={questionCount}
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
