"use client";

import { useState, useRef } from "react";
import { ChevronDownIcon, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { MaterialContentBox } from "./MaterialContentBox";
import { ToggleSwitch } from "@/shared/components/ui";
import { ChoiceQuestion, MatchingQuestion, QuizOption, MatchingPair } from "../quiz";

import { QuizDifficulty } from "./AddContentButtons";

export interface QuizData {
  question: string;
  questionType: "single" | "multiple" | "matching";
  isRequired: boolean;
  difficulty: QuizDifficulty;
  options?: QuizOption[];
  imageUrl?: string;
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
    { value: "single", label: "Single Choice" },
    { value: "multiple", label: "Multiple Choice" },
    { value: "matching", label: "Matching" },
  ];

  const handleQuestionChange = (question: string) => {
    onChange(id, { ...data, question });
  };

  const handleTypeChange = (type: "single" | "multiple" | "matching") => {
    let updatedData: QuizData = { ...data, questionType: type };

    // Initialize data based on type
    if (
      (type === "single" || type === "multiple") &&
      (!data.options || data.options.length === 0)
    ) {
      updatedData = {
        ...updatedData,
        options: [
          { id: `${id}-opt-1`, text: "", isCorrect: type === "single" },
          { id: `${id}-opt-2`, text: "", isCorrect: false },
          { id: `${id}-opt-3`, text: "", isCorrect: false },
          { id: `${id}-opt-4`, text: "", isCorrect: false },
        ],
      };
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

  const handleChoiceTypeChange = (choiceType: "single" | "multiple") => {
    // When switching between single and multiple, ensure correct answers are valid
    let updatedOptions = [...(data.options || [])];

    if (choiceType === "single") {
      // When switching to single, keep only the first correct answer
      let foundCorrect = false;
      updatedOptions = updatedOptions.map((opt) => {
        if (opt.isCorrect && !foundCorrect) {
          foundCorrect = true;
          return opt;
        }
        return { ...opt, isCorrect: false };
      });
    }

    onChange(id, { ...data, questionType: choiceType, options: updatedOptions });
  };

  const handlePairsChange = (pairs: MatchingPair[]) => {
    onChange(id, { ...data, pairs });
  };

  const renderQuestionContent = () => {
    switch (data.questionType) {
      case "single":
      case "multiple":
        return (
          <ChoiceQuestion
            id={id}
            question={data.question}
            difficulty={data.difficulty}
            isRequired={data.isRequired}
            choiceType={data.questionType}
            options={data.options || []}
            onQuestionChange={handleQuestionChange}
            onDifficultyChange={handleDifficultyChange}
            onOptionsChange={handleOptionsChange}
            onChoiceTypeChange={handleChoiceTypeChange}
          />
        );
      case "matching":
        return (
          <MatchingQuestion
            id={id}
            question={data.question}
            difficulty={data.difficulty}
            isRequired={data.isRequired}
            pairs={data.pairs || []}
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
    >
      <div className="space-y-6">
        {/* Question Text Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">
            Pertanyaan<span className="text-error">*</span>
          </label>
          <textarea
            value={data.question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="Masukkan pertanyaan quiz"
            className="text-neutral-dark border-neutral-gray/30 focus:border-primary focus:ring-primary/20 placeholder:text-neutral-gray/60 w-full rounded-lg border bg-white px-4 py-3 text-sm transition-all focus:ring-2 focus:outline-none"
            rows={3}
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Gambar (Opsional)</label>
          {data.imageUrl ? (
            <div className="relative h-48 w-full">
              <Image
                src={data.imageUrl}
                alt="Quiz question"
                fill
                className="border-neutral-gray/30 rounded-lg border object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-error hover:bg-error/90 absolute top-2 right-2 z-10 rounded-full p-1.5 text-white shadow-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div>
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
                className="border-neutral-gray/40 hover:border-primary hover:bg-primary/5 text-neutral-gray hover:text-primary flex w-full items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-sm transition-all"
              >
                <ImageIcon className="h-5 w-5" />
                <span>Upload gambar (maks. 2MB)</span>
              </button>
            </div>
          )}
        </div>

        {/* Question Type Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Tipe Soal</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="border-neutral-gray/30 focus:border-primary text-neutral-dark flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-sm transition-all focus:outline-none"
            >
              <span>{questionTypes.find((t) => t.value === data.questionType)?.label}</span>
              <ChevronDownIcon
                className={`text-neutral-gray h-4 w-4 transition-transform ${showTypeDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showTypeDropdown && (
              <div className="border-neutral-gray/30 absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
                {questionTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      handleTypeChange(type.value as "single" | "multiple" | "matching")
                    }
                    className={`hover:bg-primary/5 text-neutral-dark w-full px-4 py-2.5 text-left text-sm transition-all first:rounded-t-lg last:rounded-b-lg ${
                      data.questionType === type.value
                        ? "bg-primary/10 text-primary font-medium"
                        : ""
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Question Content (Options or Matching Pairs) */}
        {renderQuestionContent()}

        {/* Required Toggle */}
        <div className="flex items-center gap-3">
          <ToggleSwitch checked={data.isRequired} onChange={handleRequiredToggle} size="sm" />
          <span className="dark text-sm text-white">Pertanyaan wajib dijawab</span>
        </div>
      </div>
    </MaterialContentBox>
  );
}
