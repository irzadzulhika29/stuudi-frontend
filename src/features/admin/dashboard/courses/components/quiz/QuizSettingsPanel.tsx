"use client";

export interface QuizSettings {
  randomizeQuestions: boolean; // maps to is_random_order
  randomSelection: boolean; // maps to is_random_selection
  showAllQuestions: boolean; // if true, show all; else use displayedQuestionsCount
  displayedQuestionsCount: number; // maps to questions_to_show
  passingScore: number; // maps to passing_score
  timeLimitMinutes: number; // maps to time_limit_minutes
}

interface QuizSettingsPanelProps {
  settings: QuizSettings;
  totalQuestions: number;
  onSettingsChange: (key: keyof QuizSettings, value: boolean | number) => void;
}

export function QuizSettingsPanel({
  settings,
  totalQuestions,
  onSettingsChange,
}: QuizSettingsPanelProps) {
  return (
    <div className="mb-8 rounded-lg bg-[#C67B39] p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Pengaturan Quiz</h2>

      <div className="mb-6 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        {/* Tampilkan Soal Secara Acak */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Urutan Soal Acak</label>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.randomizeQuestions}
              onChange={(e) => onSettingsChange("randomizeQuestions", e.target.checked)}
              className="peer sr-only"
            />
            <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-white/50 bg-white transition-colors peer-checked:bg-[#FF9D00]">
              {settings.randomizeQuestions && (
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </label>
        </div>

        {/* Pemilihan Soal Acak */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Pemilihan Soal Acak</label>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.randomSelection}
              onChange={(e) => onSettingsChange("randomSelection", e.target.checked)}
              className="peer sr-only"
            />
            <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-white/50 bg-white transition-colors peer-checked:bg-[#FF9D00]">
              {settings.randomSelection && (
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </label>
        </div>

        {/* Tampilkan Semua Soal */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Tampilkan Semua Soal</label>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.showAllQuestions}
              onChange={(e) => onSettingsChange("showAllQuestions", e.target.checked)}
              className="peer sr-only"
            />
            <div className="flex h-6 w-6 items-center justify-center rounded border-2 border-white/50 bg-white transition-colors peer-checked:bg-[#FF9D00]">
              {settings.showAllQuestions && (
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        {/* Jumlah Soal yang Ditampilkan */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Jumlah Soal Ditampilkan</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={totalQuestions || 100}
              value={settings.displayedQuestionsCount}
              onChange={(e) =>
                onSettingsChange("displayedQuestionsCount", parseInt(e.target.value) || 1)
              }
              disabled={settings.showAllQuestions}
              className="w-20 rounded-lg border border-white/20 bg-white px-3 py-2 text-center text-black transition-all focus:ring-2 focus:ring-white/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="font-medium text-white">/ {totalQuestions} Soal</span>
          </div>
        </div>

        {/* Nilai Kelulusan */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Nilai Kelulusan (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={settings.passingScore}
            onChange={(e) => onSettingsChange("passingScore", parseFloat(e.target.value) || 0)}
            className="w-24 rounded-lg border border-white/20 bg-white px-3 py-2 text-center text-black transition-all focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        {/* Batas Waktu */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Batas Waktu (menit)</label>
          <input
            type="number"
            min={1}
            value={settings.timeLimitMinutes}
            onChange={(e) => onSettingsChange("timeLimitMinutes", parseInt(e.target.value) || 60)}
            className="w-24 rounded-lg border border-white/20 bg-white px-3 py-2 text-center text-black transition-all focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
