"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/shared/components/ui/Modal";
import { QuizData, QuizState } from "../../types/cTypes";
import { QuizStart } from "./QuizStart";
import { QuizQuestion } from "./QuizQuestion";
import { QuizSummary } from "./QuizSummary";

interface QuizContainerProps {
  quiz: QuizData;
  courseId: string;
  topicId: string;
  onStatusChange?: (status: "start" | "in-progress" | "summary") => void;
}

export function QuizContainer({ quiz, courseId, topicId, onStatusChange }: QuizContainerProps) {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [state, setState] = useState<QuizState>({
    status: "start",
    currentQuestion: 0,
    answers: new Array(quiz.questions.length).fill(null),
    correctCount: 0,
    startTime: 0,
    questionTimes: [],
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(0);

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

  const handleConfirmStart = () => {
    setShowConfirmModal(false);
    const now = Date.now();
    setState((prev) => ({
      ...prev,
      status: "in-progress",
      startTime: now,
      currentQuestion: 0,
      answers: new Array(quiz.questions.length).fill(null),
      correctCount: 0,
      questionTimes: [],
    }));
    setQuestionStartTime(now);
    setElapsedTime(0);
    setShowFeedback(false);
  };

  const handleSubmitAnswer = useCallback(
    (selectedOption: number) => {
      const questionTime = (Date.now() - questionStartTime) / 1000;
      const currentQ = quiz.questions[state.currentQuestion];
      const isCorrect = selectedOption === currentQ.correctAnswer;

      setState((prev) => ({
        ...prev,
        answers: prev.answers.map((a, i) => (i === prev.currentQuestion ? selectedOption : a)),
        correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
        questionTimes: [...prev.questionTimes, questionTime],
      }));
      setShowFeedback(true);
    },
    [questionStartTime, quiz.questions, state.currentQuestion]
  );

  const handleNext = useCallback(() => {
    const isLast = state.currentQuestion === quiz.questions.length - 1;

    if (isLast) {
      setState((prev) => ({
        ...prev,
        status: "summary",
      }));
    } else {
      setState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
      setQuestionStartTime(Date.now());
      setShowFeedback(false);
    }
  }, [state.currentQuestion, quiz.questions.length]);

  const handleRetake = () => {
    setState({
      status: "start",
      currentQuestion: 0,
      answers: new Array(quiz.questions.length).fill(null),
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

  const averageTime =
    state.questionTimes.length > 0
      ? state.questionTimes.reduce((a, b) => a + b, 0) / state.questionTimes.length
      : 0;

  const expEarned = Math.round((state.correctCount / quiz.questions.length) * 500);

  return (
    <div className="px-3 py-4 md:px-4 md:py-6">
      {state.status === "start" && (
        <QuizStart quiz={quiz} onStart={handleStart} onContinue={handleContinue} />
      )}

      {state.status === "in-progress" && (
        <QuizQuestion
          question={quiz.questions[state.currentQuestion]}
          questionNumber={state.currentQuestion + 1}
          totalQuestions={quiz.questions.length}
          elapsedTime={elapsedTime}
          onSubmit={handleSubmitAnswer}
          showFeedback={showFeedback}
          selectedAnswer={state.answers[state.currentQuestion]}
          onNext={handleNext}
          isLastQuestion={state.currentQuestion === quiz.questions.length - 1}
        />
      )}

      {state.status === "summary" && (
        <QuizSummary
          correctAnswers={state.correctCount}
          totalQuestions={quiz.questions.length}
          averageTime={averageTime}
          expEarned={expEarned}
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
            className="bg-primary-dark hover:bg-primary-dark/90 flex-1 rounded-lg py-2.5 font-medium text-white transition-colors"
          >
            Mulai Sekarang
          </button>
        </div>
      </Modal>
    </div>
  );
}
