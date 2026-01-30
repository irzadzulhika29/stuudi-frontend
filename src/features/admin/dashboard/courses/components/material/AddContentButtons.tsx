"use client";

import { Type, FileQuestion, Image as ImageIcon } from "lucide-react";

// Types
export type ContentType = "text" | "media" | "quiz";

export interface TextContent {
  id: string;
  type: "text";
  content: string;
}

export interface MediaContent {
  id: string;
  type: "media";
  file: File | null;
  embedUrl: string;
  previewUrl?: string; // URL for previewing existing media in edit mode
  mediaType?: "image" | "video"; // Type of existing media
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export type QuizDifficulty = "easy" | "medium" | "hard";

export interface QuizContent {
  id: string;
  type: "quiz";
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
  pairs?: { id: string; left: string; right: string }[];
}

export type MaterialContent = TextContent | MediaContent | QuizContent;

interface AddContentButtonsProps {
  onAddText: () => void;
  onAddQuiz: () => void;
  onAddMedia: () => void;
}

export function AddContentButtons({ onAddText, onAddQuiz, onAddMedia }: AddContentButtonsProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onAddText}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white bg-transparent px-6 py-3 font-medium text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
      >
        <Type className="h-5 w-5" />
        <span>Add Text</span>
      </button>
      <button
        type="button"
        onClick={onAddQuiz}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white bg-transparent px-6 py-3 font-medium text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
      >
        <FileQuestion className="h-5 w-5" />
        <span>Add Quiz Box</span>
      </button>
      <button
        type="button"
        onClick={onAddMedia}
        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white bg-transparent px-6 py-3 font-medium text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
      >
        <ImageIcon className="h-5 w-5" />
        <span>Add Media Box</span>
      </button>
    </div>
  );
}
