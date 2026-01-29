"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";

interface CompletionButtonProps {
  isCompleted: boolean;
  isLoading: boolean;
  onToggle: () => void;
  className?: string;
  size?: "default" | "sm";
}

export function CompletionButton({
  isCompleted,
  isLoading,
  onToggle,
  className = "",
  size = "default",
}: CompletionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Helper to join classes handling conditionals
  const cn = (...classes: (string | boolean | undefined | null)[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const isSmall = size === "sm";
  const iconSize = isSmall ? 14 : 18;

  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex items-center justify-center gap-2 overflow-hidden font-semibold transition-all duration-300 active:scale-[0.98]",
        // Size variants
        size === "default" && "w-full rounded-full border p-4 text-sm",
        size === "sm" && "w-auto min-w-[140px] rounded-full border px-4 py-2 text-xs",
        // Default / Incomplete state
        !isCompleted &&
          "border-transparent bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-500/30",
        // Completed state
        isCompleted &&
          "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20",
        // Hover state when completed (Danger/Undo)
        isCompleted && isHovered && "border-rose-500! bg-rose-500! shadow-rose-500/20!",
        // Loading state
        isLoading && "cursor-not-allowed opacity-80",
        className
      )}
    >
      {/* Loading Spinner */}
      {isLoading && <Loader2 className="animate-spin" size={iconSize} />}

      {/* Content wrapper for transitions */}
      <div className="relative flex items-center justify-center gap-2">
        {!isLoading && (
          <>
            {/* INCOMPLETE STATE */}
            {!isCompleted && <span>Tandai Selesai</span>}

            {/* COMPLETED STATE */}
            {isCompleted && (
              <>
                {/* Check Icon (Visible when NOT hovered) */}
                <div
                  className={cn(
                    "flex items-center gap-2 transition-all duration-200",
                    isHovered ? "absolute translate-y-8 opacity-0" : "translate-y-0 opacity-100"
                  )}
                >
                  <Check size={iconSize} strokeWidth={3} />
                  <span>Selesai!</span>
                </div>

                {/* X Icon / Undo (Visible when HOVERED) */}
                <div
                  className={cn(
                    "flex items-center gap-2 transition-all duration-200",
                    isHovered ? "translate-y-0 opacity-100" : "absolute -translate-y-8 opacity-0"
                  )}
                >
                  <X size={iconSize} strokeWidth={3} />
                  <span>Batalkan?</span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </button>
  );
}
