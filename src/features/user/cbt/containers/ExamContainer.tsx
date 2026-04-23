"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExamHeader } from "../components/ExamHeader";
import { ExamTimerBar } from "../components/ExamTimerBar";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionNavigation } from "../components/QuestionNavigation";
import { ExamFooter } from "../components/ExamFooter";
import { ExamSummary } from "../components/ExamSummary";
import { ExamSidebar } from "../components/ExamSidebar";
import { AlertTriangle } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { QuestionAnswer } from "@/shared/types/questionTypes";
import {
  initializeExam,
  setView,
  setCurrentIndex,
  toggleFlag,
  decrementTime,
  finishExam,
} from "@/shared/store/slices/examSlice";
import { dashboardService } from "@/features/user/dashboard/services/dashboardService";
import { examService } from "../services/examService";
import { ExamSkeleton } from "../components/ExamSkeleton";
import { useAutoSave, useExamPersistence, useFullscreenGuard } from "../hooks";
import { countAnsweredQuestions } from "../utils/answerState";
import { canReuseLoadedExam, resolveExamLookup } from "../utils/examRoute";

interface ExamContainerProps {
  stream: MediaStream | null;
  examCode?: string | null;
  examId?: string | null;
}

export function ExamContainer({ stream, examCode, examId }: ExamContainerProps) {
  const dispatch = useAppDispatch();
  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasAutoSubmittedRef = useRef(false);

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
  const examLookup = resolveExamLookup({ examCode, examId });
  const { saveAnswer, flushPendingSaves } = useAutoSave({
    attemptId: examData?.attempt_id,
  });
  const { clearCache } = useExamPersistence();
  const { showOverlay, enterFullscreen } = useFullscreenGuard({
    enabled: !!examData?.attempt_id && view !== "finished",
  });

  useEffect(() => {
    const loadExamFromApi = async () => {
      if (!examLookup) {
        setLoadError("Identitas ujian tidak valid.");
        return;
      }

      if (
        canReuseLoadedExam({
          requestedExamId: examId,
          loadedExamId: examData?.exam_id,
          isInitialized,
          questionCount: examData?.questions.length ?? 0,
        })
      ) {
        return;
      }

      setIsLoadingExam(true);
      setLoadError(null);

      try {
        const response =
          examLookup.type === "examId"
            ? await dashboardService.resumeExam(examLookup.value)
            : await dashboardService.resumeExam(
                (await dashboardService.accessExam(examLookup.value)).exam_id
              );
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

    void loadExamFromApi();
  }, [dispatch, examLookup, examData?.exam_id, examData?.questions.length, examId, isInitialized]);

  useEffect(() => {
    if (timeRemaining <= 0 || lives <= 0 || view === "finished") return;

    const timer = setInterval(() => {
      dispatch(decrementTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, lives, view, dispatch]);

  const submitCurrentExam = useCallback(async () => {
    if (!examData?.attempt_id || !examData.exam_id || isSubmittingExam) {
      setSubmitError("Attempt ujian tidak ditemukan. Silakan muat ulang halaman.");
      return false;
    }

    setIsSubmittingExam(true);
    setSubmitError(null);

    try {
      await flushPendingSaves();
      await examService.submitExam(examData.attempt_id);
      clearCache(examData.exam_id);
      examService.clearAttemptQuestionSnapshot(examData.attempt_id);
      dispatch(finishExam());
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      return true;
    } catch (err: unknown) {
      console.error("Failed to submit exam:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Gagal mengirim ujian. Silakan coba lagi.";
      setSubmitError(errorMessage);
      return false;
    } finally {
      setIsSubmittingExam(false);
    }
  }, [clearCache, dispatch, examData, flushPendingSaves, isSubmittingExam]);

  useEffect(() => {
    if (timeRemaining > 0 || lives <= 0 || view === "finished" || hasAutoSubmittedRef.current) {
      return;
    }

    hasAutoSubmittedRef.current = true;
    void submitCurrentExam();
  }, [lives, submitCurrentExam, timeRemaining, view]);

  const handleSelectAnswer = (answer: QuestionAnswer) => {
    if (!currentQuestionId) return;
    saveAnswer(currentQuestionId, answer);
  };

  const handleClearAnswer = () => {
    if (!currentQuestionId) return;
    saveAnswer(currentQuestionId, null);
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
    await submitCurrentExam();
  };

  if (lives <= 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] p-8">
        <div className="max-w-lg rounded-[28px] border border-red-200 bg-white p-10 text-center shadow-sm">
          <h2 className="mb-4 text-3xl font-semibold text-neutral-950">Ujian Dibatalkan</h2>
          <p className="mb-8 text-lg text-neutral-600">
            Anda telah melakukan terlalu banyak pelanggaran. Ujian Anda dibatalkan.
          </p>
          <Link href="/dashboard">
            <Button variant="primary" size="lg">
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (view === "finished") {
    const answeredCount = countAnsweredQuestions(answers);
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] p-8">
        <div className="max-w-lg rounded-[28px] border border-neutral-200 bg-white p-10 text-center shadow-sm">
          <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-400 uppercase">
            Submit Berhasil
          </p>
          <h2 className="mt-3 mb-4 text-3xl font-semibold text-neutral-950">Ujian selesai</h2>
          <p className="mb-2 text-lg text-neutral-600">Jawaban Anda telah berhasil dikumpulkan.</p>
          <p className="mb-8 text-neutral-500">
            {answeredCount} dari {questionCount} soal terjawab
          </p>
          <Link href="/dashboard">
            <Button variant="primary" size="lg">
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
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] p-8">
        <div className="max-w-lg rounded-[28px] border border-red-200 bg-white p-10 text-center shadow-sm">
          <h2 className="mb-4 text-3xl font-semibold text-neutral-950">Soal Tidak Tersedia</h2>
          <p className="mb-8 text-lg text-neutral-600">
            {loadError || "Data ujian belum berhasil dimuat."}
          </p>
          <Link href="/dashboard">
            <Button variant="primary" size="lg">
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
    <div className="min-h-screen bg-[#f5f4ef]">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-5 py-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <ExamHeader title={examData.title} subject={examData.subject} />
          <div className="self-center md:mt-[-2px] md:self-start">
            <ExamSidebar stream={stream} />
          </div>
        </div>

        <ExamTimerBar
          currentQuestion={currentIndex + 1}
          timeRemaining={timeRemaining}
          lives={lives}
        />

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 lg:pr-2">
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={answers[activeQuestionId] ?? null}
              onSelectAnswer={handleSelectAnswer}
              onClearAnswer={handleClearAnswer}
            />
          </div>

          <div className="w-full lg:self-start">
            <QuestionNavigation
              questions={examData.questions}
              currentIndex={currentIndex}
              answers={answers}
              flaggedQuestions={flaggedSet}
              isFlagged={flaggedSet.has(activeQuestionId)}
              onNavigate={handleNavigate}
              onToggleFlag={handleToggleFlag}
            />
          </div>
        </div>

        <ExamFooter
          currentIndex={currentIndex}
          totalQuestions={questionCount}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onFinishAttempt={handleFinishAttempt}
        />
      </div>

      {lives < maxLives && lives > 0 && (
        <div className="animate-fade-in fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-red-500/50 bg-red-500/90 px-6 py-3 text-white shadow-2xl">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <span className="font-semibold">Perhatian! Sisa nyawa: {lives}</span>
          </div>
        </div>
      )}

      {showOverlay && lives > 0 && (
        <div className="animate-fade-in fixed inset-0 z-50 flex cursor-not-allowed items-center justify-center bg-neutral-950/90 p-6 text-center backdrop-blur-xl">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-10 shadow-2xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={30} className="text-red-500" />
            </div>
            <h2 className="mb-4 text-3xl font-semibold text-neutral-950">Kembali ke Fullscreen</h2>
            <p className="mb-10 text-lg leading-relaxed text-neutral-600">
              Anda terdeteksi keluar dari mode layar penuh. Kembali ke fullscreen untuk melanjutkan
              ujian.
            </p>
            <Button variant="danger" size="lg" onClick={enterFullscreen} className="w-full">
              Kembali ke Fullscreen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
