"use client";

import { useState } from "react";
import {
  DataTable,
  TableColumn,
} from "@/features/admin/dashboard/shared/components/DataTable";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import { participantData } from "@/features/admin/dashboard/home/data/dummyData";
import {
  GroupDetailModal,
  GroupDetailData,
} from "@/features/admin/dashboard/components/GroupDetailModal";

export default function ParticipantPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupDetailData | null>(
    null
  );

  const handleShowDetail = (row: (typeof participantData)[0]) => {
    setSelectedGroup({
      team: row.team,
      school: row.school,
      members: row.members,
    });
    setIsModalOpen(true);
  };

  const columns: TableColumn[] = [
    { key: "team", header: "Team" },
    { key: "team_leader", header: "Nama Ketua" },
    { key: "school", header: "Asal Sekolah" },
    {
      key: "group_detail",
      header: "Detail Kelompok",
      render: (row) => (
        <button
          onClick={() => handleShowDetail(row as (typeof participantData)[0])}
          className="text-[#F5A623] hover:text-[#F7B731] font-medium transition-colors"
        >
          Tampilkan
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen py-4 md:py-6 px-3 md:px-4">
      <div className="max-w-6xl">
        <DashboardHeader title="Participant" className="mb-6" />

        <div className="bg-white rounded-xl ">
          <DataTable columns={columns} data={participantData} />
        </div>
      </div>

      <GroupDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedGroup}
      />
    </div>
  );
}
