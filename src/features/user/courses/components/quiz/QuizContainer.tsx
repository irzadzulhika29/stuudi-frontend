"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import Loading from "@/app/loading";
import {
  QuizData,
  QuizState,
  QuizResultResponse,
  QuizQuestion as QuizQuestionType,
} from "../../types/cTypes";
import { QuestionAnswer } from "@/shared/types/questionTypes";
import { QuizStart } from "./QuizStart";
import { QuizQuestion } from "./QuizQuestion";
import { QuizSummary } from "./QuizSummary";
import { quizService } from "../../services/quizService";

interface QuizContainerProps {
  quiz: QuizData;
  courseId: string;
  topicId: string;
  onStatusChange?: (status: "start" | "in-progress" | "summary") => void;
}

function QuizContainerInner({ quiz, courseId, topicId, onStatusChange }: QuizContainerProps) {
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
  // Removed elapsedTime state to prevent re-renders
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerResult, setLastAnswerResult] = useState<{
    isCorrect: boolean;
    correctAnswerId?: string;
  } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  // Removed console.logs

  const handleBack = () => {
    router.push(`/courses/${courseId}/topic/${topicId}`);
  };

  const handleContinue = () => {
    router.push(`/courses/${courseId}/topic/${topicId}`);
  };

  const handlePause = () => {
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
  };

  const handleResume = useCallback(
    async (attemptId?: string, startedAt?: string) => {
      sessionStorage.setItem(`quiz_session_${quiz.id}`, "true");
      const contentId = localQuiz.id;
      console.log("[QuizContainer] handleResume triggered. Using Content ID:", contentId);
      console.log("[QuizContainer] Manual Started At passed:", startedAt);
      setIsLoading(true);
      try {
        const data = await quizService.resumeQuiz(contentId);
        console.log("[QuizContainer] Resume Data:", data);

        const serverStartedAt = data.started_at || startedAt; // Fallback to passed startedAt if API missing it
        console.log("[QuizContainer] Using Started At:", serverStartedAt);

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

        const startTime = serverStartedAt ? new Date(serverStartedAt).getTime() : Date.now();

        // Map resumed answers to state
        const populatedAnswers: QuestionAnswer[] = new Array(data.questions.length).fill(null);
        if (data.answers && Array.isArray(data.answers)) {
          data.answers.forEach((ans) => {
            // Find index of question
            const qIndex = mappedQuestions.findIndex((q) => q.id === ans.question_id);
            if (qIndex !== -1) {
              populatedAnswers[qIndex] = ans.selected_option_id;
            }
          });
        }

        // Determine current question (first unanswered)
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

        // Check session storage flag
        const isActiveSession = sessionStorage.getItem(`quiz_session_${quiz.id}`);

        if (activeAttempt && isActiveSession) {
          console.log("[QuizContainer] Auto-resuming active attempt:", activeAttempt);
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

  // Removed interval useEffect for elapsedTime

  useEffect(() => {
    onStatusChange?.(state.status);
  }, [state.status, onStatusChange]);

  const handleStart = () => {
    setShowConfirmModal(true);
  };

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
      // Removed setElapsedTime(0)
      setShowFeedback(false);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Failed to start quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = useCallback(
    async (answer: QuestionAnswer) => {
      if (!attemptId || !localQuiz.questions) return;

      const questionTime = (Date.now() - questionStartTime) / 1000;
      const currentQ = localQuiz.questions[state.currentQuestion];

      // Map Answer back to option IDs for the API
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

        // Show feedback (could pass is_correct to UI if needed, for now just show feedback mode)
        // Ideally we need to tell QuizQuestion if it was correct.
        // Let's assume we update the state to reflect correctness or pass it down via a new way or just rely on the fact that we show feedback.
        // But user wants "ketauan bener salah".
        // `QuizQuestion` needs `isCorrect` prop?
        // Let's store the last result temporarily
        setLastAnswerResult({
          isCorrect: response.is_correct,
          correctAnswerId: response.correct_option_id,
        });
        setShowFeedback(true);

        // Auto Advance is now handled by useEffect
      } catch (error) {
        console.error("Failed to save answer:", error);
      }
    },
    [attemptId, localQuiz.questions, questionStartTime, state.currentQuestion]
  );

  const handleNext = useCallback(async () => {
    if (!localQuiz.questions) return;
    const isLast = state.currentQuestion === localQuiz.questions.length - 1;

    if (isLast) {
      // Submit Quiz
      if (!attemptId) return;
      setIsLoading(true);
      try {
        const result = await quizService.submitQuiz(attemptId);
        sessionStorage.removeItem(`quiz_session_${quiz.id}`);
        setLastResult(result); // Use result for summary
        setState((prev) => ({
          ...prev,
          status: "summary",
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
    }
  }, [state.currentQuestion, localQuiz.questions, attemptId, quiz.id]);

  // Auto-advance effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showFeedback && lastAnswerResult) {
      timeout = setTimeout(() => {
        handleNext();
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [showFeedback, lastAnswerResult, handleNext]);

  const handleRetake = () => {
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
  };

  return (
    <div className="px-3 py-4 md:px-4 md:py-6">
      {isLoading && <Loading />}
      {state.status === "start" && (
        <QuizStart
          quiz={quiz}
          lastResult={lastResult || undefined}
          onStart={handleStart}
          onResume={handleResume}
          onContinue={handleContinue}
        />
      )}

      {state.status === "in-progress" && localQuiz.questions && (
        <QuizQuestion
          question={localQuiz.questions[state.currentQuestion]}
          questionNumber={state.currentQuestion + 1}
          totalQuestions={localQuiz.questions.length}
          startTime={state.startTime}
          onSubmit={handleSubmitAnswer}
          showFeedback={showFeedback}
          selectedAnswer={state.answers[state.currentQuestion]}
          onNext={handleNext}
          onPause={handlePause}
          isLastQuestion={state.currentQuestion === localQuiz.questions.length - 1}
          isCorrect={lastAnswerResult?.isCorrect}
          correctAnswerId={lastAnswerResult?.correctAnswerId}
        />
      )}

      {state.status === "summary" && lastResult && (
        <QuizSummary
          correctAnswers={lastResult.correct_answers}
          totalQuestions={lastResult.total_questions}
          averageTime={(() => {
            // Calculate average time if not provided or 0
            if (lastResult.average_answer_time) return lastResult.average_answer_time;

            // Parse time_taken (e.g., "10s" -> 10)
            const totalSeconds = parseInt(lastResult.time_taken.replace(/\D/g, "") || "0");
            if (totalSeconds > 0 && lastResult.total_questions > 0) {
              return totalSeconds / lastResult.total_questions;
            }
            return 0;
          })()}
          expEarned={lastResult.exp_gained || 0}
          score={lastResult.score}
          status={lastResult.status}
          passingScore={lastResult.passing_score}
          onRetake={handleRetake}
          onBack={handleBack}
          questionResults={lastResult.question_results}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmStart}
        title="Mulai Quiz?"
        message="Apakah kamu yakin ingin memulai quiz? Timer akan dimulai setelah kamu menekan tombol mulai."
        confirmText="Mulai Sekarang"
        variant="info"
        isLoading={isLoading}
      />
    </div>
  );
}

export const QuizContainer = QuizContainerInner;
