"use client";

interface ExamConfigPanelProps {
  questionsToShow: number;
  onQuestionsToShowChange: (value: number) => void;
  isRandomOrder: boolean;
  onRandomOrderChange: (value: boolean) => void;
  isRandomSelection: boolean;
  onRandomSelectionChange: (value: boolean) => void;
  totalQuestions: number;
}

export function ExamConfigPanel({
  questionsToShow,
  onQuestionsToShowChange,
  isRandomOrder,
  onRandomOrderChange,
  isRandomSelection,
  onRandomSelectionChange,
  totalQuestions,
}: ExamConfigPanelProps) {
  return (
    <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <h2 className="mb-6 text-xl font-bold text-white">Konfigurasi Exam</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Questions to Show */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Jumlah Soal Ditampilkan</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={totalQuestions || 100}
              value={questionsToShow}
              onChange={(e) => onQuestionsToShowChange(parseInt(e.target.value) || 1)}
              className="w-24 rounded-lg border border-white/20 bg-transparent px-4 py-3 text-center text-white transition-all focus:ring-2 focus:ring-white/30 focus:outline-none"
            />
            <span className="text-white/60">/ {totalQuestions} soal</span>
          </div>
        </div>

        {/* Random Order */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Urutan Acak</label>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={isRandomOrder}
              onChange={(e) => onRandomOrderChange(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-white/20 peer-checked:bg-[#FF9D00] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>

        {/* Random Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Pemilihan Acak</label>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={isRandomSelection}
              onChange={(e) => onRandomSelectionChange(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-white/20 peer-checked:bg-[#FF9D00] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
