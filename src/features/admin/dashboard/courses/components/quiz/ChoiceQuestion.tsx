"use client";

import { Plus } from "lucide-react";
import { QuizOption, ChoiceQuestionProps, QuizDifficulty } from "./types";
import { QuizOptionItem } from "../material/QuizOptionItem";
import { ToggleSwitch } from "@/shared/components/ui";

export function ChoiceQuestion({
  id,
  difficulty,
  options,
  choiceType,
  onDifficultyChange,
  onOptionsChange,
  onChoiceTypeChange,
}: ChoiceQuestionProps) {
  const handleOptionChange = (optionId: string, text: string) => {
    const updatedOptions = options.map((opt) => (opt.id === optionId ? { ...opt, text } : opt));
    onOptionsChange(updatedOptions);
  };

  const handleToggleCorrect = (optionId: string) => {
    let updatedOptions: QuizOption[];

    if (choiceType === "multiple") {
      // Multiple choice: toggle the clicked option
      updatedOptions = options.map((opt) =>
        opt.id === optionId ? { ...opt, isCorrect: !opt.isCorrect } : opt
      );
    } else {
      // Single choice: only one can be correct
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

  const handleChoiceTypeToggle = () => {
    const newType = choiceType === "single" ? "multiple" : "single";
    onChoiceTypeChange(newType);
  };

  return (
    <div className="space-y-4">
      {/* Options Header */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">
            Pilihan Jawaban<span className="text-error">*</span>
          </span>
          <span className="text-neutral-gray">|</span>
        </div>

        {/* Choice Type Toggle */}
        <ToggleSwitch
          checked={choiceType === "multiple"}
          onChange={handleChoiceTypeToggle}
          label={choiceType === "multiple" ? "Multiple Choice" : "Single Choice"}
          size="sm"
        />

        {/* Difficulty Select */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-white">Kesulitan</span>
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

      {/* Helper text */}
      <p className="text-neutral-gray text-sm">
        {choiceType === "single"
          ? "Hanya satu jawaban yang benar"
          : "Lebih dari satu jawaban bisa benar"}
      </p>

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
            isMultipleAnswer={choiceType === "multiple"}
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
