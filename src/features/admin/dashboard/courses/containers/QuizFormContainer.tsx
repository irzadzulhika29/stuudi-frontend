"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuizBox, QuizData } from "@/features/admin/dashboard/courses/components/material";
import {
  QuizSettingsPanel,
  QuizSettings,
} from "@/features/admin/dashboard/courses/components/quiz";
import { Button } from "@/shared/components/ui";
import { useCreateQuiz } from "../hooks/useCreateQuiz";

export interface QuizItem {
  id: string;
  data: QuizData;
}

export type { QuizSettings };

interface QuizFormContainerProps {
  courseId: string;
  manageCoursesId: string;
  topicId?: string;
  quizId?: string;
  quizName?: string;
  initialQuizItems?: QuizItem[];
  isEditMode?: boolean;
  onSave?: (quizName: string, quizItems: QuizItem[], settings: QuizSettings) => void;
}

export function QuizFormContainer({
  courseId,
  manageCoursesId,
  topicId,
  quizId,
  quizName: initialQuizName = "",
  initialQuizItems = [],
  isEditMode = false,
  onSave,
}: QuizFormContainerProps) {
  const router = useRouter();
  const [quizName, setQuizName] = useState(initialQuizName);
  const [quizItems, setQuizItems] = useState<QuizItem[]>(initialQuizItems);
  const [error, setError] = useState<string | null>(null);

  // Use the create quiz hook (only for new quizzes)
  const { createQuiz, isCreating, progress } = useCreateQuiz(topicId || "");

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

  const handleSave = async () => {
    // Validate
    if (!quizName.trim()) {
      setError("Nama quiz harus diisi");
      return;
    }

    if (quizItems.length === 0) {
      setError("Quiz harus memiliki minimal 1 pertanyaan");
      return;
    }

    if (!isEditMode && !topicId) {
      setError("Topic ID tidak ditemukan");
      return;
    }

    setError(null);

    // For edit mode, use onSave callback or implement update API
    if (isEditMode) {
      if (onSave) {
        onSave(quizName, quizItems, quizSettings);
      } else {
        // TODO: Implement update quiz API
        console.log("Updating quiz:", { quizId, quizName, quizItems, quizSettings });
        router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
      }
      return;
    }

    // Create quiz using API
    const result = await createQuiz(quizName, quizItems);

    if (result.success) {
      console.log("Quiz created successfully with ID:", result.contentId);
      router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
    } else {
      setError(result.error || "Gagal membuat quiz");
      if (result.failedQuestions && result.failedQuestions.length > 0) {
        console.error("Failed questions indices:", result.failedQuestions);
      }
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
        <h1 className="mb-8 text-3xl font-bold text-white">
          {isEditMode ? "Edit Quiz" : "Tambah Quiz"}
        </h1>

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

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-red-500/20 p-4 text-red-200">
              {error}
            </div>
          )}

          {/* Progress indicator */}
          {isCreating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>
                  Menyimpan... ({progress.current}/{progress.total})
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isCreating}
            className="hover:!bg-primary w-full hover:text-white disabled:opacity-50"
          >
            {isCreating ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
