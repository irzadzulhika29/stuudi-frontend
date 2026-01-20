"use client";

import {
  DataTable,
  TableColumn,
} from "@/features/admin/dashboard/shared/components/DataTable";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import { cheatingReportData } from "@/features/admin/dashboard/home/data/dummyData";

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

export default function CheatingReportPage() {
  return (
    <div className="min-h-screen py-4 md:py-6 px-3 md:px-4">
      <div className="max-w-6xl">
        <DashboardHeader
          title="Cheating"
          highlightedText="Report"
          className="mb-5"
        />

        <DataTable columns={columns} data={cheatingReportData} />
      </div>
    </div>
  );
}
