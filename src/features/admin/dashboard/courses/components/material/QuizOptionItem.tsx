"use client";

import { Trash2 } from "lucide-react";

interface QuizOptionItemProps {
  id: string;
  optionId: string;
  text: string;
  isCorrect: boolean;
  onChange: (optionId: string, text: string) => void;
  onToggleCorrect: (optionId: string) => void;
  onDelete: (optionId: string) => void;
  isMultipleAnswer: boolean;
}

export function QuizOptionItem({
  id,
  optionId,
  text,
  isCorrect,
  onChange,
  onToggleCorrect,
  onDelete,
  isMultipleAnswer,
}: QuizOptionItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-light rounded-lg border border-neutral-gray/20 hover:border-primary/30 transition-all group">
      {/* Checkbox/Radio for correct answer */}
      <button
        type="button"
        onClick={() => onToggleCorrect(optionId)}
        className={`w-5 h-5 flex items-center justify-center border-2 transition-all ${
          isMultipleAnswer ? "rounded" : "rounded-full"
        } ${
          isCorrect
            ? "bg-primary border-primary"
            : "bg-white border-neutral-gray/50 hover:border-primary/50"
        }`}
      >
        {isCorrect && (
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
      </button>

      {/* Option text input */}
      <input
        type="text"
        value={text}
        onChange={(e) => onChange(optionId, e.target.value)}
        placeholder="Dengan saya mengetahui yang saya ketahui."
        className="flex-1 bg-transparent focus:outline-none text-neutral-dark placeholder:text-black text-sm"
      />

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onDelete(optionId)}
        className="p-1.5 text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
