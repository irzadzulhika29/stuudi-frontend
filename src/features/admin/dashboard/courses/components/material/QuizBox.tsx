"use client";

import { useState } from "react";
import { ChevronDownIcon, Image } from "lucide-react";
import { MaterialContentBox } from "./MaterialContentBox";
import { ToggleSwitch } from "@/shared/components/ui";
import {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  ShortAnswerQuestion,
  MatchingQuestion,
  QuizOption,
  MatchingPair,
} from "../quiz";

export interface QuizData {
  question: string;
  questionType: "multiple_choice" | "true_false" | "short_answer" | "matching";
  isRequired: boolean;
  isMultipleAnswer: boolean;
  points: number;
  options: QuizOption[];
  imageUrl?: string;
  // Additional fields for other question types
  correctAnswer?: boolean; // for true/false
  expectedAnswer?: string; // for short answer
  caseSensitive?: boolean; // for short answer
  pairs?: MatchingPair[]; // for matching
}

interface QuizBoxProps {
  id: string;
  data: QuizData;
  onChange: (id: string, data: QuizData) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function QuizBox({
  id,
  data,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}: QuizBoxProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const questionTypes = [
    { value: "multiple_choice", label: "Multiple Choice" },
    { value: "true_false", label: "True/False" },
    { value: "short_answer", label: "Short Answer" },
    { value: "matching", label: "Matching" },
  ];

  const handleQuestionChange = (question: string) => {
    onChange(id, { ...data, question });
  };

  const handleTypeChange = (
    type: "multiple_choice" | "true_false" | "short_answer" | "matching",
  ) => {
    // Initialize default values based on type
    let updatedData = { ...data, questionType: type };

    if (type === "true_false" && data.correctAnswer === undefined) {
      updatedData.correctAnswer = true;
    }
    if (type === "short_answer") {
      if (data.expectedAnswer === undefined) updatedData.expectedAnswer = "";
      if (data.caseSensitive === undefined) updatedData.caseSensitive = false;
    }
    if (type === "matching" && (!data.pairs || data.pairs.length === 0)) {
      updatedData.pairs = [
        { id: `pair-${Date.now()}-1`, left: "", right: "" },
        { id: `pair-${Date.now()}-2`, left: "", right: "" },
      ];
    }

    onChange(id, updatedData);
    setShowTypeDropdown(false);
  };

  const handleRequiredToggle = () => {
    onChange(id, { ...data, isRequired: !data.isRequired });
  };

  const handlePointsChange = (points: number) => {
    onChange(id, { ...data, points: Math.max(0, points) });
  };

  const handleOptionsChange = (options: QuizOption[]) => {
    onChange(id, { ...data, options });
  };

  const handleMultipleAnswerToggle = () => {
    onChange(id, { ...data, isMultipleAnswer: !data.isMultipleAnswer });
  };

  const handleCorrectAnswerChange = (value: boolean) => {
    onChange(id, { ...data, correctAnswer: value });
  };

  const handleExpectedAnswerChange = (value: string) => {
    onChange(id, { ...data, expectedAnswer: value });
  };

  const handleCaseSensitiveToggle = () => {
    onChange(id, { ...data, caseSensitive: !data.caseSensitive });
  };

  const handlePairsChange = (pairs: MatchingPair[]) => {
    onChange(id, { ...data, pairs });
  };

  // Render the appropriate question component based on type
  const renderQuestionContent = () => {
    switch (data.questionType) {
      case "multiple_choice":
        return (
          <MultipleChoiceQuestion
            id={id}
            question={data.question}
            points={data.points}
            isRequired={data.isRequired}
            options={data.options}
            isMultipleAnswer={data.isMultipleAnswer}
            onQuestionChange={handleQuestionChange}
            onPointsChange={handlePointsChange}
            onOptionsChange={handleOptionsChange}
            onMultipleAnswerToggle={handleMultipleAnswerToggle}
          />
        );
      case "true_false":
        return (
          <TrueFalseQuestion
            id={id}
            question={data.question}
            points={data.points}
            isRequired={data.isRequired}
            correctAnswer={data.correctAnswer ?? true}
            onQuestionChange={handleQuestionChange}
            onPointsChange={handlePointsChange}
            onCorrectAnswerChange={handleCorrectAnswerChange}
          />
        );
      case "short_answer":
        return (
          <ShortAnswerQuestion
            id={id}
            question={data.question}
            points={data.points}
            isRequired={data.isRequired}
            expectedAnswer={data.expectedAnswer ?? ""}
            caseSensitive={data.caseSensitive ?? false}
            onQuestionChange={handleQuestionChange}
            onPointsChange={handlePointsChange}
            onExpectedAnswerChange={handleExpectedAnswerChange}
            onCaseSensitiveToggle={handleCaseSensitiveToggle}
          />
        );
      case "matching":
        return (
          <MatchingQuestion
            id={id}
            question={data.question}
            points={data.points}
            isRequired={data.isRequired}
            pairs={data.pairs ?? []}
            onQuestionChange={handleQuestionChange}
            onPointsChange={handlePointsChange}
            onPairsChange={handlePairsChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <MaterialContentBox
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      className="bg-gray-200"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Question Type Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex bg-white items-center gap-2 px-3 py-1.5 rounded-xl hover:border-primary/50 transition-colors"
            >
              <svg
                className="w-4 h-4 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-sm text-black">
                {
                  questionTypes.find((t) => t.value === data.questionType)
                    ?.label
                }
              </span>
              <ChevronDownIcon className="w-4 h-4 text-neutral-gray" />
            </button>
            {showTypeDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-gray/20 py-1 z-10">
                {questionTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      handleTypeChange(
                        type.value as
                          | "multiple_choice"
                          | "true_false"
                          | "short_answer"
                          | "matching",
                      )
                    }
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-light transition-colors ${
                      data.questionType === type.value
                        ? "text-primary font-medium"
                        : "text-neutral-dark"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ToggleSwitch
            checked={data.isRequired}
            onChange={() => handleRequiredToggle()}
            label="Required"
            size="md"
          />
        </div>

        {isExpanded && (
          <div className="space-y-4 pl-2">
            {/* Question Input */}
            <div className="flex items-start gap-3">
              <input
                type="text"
                value={data.question}
                onChange={(e) => handleQuestionChange(e.target.value)}
                placeholder="Masukkan pertanyaan di sini..."
                className="flex-1 px-4 py-3 bg-neutral-light border border-neutral-gray/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-neutral-dark placeholder:text-neutral-gray/60 transition-all"
              />
              <button
                type="button"
                className="p-3 bg-neutral-light border border-neutral-gray/20 rounded-lg hover:border-primary/30 transition-colors"
                title="Tambah gambar"
              >
                <Image className="w-5 h-5 text-neutral-gray" />
              </button>
            </div>

            {/* Render question-type specific content */}
            {renderQuestionContent()}
          </div>
        )}
      </div>
    </MaterialContentBox>
  );
}

export type { QuizOption };
