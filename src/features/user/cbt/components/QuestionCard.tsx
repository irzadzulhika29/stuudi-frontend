"use client";

import { BaseQuestionCard } from "@/shared/components/questions/BaseQuestionCard";
import { SharedQuestion, QuestionType, QuestionAnswer } from "@/shared/types/questionTypes";
import { ExamQuestion } from "../types/examTypes";
import { hasMeaningfulAnswer } from "../utils/answerState";

interface QuestionCardProps {
  question: ExamQuestion;
  selectedAnswer: QuestionAnswer;
  onSelectAnswer: (answer: QuestionAnswer) => void;
  onClearAnswer: () => void;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  onClearAnswer,
}: QuestionCardProps) {
  const options = question.options ?? [];

  // Map ExamQuestion to SharedQuestion
  const sharedQuestion: SharedQuestion = {
    id: question.question_id,
    text: question.question_text,
    type: mapQuestionType(question.question_type),
    image: question.question_image,
    points: question.points,
    options: options.map((o) => ({
      id: o.option_id,
      text: o.option_text,
      sequence: o.sequence,
      side: o.side,
      matchingPair: o.matching_pair,
    })),
  };

  const hasAnswer = hasMeaningfulAnswer(selectedAnswer);

  return (
    <div className="flex flex-col gap-4">
      <BaseQuestionCard
        question={sharedQuestion}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={onSelectAnswer}
      />

      {hasAnswer && (
        <div className="flex justify-start">
          <button
            onClick={onClearAnswer}
            className="text-xs text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Reset Jawaban
          </button>
        </div>
      )}
    </div>
  );
}

function mapQuestionType(type: ExamQuestion["question_type"]): QuestionType {
  switch (type) {
    case "multiple":
      return "multiple";
    case "single":
      return "single";
    case "matching":
      return "matching";
    case "true_false":
      return "true_false";
    case "short_answer":
      return "short_answer";
    default:
      return "single";
  }
}
