"use client";

import { DataTable, TableColumn } from "../../shared/components/DataTable";
import { LeaderboardItem } from "../hooks/useGetExamDashboard";

interface AdminLeaderboardProps {
  data?: LeaderboardItem[];
  isLoading?: boolean;
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

export function AdminLeaderboard({ data, isLoading = false }: AdminLeaderboardProps) {
  // Handle null/undefined data
  const leaderboardData = data ?? [];

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
        <div className="text-white/60">Pilih exam untuk melihat leaderboard</div>
      </div>
    );
  }

  return (
    <DataTable columns={columns} data={leaderboardData as unknown as Record<string, unknown>[]} />
  );
}
