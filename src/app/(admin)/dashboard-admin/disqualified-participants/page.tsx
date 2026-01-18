"use client";

import {
  DataTable,
  TableColumn,
} from "@/features/admin/dashboard/shared/components/DataTable";

// Data statis untuk demo
const cheatingReportData = [
  {
    rank: 2,
    team: "Izin Auto Win",
    score: 978,
    school: "SMA Negeri 4 Surabaya",
    pageSwapCount: 1,
  },
  {
    rank: 1,
    team: "Izin Auto Win",
    score: 823,
    school: "SMA Negeri 4 Surabaya",
    pageSwapCount: 2,
  },
  {
    rank: 3,
    team: "Izin Auto Win",
    score: 821,
    school: "SMA Negeri 4 Surabaya",
    pageSwapCount: 2,
  },
  {
    rank: 4,
    team: "Izin Auto Win",
    score: 800,
    school: "SMA Negeri 4 Surabaya",
    pageSwapCount: 2,
  },
  {
    rank: 5,
    team: "Izin Auto Win",
    score: 759,
    school: "SMA Negeri 4 Surabaya",
    pageSwapCount: 1,
  },
  {
    rank: 6,
    team: "Izin Auto Win",
    score: 740,
    school: "SMA Negeri 4 Surabaya",
    pageSwapCount: 2,
  },
  {
    rank: 7,
    team: "Izin Auto Win",
    score: 723,
    school: "SMA Negeri 4 Surabaya",
    pageSwapCount: 1,
  },
];

// Konfigurasi kolom untuk cheating report
const columns: TableColumn[] = [
  { key: "rank", header: "Rank" },
  { key: "team", header: "Team" },
  { key: "score", header: "Score" },
  { key: "school", header: "School" },
  {
    key: "detail",
    header: "Detail",
    render: (row) => (
      <a
        href="#"
        className="text-[#F5A623] hover:text-[#F7B731] font-medium transition-colors"
      >
        Page swap {String(row.pageSwapCount)}x
      </a>
    ),
  },
];

export default function DisqualifiedParticipantsPage() {
  return (
    <div className="min-h-screen py-4 md:py-6 px-3 md:px-4">
      <div className="max-w-6xl">
        <h1 className="mb-5 text-2xl md:text-4xl font-bold text-white mb-2">
          Disqualified <span className="text-secondary">Participants</span>
        </h1>

        <DataTable columns={columns} data={cheatingReportData} />
      </div>
    </div>
  );
}
