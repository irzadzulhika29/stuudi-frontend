"use client";

import React, { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/shared/components/ui/Button";

interface ExamFooterProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinishAttempt: () => void;
}

export const ExamFooter = memo(function ExamFooter({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onFinishAttempt,
}: ExamFooterProps) {
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
        variant={isLast ? "primary" : "secondary"}
        size="md"
        onClick={isLast ? onFinishAttempt : onNext}
        icon={isLast ? undefined : <ChevronRight size={20} />}
      >
        {isLast ? "Selesai ujian" : "Soal selanjutnya"}
      </Button>
    </footer>
  );
});
