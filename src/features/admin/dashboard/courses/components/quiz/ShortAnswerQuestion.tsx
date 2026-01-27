"use client";

import { ShortAnswerQuestionProps, QuizDifficulty } from "./types";
import { ToggleSwitch } from "@/shared/components/ui";

export function ShortAnswerQuestion({
  difficulty,
  expectedAnswer,
  caseSensitive,
  onDifficultyChange,
  onExpectedAnswerChange,
  onCaseSensitiveToggle,
}: ShortAnswerQuestionProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-primary text-sm font-medium">
            Jawaban yang Diharapkan<span className="text-error">*</span>
          </span>
          <span className="text-neutral-gray">|</span>
        </div>

        {/* Case Sensitive Toggle */}
        <ToggleSwitch
          checked={caseSensitive}
          onChange={onCaseSensitiveToggle}
          label="Case Sensitive"
          size="sm"
        />

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

      {/* Expected Answer Input */}
      <div className="space-y-2">
        <label className="text-neutral-dark text-sm">Masukkan jawaban yang benar:</label>
        <textarea
          value={expectedAnswer}
          onChange={(e) => onExpectedAnswerChange(e.target.value)}
          placeholder="Ketik jawaban yang diharapkan di sini..."
          className="bg-neutral-light border-neutral-gray/20 focus:border-primary focus:ring-primary/20 text-neutral-dark placeholder:text-neutral-gray/60 h-24 w-full resize-none rounded-lg border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
        />
        <p className="text-neutral-gray text-xs">
          {caseSensitive
            ? "Jawaban siswa harus sama persis dengan huruf besar/kecil"
            : "Jawaban siswa akan dibandingkan tanpa memperhatikan huruf besar/kecil"}
        </p>
      </div>
    </div>
  );
}
