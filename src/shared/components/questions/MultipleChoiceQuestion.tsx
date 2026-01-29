"use client";

import { QuestionRendererProps } from "@/shared/types/questionTypes";

export function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
}: QuestionRendererProps) {
  // selectedAnswer for multiple choice should be an array of string (ids)
  const selectedIds = Array.isArray(selectedAnswer) ? selectedAnswer : [];

  const handleToggle = (optionId: string) => {
    if (selectedIds.includes(optionId)) {
      onSelectAnswer(selectedIds.filter((id) => id !== optionId));
    } else {
      onSelectAnswer([...selectedIds, optionId]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option) => {
        const isSelected = selectedIds.includes(option.id);
        return (
          <label
            key={option.id}
            className={`group flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
              isSelected
                ? "border-orange-500 bg-orange-50 shadow-md"
                : "border-neutral-200 hover:border-orange-200 hover:bg-neutral-50"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name={`question-${question.id}`}
                value={option.id}
                checked={isSelected}
                onChange={() => handleToggle(option.id)}
                className="peer sr-only"
              />
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm font-semibold transition-all ${
                  isSelected
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-neutral-300 text-neutral-400 group-hover:border-orange-300"
                }`}
              >
                {/* Standard checkmark icon or similar could go here */}
                {isSelected && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
            </div>
            <span
              className={`text-base font-medium ${
                isSelected ? "text-orange-900" : "text-neutral-700"
              }`}
            >
              {option.text}
            </span>
          </label>
        );
      })}
    </div>
  );
}
