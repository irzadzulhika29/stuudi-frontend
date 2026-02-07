"use client";

import { useEffect, useCallback } from "react";
import { useAppSelector } from "@/shared/store/hooks";
import { QuestionAnswer } from "@/shared/types/questionTypes";

const STORAGE_KEY_PREFIX = "exam_answers_";
const FLAGS_KEY_PREFIX = "exam_flags_";

/**
 * Custom hook for persisting exam data locally.
 * Provides offline resilience by caching answers and flags to localStorage.
 */
export function useExamPersistence() {
  const { examData, answers, flaggedQuestions } = useAppSelector((state) => state.exam);

  const examId = examData?.exam_id;

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (examId && Object.keys(answers).length > 0) {
      try {
        console.log(
          `[useExamPersistence] Saving ${Object.keys(answers).length} answers for exam ${examId}`
        );
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${examId}`, JSON.stringify(answers));
      } catch (e) {
        console.error("Failed to persist answers to localStorage:", e);
      }
    }
  }, [answers, examId]);

  // Save flagged questions to localStorage whenever they change
  useEffect(() => {
    if (examId && flaggedQuestions) {
      try {
        console.log(
          `[useExamPersistence] Saving ${flaggedQuestions.length} flags for exam ${examId}`
        );
        localStorage.setItem(`${FLAGS_KEY_PREFIX}${examId}`, JSON.stringify(flaggedQuestions));
      } catch (e) {
        console.error("Failed to persist flags to localStorage:", e);
      }
    }
  }, [flaggedQuestions, examId]);

  // Get cached answers for an exam
  const getCachedAnswers = useCallback((id: string): Record<string, QuestionAnswer> | null => {
    try {
      console.log(`[useExamPersistence] Loading answers for exam ${id}`);
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
      const parsed = stored ? JSON.parse(stored) : null;
      if (parsed)
        console.log(`[useExamPersistence] Found ${Object.keys(parsed).length} cached answers`);
      return parsed;
    } catch {
      return null;
    }
  }, []);

  // Get cached flags for an exam
  const getCachedFlags = useCallback((id: string): string[] | null => {
    try {
      console.log(`[useExamPersistence] Loading flags for exam ${id}`);
      const stored = localStorage.getItem(`${FLAGS_KEY_PREFIX}${id}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  // Clear all cached data for an exam (call on submit)
  const clearCache = useCallback((id: string) => {
    try {
      console.log(`[useExamPersistence] Clearing cache for exam ${id}`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
      localStorage.removeItem(`${FLAGS_KEY_PREFIX}${id}`);
    } catch (e) {
      console.error("Failed to clear exam cache:", e);
    }
  }, []);

  // Check if there's cached data for an exam
  const hasCachedData = useCallback(
    (id: string): boolean => {
      const answers = getCachedAnswers(id);
      return answers !== null && Object.keys(answers).length > 0;
    },
    [getCachedAnswers]
  );

  return {
    getCachedAnswers,
    getCachedFlags,
    clearCache,
    hasCachedData,
  };
}
