"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { QuizQuestion as QuizQuestionType } from "../../types/cTypes";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  elapsedTime: number;
  onSubmit: (selectedOption: number) => void;
  showFeedback: boolean;
  selectedAnswer: number | null;
  onNext: () => void;
  isLastQuestion: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  elapsedTime,
  onSubmit,
  showFeedback,
  selectedAnswer,
  onNext,
  isLastQuestion,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(selectedAnswer);

  // Sync selected state when selectedAnswer prop changes (for navigation between questions)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(selectedAnswer);
  }, [selectedAnswer, question.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const centisecs = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${Math.floor(secs).toString().padStart(2, "0")},${centisecs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (selected !== null) {
      onSubmit(selected);
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-white md:text-3xl">
        {question.question.split(" ").slice(0, 2).join(" ")}
      </h1>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white">
            {questionNumber}
          </span>
          <span className="bg-primary-light rounded-full px-3 py-1.5 text-xs font-medium text-white">
            /{totalQuestions} Question Done
          </span>
        </div>
        <div className="flex items-center gap-2 text-white">
          <Clock size={20} />
          <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
        </div>
      </div>

      <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white/80">
            Soal No. {questionNumber}
          </span>
          <span className="text-sm font-medium text-red-400">Required*</span>
        </div>

        {question.image && (
          <div className="relative mx-auto mb-4 aspect-square w-full max-w-xs overflow-hidden rounded-lg">
            <Image src={question.image} alt="Question illustration" fill className="object-cover" />
          </div>
        )}

        <p className="mb-6 font-medium text-white">{question.question}</p>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let optionClass = "border-white/20 hover:border-white/40";

            if (showFeedback && selectedAnswer !== null) {
              if (index === question.correctAnswer) {
                optionClass = "border-emerald-500 bg-emerald-500/20";
              } else if (index === selectedAnswer && !isCorrect) {
                optionClass = "border-red-500 bg-red-500/20";
              }
            } else if (selected === index) {
              optionClass = "border-primary-light bg-primary-light/20";
            }

            return (
              <label
                key={index}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${optionClass} ${
                  showFeedback ? "pointer-events-none" : ""
                }`}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  checked={selected === index}
                  onChange={() => !showFeedback && setSelected(index)}
                  disabled={showFeedback}
                  className="accent-primary-light h-4 w-4"
                />
                <span className="text-sm text-white">{option}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          {!showFeedback ? (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className={`rounded-lg px-6 py-2.5 font-medium transition-colors ${
                selected !== null
                  ? "bg-primary-light hover:bg-primary-light/90 text-white"
                  : "cursor-not-allowed bg-white/20 text-white/50"
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={onNext}
              className="bg-secondary hover:bg-secondary-dark rounded-lg px-6 py-2.5 font-medium text-white transition-colors"
            >
              {isLastQuestion ? "Lihat Hasil" : "Selanjutnya"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
