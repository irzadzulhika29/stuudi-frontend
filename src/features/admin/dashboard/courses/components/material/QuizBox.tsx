"use client";

import { useState, useRef } from "react";
import { ChevronDownIcon, Image as ImageIcon, X } from "lucide-react";
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

import { QuizDifficulty } from "./AddContentButtons";

export interface QuizData {
  question: string;
  questionType: "multiple_choice" | "true_false" | "short_answer" | "matching";
  isRequired: boolean;
  isMultipleAnswer: boolean;
  difficulty: QuizDifficulty;
  options: QuizOption[];
  imageUrl?: string;
  correctAnswer?: boolean;
  expectedAnswer?: string;
  caseSensitive?: boolean;
  pairs?: MatchingPair[];
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
  const [isExpanded] = useState(true);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Mohon pilih file gambar yang valid");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      onChange(id, { ...data, imageUrl });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    if (data.imageUrl) {
      URL.revokeObjectURL(data.imageUrl);
    }
    onChange(id, { ...data, imageUrl: undefined });
  };

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
    type: "multiple_choice" | "true_false" | "short_answer" | "matching"
  ) => {
    let updatedData: QuizData = { ...data, questionType: type };

    if (type === "true_false" && data.correctAnswer === undefined) {
      updatedData = { ...updatedData, correctAnswer: true };
    }
    if (type === "short_answer") {
      if (data.expectedAnswer === undefined) {
        updatedData = { ...updatedData, expectedAnswer: "" };
      }
      if (data.caseSensitive === undefined) {
        updatedData = { ...updatedData, caseSensitive: false };
      }
    }
    if (type === "matching" && (!data.pairs || data.pairs.length === 0)) {
      updatedData = {
        ...updatedData,
        pairs: [
          { id: `${id}-pair-1`, left: "", right: "" },
          { id: `${id}-pair-2`, left: "", right: "" },
        ],
      };
    }

    onChange(id, updatedData);
    setShowTypeDropdown(false);
  };

  const handleRequiredToggle = () => {
    onChange(id, { ...data, isRequired: !data.isRequired });
  };

  const handleDifficultyChange = (difficulty: QuizDifficulty) => {
    onChange(id, { ...data, difficulty });
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

  const renderQuestionContent = () => {
    switch (data.questionType) {
      case "multiple_choice":
        return (
          <MultipleChoiceQuestion
            id={id}
            question={data.question}
            difficulty={data.difficulty}
            isRequired={data.isRequired}
            options={data.options}
            isMultipleAnswer={data.isMultipleAnswer}
            onQuestionChange={handleQuestionChange}
            onDifficultyChange={handleDifficultyChange}
            onOptionsChange={handleOptionsChange}
            onMultipleAnswerToggle={handleMultipleAnswerToggle}
          />
        );
      case "true_false":
        return (
          <TrueFalseQuestion
            id={id}
            question={data.question}
            difficulty={data.difficulty}
            isRequired={data.isRequired}
            correctAnswer={data.correctAnswer ?? true}
            onQuestionChange={handleQuestionChange}
            onDifficultyChange={handleDifficultyChange}
            onCorrectAnswerChange={handleCorrectAnswerChange}
          />
        );
      case "short_answer":
        return (
          <ShortAnswerQuestion
            id={id}
            question={data.question}
            difficulty={data.difficulty}
            isRequired={data.isRequired}
            expectedAnswer={data.expectedAnswer ?? ""}
            caseSensitive={data.caseSensitive ?? false}
            onQuestionChange={handleQuestionChange}
            onDifficultyChange={handleDifficultyChange}
            onExpectedAnswerChange={handleExpectedAnswerChange}
            onCaseSensitiveToggle={handleCaseSensitiveToggle}
          />
        );
      case "matching":
        return (
          <MatchingQuestion
            id={id}
            question={data.question}
            difficulty={data.difficulty}
            isRequired={data.isRequired}
            pairs={data.pairs ?? []}
            onQuestionChange={handleQuestionChange}
            onDifficultyChange={handleDifficultyChange}
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
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="hover:border-primary/50 flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 transition-colors"
            >
              <svg
                className="text-primary h-4 w-4"
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
                {questionTypes.find((t) => t.value === data.questionType)?.label}
              </span>
              <ChevronDownIcon className="text-neutral-gray h-4 w-4" />
            </button>
            {showTypeDropdown && (
              <div className="border-neutral-gray/20 absolute top-full left-0 z-10 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
                {questionTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      handleTypeChange(
                        type.value as "multiple_choice" | "true_false" | "short_answer" | "matching"
                      )
                    }
                    className={`hover:bg-neutral-light w-full px-4 py-2 text-left text-sm transition-colors ${
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
                className="bg-neutral-light border-neutral-gray/20 focus:border-primary focus:ring-primary/20 text-neutral-dark placeholder:text-neutral-gray/60 flex-1 rounded-lg border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
              />
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`bg-neutral-light hover:border-primary/30 rounded-lg border p-3 transition-colors ${
                  data.imageUrl ? "border-primary/50 bg-primary/5" : "border-neutral-gray/20"
                }`}
                title="Tambah gambar"
              >
                <ImageIcon
                  className={`h-5 w-5 ${data.imageUrl ? "text-primary" : "text-neutral-gray"}`}
                />
              </button>
            </div>

            {/* Image Preview */}
            {data.imageUrl && (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.imageUrl}
                  alt="Gambar soal"
                  className="border-neutral-gray/20 max-h-48 max-w-full rounded-lg border object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
                  title="Hapus gambar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Render question-type specific content */}
            {renderQuestionContent()}
          </div>
        )}
      </div>
    </MaterialContentBox>
  );
}

export type { QuizOption };
