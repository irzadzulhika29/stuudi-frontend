"use client";

import { QuestionRendererProps } from "@/shared/types/questionTypes";
import { useState } from "react";

export function MatchingQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
}: QuestionRendererProps) {
  // selectedAnswer is Record<string, string> (LeftID -> RightID)
  const currentAnswers: Record<string, string> =
    selectedAnswer && typeof selectedAnswer === "object" && !Array.isArray(selectedAnswer)
      ? (selectedAnswer as Record<string, string>)
      : {};

  const leftOptions = question.options
    .filter((o) => o.side === "left")
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

  const rightOptions = question.options.filter((o) => o.side === "right");

  const [activeLeftId, setActiveLeftId] = useState<string | null>(null);
  const [draggedRightId, setDraggedRightId] = useState<string | null>(null);
  const [dragOverLeftId, setDragOverLeftId] = useState<string | null>(null);

  // --- Click Handlers ---
  const handleLeftClick = (id: string) => {
    setActiveLeftId(id === activeLeftId ? null : id);
  };

  const handleRightClick = (rightId: string) => {
    if (activeLeftId) {
      handleMatch(activeLeftId, rightId);
      setActiveLeftId(null);
    }
  };

  const handleMatch = (leftId: string, rightId: string) => {
    const newAnswer: Record<string, string> = { ...currentAnswers, [leftId]: rightId };
    onSelectAnswer(newAnswer);
  };

  const handleUnmatch = (leftId: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent triggering parent click
    const newAnswer: Record<string, string> = { ...currentAnswers };
    delete newAnswer[leftId];
    onSelectAnswer(newAnswer);
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "copyMove";
    setDraggedRightId(id);
  };

  const handleDragEnd = () => {
    setDraggedRightId(null);
    setDragOverLeftId(null);
  };

  const handleDragOver = (e: React.DragEvent, leftId: string) => {
    e.preventDefault(); // Necessary to allow dropping
    // Only visual feedback if we have a valid drag
    if (draggedRightId) {
      setDragOverLeftId(leftId);
    }
  };

  const handleDragLeave = () => {
    setDragOverLeftId(null);
  };

  const handleDrop = (e: React.DragEvent, leftId: string) => {
    e.preventDefault();
    const rightId = e.dataTransfer.getData("text/plain");
    if (rightId) {
      handleMatch(leftId, rightId);
    }
    setDraggedRightId(null);
    setDragOverLeftId(null);
  };

  const usedRightIds = new Set(Object.values(currentAnswers) as string[]);

  return (
    <div className="grid h-full grid-cols-1 gap-8 md:grid-cols-2">
      {/* Left Column (Clues/Questions) */}
      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
          Pertanyaan
        </h4>
        {leftOptions.map((opt) => {
          const isPaired = !!currentAnswers[opt.id];
          const isActive = activeLeftId === opt.id;
          const isDragOver = dragOverLeftId === opt.id;
          const pairedRightId = currentAnswers[opt.id];
          const pairedRightOption = pairedRightId
            ? rightOptions.find((r) => r.id === pairedRightId)
            : null;

          return (
            <div
              key={opt.id}
              onClick={() => handleLeftClick(opt.id)}
              onDragOver={(e) => handleDragOver(e, opt.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, opt.id)}
              className={`relative flex cursor-pointer flex-col justify-center rounded-xl border-2 p-4 transition-all duration-200 ${
                isActive || isDragOver
                  ? "border-orange-500 bg-orange-50 shadow-md ring-2 ring-orange-200"
                  : ""
              } ${!isActive && !isDragOver && isPaired ? "border-orange-200 bg-orange-50/30" : ""} ${
                !isActive && !isDragOver && !isPaired
                  ? "border-neutral-200 hover:border-orange-300 hover:bg-neutral-50"
                  : ""
              } `}
            >
              <span className="font-medium text-neutral-800">{opt.text}</span>

              {/* Paired Item Display (Droppable Zone Feedback) */}
              {isPaired && pairedRightOption && (
                <div className="group/item mt-3 flex items-center justify-between gap-2 rounded-r-lg border border-l-4 border-neutral-200 border-l-orange-500 bg-white p-3 text-sm font-medium text-neutral-700 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span>{pairedRightOption.text}</span>
                  </div>
                  <button
                    onClick={(e) => handleUnmatch(opt.id, e)}
                    className="rounded-md p-1.5 text-neutral-400 opacity-60 transition-all group-hover/item:opacity-100 hover:bg-red-50 hover:text-red-500"
                    title="Remove match"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}

              {/* Indicator / Target Icon */}
              {!isPaired && (
                <div
                  className={`pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-300 ${isDragOver ? "scale-110 text-orange-500" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Column (Options/Answers) */}
      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
          Pilihan Jawaban
        </h4>
        <div className="space-y-3">
          {rightOptions.map((opt) => {
            const isUsed = usedRightIds.has(opt.id);

            // We still show the item even if used, but maybe faded or stylized to show it's "moved"

            return (
              <div
                key={opt.id}
                draggable={!isUsed} // Only draggable if not used? Or allow dragging even if used to re-assign? Let's say drag from source is disabled if used.
                onDragStart={(e) => handleDragStart(e, opt.id)}
                onDragEnd={handleDragEnd}
                onClick={() => !isUsed && handleRightClick(opt.id)}
                className={`relative flex w-full items-center rounded-xl border-2 p-4 text-left transition-all select-none ${
                  isUsed
                    ? "border-neutral-100 bg-neutral-50 opacity-60 grayscale"
                    : "cursor-grab border-neutral-200 bg-white hover:border-orange-300 hover:shadow-md active:cursor-grabbing"
                } ${
                  activeLeftId && !isUsed
                    ? "animate-pulse border-orange-300 ring-2 ring-orange-100"
                    : ""
                } ${draggedRightId === opt.id ? "border-dashed border-orange-400 opacity-30" : ""} `}
              >
                {/* Drag Handle Icon */}
                <div className="mr-3 text-neutral-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="12" r="1"></circle>
                    <circle cx="9" cy="5" r="1"></circle>
                    <circle cx="9" cy="19" r="1"></circle>
                    <circle cx="15" cy="12" r="1"></circle>
                    <circle cx="15" cy="5" r="1"></circle>
                    <circle cx="15" cy="19" r="1"></circle>
                  </svg>
                </div>

                <span className={`font-medium ${isUsed ? "text-neutral-500" : "text-neutral-800"}`}>
                  {opt.text}
                </span>

                {isUsed && (
                  <div className="ml-auto rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                    Terpasang
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-xs text-neutral-400">
          Geser jawaban ke pertanyaan yang sesuai atau klik untuk memilih.
        </p>
      </div>
    </div>
  );
}
