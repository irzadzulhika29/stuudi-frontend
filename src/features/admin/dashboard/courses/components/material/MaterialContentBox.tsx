"use client";

import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { ReactNode } from "react";

interface MaterialContentBoxProps {
  children: ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  className?: string;
}

export function MaterialContentBox({
  children,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp = true,
  canMoveDown = true,
  className = "",
}: MaterialContentBoxProps) {
  return (
    <div
      className={`relative rounded-xl border-2 border-white shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* Action buttons on the left */}
      <div className="absolute left-3 top-3 flex flex-col gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="p-1 text-neutral-gray hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Pindah ke atas"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="p-1 text-neutral-gray hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Pindah ke bawah"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Main content */}
      <div className="pl-12 pr-4 py-4">{children}</div>

      {/* Delete button at bottom left */}
      <button
        type="button"
        onClick={onDelete}
        className="absolute left-3 bottom-3 p-2 text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg transition-all"
        title="Hapus"
      >
        <Trash2 className="text-white w-5 h-5" />
      </button>
    </div>
  );
}
