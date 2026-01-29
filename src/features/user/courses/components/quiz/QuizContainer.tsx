"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/shared/components/ui/Modal";
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

export function QuizContainer({ quiz, courseId, topicId, onStatusChange }: QuizContainerProps) {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  console.log("[QuizContainer] Quiz data:", quiz);
  console.log("[QuizContainer] Last result state:", lastResult);

  useEffect(() => {
    const fetchLastResult = async () => {
      if (quiz.lastAttemptId) {
        try {
          console.log("[QuizContainer] Fetching last result for:", quiz.lastAttemptId);
          const result = await quizService.getQuizResult(quiz.lastAttemptId);
          console.log("[QuizContainer] Last result from API:", result);
          setLastResult(result);
        } catch (error) {
          console.error("Failed to fetch last result:", error);
        }
      }
    };
    fetchLastResult();
  }, [quiz.lastAttemptId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.status === "in-progress" && !showFeedback) {
      interval = setInterval(() => {
        setElapsedTime((Date.now() - state.startTime) / 1000);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [state.status, state.startTime, showFeedback]);

  useEffect(() => {
    onStatusChange?.(state.status);
  }, [state.status, onStatusChange]);

  const handleStart = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmStart = async () => {
    setIsLoading(true);
    try {
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

      const now = Date.now();
      setState((prev) => ({
        ...prev,
        status: "in-progress",
        startTime: now,
        currentQuestion: 0,
        answers: new Array<QuestionAnswer>(data.questions.length).fill(null),
        correctCount: 0,
        questionTimes: [],
      }));
      setQuestionStartTime(now);
      setElapsedTime(0);
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
        await quizService.saveAnswer(attemptId, currentQ.id, selectedOptionIds);
        setShowFeedback(true);
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
  }, [state.currentQuestion, localQuiz.questions, attemptId]);

  const handleRetake = () => {
    setAttemptId(null);
    setState({
      status: "start",
      currentQuestion: 0,
      answers: [],
      correctCount: 0,
      startTime: 0,
      questionTimes: [],
    });
    setElapsedTime(0);
    setShowFeedback(false);
  };

  const handleBack = () => {
    router.push(`/courses/${courseId}/topic/${topicId}`);
  };

  const handleContinue = () => {
    router.push(`/courses/${courseId}/topic/${topicId}`);
  };

  const handleResume = async () => {
    setIsLoading(true);
    try {
      const data = await quizService.resumeQuiz(localQuiz.id);

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

      const now = Date.now();
      setState((prev) => ({
        ...prev,
        status: "in-progress",
        startTime: now,
        currentQuestion: 0,
        answers: new Array<QuestionAnswer>(data.questions.length).fill(null), // Or hydrate if API provided answers
        correctCount: 0,
        questionTimes: [],
      }));
      setQuestionStartTime(now);
      setElapsedTime(0);
      setShowFeedback(false);
    } catch (error) {
      console.error("Failed to resume quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-3 py-4 md:px-4 md:py-6">
      {state.status === "start" && (
        <QuizStart
          quiz={quiz}
          lastResult={lastResult || undefined}
          onStart={handleStart}
          onResume={quiz.lastAttemptId ? handleResume : undefined}
          onContinue={handleContinue}
        />
      )}

      {state.status === "in-progress" && localQuiz.questions && (
        <QuizQuestion
          question={localQuiz.questions[state.currentQuestion]}
          questionNumber={state.currentQuestion + 1}
          totalQuestions={localQuiz.questions.length}
          elapsedTime={elapsedTime}
          onSubmit={handleSubmitAnswer}
          showFeedback={showFeedback}
          selectedAnswer={state.answers[state.currentQuestion]}
          onNext={handleNext}
          isLastQuestion={state.currentQuestion === localQuiz.questions.length - 1}
        />
      )}

      {state.status === "summary" && lastResult && (
        <QuizSummary
          correctAnswers={lastResult.correct_answers}
          totalQuestions={lastResult.total_questions}
          averageTime={0} // Computed from time_taken if needed, or 0
          expEarned={lastResult.exp_gained || 0}
          onRetake={handleRetake}
          onBack={handleBack}
        />
      )}

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Mulai Quiz?"
        size="sm"
      >
        <p className="mb-6 text-neutral-600">
          Apakah kamu yakin ingin memulai quiz? Timer akan dimulai setelah kamu menekan tombol
          mulai.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="flex-1 rounded-lg border border-neutral-200 py-2.5 font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmStart}
            disabled={isLoading}
            className="bg-primary-dark hover:bg-primary-dark/90 flex-1 rounded-lg py-2.5 font-medium text-white transition-colors disabled:opacity-50"
          >
            {isLoading ? "Memuat..." : "Mulai Sekarang"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
