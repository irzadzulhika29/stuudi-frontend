"use client";

import { TrueFalseQuestionProps } from "./types";

export function TrueFalseQuestion({
  id,
  question,
  points,
  isRequired,
  correctAnswer,
  onQuestionChange,
  onPointsChange,
  onCorrectAnswerChange,
}: TrueFalseQuestionProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">
            Pilih Jawaban Benar<span className="text-error">*</span>
          </span>
          <span className="text-neutral-gray">|</span>
        </div>

        {/* Points Input */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-dark">Atur poin</span>
          <input
            type="number"
            value={points}
            onChange={(e) => onPointsChange(parseInt(e.target.value) || 0)}
            className="w-16 px-3 py-1.5 border border-neutral-gray/30 rounded-lg focus:outline-none focus:border-primary text-sm text-center"
            min={0}
          />
        </div>
      </div>

      {/* True/False Options */}
      <div className="flex gap-4">
        {/* True Option */}
        <button
          type="button"
          onClick={() => onCorrectAnswerChange(true)}
          className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
            correctAnswer
              ? "border-primary bg-primary/10"
              : "border-neutral-gray/20 hover:border-primary/50"
          }`}
        >
          <div
            className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all ${
              correctAnswer
                ? "bg-primary border-primary"
                : "bg-white border-neutral-gray/50"
            }`}
          >
            {correctAnswer && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span
            className={`font-medium ${correctAnswer ? "text-primary" : "text-neutral-dark"}`}
          >
            Benar (True)
          </span>
        </button>

        {/* False Option */}
        <button
          type="button"
          onClick={() => onCorrectAnswerChange(false)}
          className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
            !correctAnswer
              ? "border-primary bg-primary/10"
              : "border-neutral-gray/20 hover:border-primary/50"
          }`}
        >
          <div
            className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all ${
              !correctAnswer
                ? "bg-primary border-primary"
                : "bg-white border-neutral-gray/50"
            }`}
          >
            {!correctAnswer && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span
            className={`font-medium ${!correctAnswer ? "text-primary" : "text-neutral-dark"}`}
          >
            Salah (False)
          </span>
        </button>
      </div>
    </div>
  );
}
