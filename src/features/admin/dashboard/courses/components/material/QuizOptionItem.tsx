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
  // id, // eslint-disable-line @typescript-eslint/no-unused-vars
  optionId,
  text,
  isCorrect,
  onChange,
  onToggleCorrect,
  onDelete,
  isMultipleAnswer,
}: QuizOptionItemProps) {
  return (
    <div className="bg-neutral-light border-neutral-gray/20 hover:border-primary/30 group flex items-center gap-3 rounded-lg border p-3 transition-all">
      {/* Checkbox/Radio for correct answer */}
      <button
        type="button"
        onClick={() => onToggleCorrect(optionId)}
        className={`flex h-5 w-5 items-center justify-center border-2 transition-all ${
          isMultipleAnswer ? "rounded" : "rounded-full"
        } ${
          isCorrect
            ? "bg-primary border-primary"
            : "border-neutral-gray/50 hover:border-primary/50 bg-white"
        }`}
      >
        {isCorrect && (
          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Option text input */}
      <input
        type="text"
        value={text}
        onChange={(e) => onChange(optionId, e.target.value)}
        placeholder="Dengan saya mengetahui yang saya ketahui."
        className="text-neutral-dark flex-1 bg-transparent text-sm placeholder:text-black focus:outline-none"
      />

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onDelete(optionId)}
        className="text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg p-1.5 opacity-0 transition-all group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
