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
    setError: setFormError,
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

      if (isEditMode && isExistingQuestion) {
        try {
          await deleteQuestionMutation.mutateAsync({ questionId: id });
        } catch (error) {
          console.error(`Failed to delete question ${id}:`, error);
          setError("Gagal menghapus pertanyaan");
          return;
        }
      }

      setQuizItems((prev) => prev.filter((item) => item.id !== id));
    },
    [isEditMode, initialQuizItems, deleteQuestionMutation]
  );

  // Helper to save quiz configuration
  const saveQuizConfig = async (contentId: string) => {
    const questionsToShow = effectiveSettings.showAllQuestions
      ? quizItems.length
      : effectiveSettings.displayedQuestionsCount;

    await configureQuizMutation.mutateAsync({
      contentId,
      config: {
        questions_to_show: questionsToShow,
        is_random_order: effectiveSettings.randomizeQuestions,
        is_random_selection: effectiveSettings.randomSelection,
        passing_score: effectiveSettings.passingScore,
        time_limit_minutes: effectiveSettings.timeLimitMinutes,
      },
    });
  };

  // Handle save button click
  const onSaveClick = async () => {
    setError(null);

    if (isEditMode) {
      if (onSave) {
        onSave(quizName, quizItems, quizSettings);
      } else {
        setIsUpdating(true);
        setUpdateProgress({ current: 0, total: quizItems.length + 1 }); // +1 for config

        const failedQuestions: number[] = [];
        const initialItemIds = new Set(initialQuizItems.map((item) => item.id));

        for (let i = 0; i < quizItems.length; i++) {
          const item = quizItems[i];

          let questionType: "single" | "multiple" = "single";
          if (item.data.questionType === "multiple_choice") {
            questionType = item.data.isMultipleAnswer ? "multiple" : "single";
          }

          const options = item.data.options.map((opt) => ({
            text: opt.text,
            is_correct: opt.isCorrect,
          }));

          const questionData = {
            question_text: item.data.question,
            question_type: questionType,
            difficulty: item.data.difficulty,
            explanation: "",
            options,
          };

          try {
            const isExistingQuestion = initialItemIds.has(item.id);

            if (isExistingQuestion) {
              await updateQuestionMutation.mutateAsync({
                questionId: item.id,
                question: questionData,
              });
            } else {
              await addQuestionMutation.mutateAsync({
                contentId: quizId!,
                question: questionData,
              });
            }
          } catch (error) {
            console.error(`Failed to save question ${i + 1}:`, error);
            failedQuestions.push(i);
          }

          setUpdateProgress({ current: i + 1, total: quizItems.length + 1 });
        }

        // Save quiz configuration
        try {
          await saveQuizConfig(quizId!);
        } catch (error) {
          console.error("Failed to save quiz configuration:", error);
          setError("Gagal menyimpan konfigurasi quiz");
          setIsUpdating(false);
          return;
        }

        setUpdateProgress({ current: quizItems.length + 1, total: quizItems.length + 1 });
        setIsUpdating(false);

        if (failedQuestions.length > 0) {
          setError(`${failedQuestions.length} pertanyaan gagal disimpan`);
          return;
        }

        router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
      }
      return;
    }

    // Create new quiz
    const result = await createQuiz(quizName, quizItems);

    if (result.success && result.contentId) {
      // Configure the quiz after creation
      try {
        await saveQuizConfig(result.contentId);
      } catch (error) {
        console.error("Failed to configure quiz:", error);
        // Quiz is created but config failed - still redirect but show warning
      }

      router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
    } else {
      setError(result.error || "Gagal membuat quiz");
      if (result.failedQuestions && result.failedQuestions.length > 0) {
        console.error("Failed questions indices:", result.failedQuestions);
      }
    }
  };

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
          {isLoading && (
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
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <Button
            variant="outline"
            onClick={onSaveClick}
            disabled={isLoading}
            className="hover:!bg-primary w-full hover:text-white disabled:opacity-50"
          >
            {isLoading ? (isEditMode ? "Memperbarui..." : "Menyimpan...") : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
