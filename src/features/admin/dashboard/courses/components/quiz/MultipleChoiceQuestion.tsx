"use client";

import { Plus } from "lucide-react";
import { QuizOption, MultipleChoiceQuestionProps } from "./types";
import { QuizOptionItem } from "../material/QuizOptionItem";
import { ToggleSwitch } from "@/shared/components/ui";

export function MultipleChoiceQuestion({
  id,
  question,
  points,
  isRequired,
  options,
  isMultipleAnswer,
  onQuestionChange,
  onPointsChange,
  onOptionsChange,
  onMultipleAnswerToggle,
}: MultipleChoiceQuestionProps) {
  const handleOptionChange = (optionId: string, text: string) => {
    const updatedOptions = options.map((opt) =>
      opt.id === optionId ? { ...opt, text } : opt,
    );
    onOptionsChange(updatedOptions);
  };

  const handleToggleCorrect = (optionId: string) => {
    let updatedOptions: QuizOption[];
    if (isMultipleAnswer) {
      updatedOptions = options.map((opt) =>
        opt.id === optionId ? { ...opt, isCorrect: !opt.isCorrect } : opt,
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
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">
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
        className="flex items-center gap-2 px-4 py-2 border border-dashed border-neutral-gray/40 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-sm text-neutral-gray hover:text-primary"
      >
        <Plus className="w-4 h-4" />
        <span>Tambahkan jawaban</span>
      </button>
    </div>
  );
}
