"use client";

import { type ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDownIcon, Image as ImageIcon, X } from "lucide-react";
import { MaterialContentBox } from "./MaterialContentBox";
import { Modal, ToggleSwitch } from "@/shared/components/ui";
import { ChoiceQuestion, MatchingQuestion, QuizOption, MatchingPair } from "../quiz";
import { MathText, hasMathSyntax } from "@/shared/components/math";

import { QuizDifficulty } from "./AddContentButtons";

export interface QuizData {
  question: string;
  questionType: "single" | "multiple" | "matching";
  isRequired: boolean;
  difficulty: QuizDifficulty;
  options?: QuizOption[];
  imageUrl?: string;
  imageFile?: File | null;
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

type EquationType = "fraction" | "power" | "root";
type EquationMode = "inline" | "block";

interface EquationBuilderState {
  type: EquationType;
  mode: EquationMode;
  numerator: string;
  denominator: string;
  base: string;
  exponent: string;
  radicand: string;
}

const defaultEquationBuilder: EquationBuilderState = {
  type: "fraction",
  mode: "inline",
  numerator: "a+b",
  denominator: "c+d",
  base: "x",
  exponent: "2",
  radicand: "x+1",
};

function buildEquationLatex(builder: EquationBuilderState): string {
  let expression = "";

  switch (builder.type) {
    case "fraction":
      expression = `\\frac{${builder.numerator || "a"}}{${builder.denominator || "b"}}`;
      break;
    case "power":
      expression = `${builder.base || "x"}^{${builder.exponent || "2"}}`;
      break;
    case "root":
      expression = `\\sqrt{${builder.radicand || "x"}}`;
      break;
  }

  return builder.mode === "block" ? `$$\n${expression}\n$$` : `$${expression}$`;
}

function isEscapedDollar(text: string, index: number) {
  let backslashes = 0;
  let i = index - 1;
  while (i >= 0 && text[i] === "\\") {
    backslashes += 1;
    i -= 1;
  }
  return backslashes % 2 === 1;
}

function getMathContextAtCursor(text: string, cursor: number) {
  let inInlineMath = false;
  let inBlockMath = false;
  let i = 0;

  while (i < cursor) {
    const current = text[i];
    const next = text[i + 1];

    if (current === "$" && !isEscapedDollar(text, i)) {
      if (next === "$" && !isEscapedDollar(text, i + 1)) {
        inBlockMath = !inBlockMath;
        i += 2;
        continue;
      }

      if (!inBlockMath) {
        inInlineMath = !inInlineMath;
      }
    }

    i += 1;
  }

  return {
    inInlineMath,
    inBlockMath,
  };
}

function unwrapInlineMath(template: string) {
  const trimmed = template.trim();
  if (trimmed.startsWith("$") && trimmed.endsWith("$") && !trimmed.startsWith("$$")) {
    return trimmed.slice(1, -1);
  }
  return template;
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
  const [showEquationBuilder, setShowEquationBuilder] = useState(false);
  const [equationBuilder, setEquationBuilder] =
    useState<EquationBuilderState>(defaultEquationBuilder);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldShowMathPreview = hasMathSyntax(data.question);
  const equationLatex = buildEquationLatex(equationBuilder);

  const questionTypes = [
    { value: "single", label: "Single Choice" },
    { value: "multiple", label: "Multiple Choice" },
    { value: "matching", label: "Matching" },
  ];

  const handleQuestionChange = (question: string) => {
    onChange(id, { ...data, question });
  };

  const insertFormula = (template: string) => {
    const textarea = questionInputRef.current;

    if (!textarea) {
      handleQuestionChange(`${data.question}${data.question ? " " : ""}${template}`);
      return;
    }

    const start = textarea.selectionStart ?? data.question.length;
    const end = textarea.selectionEnd ?? data.question.length;
    const mathContext = getMathContextAtCursor(data.question, start);
    const insertion =
      mathContext.inInlineMath || mathContext.inBlockMath ? unwrapInlineMath(template) : template;
    const nextValue = `${data.question.slice(0, start)}${insertion}${data.question.slice(end)}`;

    handleQuestionChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = start + insertion.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const resetEquationBuilder = () => {
    setEquationBuilder(defaultEquationBuilder);
  };

  const closeEquationBuilder = () => {
    setShowEquationBuilder(false);
    resetEquationBuilder();
  };

  const handleInsertEquation = () => {
    insertFormula(equationLatex);
    closeEquationBuilder();
  };

  const handleTypeChange = (type: "single" | "multiple" | "matching") => {
    let updatedData: QuizData = { ...data, questionType: type };

    // Initialize data based on type and clean up stale data
    if (type === "single" || type === "multiple") {
      // Clear pairs when switching to choice type
      updatedData = { ...updatedData, pairs: undefined };

      if (!data.options || data.options.length === 0) {
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
    }

    if (type === "matching") {
      // Clear options when switching to matching type
      updatedData = { ...updatedData, options: undefined };

      if (!data.pairs || data.pairs.length === 0) {
        updatedData = {
          ...updatedData,
          pairs: [
            { id: `${id}-pair-1`, left: "", right: "" },
            { id: `${id}-pair-2`, left: "", right: "" },
          ],
        };
      }
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

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    onChange(id, { ...data, imageUrl: localPreviewUrl, imageFile: file });

    // Allow selecting the same file again later.
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    onChange(id, { ...data, imageUrl: undefined, imageFile: null });
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
            ref={questionInputRef}
            value={data.question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="Masukkan pertanyaan quiz"
            className="text-neutral-dark border-neutral-gray/30 focus:border-primary focus:ring-primary/20 placeholder:text-neutral-gray/60 w-full rounded-lg border bg-white px-4 py-3 text-sm transition-all focus:ring-2 focus:outline-none"
            rows={3}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowEquationBuilder(true)}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:border-white/40 hover:bg-white/15"
            >
              Insert Equation
            </button>
          </div>
          <p className="text-xs text-white/70">
            Gunakan builder untuk pecahan, pangkat, dan akar. Hasilnya akan otomatis diubah ke LaTeX
            oleh frontend.
          </p>
          {shouldShowMathPreview ? (
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white">
              <p className="mb-2 text-xs font-medium tracking-wide text-white/60 uppercase">
                Preview Persamaan
              </p>
              <MathText content={data.question} />
            </div>
          ) : null}
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
                <span>Upload gambar (JPG, JPEG, PNG, WEBP)</span>
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

      <Modal
        isOpen={showEquationBuilder}
        onClose={closeEquationBuilder}
        title="Insert Equation"
        size="lg"
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-700">Tipe Persamaan</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "fraction", label: "Pecahan" },
                { value: "power", label: "Pangkat" },
                { value: "root", label: "Akar" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setEquationBuilder((prev) => ({
                      ...prev,
                      type: option.value as EquationType,
                    }))
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    equationBuilder.type === option.value
                      ? "border-[#D77211] bg-[#D77211]/10 text-[#B95C2F]"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-700">Mode Tampilan</p>
            <div className="flex gap-2">
              {[
                { value: "inline", label: "Inline" },
                { value: "block", label: "Block" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setEquationBuilder((prev) => ({
                      ...prev,
                      mode: option.value as EquationMode,
                    }))
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    equationBuilder.mode === option.value
                      ? "border-[#D77211] bg-[#D77211]/10 text-[#B95C2F]"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {equationBuilder.type === "fraction" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Pembilang</label>
                <input
                  type="text"
                  value={equationBuilder.numerator}
                  onChange={(e) =>
                    setEquationBuilder((prev) => ({
                      ...prev,
                      numerator: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-800 transition-all outline-none focus:border-[#D77211] focus:ring-2 focus:ring-[#D77211]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Penyebut</label>
                <input
                  type="text"
                  value={equationBuilder.denominator}
                  onChange={(e) =>
                    setEquationBuilder((prev) => ({
                      ...prev,
                      denominator: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-800 transition-all outline-none focus:border-[#D77211] focus:ring-2 focus:ring-[#D77211]/20"
                />
              </div>
            </div>
          )}

          {equationBuilder.type === "power" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Basis</label>
                <input
                  type="text"
                  value={equationBuilder.base}
                  onChange={(e) =>
                    setEquationBuilder((prev) => ({
                      ...prev,
                      base: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-800 transition-all outline-none focus:border-[#D77211] focus:ring-2 focus:ring-[#D77211]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Pangkat</label>
                <input
                  type="text"
                  value={equationBuilder.exponent}
                  onChange={(e) =>
                    setEquationBuilder((prev) => ({
                      ...prev,
                      exponent: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-800 transition-all outline-none focus:border-[#D77211] focus:ring-2 focus:ring-[#D77211]/20"
                />
              </div>
            </div>
          )}

          {equationBuilder.type === "root" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Isi Akar</label>
              <input
                type="text"
                value={equationBuilder.radicand}
                onChange={(e) =>
                  setEquationBuilder((prev) => ({
                    ...prev,
                    radicand: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-800 transition-all outline-none focus:border-[#D77211] focus:ring-2 focus:ring-[#D77211]/20"
              />
            </div>
          )}

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              Preview
            </p>
            <div className="mb-3 rounded-lg bg-white px-4 py-3 text-neutral-800">
              <MathText content={equationLatex} />
            </div>
            <p className="mb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              LaTeX Output
            </p>
            <code className="block overflow-x-auto rounded-lg bg-neutral-900 px-4 py-3 text-xs text-white">
              {equationLatex}
            </code>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeEquationBuilder}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleInsertEquation}
              className="rounded-lg bg-[#D77211] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#C06010]"
            >
              Sisipkan ke Soal
            </button>
          </div>
        </div>
      </Modal>
    </MaterialContentBox>
  );
}
