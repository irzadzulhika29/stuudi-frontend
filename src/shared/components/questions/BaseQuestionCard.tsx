"use client";

import Image from "next/image";
import { SharedQuestion, QuestionRendererProps } from "@/shared/types/questionTypes";
import { SingleChoiceQuestion } from "./SingleChoiceQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { MatchingQuestion } from "./MatchingQuestion";

interface BaseQuestionCardProps extends QuestionRendererProps {
  className?: string; // Additional styling
}

export function BaseQuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  className = "",
  disabled,
  isCorrect,
}: BaseQuestionCardProps) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ${className}`}
    >
      {question.image && (
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-neutral-100">
          <Image
            src={question.image}
            alt="Question image"
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-y-auto p-6">
        <p className="mb-6 text-lg leading-relaxed font-medium text-neutral-800 md:text-xl">
          {question.text}
        </p>

        <div className="flex-1">
          {renderQuestionContent({ question, selectedAnswer, onSelectAnswer, disabled, isCorrect })}
        </div>
      </div>
    </div>
  );
}

function renderQuestionContent(props: QuestionRendererProps) {
  switch (props.question.type) {
    case "single":
    case "true_false":
      return <SingleChoiceQuestion {...props} />;
    case "multiple":
      return <MultipleChoiceQuestion {...props} />;
    case "matching":
      return <MatchingQuestion {...props} />;
    case "short_answer":
      return (
        <div className="rounded-lg border border-dashed p-4">
          Short Answer Component Placeholder
        </div>
      ); // TODO: Implement
    default:
      return (
        <div className="text-red-500">
          Unknown Question Type: {(props.question as SharedQuestion).type}
        </div>
      );
  }
}
