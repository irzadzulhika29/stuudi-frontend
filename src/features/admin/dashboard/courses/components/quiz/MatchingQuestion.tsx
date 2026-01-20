"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { MatchingPair, MatchingQuestionProps } from "./types";

export function MatchingQuestion({
  id,
  question,
  points,
  isRequired,
  pairs,
  onQuestionChange,
  onPointsChange,
  onPairsChange,
}: MatchingQuestionProps) {
  const handlePairChange = (
    pairId: string,
    field: "left" | "right",
    value: string,
  ) => {
    const updatedPairs = pairs.map((pair) =>
      pair.id === pairId ? { ...pair, [field]: value } : pair,
    );
    onPairsChange(updatedPairs);
  };

  const handleDeletePair = (pairId: string) => {
    const updatedPairs = pairs.filter((pair) => pair.id !== pairId);
    onPairsChange(updatedPairs);
  };

  const handleAddPair = () => {
    const newPair: MatchingPair = {
      id: `pair-${Date.now()}`,
      left: "",
      right: "",
    };
    onPairsChange([...pairs, newPair]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">
            Pasangan Menjodohkan<span className="text-error">*</span>
          </span>
          <span className="text-neutral-gray">|</span>
        </div>

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

      {/* Column Headers */}
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] gap-3 items-center">
        <div className="w-6"></div>
        <span className="text-sm font-medium text-neutral-dark text-center">
          Pertanyaan
        </span>
        <div className="w-8"></div>
        <span className="text-sm font-medium text-neutral-dark text-center">
          Jawaban
        </span>
        <div className="w-8"></div>
      </div>

      {/* Matching Pairs */}
      <div className="space-y-3">
        {pairs.map((pair, index) => (
          <div
            key={pair.id}
            className="grid grid-cols-[auto_1fr_auto_1fr_auto] gap-3 items-center group"
          >
            {/* Drag Handle */}
            <div className="text-neutral-gray/50 cursor-grab">
              <GripVertical className="w-5 h-5" />
            </div>

            {/* Left Input (Question) */}
            <input
              type="text"
              value={pair.left}
              onChange={(e) =>
                handlePairChange(pair.id, "left", e.target.value)
              }
              placeholder={`Pertanyaan ${index + 1}`}
              className="px-4 py-3 bg-neutral-light border border-neutral-gray/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-neutral-dark placeholder:text-neutral-gray/60 transition-all text-sm"
            />

            {/* Arrow/Connection */}
            <div className="flex items-center justify-center">
              <svg
                className="w-6 h-6 text-neutral-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>

            {/* Right Input (Answer) */}
            <input
              type="text"
              value={pair.right}
              onChange={(e) =>
                handlePairChange(pair.id, "right", e.target.value)
              }
              placeholder={`Jawaban ${index + 1}`}
              className="px-4 py-3 bg-neutral-light border border-neutral-gray/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-neutral-dark placeholder:text-neutral-gray/60 transition-all text-sm"
            />

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => handleDeletePair(pair.id)}
              className="p-2 text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Pair Button */}
      <button
        type="button"
        onClick={handleAddPair}
        className="flex items-center gap-2 px-4 py-2 border border-dashed border-neutral-gray/40 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-sm text-neutral-gray hover:text-primary"
      >
        <Plus className="w-4 h-4" />
        <span>Tambahkan pasangan</span>
      </button>
    </div>
  );
}
