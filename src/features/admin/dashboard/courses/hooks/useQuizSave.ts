"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QuizItem } from "../containers/QuizFormContainer";
import { QuizSettings } from "../components/quiz";
import { transformQuizItemToApiFormat } from "../utils/quizTransformers";
import { validateQuizName, validateQuizItems } from "../utils/quizValidators";
import { useCreateQuiz, useUpdateQuizQuestion, useAddQuizQuestions } from "./useCreateQuiz";
import { useConfigureQuiz } from "./useQuizConfig";

interface UseQuizSaveProps {
  courseId: string;
  manageCoursesId: string;
  topicId?: string;
  quizId?: string;
  isEditMode?: boolean;
  initialQuizItems?: QuizItem[];
  onSave?: (quizName: string, quizItems: QuizItem[], settings: QuizSettings) => void;
}

export function useQuizSave({
  courseId,
  manageCoursesId,
  topicId,
  quizId,
  isEditMode = false,
  initialQuizItems = [],
  onSave,
}: UseQuizSaveProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [saveError, setSaveError] = useState<string | null>(null);

  // API mutations
  const { createQuiz, isCreating, progress: createProgress } = useCreateQuiz(topicId || "");
  const updateQuestionMutation = useUpdateQuizQuestion();
  const addQuestionMutation = useAddQuizQuestions();
  const configureQuizMutation = useConfigureQuiz();

  // Save quiz configuration
  const saveQuizConfig = useCallback(
    async (contentId: string, quizItems: QuizItem[], settings: QuizSettings) => {
      const questionsToShow = settings.showAllQuestions
        ? quizItems.length
        : settings.displayedQuestionsCount;

      await configureQuizMutation.mutateAsync({
        contentId,
        config: {
          questions_to_show: questionsToShow,
          is_random_order: settings.randomizeQuestions,
          is_random_selection: settings.randomSelection,
          passing_score: settings.passingScore,
          time_limit_minutes: settings.timeLimitMinutes,
        },
      });
    },
    [configureQuizMutation]
  );

  // Handle save for edit mode
  const handleEditModeSave = useCallback(
    async (
      quizName: string,
      quizItems: QuizItem[],
      settings: QuizSettings
    ): Promise<{ success: boolean; error?: string }> => {
      if (onSave) {
        onSave(quizName, quizItems, settings);
        return { success: true };
      }

      setIsSaving(true);
      setProgress({ current: 0, total: quizItems.length + 1 }); // +1 for config

      const failedQuestions: number[] = [];
      const initialItemIds = new Set(initialQuizItems.map((item) => item.id));

      // Save each question
      for (let i = 0; i < quizItems.length; i++) {
        const item = quizItems[i];

        try {
          const questionData = transformQuizItemToApiFormat(item);
          const isExistingQuestion = initialItemIds.has(item.id);

          if (isExistingQuestion) {
            console.log(`Updating question ${i + 1}/${quizItems.length}`);
            await updateQuestionMutation.mutateAsync({
              questionId: item.id,
              question: questionData,
            });
          } else {
            console.log(`Adding new question ${i + 1}/${quizItems.length}`);
            await addQuestionMutation.mutateAsync({
              contentId: quizId!,
              question: questionData,
            });
          }
        } catch (error) {
          console.error(`Failed to save question ${i + 1}:`, error);
          failedQuestions.push(i);
        }

        setProgress({ current: i + 1, total: quizItems.length + 1 });
      }

      // Save quiz configuration
      try {
        console.log("Saving quiz configuration...");
        await saveQuizConfig(quizId!, quizItems, settings);
        console.log("Quiz configuration saved successfully");
      } catch (error) {
        console.error("Failed to save quiz configuration:", error);
        setIsSaving(false);
        return { success: false, error: "Gagal menyimpan konfigurasi quiz" };
      }

      setProgress({ current: quizItems.length + 1, total: quizItems.length + 1 });
      setIsSaving(false);

      if (failedQuestions.length > 0) {
        return {
          success: false,
          error: `${failedQuestions.length} pertanyaan gagal disimpan`,
        };
      }

      // Navigate back on success
      router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
      return { success: true };
    },
    [
      quizId,
      onSave,
      initialQuizItems,
      updateQuestionMutation,
      addQuestionMutation,
      saveQuizConfig,
      router,
      courseId,
      manageCoursesId,
    ]
  );

  // Handle save for create mode
  const handleCreateModeSave = useCallback(
    async (
      quizName: string,
      quizItems: QuizItem[],
      settings: QuizSettings
    ): Promise<{ success: boolean; error?: string }> => {
      const result = await createQuiz(quizName, quizItems);

      if (result.success && result.contentId) {
        console.log("Quiz created successfully with ID:", result.contentId);

        // Configure the quiz after creation
        try {
          console.log("Configuring quiz...");
          await saveQuizConfig(result.contentId, quizItems, settings);
          console.log("Quiz configured successfully");
        } catch (error) {
          console.error("Failed to configure quiz:", error);
          // Quiz is created but config failed - still redirect but could show warning
        }

        router.push(`/dashboard-admin/courses/${courseId}/manage/${manageCoursesId}`);
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || "Gagal membuat quiz",
        };
      }
    },
    [createQuiz, saveQuizConfig, router, courseId, manageCoursesId]
  );

  // Main save handler
  const handleSave = useCallback(
    async (quizName: string, quizItems: QuizItem[], settings: QuizSettings): Promise<void> => {
      // Validate quiz name
      const nameValidation = validateQuizName(quizName);
      if (!nameValidation.isValid) {
        setSaveError(nameValidation.error || "Nama quiz tidak valid");
        return;
      }

      // Validate quiz items
      const itemsValidation = validateQuizItems(quizItems);
      if (!itemsValidation.isValid) {
        setSaveError(itemsValidation.error || "Ada kesalahan pada pertanyaan");
        return;
      }

      // Check topicId for create mode
      if (!isEditMode && !topicId) {
        setSaveError("Topic ID tidak ditemukan");
        return;
      }

      setSaveError(null);

      // Save based on mode
      const result = isEditMode
        ? await handleEditModeSave(quizName, quizItems, settings)
        : await handleCreateModeSave(quizName, quizItems, settings);

      if (!result.success && result.error) {
        setSaveError(result.error);
      }
    },
    [isEditMode, topicId, handleEditModeSave, handleCreateModeSave]
  );

  const isLoading = isEditMode ? isSaving : isCreating;
  const currentProgress = isEditMode ? progress : createProgress;

  return {
    handleSave,
    isLoading,
    progress: currentProgress,
    saveError,
    setSaveError,
  };
}
