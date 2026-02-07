"use client";

import { useState, useCallback, useEffect } from "react";
import { QuizData, QuizState, QuizQuestion } from "../types/cTypes";
import { QuestionAnswer, QuestionType } from "@/shared/types/questionTypes";
import { quizService } from "../services/quizService";

interface UseQuizStateOptions {
  quiz: QuizData;
  onStatusChange?: (status: "start" | "in-progress" | "summary") => void;
}

interface UseQuizStateReturn {
  state: QuizState;
  localQuiz: QuizData;
  attemptId: string | null;
  isLoading: boolean;
  questionStartTime: number;
  showFeedback: boolean;
  lastAnswerResult: { isCorrect: boolean; correctAnswerId?: string } | null;

  // Actions
  startQuiz: () => Promise<void>;
  resumeQuiz: (attemptId?: string, startedAt?: string) => Promise<void>;
  pauseQuiz: () => void;
  submitAnswer: (answer: QuestionAnswer) => Promise<void>;
  goToNext: () => Promise<void>;
  setShowFeedback: (show: boolean) => void;
  setState: React.Dispatch<React.SetStateAction<QuizState>>;
}

/**
 * Custom hook for managing quiz state.
 * Handles starting, resuming, pausing, and answer submission.
 */
export function useQuizState({ quiz, onStatusChange }: UseQuizStateOptions): UseQuizStateReturn {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localQuiz, setLocalQuiz] = useState<QuizData>(quiz);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerResult, setLastAnswerResult] = useState<{
    isCorrect: boolean;
    correctAnswerId?: string;
  } | null>(null);

  const [state, setState] = useState<QuizState>({
    status: "start",
    currentQuestion: 0,
    answers: [],
    correctCount: 0,
    startTime: 0,
    questionTimes: [],
  });

  // Notify status changes
  useEffect(() => {
    onStatusChange?.(state.status);
  }, [state.status, onStatusChange]);

  const mapQuestions = (questions: unknown[]): QuizQuestion[] => {
    return questions.map((q: unknown) => {
      const question = q as {
        question_id: string;
        question_text: string;
        question_type: string;
        image_url?: string;
        points: number;
        options: Array<{
          option_id: string;
          option_text: string;
          sequence: number;
        }>;
      };
      return {
        id: question.question_id,
        text: question.question_text,
        type: question.question_type as QuestionType,
        image: question.image_url || undefined,
        points: question.points,
        options: question.options.map((o) => ({
          id: o.option_id,
          text: o.option_text,
          sequence: o.sequence,
        })),
        correctAnswer: -1,
      };
    });
  };

  const startQuiz = useCallback(async () => {
    setIsLoading(true);
    try {
      sessionStorage.setItem(`quiz_session_${quiz.id}`, "true");
      const data = await quizService.startQuiz(localQuiz.id);
      const mappedQuestions = mapQuestions(data.questions);

      setLocalQuiz((prev) => ({
        ...prev,
        questions: mappedQuestions,
      }));
      setAttemptId(data.attempt_id);

      const startTime = new Date(data.started_at).getTime();
      setState({
        status: "in-progress",
        startTime,
        currentQuestion: 0,
        answers: new Array<QuestionAnswer>(data.questions.length).fill(null),
        correctCount: 0,
        questionTimes: [],
      });
      setQuestionStartTime(Date.now());
      setShowFeedback(false);
    } catch (error) {
      console.error("Failed to start quiz:", error);
    } finally {
      setIsLoading(false);
    }
  }, [quiz.id, localQuiz.id]);

  const resumeQuiz = useCallback(
    async (manualAttemptId?: string, startedAt?: string) => {
      sessionStorage.setItem(`quiz_session_${quiz.id}`, "true");
      setIsLoading(true);
      try {
        const data = await quizService.resumeQuiz(localQuiz.id);
        const mappedQuestions = mapQuestions(data.questions);

        setLocalQuiz((prev) => ({
          ...prev,
          questions: mappedQuestions,
        }));
        setAttemptId(data.attempt_id);

        const serverStartedAt = data.started_at || startedAt;
        const startTime = serverStartedAt ? new Date(serverStartedAt).getTime() : Date.now();

        // Map resumed answers to state
        const populatedAnswers: QuestionAnswer[] = new Array(data.questions.length).fill(null);
        if (data.answers && Array.isArray(data.answers)) {
          data.answers.forEach((ans: { question_id: string; selected_option_id: string }) => {
            const qIndex = mappedQuestions.findIndex((q) => q.id === ans.question_id);
            if (qIndex !== -1) {
              populatedAnswers[qIndex] = ans.selected_option_id;
            }
          });
        }

        const answeredCount = populatedAnswers.filter((a) => a !== null).length;
        const nextQuestionIndex = Math.min(answeredCount, mappedQuestions.length - 1);

        setState({
          status: "in-progress",
          startTime,
          currentQuestion: nextQuestionIndex,
          answers: populatedAnswers,
          correctCount: 0,
          questionTimes: [],
        });
        setQuestionStartTime(Date.now());
        setShowFeedback(false);
      } catch (error) {
        console.error("Failed to resume quiz:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [quiz.id, localQuiz.id]
  );

  const pauseQuiz = useCallback(() => {
    sessionStorage.removeItem(`quiz_session_${quiz.id}`);
    setState({
      status: "start",
      currentQuestion: 0,
      answers: [],
      correctCount: 0,
      startTime: 0,
      questionTimes: [],
    });
    setShowFeedback(false);
  }, [quiz.id]);

  const submitAnswer = useCallback(
    async (answer: QuestionAnswer) => {
      if (!attemptId || !localQuiz.questions) return;

      const questionTime = (Date.now() - questionStartTime) / 1000;
      const currentQ = localQuiz.questions[state.currentQuestion];

      let selectedOptionIds: string[] = [];
      if (typeof answer === "string") {
        selectedOptionIds = [answer];
      } else if (Array.isArray(answer)) {
        selectedOptionIds = answer as string[];
      } else if (answer && typeof answer === "object") {
        selectedOptionIds = Object.values(answer as Record<string, string>);
      }

      setState((prev) => ({
        ...prev,
        answers: prev.answers.map((a, i) => (i === prev.currentQuestion ? answer : a)),
        questionTimes: [...prev.questionTimes, questionTime],
      }));

      try {
        // Determine payload based on question type or selection count
        const payload = currentQ.type === "multiple" ? selectedOptionIds : selectedOptionIds[0];

        const response = await quizService.saveAnswer(attemptId, currentQ.id, payload);
        setLastAnswerResult({
          isCorrect: response.is_correct,
          correctAnswerId: response.correct_option_id,
        });
        setShowFeedback(true);
      } catch (error) {
        console.error("Failed to save answer:", error);
      }
    },
    [attemptId, localQuiz.questions, questionStartTime, state.currentQuestion]
  );

  const goToNext = useCallback(async () => {
    if (!localQuiz.questions) return;
    const isLast = state.currentQuestion === localQuiz.questions.length - 1;

    if (isLast && attemptId) {
      setIsLoading(true);
      try {
        const result = await quizService.submitQuiz(attemptId);
        sessionStorage.removeItem(`quiz_session_${quiz.id}`);
        setState((prev) => ({
          ...prev,
          status: "summary",
          correctCount: result.score || 0,
        }));
      } catch (error) {
        console.error("Failed to submit quiz:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
      setQuestionStartTime(Date.now());
      setShowFeedback(false);
      setLastAnswerResult(null);
    }
  }, [attemptId, localQuiz.questions, quiz.id, state.currentQuestion]);

  return {
    state,
    localQuiz,
    attemptId,
    isLoading,
    questionStartTime,
    showFeedback,
    lastAnswerResult,
    startQuiz,
    resumeQuiz,
    pauseQuiz,
    submitAnswer,
    goToNext,
    setShowFeedback,
    setState,
  };
}
