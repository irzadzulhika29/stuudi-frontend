"use client";

import { useState, useCallback } from "react";
import { QuizItem } from "../containers/QuizFormContainer";
import { QuizData } from "../components/material";
import { generateDefaultQuizItem } from "../utils/quizTransformers";
import { validateQuizItems } from "../utils/quizValidators";
import { useDeleteQuizQuestion } from "./useCreateQuiz";

interface UseQuizItemsProps {
  initialItems?: QuizItem[];
  isEditMode?: boolean;
}

export function useQuizItems({ initialItems = [], isEditMode = false }: UseQuizItemsProps) {
  const [quizItems, setQuizItems] = useState<QuizItem[]>(initialItems);
  const deleteQuestionMutation = useDeleteQuizQuestion();

  // Add new quiz question
  const addQuizItem = useCallback((type: "single" | "multiple" | "matching" = "single") => {
    const newQuiz = generateDefaultQuizItem(type);
    setQuizItems((prev) => [...prev, newQuiz]);
  }, []);

  // Update quiz content
  const updateQuizItem = useCallback((id: string, data: QuizData) => {
    setQuizItems((prev) => prev.map((item) => (item.id === id ? { ...item, data } : item)));
  }, []);

  // Move quiz up or down
  const moveQuizItem = useCallback((index: number, direction: "up" | "down") => {
    setQuizItems((prev) => {
      const newItems = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newItems.length) return prev;
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      return newItems;
    });
  }, []);

  // Delete quiz question
  const deleteQuizItem = useCallback(
    async (id: string) => {
      // Check if this is a server-side question (UUID format) vs client-side (quiz-xxx format)
      const isServerQuestion = !id.startsWith("quiz-");
      const initialItemIds = new Set(initialItems.map((item) => item.id));
      const isExistingQuestion = initialItemIds.has(id);

      // Only delete from server if:
      // 1. In edit mode
      // 2. This is an existing question (in initialItems)
      // 3. This is a server-side question (UUID format, not quiz-xxx)
      if (isEditMode && isExistingQuestion && isServerQuestion) {
        try {
          console.log(`Deleting question ${id}...`);
          await deleteQuestionMutation.mutateAsync({ questionId: id });
          console.log(`Question ${id} deleted successfully`);
        } catch (error) {
          console.error(`Failed to delete question ${id}:`, error);
          throw new Error("Gagal menghapus pertanyaan");
        }
      }

      // Remove from local state
      setQuizItems((prev) => prev.filter((item) => item.id !== id));
    },
    [isEditMode, initialItems, deleteQuestionMutation]
  );

  // Delete all quiz items
  const clearAllItems = useCallback(() => {
    setQuizItems([]);
  }, []);

  // Validate all quiz items
  const validateItems = useCallback((): { isValid: boolean; error?: string } => {
    return validateQuizItems(quizItems);
  }, [quizItems]);

  return {
    quizItems,
    setQuizItems,
    addQuizItem,
    updateQuizItem,
    moveQuizItem,
    deleteQuizItem,
    clearAllItems,
    validateItems,
  };
}
