"use client";

import { useParams } from "next/navigation";
import { DataTable, TableColumn } from "@/features/admin/dashboard/shared/components/DataTable";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import { useGetDisqualifiedParticipants } from "@/features/admin/dashboard/home/hooks/useGetDisqualifiedParticipants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function DisqualifiedParticipantsPage() {
  const params = useParams();
  const examId = params.examId as string;

  const { data, isLoading, error } = useGetDisqualifiedParticipants(examId);

  const columns: TableColumn[] = [
    {
      key: "no",
      header: "No",
      render: (_, index) => String((index as number) + 1),
    },
    {
      key: "team_name",
      header: "Team",
      render: (row) => String(row.team_name || "-"),
    },
    {
      key: "school",
      header: "School",
      render: (row) => String(row.school || "-"),
    },
    {
      key: "violation_type",
      header: "Violation Type",
      render: (row) => (
        <span className="font-medium text-red-600">
          {String(row.violation_type || row.reason || "Disqualified")}
        </span>
      ),
    },
    {
      key: "disqualified_at",
      header: "Disqualified At",
      render: (row) => {
        if (row.disqualified_at) {
          try {
            return new Date(String(row.disqualified_at)).toLocaleString("id-ID");
          } catch {
            return "-";
          }
        }
        return "-";
      },
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
          <DashboardHeader title="Disqualified" highlightedText="Participants" className="mb-5" />
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
          <DashboardHeader title="Disqualified" highlightedText="Participants" className="mb-5" />
          <div className="rounded-xl bg-white p-8 text-center text-red-500">
            Gagal memuat data. Silakan coba lagi.
          </div>
        </div>
      </div>
    );
  }

  const tableData = (data?.disqualified_participants ?? []).map((participant, index) => ({
    ...participant,
    no: index + 1,
  }));

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

        <DashboardHeader title="Disqualified" highlightedText="Participants" className="mb-5" />

        {data?.exam_title && (
          <h2 className="mb-4 text-xl font-semibold text-white">{data.exam_title}</h2>
        )}

        {tableData.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500">
            Tidak ada peserta yang didiskualifikasi untuk exam ini.
          </div>
        ) : (
          <DataTable columns={columns} data={tableData} />
        )}
      </div>
    </div>
  );
}
