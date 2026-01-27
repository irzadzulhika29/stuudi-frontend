"use client";

import { Plus } from "lucide-react";
import { QuizOption, MultipleChoiceQuestionProps, QuizDifficulty } from "./types";
import { QuizOptionItem } from "../material/QuizOptionItem";
import { ToggleSwitch } from "@/shared/components/ui";

export function MultipleChoiceQuestion({
  id,
  difficulty,
  options,
  isMultipleAnswer,
  onDifficultyChange,
  onOptionsChange,
  onMultipleAnswerToggle,
}: MultipleChoiceQuestionProps) {
  const handleOptionChange = (optionId: string, text: string) => {
    const updatedOptions = options.map((opt) => (opt.id === optionId ? { ...opt, text } : opt));
    onOptionsChange(updatedOptions);
  };

  const handleToggleCorrect = (optionId: string) => {
    let updatedOptions: QuizOption[];
    if (isMultipleAnswer) {
      updatedOptions = options.map((opt) =>
        opt.id === optionId ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );
    } else {
      updatedOptions = options.map((opt) => ({
        ...opt,
        isCorrect: opt.id === optionId,
      }));
    }
    onOptionsChange(updatedOptions);
  };

  const handleDeleteOption = (optionId: string) => {
    const updatedOptions = options.filter((opt) => opt.id !== optionId);
    onOptionsChange(updatedOptions);
  };

  const handleAddOption = () => {
    const newOption: QuizOption = {
      id: `option-${Date.now()}`,
      text: "",
      isCorrect: false,
    };
    onOptionsChange([...options, newOption]);
  };

  return (
    <div className="space-y-4">
      {/* Options Header */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-primary text-sm font-medium">
            Pilihan Jawaban<span className="text-error">*</span>
          </span>
          <span className="text-neutral-gray">|</span>
        </div>

        {/* Multiple Answer Toggle */}
        <ToggleSwitch
          checked={isMultipleAnswer}
          onChange={onMultipleAnswerToggle}
          label="Multiple Answer"
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

      {/* Options List */}
      <div className="space-y-2">
        {options.map((option) => (
          <QuizOptionItem
            key={option.id}
            id={id}
            optionId={option.id}
            text={option.text}
            isCorrect={option.isCorrect}
            onChange={handleOptionChange}
            onToggleCorrect={handleToggleCorrect}
            onDelete={handleDeleteOption}
            isMultipleAnswer={isMultipleAnswer}
          />
        ))}
      </div>

      {/* Add Option Button */}
      <button
        type="button"
        onClick={handleAddOption}
        className="border-neutral-gray/40 hover:border-primary hover:bg-primary/5 text-neutral-gray hover:text-primary flex items-center gap-2 rounded-lg border border-dashed px-4 py-2 text-sm transition-all"
      >
        <Plus className="h-4 w-4" />
        <span>Tambahkan jawaban</span>
      </button>
    </div>
  );
}
