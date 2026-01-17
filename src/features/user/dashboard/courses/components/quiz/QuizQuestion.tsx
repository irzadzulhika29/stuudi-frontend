"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { QuizQuestion as QuizQuestionType } from "../../types/cTypes";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  completedCount: number;
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
  completedCount,
  elapsedTime,
  onSubmit,
  showFeedback,
  selectedAnswer,
  onNext,
  isLastQuestion,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(selectedAnswer);

  useEffect(() => {
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
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        {question.question.split(" ").slice(0, 2).join(" ")}
      </h1>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {questionNumber}
          </span>
          <span className="bg-primary-light text-white text-xs font-medium px-3 py-1.5 rounded-full">
            /{totalQuestions} Question Done
          </span>
        </div>
        <div className="flex items-center gap-2 text-white">
          <Clock size={20} />
          <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-white/80 bg-white/10 px-3 py-1.5 rounded-lg">
            Soal No. {questionNumber}
          </span>
          <span className="text-sm text-red-400 font-medium">Required*</span>
        </div>

        {question.image && (
          <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden mb-4 mx-auto">
            <Image
              src={question.image}
              alt="Question illustration"
              fill
              className="object-cover"
            />
          </div>
        )}

        <p className="text-white font-medium mb-6">{question.question}</p>

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
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${optionClass} ${
                  showFeedback ? "pointer-events-none" : ""
                }`}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  checked={selected === index}
                  onChange={() => !showFeedback && setSelected(index)}
                  disabled={showFeedback}
                  className="w-4 h-4 accent-primary-light"
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
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                selected !== null
                  ? "bg-primary-light text-white hover:bg-primary-light/90"
                  : "bg-white/20 text-white/50 cursor-not-allowed"
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={onNext}
              className="bg-secondary text-white font-medium px-6 py-2.5 rounded-lg hover:bg-secondary-dark transition-colors"
            >
              {isLastQuestion ? "Lihat Hasil" : "Selanjutnya"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
