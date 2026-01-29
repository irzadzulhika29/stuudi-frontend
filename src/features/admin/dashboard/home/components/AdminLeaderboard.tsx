"use client";

import { DataTable, TableColumn } from "../../shared/components/DataTable";

// Data statis untuk demo
const leaderboardData = [
  {
    rank: 1,
    team: "Izin Auto Win",
    score: 990,
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 2,
    team: "Izin Auto Win",
    score: 989,
    school: "SMA Negeri 4 Surabaya",
    status: "Eliminated",
  },
  {
    rank: 3,
    team: "Izin Auto Win",
    score: 978,
    school: "SMA Negeri 4 Surabaya",
    status: "Cheating Flagged",
  },
  {
    rank: 4,
    team: "Izin Auto Win",
    score: 966,
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 5,
    team: "Izin Auto Win",
    score: 955,
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 6,
    team: "Izin Auto Win",
    score: 950,
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 7,
    team: "Izin Auto Win",
    score: 943,
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 8,
    team: "Izin Auto Win",
    score: 940,
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 9,
    team: "Izin Auto Win",
    score: 935,
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 10,
    team: "Izin Auto Win",
    score: 990,
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
];

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
  { key: "team", header: "Team" },
  { key: "score", header: "Score" },
  { key: "school", header: "School" },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={String(row.status)} />,
  },
];

export function AdminLeaderboard() {
  return <DataTable columns={columns} data={leaderboardData} />;
}
