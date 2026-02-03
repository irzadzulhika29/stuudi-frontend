"use client";

import { QuestionRendererProps } from "@/shared/types/questionTypes";

export function SingleChoiceQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  disabled,
  isCorrect,
  correctAnswerId,
}: QuestionRendererProps) {
  const getOptionStyles = (optionId: string) => {
    const isSelected = selectedAnswer === optionId;
    const isThisCorrect = correctAnswerId === optionId;

    if (disabled) {
      if (isSelected) {
        return isCorrect
          ? "border-green-500 bg-green-50 shadow-md"
          : "border-red-500 bg-red-50 shadow-md";
      }
      if (isThisCorrect) {
        return "border-green-500 bg-green-50 shadow-md";
      }
    }

    if (isSelected) {
      return "border-orange-500 bg-orange-50 shadow-md";
    }

    return disabled
      ? "border-neutral-200 opacity-60 cursor-not-allowed"
      : "border-neutral-200 hover:border-orange-200 hover:bg-neutral-50";
  };

  const getCircleStyles = (optionId: string) => {
    const isSelected = selectedAnswer === optionId;
    const isThisCorrect = correctAnswerId === optionId;

    if (disabled) {
      if (isSelected) {
        return isCorrect
          ? "border-green-500 bg-green-500 text-white"
          : "border-red-500 bg-red-500 text-white";
      }
      if (isThisCorrect) {
        return "border-green-500 bg-green-500 text-white";
      }
    }

    if (isSelected) {
      return "border-orange-500 bg-orange-500 text-white";
    }

    return "border-neutral-300 text-neutral-400 group-hover:border-orange-300";
  };

  const getTextStyles = (optionId: string) => {
    const isSelected = selectedAnswer === optionId;
    const isThisCorrect = correctAnswerId === optionId;

    if (disabled) {
      if (isSelected) {
        return isCorrect ? "text-green-900" : "text-red-900";
      }
      if (isThisCorrect) {
        return "text-green-900";
      }
    }

    if (isSelected) {
      return "text-orange-900";
    }

    return "text-neutral-700";
  };

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option) => (
        <label
          key={option.id}
          className={`group flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${getOptionStyles(
            option.id
          )}`}
          onClick={(e) => disabled && e.preventDefault()}
        >
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => !disabled && onSelectAnswer(option.id)}
              disabled={disabled}
              className="peer sr-only"
            />
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${getCircleStyles(
                option.id
              )}`}
            >
              {option.sequence ? String.fromCharCode(65 + option.sequence - 1) : ""}
            </div>
          </div>
          <span className={`text-base font-medium ${getTextStyles(option.id)}`}>{option.text}</span>
        </label>
      ))}
    </div>
  );
}
