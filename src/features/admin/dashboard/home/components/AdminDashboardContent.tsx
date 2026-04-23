"use client";

import { useState, useRef, useEffect } from "react";
import { AdminLeaderboard } from "./AdminLeaderboard";
import { AdminStatsCards } from "./AdminStatsCards";
import { AdminExamStats } from "./AdminExamStats";
import { useGetAllExams } from "../hooks/useGetAllExams";
import { useGetExamDashboard } from "../hooks/useGetExamDashboard";
import { useGetExamResults } from "../hooks/useGetExamResults";

interface DropdownOption {
  value: string;
  label: string;
}

interface GlassDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function GlassDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
}: GlassDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-medium backdrop-blur-md transition-all ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-white/40 hover:bg-white/15"
        } ${isOpen ? "border-secondary ring-secondary/30 ring-2" : ""}`}
      >
        <span className={selectedOption ? "text-white" : "text-white/50"}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`h-5 w-5 text-white/60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <div className="max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="text-primary/50 px-4 py-3 text-center text-sm">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-3 text-left text-sm transition-all hover:bg-gray-100 ${
                    option.value === value
                      ? "bg-secondary/10 text-secondary font-medium"
                      : "text-primary"
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminDashboardContent() {
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const { data: exams, isLoading: isLoadingExams } = useGetAllExams();
  const { data: examDashboard, isLoading: isLoadingDashboard } =
    useGetExamDashboard(selectedExamId);
  const { data: examResults, isLoading: isLoadingResults } = useGetExamResults(selectedExamId);

  const examOptions =
    exams?.map((exam) => ({
      value: exam.exam_id,
      label: exam.title,
    })) ?? [];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl">
        {/* Header with Exam Dropdown */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-white md:text-4xl">
              Welcome back, <span className="text-secondary">Admin</span>
            </h1>
            <p className="text-white/60">Lihat performa kegiatan platform pada hari ini.</p>
          </div>

          {/* Exam Dropdown */}
          <div className="w-full md:w-72">
            <GlassDropdown
              options={examOptions}
              value={selectedExamId}
              onChange={setSelectedExamId}
              placeholder={isLoadingExams ? "Memuat exam..." : "Pilih Exam"}
              disabled={isLoadingExams}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <AdminStatsCards
          totalParticipants={examDashboard?.total_participants}
          disqualifiedParticipants={examDashboard?.disqualified_participants}
          cheatingReports={examDashboard?.cheating_reports}
          isLoading={isLoadingDashboard && !!selectedExamId}
          examId={selectedExamId}
        />

        {/* Exam Performance Stats */}
        {selectedExamId && (
          <div className="mb-6">
            {isLoadingResults ? (
              <div>
                <h2 className="mb-4 text-xl font-bold text-white">Exam Performance</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-36 animate-pulse rounded-2xl bg-white/10 backdrop-blur-md"
                    />
                  ))}
                </div>
              </div>
            ) : examResults ? (
              <AdminExamStats data={examResults} />
            ) : null}
          </div>
        )}

        {/* Leaderboard Section */}
        <div className="">
          <h2 className="mb-5 text-3xl font-bold text-white">
            {examDashboard?.exam_title
              ? `Leaderboard - ${examDashboard.exam_title}`
              : "Leaderboard Top 10 Teams"}
          </h2>
        </div>
        <AdminLeaderboard
          data={examDashboard?.leaderboard}
          isLoading={isLoadingDashboard && !!selectedExamId}
        />
      </div>
    </div>
  );
}
