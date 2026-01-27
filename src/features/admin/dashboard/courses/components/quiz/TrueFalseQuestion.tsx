"use client";

import { TrueFalseQuestionProps, QuizDifficulty } from "./types";

export function TrueFalseQuestion({
  difficulty,
  correctAnswer,
  onDifficultyChange,
  onCorrectAnswerChange,
}: TrueFalseQuestionProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-primary text-sm font-medium">
            Pilih Jawaban Benar<span className="text-error">*</span>
          </span>
          <span className="text-neutral-gray">|</span>
        </div>

        {/* Difficulty Select */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-dark text-sm">Kesulitan</span>
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as QuizDifficulty)}
            className="border-neutral-gray/30 focus:border-primary text-neutral-dark rounded-lg border bg-white px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* True/False Options */}
      <div className="flex gap-4">
        {/* True Option */}
        <button
          type="button"
          onClick={() => onCorrectAnswerChange(true)}
          className={`flex flex-1 items-center gap-3 rounded-lg border-2 p-4 transition-all ${
            correctAnswer
              ? "border-primary bg-primary/10"
              : "border-neutral-gray/20 hover:border-primary/50"
          }`}
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
              correctAnswer ? "bg-primary border-primary" : "border-neutral-gray/50 bg-white"
            }`}
          >
            {correctAnswer && (
              <svg
                className="h-3 w-3 text-white"
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
          <span className={`font-medium ${correctAnswer ? "text-primary" : "text-neutral-dark"}`}>
            Benar (True)
          </span>
        </button>

        {/* False Option */}
        <button
          type="button"
          onClick={() => onCorrectAnswerChange(false)}
          className={`flex flex-1 items-center gap-3 rounded-lg border-2 p-4 transition-all ${
            !correctAnswer
              ? "border-primary bg-primary/10"
              : "border-neutral-gray/20 hover:border-primary/50"
          }`}
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
              !correctAnswer ? "bg-primary border-primary" : "border-neutral-gray/50 bg-white"
            }`}
          >
            {!correctAnswer && (
              <svg
                className="h-3 w-3 text-white"
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
          <span className={`font-medium ${!correctAnswer ? "text-primary" : "text-neutral-dark"}`}>
            Salah (False)
          </span>
        </button>
      </div>
    </div>
  );
}
