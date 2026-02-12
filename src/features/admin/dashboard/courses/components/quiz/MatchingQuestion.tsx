"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { MatchingPair, MatchingQuestionProps, QuizDifficulty } from "./types";

export function MatchingQuestion({
  difficulty,
  pairs,
  onDifficultyChange,
  onPairsChange,
}: MatchingQuestionProps) {
  const handlePairChange = (pairId: string, field: "left" | "right", value: string) => {
    const updatedPairs = pairs.map((pair) =>
      pair.id === pairId ? { ...pair, [field]: value } : pair
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
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">
            Pasangan Menjodohkan<span className="text-error">*</span>
          </span>
          <span className="text-neutral-gray">|</span>
        </div>

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

      {/* Column Headers */}
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-3">
        <div className="w-6"></div>
        <span className="text-center text-sm font-medium text-white">Pertanyaan</span>
        <div className="w-8"></div>
        <span className="text-center text-sm font-medium text-white">Jawaban</span>
        <div className="w-8"></div>
      </div>

      {/* Matching Pairs */}
      <div className="space-y-3">
        {pairs.map((pair, index) => (
          <div
            key={pair.id}
            className="group grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-3"
          >
            {/* Drag Handle */}
            <div className="text-neutral-gray/50 cursor-grab">
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Left Input (Question) */}
            <input
              type="text"
              value={pair.left}
              onChange={(e) => handlePairChange(pair.id, "left", e.target.value)}
              placeholder={`Pertanyaan ${index + 1}`}
              className="bg-neutral-light border-neutral-gray/20 focus:border-primary focus:ring-primary/20 text-neutral-dark placeholder:text-neutral-gray/60 rounded-lg border px-4 py-3 text-sm transition-all focus:ring-2 focus:outline-none"
            />

            {/* Arrow/Connection */}
            <div className="flex items-center justify-center">
              <svg
                className="text-neutral-gray h-6 w-6"
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
              onChange={(e) => handlePairChange(pair.id, "right", e.target.value)}
              placeholder={`Jawaban ${index + 1}`}
              className="bg-neutral-light border-neutral-gray/20 focus:border-primary focus:ring-primary/20 text-neutral-dark placeholder:text-neutral-gray/60 rounded-lg border px-4 py-3 text-sm transition-all focus:ring-2 focus:outline-none"
            />

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => handleDeletePair(pair.id)}
              className="text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg p-2 opacity-0 transition-all group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Pair Button */}
      <button
        type="button"
        onClick={handleAddPair}
        className="hover:bg-primary/5 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white px-4 py-2 text-sm text-white transition-all hover:text-white"
      >
        <Plus className="h-4 w-4" />
        <span>Tambahkan pasangan</span>
      </button>
    </div>
  );
}
