"use client";

interface ExamCodeDisplayProps {
  examCode: string;
}

export function ExamCodeDisplay({ examCode }: ExamCodeDisplayProps) {
  const copyExamCode = () => {
    navigator.clipboard.writeText(examCode);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/60">Kode Exam:</span>
      <button
        type="button"
        onClick={copyExamCode}
        className="flex items-center gap-2 rounded-lg bg-[#FF9D00] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#E68E00]"
        title="Klik untuk menyalin"
      >
        {examCode}
      </button>
    </div>
  );
}
