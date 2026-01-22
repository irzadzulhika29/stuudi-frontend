"use client";

export interface QuizSettings {
  randomizeQuestions: boolean;
  showAllQuestions: boolean;
  displayedQuestionsCount: number;
  protector: boolean;
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
    <div className="bg-[#C67B39] rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-6">Pengaturan Quiz</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Tampilkan Soal Secara Acak */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">
            Tampilkan Soal Secara Acak
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.randomizeQuestions}
              onChange={(e) =>
                onSettingsChange("randomizeQuestions", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-6 h-6 bg-white border-2 border-white/50 rounded flex items-center justify-center peer-checked:bg-[#FF9D00] transition-colors">
              {settings.randomizeQuestions && (
                <svg
                  className="w-4 h-4 text-white"
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
          <label className="text-sm font-medium text-white">
            Tampilkan Semua Soal
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showAllQuestions}
              onChange={(e) =>
                onSettingsChange("showAllQuestions", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-6 h-6 bg-white border-2 border-white/50 rounded flex items-center justify-center peer-checked:bg-[#FF9D00] transition-colors">
              {settings.showAllQuestions && (
                <svg
                  className="w-4 h-4 text-white"
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
         {/* Protector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Protector</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.protector}
              onChange={(e) => onSettingsChange("protector", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-6 h-6 bg-white border-2 border-white/50 rounded flex items-center justify-center peer-checked:bg-[#FF9D00] transition-colors">
              {settings.protector && (
                <svg
                  className="w-4 h-4 text-white"
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

        {/* Jumlah Soal yang Ditampilkan */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">
            Jumlah Soal yang Ditampilkan
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={totalQuestions || 100}
              value={settings.displayedQuestionsCount}
              onChange={(e) =>
                onSettingsChange(
                  "displayedQuestionsCount",
                  parseInt(e.target.value) || 1,
                )
              }
              disabled={settings.showAllQuestions}
              className="w-20 px-3 py-2 bg-white border border-white/20 rounded-lg text-black text-center focus:outline-none focus:ring-2 focus:ring-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-white font-medium">
              / {totalQuestions} Soal
            </span>
          </div>
        </div>

       
      </div>
    </div>
  );
}
