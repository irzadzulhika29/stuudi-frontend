"use client";

import { ChevronLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { QuizBox, QuizData } from "@/features/admin/dashboard/courses/components/material";
import {
  QuizSettingsPanel,
  QuizSettings,
} from "@/features/admin/dashboard/courses/components/quiz";
import { Button } from "@/shared/components/ui";
import { useQuizForm } from "../hooks/useQuizForm";
import { useQuizItems } from "../hooks/useQuizItems";
import { useQuizSave } from "../hooks/useQuizSave";

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
  // Use custom hooks for form management
  const {
    quizName,
    setQuizName,
    error: formError,
    // setError: setFormError, // Not used directly, managed by hooks
    effectiveSettings,
    handleSettingsChange,
    isLoadingConfig,
  } = useQuizForm({
    initialQuizName,
    isEditMode,
    quizId,
  });

  // Use custom hooks for quiz items management
  const { quizItems, addQuizItem, updateQuizItem, moveQuizItem, deleteQuizItem, clearAllItems } =
    useQuizItems({
      initialItems: initialQuizItems,
      isEditMode,
    });

  // Use custom hook for saving
  const {
    handleSave,
    isLoading: isSaving,
    progress,
    saveError,
    // setSaveError,
  } = useQuizSave({
    courseId,
    manageCoursesId,
    topicId,
    quizId,
    isEditMode,
    initialQuizItems,
    onSave,
  });

  // Combine errors
  const error = formError || saveError;

  // Show loading when fetching config in edit mode
  if (isEditMode && isLoadingConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Memuat konfigurasi quiz...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href={`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9D00] text-white transition-colors hover:bg-[#E68E00]"
        >
          <ChevronLeft size={24} />
        </Link>
        <span className="text-lg text-white">Course/Course Details</span>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-white">
          {isEditMode ? "Edit Quiz" : "Tambah Quiz"}
        </h1>

        {/* Quiz Name Input */}
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

        {/* Quiz Questions Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Soal Quiz</h2>

          {/* Quiz Items List */}
          <div className="space-y-4">
            {quizItems.map((item, index) => (
              <QuizBox
                key={item.id}
                id={item.id}
                data={item.data}
                onChange={updateQuizItem}
                onMoveUp={() => moveQuizItem(index, "up")}
                onMoveDown={() => moveQuizItem(index, "down")}
                onDelete={() => deleteQuizItem(item.id)}
                canMoveUp={index > 0}
                canMoveDown={index < quizItems.length - 1}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Delete All Button */}
            <button
              type="button"
              className="text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg p-2 transition-all"
              title="Hapus semua"
              onClick={clearAllItems}
            >
              <Trash2 className="hover:text-gray h-5 w-5 text-white" />
            </button>

            {/* Add Question Button */}
            <button
              type="button"
              onClick={() => addQuizItem("single")}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/50 bg-transparent px-6 py-3 text-white transition-all hover:border-white hover:bg-white/20"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Tambah Pertanyaan</span>
            </button>
          </div>

          {/* Quiz Settings Panel */}
          <QuizSettingsPanel
            settings={effectiveSettings}
            totalQuestions={quizItems.length}
            onSettingsChange={handleSettingsChange}
          />

          {/* Error Display */}
          {error && <div className="rounded-lg bg-red-500/20 p-4 text-red-200">{error}</div>}

          {/* Progress Display */}
          {isSaving && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>
                  {isEditMode ? "Memperbarui" : "Menyimpan"}... ({progress.current}/{progress.total}
                  )
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{
                    width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => handleSave(quizName, quizItems, effectiveSettings)}
              disabled={isSaving}
              className="!bg-primary !w-auto !text-white hover:scale-105 hover:text-white disabled:opacity-50"
            >
              {isSaving ? (isEditMode ? "Memperbarui..." : "Menyimpan...") : "Simpan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
