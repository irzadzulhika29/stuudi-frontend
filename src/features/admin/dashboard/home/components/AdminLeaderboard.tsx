"use client";

import type { ChangeEvent } from "react";
import { DataTable, TableColumn } from "../../shared/components/DataTable";
import { LeaderboardItem } from "../hooks/useGetExamDashboard";

interface AdminLeaderboardProps {
  data?: LeaderboardItem[];
  isLoading?: boolean;
  title?: string;
  limit: number;
  onLimitChange: (limit: number) => void;
  hasSelectedExam?: boolean;
  isLimitDisabled?: boolean;
}

// Komponen untuk status badge
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, string> = {
    Active: "text-[#4CAF50]",
    Eliminated: "text-gray-400",
    "Cheating Flagged": "text-[#FFC107]",
  };

  return <span className={`font-medium ${statusStyles[status] || "text-gray-600"}`}>{status}</span>;
};

// Konfigurasi kolom untuk leaderboard
const columns: TableColumn[] = [
  { key: "rank", header: "Rank" },
  { key: "team_name", header: "Team" },
  { key: "score", header: "Score" },
  { key: "duration", header: "Duration" },
  { key: "violence", header: "Violence" },
  { key: "school_name", header: "School" },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={String(row.status)} />,
  },
];

export function AdminLeaderboard({
  data,
  isLoading = false,
  title,
  limit,
  onLimitChange,
  hasSelectedExam = false,
  isLimitDisabled = false,
}: AdminLeaderboardProps) {
  // Handle null/undefined data
  const leaderboardData = data ?? [];
  const heading = title ? `Leaderboard - ${title}` : `Leaderboard Top ${limit} Teams`;

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextLimit = Number(event.target.value);

    if (!Number.isFinite(nextLimit) || nextLimit < 1) {
      return;
    }

    onLimitChange(Math.floor(nextLimit));
  };

  const content = (() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60">Memuat data leaderboard...</div>
        </div>
      );
    }

    if (leaderboardData.length === 0) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60">
            {hasSelectedExam
              ? "Belum ada data leaderboard"
              : "Pilih exam untuk melihat leaderboard"}
          </div>
        </div>
      );
    }

    return (
      <DataTable columns={columns} data={leaderboardData as unknown as Record<string, unknown>[]} />
    );
  })();

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold text-white">{heading}</h2>
        <label className="flex w-full items-center gap-3 text-sm font-medium text-white/70 sm:w-auto">
          <span className="shrink-0">Tampilkan</span>
          <input
            type="number"
            min={1}
            step={1}
            value={limit}
            onChange={handleLimitChange}
            disabled={isLimitDisabled}
            className="focus:border-secondary focus:ring-secondary/30 h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition-all outline-none placeholder:text-white/40 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-24"
          />
        </label>
      </div>
      {content}
    </section>
  );
}
