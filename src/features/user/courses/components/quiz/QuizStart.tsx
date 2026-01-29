"use client";

import { QuizData, QuizResultResponse } from "../../types/cTypes";

interface QuizStartProps {
  quiz: QuizData;
  lastResult?: QuizResultResponse;
  onStart: () => void;
  onResume?: () => void;
  onContinue: () => void;
}

export function QuizStart({ quiz, lastResult, onStart, onResume, onContinue }: QuizStartProps) {
  const { previousAttempt } = quiz;

  console.log("[QuizStart] Props:", {
    hasLastResult: !!lastResult,
    lastResultStatus: lastResult?.status,
    hasOnResume: !!onResume,
  });

  const stats = lastResult
    ? {
        completionPoints: lastResult.total_exp || lastResult.exp_gained || 0,
        correctAnswers: lastResult.correct_answers,
        totalQuestions: lastResult.total_questions,
        averageTime: lastResult.time_taken,
      }
    : previousAttempt;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <h1 className="mb-4 text-2xl font-bold text-white md:text-3xl">{quiz.title}</h1>
        <p className="mb-6 leading-relaxed text-white/80">{quiz.description}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onStart}
            className="bg-secondary hover:bg-secondary-dark rounded-full px-8 py-3 font-semibold text-white transition-colors"
          >
            Mulai
          </button>

          {onResume && (
            <button
              onClick={onResume}
              className="bg-primary hover:bg-primary-dark rounded-full px-8 py-3 font-semibold text-white ring-1 ring-white/20 transition-colors"
            >
              Lanjutkan
            </button>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-4 text-center text-xs text-white/50">
          <p>Last Result: {lastResult?.status || "None"}</p>
          <p>Resume Available: {onResume ? "Yes" : "No"}</p>
        </div>

        {stats && (
          <div className="mt-10">
            <h2 className="mb-6 text-center text-lg font-semibold text-white">
              Record of Your Last Attemps
            </h2>
            <div className="flex justify-center gap-4">
              <div className="bg-secondary min-w-[160px] rounded-2xl px-6 py-4 text-center">
                <p className="mb-2 text-sm font-medium text-white">Completion Points</p>
                <p className="text-white">
                  <span className="text-4xl font-bold">+{stats.completionPoints}</span>
                  <span className="ml-1 text-lg">exp</span>
                </p>
              </div>
              <div className="bg-secondary min-w-[160px] rounded-2xl px-6 py-4 text-center">
                <p className="mb-2 text-sm font-medium text-white">Correct Answer</p>
                <p className="text-white">
                  <span className="text-4xl font-bold">
                    {stats.correctAnswers}/{stats.totalQuestions}
                  </span>
                  <span className="ml-1 text-lg">questions</span>
                </p>
              </div>
              <div className="bg-secondary min-w-[160px] rounded-2xl px-6 py-4 text-center">
                <p className="mb-2 text-sm font-medium text-white">Average Answer Time</p>
                <p className="text-white">
                  <span className="text-4xl font-bold">
                    {typeof stats.averageTime === "number"
                      ? stats.averageTime.toFixed(2)
                      : typeof stats.averageTime === "string"
                        ? stats.averageTime.split(" ")[0]
                        : "0"}
                  </span>
                  <span className="ml-1 text-lg">sec/question</span>
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onContinue}
            className="bg-secondary hover:bg-secondary-dark rounded-full px-8 py-3 font-medium text-white transition-colors"
          >
            Continue to the next lesson
          </button>
        </div>
      </div>
    </div>
  );
}
