"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { QuizBox, QuizData } from "@/features/admin/dashboard/courses/components/material";
import {
  QuizSettingsPanel,
  QuizSettings,
} from "@/features/admin/dashboard/courses/components/quiz";
import { Button } from "@/shared/components/ui";

export interface QuizItem {
  id: string;
  data: QuizData;
}

export type { QuizSettings };

interface QuizFormContainerProps {
  courseId: string;
  manageCoursesId: string;
  quizName?: string;
  onSave?: (quizName: string, quizItems: QuizItem[], settings: QuizSettings) => void;
}

export function QuizFormContainer({
  courseId,
  manageCoursesId,
  quizName: initialQuizName = "",
  onSave,
}: QuizFormContainerProps) {
  const [quizName, setQuizName] = useState(initialQuizName);
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);

  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    randomizeQuestions: false,
    showAllQuestions: false,
    displayedQuestionsCount: 10,
    protector: false,
  });

  const generateId = () => `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addQuizQuestion = useCallback(() => {
    const newQuiz: QuizItem = {
      id: generateId(),
      data: {
        question: "",
        questionType: "multiple_choice",
        isRequired: true,
        isMultipleAnswer: false,
        difficulty: "easy",
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

  const updateQuizContent = useCallback((id: string, data: QuizData) => {
    setQuizItems((prev) => prev.map((item) => (item.id === id ? { ...item, data } : item)));
  }, []);

  const moveQuiz = useCallback((index: number, direction: "up" | "down") => {
    setQuizItems((prev) => {
      const newItems = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newItems.length) return prev;
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      return newItems;
    });
  }, []);

  const deleteQuiz = useCallback((id: string) => {
    setQuizItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleSave = () => {
    if (onSave) {
      onSave(quizName, quizItems, quizSettings);
    } else {
      console.log("Saving quiz:", { quizName, quizItems, quizSettings });
    }
  };

  const handleSettingsChange = (key: keyof QuizSettings, value: boolean | number) => {
    setQuizSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href={`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9D00] text-white transition-colors hover:bg-[#E68E00]"
          >
            <ChevronLeft size={24} />
          </Link>
          <span className="text-lg text-white">Course/Course Details</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-white">Tambah Quiz</h1>

        <div className="mb-8 space-y-2">
          <label className="block text-sm font-medium text-white">Nama Quiz</label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="Masukkan nama quiz"
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white transition-all placeholder:text-white/60 focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Soal Quiz</h2>

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

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg p-2 transition-all"
              title="Hapus semua"
              onClick={() => setQuizItems([])}
            >
              <Trash2 className="hover:text-gray h-5 w-5 text-white" />
            </button>
            <button
              type="button"
              onClick={addQuizQuestion}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/50 bg-transparent px-6 py-3 text-white transition-all hover:border-white hover:bg-white/20"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Tambah Pertanyaan</span>
            </button>
          </div>

          <QuizSettingsPanel
            settings={quizSettings}
            totalQuestions={quizItems.length}
            onSettingsChange={handleSettingsChange}
          />
          <Button
            variant="outline"
            onClick={handleSave}
            className="hover:!bg-primary w-full hover:text-white"
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
