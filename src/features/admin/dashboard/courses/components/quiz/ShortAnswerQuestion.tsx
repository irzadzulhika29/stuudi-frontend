"use client";

import { ShortAnswerQuestionProps } from "./types";
import { ToggleSwitch } from "@/shared/components/ui";

export function ShortAnswerQuestion({
  id,
  question,
  points,
  isRequired,
  expectedAnswer,
  caseSensitive,
  onQuestionChange,
  onPointsChange,
  onExpectedAnswerChange,
  onCaseSensitiveToggle,
}: ShortAnswerQuestionProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">
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

      {/* Expected Answer Input */}
      <div className="space-y-2">
        <label className="text-sm text-neutral-dark">
          Masukkan jawaban yang benar:
        </label>
        <textarea
          value={expectedAnswer}
          onChange={(e) => onExpectedAnswerChange(e.target.value)}
          placeholder="Ketik jawaban yang diharapkan di sini..."
          className="w-full px-4 py-3 bg-neutral-light border border-neutral-gray/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-neutral-dark placeholder:text-neutral-gray/60 transition-all resize-none h-24"
        />
        <p className="text-xs text-neutral-gray">
          {caseSensitive
            ? "Jawaban siswa harus sama persis dengan huruf besar/kecil"
            : "Jawaban siswa akan dibandingkan tanpa memperhatikan huruf besar/kecil"}
        </p>
      </div>
    </div>
  );
}
