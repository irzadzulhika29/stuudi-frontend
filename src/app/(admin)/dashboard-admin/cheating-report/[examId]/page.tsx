"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { DataTable, TableColumn } from "@/features/admin/dashboard/shared/components/DataTable";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import { useGetCheatingReport } from "@/features/admin/dashboard/home/hooks/useGetCheatingReport";
import { TabSwitchDetailModal } from "@/features/admin/dashboard/home/components/TabSwitchDetailModal";
import { TabSwitchDetail } from "@/features/admin/dashboard/home/types/cheatingReportTypes";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CheatingReportPage() {
  const params = useParams();
  const examId = params.examId as string;
  const [selectedTeam, setSelectedTeam] = useState<{
    teamName: string;
    details: TabSwitchDetail[];
  } | null>(null);

  const { data, isLoading, error } = useGetCheatingReport(examId);

  const columns: TableColumn[] = [
    {
      key: "no",
      header: "No",
      render: (_, index) => String((index as number) + 1),
    },
    { key: "team_name", header: "Team" },
    { key: "school", header: "School" },
    {
      key: "tab_switches",
      header: "Tab Switches",
      render: (row) => (
        <span className="font-semibold text-red-600">{String(row.tab_switches)}x</span>
      ),
    },
    {
      key: "detail",
      header: "Detail",
      render: (row) => (
        <button
          onClick={() =>
            setSelectedTeam({
              teamName: String(row.team_name || ""),
              details: (row.tab_switch_details as TabSwitchDetail[]) || [],
            })
          }
          className="font-medium text-[#F5A623] underline transition-colors hover:text-[#F7B731]"
        >
          Lihat Detail
        </button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
        <div className="max-w-6xl">
          <div className="mb-8 flex items-center gap-4">
            <Link
              href="/dashboard-admin"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white transition-colors hover:bg-[#E68E00]"
            >
              <ChevronLeft size={24} />
            </Link>
          </div>
          <DashboardHeader title="Cheating" highlightedText="Report" className="mb-5" />
          <div className="rounded-xl bg-white p-8 text-center text-gray-500">Memuat data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
        <div className="max-w-6xl">
          <div className="mb-8 flex items-center gap-4">
            <Link
              href="/dashboard-admin"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white transition-colors hover:bg-[#E68E00]"
            >
              <ChevronLeft size={24} />
            </Link>
          </div>
          <DashboardHeader title="Cheating" highlightedText="Report" className="mb-5" />
          <div className="rounded-xl bg-white p-8 text-center text-red-500">
            Gagal memuat data. Silakan coba lagi.
          </div>
        </div>
      </div>
    );
  }

  const tableData =
    data?.suspicious_attempts.map((attempt, index) => ({
      ...attempt,
      no: index + 1,
    })) || [];

  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="max-w-6xl">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard-admin"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-white transition-colors hover:bg-[#E68E00]"
          >
            <ChevronLeft size={24} />
          </Link>
          <span className="text-lg text-white">Kembali ke Dashboard</span>
        </div>

        <DashboardHeader title="Cheating" highlightedText="Report" className="mb-5" />

        {data?.exam_title && (
          <h2 className="mb-4 text-xl font-semibold text-white">{data.exam_title}</h2>
        )}

        {tableData.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500">
            Tidak ada laporan kecurangan untuk exam ini.
          </div>
        ) : (
          <DataTable columns={columns} data={tableData} />
        )}

        {/* Tab Switch Details Modal */}
        {selectedTeam && (
          <TabSwitchDetailModal
            isOpen={!!selectedTeam}
            onClose={() => setSelectedTeam(null)}
            teamName={selectedTeam.teamName}
            tabSwitchDetails={selectedTeam.details}
          />
        )}
      </div>
    </div>
  );
}
