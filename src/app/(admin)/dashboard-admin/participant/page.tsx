"use client";

import {
  DataTable,
  TableColumn,
} from "@/features/admin/dashboard/shared/components/DataTable";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import { participantData } from "@/features/admin/dashboard/home/data/dummyData";

// Konfigurasi kolom untuk participants
const columns: TableColumn[] = [
  { key: "team", header: "Team" },
  { key: "team_leader", header: "Nama Ketua" },
  { key: "school", header: "Asal Sekolah" },
  {
    key: "group_detail",
    header: "Detail Kelompok",
    render: (row) => (
      <a
        href="#"
        className="text-[#F5A623] hover:text-[#F7B731] font-medium transition-colors"
      >
        Tampilkan
      </a>
    ),
  },
];

export default function ParticipantPage() {
  return (
    <div className="min-h-screen py-4 md:py-6 px-3 md:px-4">
      <div className="max-w-6xl">
        <DashboardHeader title="Participant" className="mb-6" />

        <div className="bg-white rounded-xl ">
          <DataTable columns={columns} data={participantData} />
        </div>
      </div>
    </div>
  );
}
