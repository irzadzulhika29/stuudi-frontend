"use client";

import React, { memo } from "react";
import { ExamQuestion } from "../types/examTypes";
import { Flag } from "lucide-react";
import { countAnsweredQuestions, hasMeaningfulAnswer } from "../utils/answerState";
import { QuestionAnswer } from "@/shared/types/questionTypes";

interface QuestionNavigationProps {
  questions: ExamQuestion[];
  currentIndex: number;
  answers: Record<string, QuestionAnswer>;
  flaggedQuestions: Set<string>;
  isFlagged: boolean;
  onNavigate: (index: number) => void;
  onToggleFlag: () => void;
}

export const QuestionNavigation = memo(function QuestionNavigation({
  questions,
  currentIndex,
  answers,
  flaggedQuestions,
  isFlagged,
  onNavigate,
  onToggleFlag,
}: QuestionNavigationProps) {
  const answeredCount = countAnsweredQuestions(answers);

  const getStatusStyles = (questionId: string, index: number): string => {
    const isAnswered = hasMeaningfulAnswer(answers[questionId]);
    const isCurrent = index === currentIndex;

    if (isCurrent && isAnswered) {
      return "bg-primary text-white ring-2 ring-orange-300 shadow-sm";
    }

    if (isCurrent) {
      return "bg-white text-neutral-900 ring-2 ring-orange-400 shadow-sm";
    }

    if (isAnswered) {
      return "bg-primary text-white hover:bg-primary/90";
    }

    return "bg-neutral-100 text-neutral-600 hover:bg-neutral-200";
  };

  return (
    <div className="w-full rounded-[24px] border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-neutral-950">Navigasi soal</h3>
          <p className="mt-1 text-sm text-neutral-500">
            {answeredCount}/{questions.length} soal terjawab
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleFlag}
          title={isFlagged ? "Batalkan tanda soal" : "Tandai soal"}
          aria-label={isFlagged ? "Batalkan tanda soal" : "Tandai soal"}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
            isFlagged
              ? "border-amber-400/40 bg-amber-500/20 text-amber-200"
              : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
          }`}
        >
          <Flag size={15} className={isFlagged ? "fill-current" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2.5">
        {questions.map((question, index) => {
          const questionId = question.question_id;
          const isQuestionFlagged = flaggedQuestions.has(questionId);

          return (
            <button
              type="button"
              key={questionId}
              onClick={() => onNavigate(index)}
              className={`relative flex h-11 w-full items-center justify-center rounded-xl border border-neutral-200 text-sm font-semibold transition-colors ${getStatusStyles(questionId, index)}`}
            >
              {index + 1}
              {isQuestionFlagged && (
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});
