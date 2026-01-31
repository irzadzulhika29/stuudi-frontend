"use client";

interface ExamMetadataFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  duration: number;
  onDurationChange: (value: number) => void;
  passingScore: number;
  onPassingScoreChange: (value: number) => void;
  startTime: string;
  onStartTimeChange: (value: string) => void;
  endTime: string;
  onEndTimeChange: (value: string) => void;
  maxAttempts: number;
  onMaxAttemptsChange: (value: number) => void;
  examCode?: string;
}

export function ExamMetadataForm({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  duration,
  onDurationChange,
  passingScore,
  onPassingScoreChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  maxAttempts,
  onMaxAttemptsChange,
  examCode,
}: ExamMetadataFormProps) {
  const copyExamCode = () => {
    if (examCode) {
      navigator.clipboard.writeText(examCode);
    }
  };
  return (
    <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Informasi Exam</h2>
        {examCode && (
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
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-white">Judul Exam</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Masukkan judul exam"
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white transition-all placeholder:text-white/60 focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-white">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Masukkan deskripsi exam"
            rows={3}
            className="w-full resize-none rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white transition-all placeholder:text-white/60 focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Durasi (menit)</label>
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => onDurationChange(parseInt(e.target.value) || 60)}
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white transition-all focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        {/* Passing Score */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Nilai Kelulusan (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={passingScore}
            onChange={(e) => onPassingScoreChange(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white transition-all focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        {/* Start Time */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Waktu Mulai</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white [color-scheme:dark] transition-all focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Waktu Selesai</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white [color-scheme:dark] transition-all focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>

        {/* Max Attempts */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Maksimal Percobaan</label>
          <input
            type="number"
            min={1}
            value={maxAttempts}
            onChange={(e) => onMaxAttemptsChange(parseInt(e.target.value) || 1)}
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white transition-all focus:ring-2 focus:ring-white/30 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
