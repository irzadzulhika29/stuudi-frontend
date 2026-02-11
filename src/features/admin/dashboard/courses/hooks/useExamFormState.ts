import { useState, useCallback, useMemo } from "react";
import { QuizData } from "@/features/admin/dashboard/courses/components/material";
import {
  formatDateTimeLocal,
  transformApiQuestionsToQuizItems,
  generateDefaultQuizItem,
} from "../utils";
import { useGetExamDetails } from "./useGetExamDetails";
import { QuizItem } from "../types";

export type { QuizItem };

export const DEFAULT_EXAM_STATE = {
  title: "",
  description: "",
  duration: 120,
  passingScore: 70.0,
  startTime: "",
  endTime: "",
  maxAttempts: 2,
  questionsToShow: 0, // Will be set to total questions count
  isRandomOrder: false,
  isRandomSelection: false,
  quizItems: [] as QuizItem[],
};

interface UseExamFormStateProps {
  examId?: string;
  isEditMode: boolean;
}

export function useExamFormState({ examId, isEditMode }: UseExamFormStateProps) {
  // Fetch exam details if in edit mode
  const { data: examDetails, isLoading: isLoadingExam } = useGetExamDetails(
    isEditMode && examId ? examId : ""
  );

  // Derive initial values from API data
  const initialValues = useMemo(() => {
    if (isEditMode && examDetails) {
      const questions = transformApiQuestionsToQuizItems(examDetails);
      // Default questionsToShow to total questions count if not set or is 0
      const questionsToShowValue =
        examDetails.questions_to_show > 0 ? examDetails.questions_to_show : questions.length;

      return {
        title: examDetails.title,
        description: examDetails.description,
        duration: examDetails.duration,
        passingScore: examDetails.passing_score,
        startTime: formatDateTimeLocal(examDetails.start_time),
        endTime: formatDateTimeLocal(examDetails.end_time),
        maxAttempts: examDetails.max_attempts,
        questionsToShow: questionsToShowValue,
        isRandomOrder: examDetails.is_random_order,
        isRandomSelection: examDetails.is_random_selection,
        quizItems: questions,
      };
    }
    return DEFAULT_EXAM_STATE;
  }, [isEditMode, examDetails]);

  // Track if user has started editing (to stop syncing with server)
  const [hasSyncedWithServer, setHasSyncedWithServer] = useState(false);

  // Exam Metadata - local state for user edits
  const [localExamTitle, setLocalExamTitle] = useState("");
  const [localExamDescription, setLocalExamDescription] = useState("");
  const [localExamDuration, setLocalExamDuration] = useState(120);
  const [localExamPassingScore, setLocalExamPassingScore] = useState(70.0);
  const [localExamStartTime, setLocalExamStartTime] = useState("");
  const [localExamEndTime, setLocalExamEndTime] = useState("");
  const [localExamMaxAttempts, setLocalExamMaxAttempts] = useState(2);
  const [localQuestionsToShow, setLocalQuestionsToShow] = useState(5);
  const [localIsRandomOrder, setLocalIsRandomOrder] = useState(false);
  const [localIsRandomSelection, setLocalIsRandomSelection] = useState(false);
  const [localQuizItems, setLocalQuizItems] = useState<QuizItem[]>([]);

  // Effective values: use server data until user starts editing
  const examTitle = hasSyncedWithServer ? localExamTitle : initialValues.title;
  const examDescription = hasSyncedWithServer ? localExamDescription : initialValues.description;
  const examDuration = hasSyncedWithServer ? localExamDuration : initialValues.duration;
  const examPassingScore = hasSyncedWithServer ? localExamPassingScore : initialValues.passingScore;
  const examStartTime = hasSyncedWithServer ? localExamStartTime : initialValues.startTime;
  const examEndTime = hasSyncedWithServer ? localExamEndTime : initialValues.endTime;
  const examMaxAttempts = hasSyncedWithServer ? localExamMaxAttempts : initialValues.maxAttempts;
  const isRandomOrder = hasSyncedWithServer ? localIsRandomOrder : initialValues.isRandomOrder;
  const isRandomSelection = hasSyncedWithServer
    ? localIsRandomSelection
    : initialValues.isRandomSelection;
  const quizItems = hasSyncedWithServer ? localQuizItems : initialValues.quizItems;

  // questionsToShow defaults to total questions count if 0 or not set
  const rawQuestionsToShow = hasSyncedWithServer
    ? localQuestionsToShow
    : initialValues.questionsToShow;
  const questionsToShow = rawQuestionsToShow > 0 ? rawQuestionsToShow : quizItems.length;

  // Helper to sync with server and then update local state
  const syncAndUpdate = useCallback(
    <T>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
      if (!hasSyncedWithServer) {
        setHasSyncedWithServer(true);
        // For edit mode, sync all local state with server data first
        if (isEditMode && examDetails) {
          setLocalExamTitle(initialValues.title);
          setLocalExamDescription(initialValues.description);
          setLocalExamDuration(initialValues.duration);
          setLocalExamPassingScore(initialValues.passingScore);
          setLocalExamStartTime(initialValues.startTime);
          setLocalExamEndTime(initialValues.endTime);
          setLocalExamMaxAttempts(initialValues.maxAttempts);
          setLocalQuestionsToShow(initialValues.questionsToShow);
          setLocalIsRandomOrder(initialValues.isRandomOrder);
          setLocalIsRandomSelection(initialValues.isRandomSelection);
          setLocalQuizItems(initialValues.quizItems);
        }
      }
      setter(value);
    },
    [hasSyncedWithServer, isEditMode, examDetails, initialValues]
  );

  // Wrapped setters that sync first
  const setExamTitle = useCallback(
    (v: string) => syncAndUpdate(setLocalExamTitle, v),
    [syncAndUpdate]
  );
  const setExamDescription = useCallback(
    (v: string) => syncAndUpdate(setLocalExamDescription, v),
    [syncAndUpdate]
  );
  const setExamDuration = useCallback(
    (v: number) => syncAndUpdate(setLocalExamDuration, v),
    [syncAndUpdate]
  );
  const setExamPassingScore = useCallback(
    (v: number) => syncAndUpdate(setLocalExamPassingScore, v),
    [syncAndUpdate]
  );
  const setExamStartTime = useCallback(
    (v: string) => syncAndUpdate(setLocalExamStartTime, v),
    [syncAndUpdate]
  );
  const setExamEndTime = useCallback(
    (v: string) => syncAndUpdate(setLocalExamEndTime, v),
    [syncAndUpdate]
  );
  const setExamMaxAttempts = useCallback(
    (v: number) => syncAndUpdate(setLocalExamMaxAttempts, v),
    [syncAndUpdate]
  );
  const setQuestionsToShow = useCallback(
    (v: number) => syncAndUpdate(setLocalQuestionsToShow, v),
    [syncAndUpdate]
  );
  const setIsRandomOrder = useCallback(
    (v: boolean) => syncAndUpdate(setLocalIsRandomOrder, v),
    [syncAndUpdate]
  );
  const setIsRandomSelection = useCallback(
    (v: boolean) => syncAndUpdate(setLocalIsRandomSelection, v),
    [syncAndUpdate]
  );
  const setQuizItems = useCallback(
    (v: QuizItem[] | ((prev: QuizItem[]) => QuizItem[])) => {
      if (!hasSyncedWithServer) {
        setHasSyncedWithServer(true);
        // For edit mode, sync all local state with server data first
        if (isEditMode && examDetails) {
          setLocalExamTitle(initialValues.title);
          setLocalExamDescription(initialValues.description);
          setLocalExamDuration(initialValues.duration);
          setLocalExamPassingScore(initialValues.passingScore);
          setLocalExamStartTime(initialValues.startTime);
          setLocalExamEndTime(initialValues.endTime);
          setLocalExamMaxAttempts(initialValues.maxAttempts);
          setLocalQuestionsToShow(initialValues.questionsToShow);
          setLocalIsRandomOrder(initialValues.isRandomOrder);
          setLocalIsRandomSelection(initialValues.isRandomSelection);
          setLocalQuizItems(initialValues.quizItems);
        }
      }
      setLocalQuizItems(v);
    },
    [hasSyncedWithServer, isEditMode, examDetails, initialValues]
  );

  // Quiz item actions
  const addQuizQuestion = useCallback(() => {
    const newQuiz = generateDefaultQuizItem("single");
    setQuizItems((prev) => [...prev, newQuiz]);
  }, [setQuizItems]);

  const updateQuizContent = useCallback(
    (id: string, data: QuizData) => {
      setQuizItems((prev) => prev.map((item) => (item.id === id ? { ...item, data } : item)));
    },
    [setQuizItems]
  );

  const moveQuiz = useCallback(
    (index: number, direction: "up" | "down") => {
      setQuizItems((prev) => {
        const newItems = [...prev];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return prev;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        return newItems;
      });
    },
    [setQuizItems]
  );

  const deleteQuiz = useCallback(
    (id: string) => {
      setQuizItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setQuizItems]
  );

  return {
    // Exam details
    examDetails,
    isLoadingExam,

    // State values
    examTitle,
    examDescription,
    examDuration,
    examPassingScore,
    examStartTime,
    examEndTime,
    examMaxAttempts,
    questionsToShow,
    isRandomOrder,
    isRandomSelection,
    quizItems,

    // State setters
    setExamTitle,
    setExamDescription,
    setExamDuration,
    setExamPassingScore,
    setExamStartTime,
    setExamEndTime,
    setExamMaxAttempts,
    setQuestionsToShow,
    setIsRandomOrder,
    setIsRandomSelection,
    setQuizItems,

    // Quiz item actions
    addQuizQuestion,
    updateQuizContent,
    moveQuiz,
    deleteQuiz,
  };
}
