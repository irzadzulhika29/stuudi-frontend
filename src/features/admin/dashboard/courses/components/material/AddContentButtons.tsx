"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Type,
  FileQuestion,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

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
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizContent {
  id: string;
  type: "quiz";
  question: string;
  questionType: "multiple_choice" | "true_false" | "short_answer" | "matching";
  isRequired: boolean;
  isMultipleAnswer: boolean;
  points: number;
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

export function AddContentButtons({
  onAddText,
  onAddQuiz,
  onAddMedia,
}: AddContentButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        type="button"
        onClick={onAddText}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white border border-white  font-medium rounded-2xl hover:opacity-90 transition-all shadow-md hover:shadow-lg"
      >
        <Type className="w-5 h-5" />
        <span>Add Text</span>
      </button>
      <button
        type="button"
        onClick={onAddQuiz}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white border border-white  font-medium rounded-2xl hover:opacity-90 transition-all shadow-md hover:shadow-lg"
      >
        <FileQuestion className="w-5 h-5" />
        <span>Add Quiz Box</span>
      </button>
      <button
        type="button"
        onClick={onAddMedia}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white border border-white  font-medium rounded-2xl hover:opacity-90 transition-all shadow-md hover:shadow-lg"
      >
        <ImageIcon className="w-5 h-5" />
        <span>Add Media Box</span>
      </button>
    </div>
  );
}
