"use client";

import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import Loading from "@/app/loading";
import { QuizData } from "../../types/cTypes";
import { QuizStart } from "./QuizStart";
import { QuizQuestion } from "./QuizQuestion";
import { QuizSummary } from "./QuizSummary";
import { useQuizLogic } from "./useQuizLogic";
import { useEffect } from "react";

interface QuizContainerProps {
  quiz: QuizData;
  courseId: string;
  topicId: string;
  onStatusChange?: (status: "start" | "in-progress" | "summary") => void;
}

function QuizContainerInner({ quiz, courseId, topicId, onStatusChange }: QuizContainerProps) {
  const {
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
    handleContinue,
    setShowConfirmModal,
  } = useQuizLogic({ quiz, courseId, topicId });

  useEffect(() => {
    onStatusChange?.(state.status);
  }, [state.status, onStatusChange]);

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
            if (lastResult.average_answer_time) return lastResult.average_answer_time;
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
