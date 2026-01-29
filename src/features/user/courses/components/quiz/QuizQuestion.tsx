"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle } from "lucide-react";
import { BaseQuestionCard } from "@/shared/components/questions/BaseQuestionCard";
import { QuestionAnswer, SharedQuestion } from "@/shared/types/questionTypes";

interface QuizQuestionProps {
  question: SharedQuestion;
  questionNumber: number;
  totalQuestions: number;
  elapsedTime: number;
  onSubmit: (selectedOption: QuestionAnswer) => void;
  showFeedback: boolean;
  selectedAnswer: QuestionAnswer;
  onNext: () => void;
  isLastQuestion: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  elapsedTime,
  onSubmit,
  showFeedback,
  selectedAnswer,
  onNext,
  isLastQuestion,
}: QuizQuestionProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const centisecs = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${Math.floor(secs).toString().padStart(2, "0")},${centisecs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (answer: QuestionAnswer) => {
    // In Quiz mode, maybe we want instant submit?
    // Current flow: Select -> (Button enabled) -> Submit -> Feedback -> Next
    // So we need local state if we want to "Select" before "Submit".
    // But QuizContainer handles "optimistic update" on submit? No, handleSubmitAnswer updates state.
    // BaseQuestionCard expects onSelectAnswer to update selection immediately.
    // If we pass `onSubmit` to `onSelectAnswer`, it submits immediately.
    // To keep "Select then Submit" flow, `QuizContainer` needs to handle "Selection" state separately from "Submitted Answer"?
    // OR we just use `onSubmit` as "Select" and modify `QuizContainer` to not call API immediately?

    // Actually `QuizContainer`'s `handleSubmitAnswer` calls API immediately.
    // If we want "Select then Submit button", we need to lift "Selection" state or keep it local here.
    // But `BaseQuestionCard` is controlled by `selectedAnswer`.

    // Let's assume for this Refactor that selecting an option updates the Parent State (Selection) but DOES NOT submit APi?
    // Refactor `QuizContainer`'s `handleSubmitAnswer` logic?
    // The current `QuizContainer` implementation calls API immediately in `handleSubmitAnswer`.
    // And the UI had a "Submit Answer" button.

    // Let's change the flow slightly to be more seamless or adapt `QuizContainer`.
    // Simplest: `onSelectAnswer` here calls a new prop `onSelect` (which updates local state in Container without API), and "Submit" button calls `onSubmit` (API).
    // But `QuizContainer` doesn't have `onSelect`.

    // Hack for now: We treat "Submit" as "Select" for UI purposes, but we only really "Lock in" when clicking Next?
    // No, `saveAnswer` IS the submission.

    // Okay, the previous `QuizQuestion` had local `selected` state.
    // I should do the same here.
    // local `currentSelection` state.

    // But `BaseQuestionCard` needs `selectedAnswer` prop.
    // I will use local state to feed `BaseQuestionCard`, then `onSubmit` sends it up.
    setCurrentSelection(answer);
  };

  const [currentSelection, setCurrentSelection] = useState<QuestionAnswer>(selectedAnswer);

  // Sync if prop changes (navigating)
  useEffect(() => {
    setCurrentSelection(selectedAnswer);
  }, [selectedAnswer, question.id]);

  const handleSubmit = () => {
    if (currentSelection !== null) {
      onSubmit(currentSelection);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white backdrop-blur-md">
            {questionNumber}
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-medium tracking-wider text-white/60 uppercase">
              Question
            </span>
            <span className="font-semibold text-white">
              {questionNumber} / {totalQuestions}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md">
          <Clock size={18} className="text-orange-300" />
          <span className="font-mono text-xl font-bold tracking-widest text-white">
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-1 shadow-2xl shadow-black/20">
        <BaseQuestionCard
          question={question}
          selectedAnswer={currentSelection} // Local selection
          onSelectAnswer={handleSelectAnswer}
          disabled={showFeedback} // Disable interaction if showing feedback
          className="h-auto min-h-[400px] border-none shadow-none"
        />
      </div>

      <div className="mt-8 flex justify-end">
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={!currentSelection && currentSelection !== 0} // Check if selected
            className={`transform rounded-xl px-8 py-4 text-lg font-bold transition-all active:scale-95 ${
              currentSelection || currentSelection === 0
                ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg hover:shadow-orange-500/30"
                : "cursor-not-allowed border border-white/10 bg-white/10 text-white/40"
            }`}
          >
            Jawab Pertanyaan
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-neutral-900 shadow-lg transition-all hover:bg-neutral-100"
          >
            {isLastQuestion ? "Selesai & Lihat Hasil" : "Pertanyaan Selanjutnya"}
            <CheckCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
