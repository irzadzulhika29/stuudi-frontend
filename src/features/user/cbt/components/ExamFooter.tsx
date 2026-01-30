"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/shared/components/ui/Button";

interface ExamFooterProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function ExamFooter({ currentIndex, totalQuestions, onPrevious, onNext }: ExamFooterProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <footer className="flex w-full items-center justify-between gap-4">
      <Button
        variant="secondary"
        size="md"
        onClick={onPrevious}
        disabled={isFirst}
        icon={<ChevronLeft size={20} />}
        iconPosition="left"
      >
        Soal sebelumnya
      </Button>

      <Button
        variant="secondary"
        size="md"
        onClick={onNext}
        disabled={isLast}
        icon={<ChevronRight size={20} />}
      >
        Soal selanjutnya
      </Button>
    </footer>
  );
}
