"use client";

import { useState, useCallback, useMemo } from "react";
import { ChevronLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuizBox, QuizData } from "@/features/admin/dashboard/courses/components/material";
import {
  QuizSettingsPanel,
  QuizSettings,
} from "@/features/admin/dashboard/courses/components/quiz";
import { Button } from "@/shared/components/ui";
import {
  useCreateQuiz,
  useUpdateQuizQuestion,
  useAddQuizQuestions,
  useDeleteQuizQuestion,
} from "../hooks/useCreateQuiz";
import { useConfigureQuiz, useGetQuizConfig } from "../hooks/useQuizConfig";

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

// Default settings
const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  randomizeQuestions: false,
  randomSelection: false,
  showAllQuestions: false,
  displayedQuestionsCount: 10,
  passingScore: 70.0,
  timeLimitMinutes: 60,
};

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState({ current: 0, total: 0 });

  // Use the create quiz hook (only for new quizzes)
  const { createQuiz, isCreating, progress } = useCreateQuiz(topicId || "");

  // Use update question hook for edit mode
  const updateQuestionMutation = useUpdateQuizQuestion();
  const addQuestionMutation = useAddQuizQuestions();
  const deleteQuestionMutation = useDeleteQuizQuestion();

  // Quiz configuration hooks
  const configureQuizMutation = useConfigureQuiz();
  const { data: existingConfig, isLoading: isLoadingConfig } = useGetQuizConfig(
    isEditMode && quizId ? quizId : ""
  );

  // Derive initial settings from existingConfig or use defaults
  const initialSettings = useMemo<QuizSettings>(() => {
    if (isEditMode && existingConfig) {
      return {
        randomizeQuestions: existingConfig.is_random_order,
        randomSelection: existingConfig.is_random_selection,
        showAllQuestions: false,
        displayedQuestionsCount: existingConfig.questions_to_show,
        passingScore: existingConfig.passing_score,
        timeLimitMinutes: existingConfig.time_limit_minutes,
      };
    }
    return DEFAULT_QUIZ_SETTINGS;
  }, [isEditMode, existingConfig]);

  const [quizSettings, setQuizSettings] = useState<QuizSettings>(DEFAULT_QUIZ_SETTINGS);

  // Track if we've synced with server data
  const [hasSyncedWithServer, setHasSyncedWithServer] = useState(false);

  // Sync settings when data loads (only once)
  const effectiveSettings = useMemo(() => {
    if (isEditMode && existingConfig && !hasSyncedWithServer) {
      return initialSettings;
    }
    return quizSettings;
  }, [isEditMode, existingConfig, hasSyncedWithServer, initialSettings, quizSettings]);

  // Update local state when settings change from server
  const handleSettingsChange = useCallback(
    (key: keyof QuizSettings, value: boolean | number) => {
      if (!hasSyncedWithServer && isEditMode && existingConfig) {
        setHasSyncedWithServer(true);
        setQuizSettings(initialSettings);
      }
      setQuizSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [hasSyncedWithServer, isEditMode, existingConfig, initialSettings]
  );

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

  const deleteQuiz = useCallback(
    async (id: string) => {
      const initialItemIds = new Set(initialQuizItems.map((item) => item.id));
      const isExistingQuestion = initialItemIds.has(id);

      if (isEditMode && isExistingQuestion) {
        try {
          console.log(`Deleting question ${id}...`);
          await deleteQuestionMutation.mutateAsync({ questionId: id });
          console.log(`Question ${id} deleted successfully`);
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

  const handleSave = async () => {
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
              console.log(`Updating question ${i + 1}/${quizItems.length}:`, questionData);
              await updateQuestionMutation.mutateAsync({
                questionId: item.id,
                question: questionData,
              });
              console.log(`Question ${i + 1} updated successfully`);
            } else {
              console.log(`Adding new question ${i + 1}/${quizItems.length}:`, questionData);
              await addQuestionMutation.mutateAsync({
                contentId: quizId!,
                question: questionData,
              });
              console.log(`Question ${i + 1} added successfully`);
            }
          } catch (error) {
            console.error(`Failed to save question ${i + 1}:`, error);
            failedQuestions.push(i);
          }

          setUpdateProgress({ current: i + 1, total: quizItems.length + 1 });
        }

        // Save quiz configuration
        try {
          console.log("Saving quiz configuration...");
          await saveQuizConfig(quizId!);
          console.log("Quiz configuration saved successfully");
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

        console.log("Quiz updated successfully");
        router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
      }
      return;
    }

    // Create new quiz
    const result = await createQuiz(quizName, quizItems);

    if (result.success && result.contentId) {
      console.log("Quiz created successfully with ID:", result.contentId);

      // Configure the quiz after creation
      try {
        console.log("Configuring quiz...");
        await saveQuizConfig(result.contentId);
        console.log("Quiz configured successfully");
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
            settings={effectiveSettings}
            totalQuestions={quizItems.length}
            onSettingsChange={handleSettingsChange}
          />

          {error && <div className="rounded-lg bg-red-500/20 p-4 text-red-200">{error}</div>}

          {(isCreating || isUpdating) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>
                  {isEditMode ? "Memperbarui" : "Menyimpan"}... (
                  {isEditMode ? updateProgress.current : progress.current}/
                  {isEditMode ? updateProgress.total : progress.total})
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{
                    width: `${((isEditMode ? updateProgress.current : progress.current) / (isEditMode ? updateProgress.total : progress.total)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isCreating || isUpdating}
            className="hover:!bg-primary w-full hover:text-white disabled:opacity-50"
          >
            {isCreating || isUpdating ? (isEditMode ? "Memperbarui..." : "Menyimpan...") : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
