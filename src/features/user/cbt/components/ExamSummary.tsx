"use client";

import { useState } from "react";
import { Flag, ArrowLeft } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { ConfirmSubmitModal } from "./ConfirmSubmitModal";
import { ExamQuestion } from "@/features/user/cbt/types/examTypes";
import { QuestionAnswer } from "@/shared/types/questionTypes";

interface ExamSummaryProps {
  questions: ExamQuestion[];
  answers: Record<string, QuestionAnswer>;
  flaggedQuestions: string[];
  onNavigateToQuestion: (index: number) => void;
  onBackToExam: () => void;
  onConfirmSubmit: () => void;
}

export function ExamSummary({
  questions,
  answers,
  flaggedQuestions,
  onNavigateToQuestion,
  onBackToExam,
  onConfirmSubmit,
}: ExamSummaryProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = flaggedQuestions.length;

  const getQuestionStatus = (questionId: string) => {
    const isAnswered = answers[questionId] !== undefined;
    const isFlagged = flaggedQuestions.includes(questionId);

    if (isFlagged && isAnswered) return "flagged-answered";
    if (isFlagged) return "flagged";
    if (isAnswered) return "answered";
    return "unanswered";
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-orange-500 text-white shadow-lg shadow-orange-500/20 border border-orange-400/20";
      case "unanswered":
        return "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 border border-white/10";
      case "flagged":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/50";
      case "flagged-answered":
        return "bg-orange-500 text-white ring-2 ring-amber-500 ring-offset-2 ring-offset-black";
      default:
        return "bg-white/5 text-white/60";
    }
  };

  const handleFinishClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    onConfirmSubmit();
  };

  return (
    <>
      <div className="animate-in fade-in zoom-in-95 mx-auto flex min-h-screen max-w-5xl flex-col p-6 duration-300 lg:p-10">
        <div className="mb-10 space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">Ringkasan Jawaban</h1>
          <p className="text-neutral-400">
            Pastikan semua jawaban sudah sesuai sebelum menyelesaikan ujian.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/50 p-6 transition-all duration-300 hover:border-orange-500/30">
            <div className="relative z-10 flex flex-col items-center">
              <span className="mb-1 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                {answeredCount}
              </span>
              <span className="text-sm font-medium tracking-wider text-neutral-400 uppercase">
                Terjawab
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/50 p-6 transition-all duration-300 hover:border-red-500/30">
            <div className="relative z-10 flex flex-col items-center">
              <span className="mb-1 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                {unansweredCount}
              </span>
              <span className="text-sm font-medium tracking-wider text-neutral-400 uppercase">
                Kosong
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/50 p-6 transition-all duration-300 hover:border-amber-500/30">
            <div className="relative z-10 flex flex-col items-center">
              <span className="mb-1 text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                {flaggedCount}
              </span>
              <span className="text-sm font-medium tracking-wider text-neutral-400 uppercase">
                Ditandai
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
          </div>
        </div>

        {/* Question Grid */}
        <div className="mb-10 flex-1 rounded-3xl border border-white/5 bg-neutral-900/30 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Navigasi Soal</h2>
            <div className="flex items-center gap-4 text-xs font-medium text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>Terjawab
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full border border-white/10 bg-neutral-700"></div>
                Kosong
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>Ditandai
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 place-items-center gap-3 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
            {questions.map((question, index) => {
              const status = getQuestionStatus(question.question_id);
              return (
                <button
                  key={question.question_id}
                  onClick={() => onNavigateToQuestion(index)}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-110 active:scale-95 ${getStatusStyles(status)}`}
                >
                  {index + 1}
                  {flaggedQuestions.includes(question.question_id) && (
                    <div className="absolute top-0 right-0 -mt-1 -mr-1">
                      <div className="rounded-full bg-amber-500 p-0.5">
                        <Flag size={8} className="fill-black text-black" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={onBackToExam}
            className="flex-1 border-white/20 bg-white/5 py-6 text-white transition-all hover:border-white/30 hover:bg-white/10"
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowLeft size={20} />
              <span className="font-semibold">Kembali ke Soal</span>
            </div>
          </Button>
          <Button
            variant="glow"
            size="lg"
            onClick={handleFinishClick}
            className="flex-1 py-6 text-lg font-bold tracking-wide"
          >
            Selesaikan Ujian
          </Button>
        </div>
      </div>

      <ConfirmSubmitModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
      />
    </>
  );
}
