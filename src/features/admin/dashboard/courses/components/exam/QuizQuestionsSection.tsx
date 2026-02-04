"use client";

import { Plus, Trash2 } from "lucide-react";
import { QuizBox, QuizData } from "@/features/admin/dashboard/courses/components/material";
import { QuizItem } from "../../hooks/useExamFormState";

interface QuizQuestionsSectionProps {
  quizItems: QuizItem[];
  onAddQuestion: () => void;
  onUpdateContent: (id: string, data: QuizData) => void;
  onMoveQuiz: (index: number, direction: "up" | "down") => void;
  onDeleteQuestion: (id: string) => void;
  onClearAll: () => void;
}

export function QuizQuestionsSection({
  quizItems,
  onAddQuestion,
  onUpdateContent,
  onMoveQuiz,
  onDeleteQuestion,
  onClearAll,
}: QuizQuestionsSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Soal Exam</h2>

      <div className="space-y-4">
        {quizItems.map((item, index) => (
          <QuizBox
            key={item.id}
            id={item.id}
            data={item.data}
            onChange={onUpdateContent}
            onMoveUp={() => onMoveQuiz(index, "up")}
            onMoveDown={() => onMoveQuiz(index, "down")}
            onDelete={() => onDeleteQuestion(item.id)}
            canMoveUp={index > 0}
            canMoveDown={index < quizItems.length - 1}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-neutral-gray hover:text-error hover:bg-error/10 rounded-lg p-2 transition-all"
          title="Hapus semua"
          onClick={onClearAll}
        >
          <Trash2 className="hover:text-gray h-5 w-5 text-white" />
        </button>
        <button
          type="button"
          onClick={onAddQuestion}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/50 bg-transparent px-6 py-3 text-white transition-all hover:border-white hover:bg-white/20"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Tambah Pertanyaan</span>
        </button>
      </div>
    </div>
  );
}
