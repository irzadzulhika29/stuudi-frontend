"use client";

import { useState, useMemo, useCallback } from "react";
import { QuizSettings } from "../components/quiz";
import { useGetQuizConfig } from "./useQuizConfig";
import { validateQuizName } from "../utils/quizValidators";

const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  randomizeQuestions: false,
  randomSelection: false,
  showAllQuestions: false,
  displayedQuestionsCount: 10,
  passingScore: 70.0,
  timeLimitMinutes: 60,
};

interface UseQuizFormProps {
  initialQuizName?: string;
  isEditMode?: boolean;
  quizId?: string;
}

export function useQuizForm({
  initialQuizName = "",
  isEditMode = false,
  quizId,
}: UseQuizFormProps) {
  const [quizName, setQuizName] = useState(initialQuizName);
  const [error, setError] = useState<string | null>(null);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>(DEFAULT_QUIZ_SETTINGS);
  const [hasSyncedWithServer, setHasSyncedWithServer] = useState(false);

  // Fetch existing config for edit mode
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

  // Validate quiz name
  const validateName = useCallback((): boolean => {
    const validation = validateQuizName(quizName);
    if (!validation.isValid) {
      setError(validation.error || "Nama quiz tidak valid");
      return false;
    }
    return true;
  }, [quizName]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    quizName,
    setQuizName,
    error,
    setError,
    clearError,
    quizSettings,
    setQuizSettings,
    effectiveSettings,
    handleSettingsChange,
    isLoadingConfig,
    validateName,
  };
}
