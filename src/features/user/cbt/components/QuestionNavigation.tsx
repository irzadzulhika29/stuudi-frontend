"use client";

import { Flag } from "lucide-react";
import Button from "@/shared/components/ui/Button";

interface QuestionNavigationProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<number, string>;
  flaggedQuestions: Set<number>;
  isFlagged: boolean;
  onNavigate: (index: number) => void;
  onToggleFlag: () => void;
  onFinishAttempt: () => void;
}

export function QuestionNavigation({
  totalQuestions,
  currentIndex,
  answers,
  flaggedQuestions,
  isFlagged,
  onNavigate,
  onToggleFlag,
  onFinishAttempt,
}: QuestionNavigationProps) {
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const getStatusStyles = (index: number): string => {
    const questionId = index + 1;
    const isAnswered = answers[questionId] !== undefined;
    const isCurrent = index === currentIndex;

    if (isCurrent) return "bg-secondary text-white ring-2 ring-primary/20";
    if (isAnswered) return "bg-primary text-white";
    return "bg-white text-primary";
  };

  return (
    <div className="max-w-max rounded-2xl bg-white/10 p-4 backdrop-blur-md">
      <h3 className="mb-4 text-sm font-semibold text-white">Navigasi soal</h3>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const questionId = index + 1;
          const isQuestionFlagged = flaggedQuestions.has(questionId);

          return (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-110 ${getStatusStyles(index)}`}
            >
              {index + 1}
              {isQuestionFlagged && (
                <Flag size={10} className="fill-error text-error absolute right-0.5 bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Button
          variant={isFlagged ? "primary" : "outline"}
          size="sm"
          onClick={onToggleFlag}
          icon={<Flag size={16} />}
          iconPosition="left"
          className={`w-full ${isFlagged ? "bg-amber-500! hover:bg-amber-600!" : "border-white/30! text-white! hover:bg-white/10!"}`}
        >
          {isFlagged ? "Hapus Tandai" : "Tandai Soal"}
        </Button>

        {isLastQuestion && (
          <button
            onClick={onFinishAttempt}
            className="w-full rounded-xl bg-white/10 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/20"
          >
            Selesai ({answeredCount}/{totalQuestions})
          </button>
        )}
      </div>
    </div>
  );
}
