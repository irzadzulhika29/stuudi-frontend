"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { DataTable, TableColumn } from "@/features/admin/dashboard/shared/components/DataTable";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import { useGetExamParticipants } from "@/features/admin/dashboard/home/hooks/useGetExamParticipants";
import { ChevronLeft, Users } from "lucide-react";
import Link from "next/link";

export default function ExamParticipantsPage() {
  const params = useParams();
  const examId = params.examId as string;
  const [selectedTeam, setSelectedTeam] = useState<{
    teamName: string;
    members: Array<{ team_member_id: string; name: string }>;
  } | null>(null);

  const { data, isLoading, error } = useGetExamParticipants(examId);

  const columns: TableColumn[] = [
    {
      key: "no",
      header: "No",
      render: (_, index) => String((index as number) + 1),
    },
    {
      key: "team_name",
      header: "Nama Tim",
      render: (row) => String(row.team_name || "-"),
    },
    {
      key: "leader_name",
      header: "Nama Ketua",
      render: (row) => String(row.leader_name || "-"),
    },
    {
      key: "school",
      header: "Sekolah",
      render: (row) => String(row.school || "-"),
    },
    {
      key: "team_members",
      header: "Anggota Tim",
      render: (row) => {
        const members = row.team_members as Array<{ team_member_id: string; name: string }>;
        const memberCount = members?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{memberCount} anggota</span>
            {memberCount > 0 && (
              <button
                onClick={() =>
                  setSelectedTeam({
                    teamName: String(row.team_name || ""),
                    members: members || [],
                  })
                }
                className="font-medium text-[#F5A623] underline transition-colors hover:text-[#F7B731]"
              >
                Lihat Detail
              </button>
            )}
          </div>
        );
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
          <DashboardHeader title="Exam" highlightedText="Participants" className="mb-5" />
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
          <DashboardHeader title="Exam" highlightedText="Participants" className="mb-5" />
          <div className="rounded-xl bg-white p-8 text-center text-red-500">
            Gagal memuat data. Silakan coba lagi.
          </div>
        </div>
      </div>
    );
  }

  const tableData = (data ?? []).map((participant, index) => ({
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

        <DashboardHeader title="Exam" highlightedText="Participants" className="mb-5" />

        <div className="mb-4 flex items-center gap-2 text-white">
          <Users size={20} />
          <span className="text-lg font-medium">Total Peserta: {tableData.length}</span>
        </div>

        {tableData.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500">
            Belum ada peserta yang terdaftar untuk exam ini.
          </div>
        ) : (
          <DataTable columns={columns} data={tableData} />
        )}

        {/* Team Members Modal */}
        {selectedTeam && (
          <div
            className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
            onClick={() => setSelectedTeam(null)}
          >
            <div
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Anggota Tim</h3>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-gray-500 transition-colors hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="bg-opacity-10 mb-4 rounded-lg bg-[#F5A623] p-4">
                <p className="text-lg font-semibold text-gray-800">{selectedTeam.teamName}</p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {selectedTeam.members.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">Tidak ada anggota tim.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedTeam.members.map((member, index) => (
                      <div
                        key={member.team_member_id}
                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5A623] font-semibold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{member.name}</p>
                          <p className="text-sm text-gray-500">ID: {member.team_member_id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="rounded-lg bg-[#F5A623] px-6 py-2 font-medium text-white transition-colors hover:bg-[#E68E00]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
