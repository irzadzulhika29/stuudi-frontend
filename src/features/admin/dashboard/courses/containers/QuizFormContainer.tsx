"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  QuizBox,
  QuizData,
  QuizOption,
} from "@/features/admin/dashboard/courses/components/material";
import { Button } from "@/shared/components/ui";

export interface QuizItem {
  id: string;
  data: QuizData;
}

interface QuizFormContainerProps {
  courseId: string;
  manageCoursesId: string;
  quizName?: string;
  onSave?: (quizName: string, quizItems: QuizItem[]) => void;
}

export function QuizFormContainer({
  courseId,
  manageCoursesId,
  quizName: initialQuizName = "",
  onSave,
}: QuizFormContainerProps) {
  const [quizName, setQuizName] = useState(initialQuizName);
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);

  // Generate unique ID
  const generateId = () =>
    `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add new quiz question
  const addQuizQuestion = useCallback(() => {
    const newQuiz: QuizItem = {
      id: generateId(),
      data: {
        question: "",
        questionType: "multiple_choice",
        isRequired: true,
        isMultipleAnswer: false,
        points: 1,
        options: [
          { id: `opt-${Date.now()}-1`, text: "", isCorrect: false },
          { id: `opt-${Date.now()}-2`, text: "", isCorrect: true },
          { id: `opt-${Date.now()}-3`, text: "", isCorrect: false },
          { id: `opt-${Date.now()}-4`, text: "", isCorrect: false },
        ],
      },
    };
    setQuizItems((prev) => [...prev, newQuiz]);
  }, []);

  // Update quiz content
  const updateQuizContent = useCallback((id: string, data: QuizData) => {
    setQuizItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, data } : item)),
    );
  }, []);

  // Reorder quiz
  const moveQuiz = useCallback((index: number, direction: "up" | "down") => {
    setQuizItems((prev) => {
      const newItems = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newItems.length) return prev;
      [newItems[index], newItems[targetIndex]] = [
        newItems[targetIndex],
        newItems[index],
      ];
      return newItems;
    });
  }, []);

  // Delete quiz
  const deleteQuiz = useCallback((id: string) => {
    setQuizItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(quizName, quizItems);
    } else {
      console.log("Saving quiz:", { quizName, quizItems });
      // TODO: Implement save logic with API
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`}
            className="w-10 h-10 bg-[#FF9D00] rounded-full flex items-center justify-center text-white hover:bg-[#E68E00] transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>
          <span className="text-white text-lg">Course/Course Details</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-8">Tambah Quiz</h1>

        {/* Quiz Name Input */}
        <div className="space-y-2 mb-8">
          <label className="block text-sm font-medium text-white">
            Nama Quiz
          </label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="Masukkan nama quiz"
            className="w-full px-4 py-3 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all bg-transparent"
          />
        </div>

        {/* Quiz Questions Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Soal Quiz</h2>

          {/* Quiz Items */}
          <div className="space-y-4">
            {quizItems.map((item, index) => (
              <QuizBox
                key={item.id}
                id={item.id}
                data={item.data}
                onChange={updateQuizContent}
                onMoveUp={() => moveQuiz(index, "up")}
                onMoveDown={() => moveQuiz(index, "down")}
                onDelete={() => deleteQuiz(item.id)}
                canMoveUp={index > 0}
                canMoveDown={index < quizItems.length - 1}
              />
            ))}
          </div>

          {/* Add New Question Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg transition-all"
              title="Hapus semua"
              onClick={() => setQuizItems([])}
            >
              <Trash2 className="hover:text-gray text-white w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={addQuizQuestion}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-dashed border-white/50 rounded-lg text-white hover:bg-white/20 hover:border-white transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Tambah Pertanyaan</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2 bg-white rounded-full text-gray-500 font-medium text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
