"use client";

import { QuestionRendererProps } from "@/shared/types/questionTypes";

export function SingleChoiceQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
}: QuestionRendererProps) {
  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option) => (
        <label
          key={option.id}
          className={`group flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
            selectedAnswer === option.id
              ? "border-orange-500 bg-orange-50 shadow-md"
              : "border-neutral-200 hover:border-orange-200 hover:bg-neutral-50"
          }`}
        >
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => onSelectAnswer(option.id)}
              className="peer sr-only"
            />
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${
                selectedAnswer === option.id
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-neutral-300 text-neutral-400 group-hover:border-orange-300"
              }`}
            >
              {option.sequence ? String.fromCharCode(65 + option.sequence - 1) : ""}
            </div>
          </div>
          <span
            className={`text-base font-medium ${
              selectedAnswer === option.id ? "text-orange-900" : "text-neutral-700"
            }`}
          >
            {option.text}
          </span>
        </label>
      ))}
    </div>
  );
}
