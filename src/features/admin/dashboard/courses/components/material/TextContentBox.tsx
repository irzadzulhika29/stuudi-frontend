"use client";

import { useState } from "react";
import { MaterialContentBox } from "./MaterialContentBox";

interface TextContentBoxProps {
  id: string;
  content: string;
  onChange: (id: string, content: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function TextContentBox({
  id,
  content,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: TextContentBoxProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <MaterialContentBox
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      <div className="space-y-2">
        <p className="text-sm text-white font-medium">
          Add text here
        </p>
        <div
          className={`relative rounded-lg border-2 transition-all duration-300 ${
            isFocused
              ? "border-white bg-primary/5"
              : "border-dashed border-neutral-gray/50"
          }`}
        >
          <textarea
            value={content}
            onChange={(e) => onChange(id, e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Tulis konten materi di sini..."
            className="w-full min-h-[120px] p-4 bg-transparent resize-none focus:outline-none text-white placeholder:text-white"
            rows={5}
          />
        </div>
      </div>
    </MaterialContentBox>
  );
}
