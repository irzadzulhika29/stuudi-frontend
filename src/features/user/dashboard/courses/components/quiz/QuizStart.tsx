"use client";

import { QuizData } from "../../types/cTypes";

interface QuizStartProps {
  quiz: QuizData;
  onStart: () => void;
  onContinue: () => void;
}

export function QuizStart({ quiz, onStart, onContinue }: QuizStartProps) {
  const { previousAttempt } = quiz;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {quiz.title}
        </h1>
        <p className="text-white/80 leading-relaxed mb-6">{quiz.description}</p>

        <button
          onClick={onStart}
          className="bg-secondary text-white font-semibold px-8 py-3 rounded-full hover:bg-secondary-dark transition-colors"
        >
          Mulai
        </button>

        {previousAttempt && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-white text-center mb-6">
              Record of Your Last Attemps
            </h2>
            <div className="flex justify-center gap-4">
              <div className="bg-secondary rounded-2xl px-6 py-4 text-center min-w-[160px]">
                <p className="text-white text-sm font-medium mb-2">
                  Completion Points
                </p>
                <p className="text-white">
                  <span className="text-4xl font-bold">
                    +{previousAttempt.completionPoints}
                  </span>
                  <span className="text-lg ml-1">exp</span>
                </p>
              </div>
              <div className="bg-secondary rounded-2xl px-6 py-4 text-center min-w-[160px]">
                <p className="text-white text-sm font-medium mb-2">
                  Correct Answer
                </p>
                <p className="text-white">
                  <span className="text-4xl font-bold">
                    {previousAttempt.correctAnswers}/
                    {previousAttempt.totalQuestions}
                  </span>
                  <span className="text-lg ml-1">questions</span>
                </p>
              </div>
              <div className="bg-secondary rounded-2xl px-6 py-4 text-center min-w-[160px]">
                <p className="text-white text-sm font-medium mb-2">
                  Average Answer Time
                </p>
                <p className="text-white">
                  <span className="text-4xl font-bold">
                    {previousAttempt.averageTime.toFixed(2)}
                  </span>
                  <span className="text-lg ml-1">sec/question</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={onContinue}
            className="bg-secondary text-white font-medium px-8 py-3 rounded-full hover:bg-secondary-dark transition-colors"
          >
            Continue to the next lesson
          </button>
        </div>
      </div>
    </div>
  );
}
