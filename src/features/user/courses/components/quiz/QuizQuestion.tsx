"use client";

import { useState, useEffect } from "react";
import { PauseCircle } from "lucide-react";
import { BaseQuestionCard } from "@/shared/components/questions/BaseQuestionCard";
import { QuestionAnswer, SharedQuestion } from "@/shared/types/questionTypes";
import Button from "@/shared/components/ui/Button";

import { TimerDisplay } from "./TimerDisplay";

interface QuizQuestionProps {
  question: SharedQuestion;
  questionNumber: number;
  totalQuestions: number;
  startTime: number;
  onSubmit: (selectedOption: QuestionAnswer) => void;
  showFeedback: boolean;
  selectedAnswer: QuestionAnswer;
  onNext: () => void;
  onPause?: () => void;
  isLastQuestion: boolean;
  isCorrect?: boolean;
  correctAnswerId?: string;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  startTime,
  onSubmit,
  showFeedback,
  selectedAnswer,
  onNext,
  onPause,
  isLastQuestion,
  isCorrect,
  correctAnswerId,
}: QuizQuestionProps) {
  const handleSelectAnswer = (answer: QuestionAnswer) => {
    // ... logic remains same
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
          {onPause && (
            <button
              onClick={onPause}
              className="ml-2 flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/20 hover:text-white"
            >
              <PauseCircle size={14} />
              Kembali
            </button>
          )}
        </div>

        <TimerDisplay startTime={startTime} />
      </div>

      <div className="rounded-3xl bg-white p-1 shadow-2xl shadow-black/20">
        <BaseQuestionCard
          question={question}
          selectedAnswer={currentSelection} // Local selection
          onSelectAnswer={handleSelectAnswer}
          disabled={showFeedback} // Disable interaction if showing feedback
          isCorrect={isCorrect}
          correctAnswerId={correctAnswerId}
          className="h-auto min-h-[400px] border-none shadow-none"
        />
      </div>

      <div className="mt-8 flex justify-end">
        {!showFeedback ? (
          <Button
            onClick={handleSubmit}
            disabled={!currentSelection && currentSelection !== 0}
            variant="secondary"
            size="lg"
            className="w-full text-lg font-bold shadow-xl md:w-auto"
          >
            Jawab Pertanyaan
          </Button>
        ) : (
          <div className="flex w-full items-center justify-end">
            <Button
              onClick={onNext}
              variant={isLastQuestion ? "primary" : "secondary"} // Solid button
              className="flex"
            >
              {isLastQuestion ? "Selesai" : "Lanjut"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
