"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Flag, ArrowLeft } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { ConfirmSubmitModal } from "./ConfirmSubmitModal";
import { ExamQuestion } from "../types/examTypes";

interface ExamSummaryProps {
  questions: ExamQuestion[];
  answers: Record<number, string>;
  flaggedQuestions: number[];
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

  const getQuestionStatus = (questionId: number) => {
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
        return "bg-primary text-white hover:bg-primary/80";
      case "unanswered":
        return "bg-red-500/20 text-red-400 hover:bg-red-500/30 ring-1 ring-red-500/30";
      case "flagged":
        return "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 ring-1 ring-amber-500/30";
      case "flagged-answered":
        return "bg-primary text-white ring-2 ring-amber-500";
      default:
        return "bg-white/10 text-white/60";
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
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col p-6">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">Ringkasan Jawaban</h1>
          <p className="text-white/60">Periksa kembali semua jawaban sebelum mengakhiri ujian</p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-center">
            <CheckCircle2 size={32} className="mx-auto mb-3 text-green-500" />
            <p className="text-3xl font-bold text-green-400">{answeredCount}</p>
            <p className="text-sm text-green-400/70">Terjawab</p>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <XCircle size={32} className="mx-auto mb-3 text-red-500" />
            <p className="text-3xl font-bold text-red-400">{unansweredCount}</p>
            <p className="text-sm text-red-400/70">Belum Terjawab</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 text-center">
            <Flag size={32} className="mx-auto mb-3 text-amber-500" />
            <p className="text-3xl font-bold text-amber-400">{flaggedCount}</p>
            <p className="text-sm text-amber-400/70">Ditandai</p>
          </div>
        </div>

        <div className="mb-8 flex-1 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h2 className="mb-6 text-lg font-semibold text-white">Semua Soal</h2>
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
            {questions.map((question, index) => {
              const status = getQuestionStatus(question.id);
              return (
                <button
                  key={question.id}
                  onClick={() => onNavigateToQuestion(index)}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-110 ${getStatusStyles(status)}`}
                >
                  {question.id}
                  {flaggedQuestions.includes(question.id) && (
                    <Flag
                      size={10}
                      className="absolute right-1 bottom-1 fill-amber-500 text-amber-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-4 w-4 rounded"></div>
              <span>Terjawab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-red-500/30 ring-1 ring-red-500/50"></div>
              <span>Belum Terjawab</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-amber-500/30 ring-1 ring-amber-500/50"></div>
              <span>Ditandai</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onBackToExam}
            icon={<ArrowLeft size={20} />}
            iconPosition="left"
            className="flex-1"
          >
            Kembali ke Soal
          </Button>
          <Button variant="primary" size="lg" onClick={handleFinishClick} className="flex-1">
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
