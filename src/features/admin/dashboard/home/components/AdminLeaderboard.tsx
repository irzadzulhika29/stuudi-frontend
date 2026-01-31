"use client";

import { DataTable, TableColumn } from "../../shared/components/DataTable";

// Data statis untuk demo
const leaderboardData = [
  {
    rank: 1,
    team: "Izin Auto Win",
    score: 990,
    completionTime: "1h 23m 45s",
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 2,
    team: "Izin Auto Win",
    score: 989,
    completionTime: "1h 25m 12s",
    school: "SMA Negeri 4 Surabaya",
    status: "Eliminated",
  },
  {
    rank: 3,
    team: "Izin Auto Win",
    score: 978,
    completionTime: "1h 28m 33s",
    school: "SMA Negeri 4 Surabaya",
    status: "Cheating Flagged",
  },
  {
    rank: 4,
    team: "Izin Auto Win",
    score: 966,
    completionTime: "1h 32m 15s",
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 5,
    team: "Izin Auto Win",
    score: 955,
    completionTime: "1h 35m 42s",
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 6,
    team: "Izin Auto Win",
    score: 950,
    completionTime: "1h 38m 18s",
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 7,
    team: "Izin Auto Win",
    score: 943,
    completionTime: "1h 42m 05s",
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 8,
    team: "Izin Auto Win",
    score: 940,
    completionTime: "1h 45m 30s",
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 9,
    team: "Izin Auto Win",
    score: 935,
    completionTime: "1h 48m 22s",
    school: "SMA Negeri 4 Surabaya",
    status: "Active",
  },
  {
    rank: 10,
    team: "Izin Auto Win",
    score: 990,
    completionTime: "1h 52m 10s",
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
  { key: "completionTime", header: "Completion Time" },
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
