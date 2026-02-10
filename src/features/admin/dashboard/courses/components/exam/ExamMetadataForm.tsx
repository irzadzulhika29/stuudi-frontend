"use client";

import { ExamFormInput } from "./ExamFormInput";
import { ExamFormTextarea } from "./ExamFormTextarea";
import { ExamFormNumber } from "./ExamFormNumber";
import { ExamFormDatetime } from "./ExamFormDatetime";
import { ExamCodeDisplay } from "./ExamCodeDisplay";

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
  return (
    <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Informasi Exam</h2>
        {examCode && <ExamCodeDisplay examCode={examCode} />}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ExamFormInput
          label="Judul Exam"
          value={title}
          onChange={onTitleChange}
          placeholder="Masukkan judul exam"
          className="md:col-span-2"
        />

        <ExamFormTextarea
          label="Deskripsi"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Masukkan deskripsi exam"
          rows={3}
          className="md:col-span-2"
        />

        <ExamFormNumber
          label="Durasi (menit)"
          value={duration}
          onChange={onDurationChange}
          min={1}
        />

        <ExamFormNumber
          label="Nilai Kelulusan (%)"
          value={passingScore}
          onChange={onPassingScoreChange}
          min={0}
          max={100}
          step={0.1}
        />

        <ExamFormDatetime label="Waktu Mulai" value={startTime} onChange={onStartTimeChange} />

        <ExamFormDatetime label="Waktu Selesai" value={endTime} onChange={onEndTimeChange} />

        <ExamFormNumber
          label="Maksimal Percobaan"
          value={maxAttempts}
          onChange={onMaxAttemptsChange}
          min={1}
        />
      </div>
    </div>
  );
}
