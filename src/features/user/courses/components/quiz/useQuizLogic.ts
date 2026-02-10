import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  QuizData,
  QuizState,
  QuizResultResponse,
  QuizQuestion as QuizQuestionType,
} from "../../types/cTypes";
import { QuestionAnswer } from "@/shared/types/questionTypes";
import { quizService } from "../../services/quizService";

interface UseQuizLogicProps {
  quiz: QuizData;
  courseId: string;
  topicId: string;
}

export function useQuizLogic({ quiz, courseId, topicId }: UseQuizLogicProps) {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastResult, setLastResult] = useState<QuizResultResponse | null>(null);
  const [localQuiz, setLocalQuiz] = useState<QuizData>(quiz);

  const [state, setState] = useState<QuizState>({
    status: "start",
    currentQuestion: 0,
    answers: [],
    correctCount: 0,
    startTime: 0,
    questionTimes: [],
  });

  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerResult, setLastAnswerResult] = useState<{
    isCorrect: boolean;
    correctAnswerId?: string;
  } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  const handleBack = useCallback(() => {
    router.push(`/courses/${courseId}/topic/${topicId}`);
  }, [router, courseId, topicId]);

  const handlePause = useCallback(() => {
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

  const handleResume = useCallback(
    async (attemptId?: string, startedAt?: string) => {
      sessionStorage.setItem(`quiz_session_${quiz.id}`, "true");
      const contentId = localQuiz.id;

      setIsLoading(true);
      try {
        const data = await quizService.resumeQuiz(contentId);
        const serverStartedAt = data.started_at || startedAt;

        const mappedQuestions: QuizQuestionType[] = data.questions.map((q) => ({
          id: q.question_id,
          text: q.question_text,
          type: q.question_type,
          image: q.image_url || undefined,
          points: q.points,
          options: q.options.map((o) => ({
            id: o.option_id,
            text: o.option_text,
            sequence: o.sequence,
          })),
          correctAnswer: -1,
        }));

        setLocalQuiz((prev) => ({ ...prev, questions: mappedQuestions }));
        setAttemptId(data.attempt_id);

        const startTime = serverStartedAt ? new Date(serverStartedAt).getTime() : Date.now();

        // Map resumed answers to state
        const populatedAnswers: QuestionAnswer[] = new Array(data.questions.length).fill(null);
        if (data.answers && Array.isArray(data.answers)) {
          data.answers.forEach((ans) => {
            const qIndex = mappedQuestions.findIndex((q) => q.id === ans.question_id);
            if (qIndex !== -1) {
              populatedAnswers[qIndex] = ans.selected_option_id;
            }
          });
        }

        const answeredCount = populatedAnswers.filter((a) => a !== null).length;
        const nextQuestionIndex = Math.min(answeredCount, mappedQuestions.length - 1);

        setState((prev) => ({
          ...prev,
          status: "in-progress",
          startTime: startTime,
          currentQuestion: nextQuestionIndex,
          answers: populatedAnswers,
          correctCount: 0,
          questionTimes: [],
        }));
        setQuestionStartTime(Date.now());
        setShowFeedback(false);
      } catch (error) {
        console.error("Failed to resume quiz:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [localQuiz.id, quiz.id]
  );

  const handleNext = useCallback(async () => {
    if (!localQuiz.questions) return;
    const isLast = state.currentQuestion === localQuiz.questions.length - 1;

    if (isLast) {
      if (!attemptId) return;
      setIsLoading(true);
      try {
        const result = await quizService.submitQuiz(attemptId);
        sessionStorage.removeItem(`quiz_session_${quiz.id}`);
        setLastResult(result);
        setState((prev) => ({ ...prev, status: "summary" }));
      } catch (error) {
        console.error("Failed to submit quiz:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setState((prev) => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
      setQuestionStartTime(Date.now());
      setShowFeedback(false);
    }
  }, [state.currentQuestion, localQuiz.questions, attemptId, quiz.id]);

  const handleSubmitAnswer = useCallback(
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

  const handleRetake = useCallback(() => {
    sessionStorage.removeItem(`quiz_session_${quiz.id}`);
    setAttemptId(null);
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

  const handleStart = () => setShowConfirmModal(true);

  const handleConfirmStart = async () => {
    setIsLoading(true);
    try {
      sessionStorage.setItem(`quiz_session_${quiz.id}`, "true");
      const data = await quizService.startQuiz(localQuiz.id);

      const mappedQuestions: QuizQuestionType[] = data.questions.map((q) => ({
        id: q.question_id,
        text: q.question_text,
        type: q.question_type,
        image: q.image_url || undefined,
        points: q.points,
        options: q.options.map((o) => ({
          id: o.option_id,
          text: o.option_text,
          sequence: o.sequence,
        })),
        correctAnswer: -1,
      }));

      setLocalQuiz((prev) => ({
        ...prev,
        questions: mappedQuestions,
      }));
      setAttemptId(data.attempt_id);

      const startTime = new Date(data.started_at).getTime();
      setState((prev) => ({
        ...prev,
        status: "in-progress",
        startTime: startTime,
        currentQuestion: 0,
        answers: new Array<QuestionAnswer>(data.questions.length).fill(null),
        correctCount: 0,
        questionTimes: [],
      }));
      setQuestionStartTime(Date.now());
      setShowFeedback(false);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Failed to start quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-advance
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showFeedback && lastAnswerResult) {
      timeout = setTimeout(() => {
        handleNext();
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [showFeedback, lastAnswerResult, handleNext]);

  // Initial Data Fetching
  useEffect(() => {
    const fetchLastResult = async () => {
      if (quiz.lastAttemptId) {
        try {
          const result = await quizService.getQuizResult(quiz.lastAttemptId);
          setLastResult(result);
        } catch (error) {
          console.error("Failed to fetch last result:", error);
        }
      }
    };

    const checkActiveAttempt = async () => {
      setIsLoading(true);
      try {
        const attempts = await quizService.getQuizAttempts(quiz.id);
        const activeAttempt = attempts.find(
          (a) => a.content_id === quiz.id && a.status.toLowerCase() == "in_progress"
        );

        const isActiveSession = sessionStorage.getItem(`quiz_session_${quiz.id}`);

        if (activeAttempt && isActiveSession) {
          await handleResume(activeAttempt.attempt_id, activeAttempt.started_at);
        }
      } catch (error) {
        console.error("Failed to check active attempt:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastResult();
    checkActiveAttempt();
  }, [quiz.lastAttemptId, quiz.id, handleResume]);

  return {
    state,
    localQuiz,
    isLoading,
    lastResult,
    showConfirmModal,
    showFeedback,
    lastAnswerResult,
    handleStart,
    handleConfirmStart,
    handleSubmitAnswer,
    handleNext,
    handleBack,
    handlePause,
    handleRetake,
    handleResume,
    handleContinue: handleBack, // Same action
    setShowConfirmModal,
  };
}
