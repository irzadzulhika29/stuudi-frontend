"use client";

import Button from "@/shared/components/ui/Button";
import { ConfirmSubmitModal } from "./ConfirmSubmitModal";
import { ExamQuestion } from "@/features/user/cbt/types/examTypes";
import { QuestionAnswer } from "@/shared/types/questionTypes";
import { useExamSummary } from "../hooks/useExamSummary";

interface ExamSummaryProps {
  questions: ExamQuestion[];
  answers: Record<string, QuestionAnswer>;
  flaggedQuestions: string[];
  onNavigateToQuestion: (index: number) => void;
  onBackToExam: () => void;
  onConfirmSubmit: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export function ExamSummary({
  questions,
  answers,
  flaggedQuestions,
  onNavigateToQuestion,
  onBackToExam,
  onConfirmSubmit,
  isSubmitting = false,
  submitError = null,
}: ExamSummaryProps) {
  const {
    answeredCount,
    unansweredCount,
    flaggedCount,
    showConfirmModal,
    handleFinishClick,
    handleCloseConfirmModal,
    handleConfirmSubmit,
    isQuestionFlagged,
    isQuestionAnswered,
    getAnswerPreview,
  } = useExamSummary({
    questions,
    answers,
    flaggedQuestions,
    onConfirmSubmit,
  });

  return (
    <>
      <div className="min-h-screen bg-[#f5f4ef] px-4 py-5 md:px-6">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5">
          <div className="rounded-[28px] border border-neutral-200 bg-white px-5 py-5 shadow-sm">
            <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-400 uppercase">
              Ringkasan Jawaban
            </p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-neutral-950">
                  Periksa jawaban terakhir
                </h1>
                <p className="mt-2 text-sm text-neutral-600">
                  Pastikan jawaban yang tersimpan sudah sesuai sebelum mengakhiri ujian.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 lg:min-w-[360px]">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-center">
                  <p className="text-2xl font-semibold text-neutral-950">{answeredCount}</p>
                  <p className="mt-1 text-xs tracking-[0.16em] text-neutral-500 uppercase">
                    Terjawab
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-center">
                  <p className="text-2xl font-semibold text-neutral-950">{unansweredCount}</p>
                  <p className="mt-1 text-xs tracking-[0.16em] text-neutral-500 uppercase">
                    Kosong
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-center">
                  <p className="text-2xl font-semibold text-neutral-950">{flaggedCount}</p>
                  <p className="mt-1 text-xs tracking-[0.16em] text-neutral-500 uppercase">
                    Ditandai
                  </p>
                </div>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
            <section className="rounded-[28px] border border-neutral-200 bg-white p-4 shadow-sm md:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-neutral-950">Jawaban tersimpan</h2>
                <p className="text-xs text-neutral-500">{questions.length} soal</p>
              </div>

              <div className="space-y-3 lg:max-h-[68vh] lg:overflow-y-auto lg:pr-1">
                {questions.map((question, index) => {
                  const answer = answers[question.question_id] ?? null;
                  const isAnswered = isQuestionAnswered(question.question_id);
                  const isFlagged = isQuestionFlagged(question.question_id);

                  return (
                    <button
                      type="button"
                      key={question.question_id}
                      onClick={() => onNavigateToQuestion(index)}
                      className="w-full rounded-[22px] border border-neutral-200 bg-neutral-50 px-4 py-4 text-left transition-colors hover:border-neutral-300 hover:bg-white"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                            isAnswered ? "bg-primary text-white" : "bg-white text-neutral-500"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-neutral-900">
                              {question.question_text}
                            </p>
                            {isFlagged && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                                Ditandai
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                            {getAnswerPreview(question, answer)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <aside className="lg:sticky lg:top-5 lg:self-start">
              <div className="rounded-[28px] border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-neutral-950">Navigasi soal</h2>
                  <p className="mt-1 text-xs text-neutral-500">
                    Pilih nomor untuk kembali ke soal.
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {questions.map((question, index) => {
                    const isAnswered = isQuestionAnswered(question.question_id);
                    const isFlagged = isQuestionFlagged(question.question_id);

                    return (
                      <button
                        type="button"
                        key={question.question_id}
                        onClick={() => onNavigateToQuestion(index)}
                        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
                          isAnswered
                            ? "border-primary bg-primary text-white"
                            : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        {index + 1}
                        {isFlagged && (
                          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button
              variant="outline"
              size="lg"
              onClick={onBackToExam}
              className="flex-1 border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
            >
              Kembali ke Soal
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleFinishClick}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim Jawaban..." : "Selesaikan Ujian"}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmSubmitModal
        isOpen={showConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
