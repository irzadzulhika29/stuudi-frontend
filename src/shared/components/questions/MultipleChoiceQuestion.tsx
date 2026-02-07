"use client";

import { QuestionRendererProps } from "@/shared/types/questionTypes";

export function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  disabled,
  isCorrect,
}: QuestionRendererProps) {
  // selectedAnswer for multiple choice should be an array of string (ids)
  const selectedIds = Array.isArray(selectedAnswer) ? selectedAnswer : [];

  const handleToggle = (optionId: string) => {
    if (disabled) return;

    if (selectedIds.includes(optionId)) {
      onSelectAnswer(selectedIds.filter((id) => id !== optionId));
    } else {
      onSelectAnswer([...selectedIds, optionId]);
    }
  };

  const getOptionStyles = (isSelected: boolean) => {
    // Result State (Feedback)
    if (isCorrect !== undefined && isSelected) {
      if (isCorrect) {
        return {
          container: "border-green-500 bg-green-50/50 shadow-sm",
          checkbox: "border-green-500 bg-green-500 text-white",
          text: "text-green-900 font-semibold",
        };
      } else {
        return {
          container: "border-red-500 bg-red-50/50 shadow-sm",
          checkbox: "border-red-500 bg-red-500 text-white",
          text: "text-red-900 font-semibold",
        };
      }
    }

    // Default Selection State
    if (isSelected) {
      return {
        container: "border-orange-500 bg-orange-50 shadow-md",
        checkbox: "border-orange-500 bg-orange-500 text-white",
        text: "text-orange-900",
      };
    }

    // Default Unselected State
    return {
      container: "border-neutral-200 hover:border-orange-200 hover:bg-neutral-50",
      checkbox: "border-neutral-300 text-neutral-400 group-hover:border-orange-300",
      text: "text-neutral-700",
    };
  };

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option) => {
        const isSelected = selectedIds.includes(option.id);
        const styles = getOptionStyles(isSelected);

        return (
          <label
            key={option.id}
            className={`group flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 ${
              disabled ? "cursor-default opacity-90" : "cursor-pointer hover:shadow-md"
            } ${styles.container}`}
          >
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name={`question-${question.id}`}
                value={option.id}
                checked={isSelected}
                onChange={() => handleToggle(option.id)}
                className="peer sr-only"
                disabled={disabled}
              />
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm font-semibold transition-all ${styles.checkbox}`}
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
            <span className={`text-base font-medium ${styles.text}`}>{option.text}</span>
          </label>
        );
      })}
    </div>
  );
}
