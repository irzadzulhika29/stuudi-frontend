"use client";

import { useState } from "react";
import { DataTable, TableColumn } from "@/features/admin/dashboard/shared/components/DataTable";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import { participantData } from "@/features/admin/dashboard/home/data/dummyData";
import {
  GroupDetailModal,
  GroupDetailData,
} from "@/features/admin/dashboard/components/GroupDetailModal";
import { ManageParticipantsModal } from "@/features/admin/dashboard/courses/components/smallcomponents/ManageParticipantsModal";
import { Users } from "lucide-react";

const dummyAvailableStudents = [
  { id: "s1", name: "Alice Johnson" },
  { id: "s2", name: "Bob Smith" },
  { id: "s3", name: "Charlie Brown" },
  { id: "s4", name: "Diana Ross" },
  { id: "s5", name: "Edward Norton" },
];

const dummyParticipants = participantData.slice(0, 5).map((p, idx) => ({
  id: `p${idx + 1}`,
  name: p.team_leader,
}));

export default function ParticipantPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupDetailData | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [participants, setParticipants] = useState(dummyParticipants);

  const handleShowDetail = (row: (typeof participantData)[0]) => {
    setSelectedGroup({
      team: row.team,
      school: row.school,
      members: row.members,
    });
    setIsModalOpen(true);
  };

  const handleAddParticipant = (student: { id: string; name: string }) => {
    setParticipants((prev) => [...prev, { id: student.id, name: student.name }]);
  };

  const handleRemoveParticipant = (participantId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
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
          className="font-medium text-[#F5A623] transition-colors hover:text-[#F7B731]"
        >
          Tampilkan
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <DashboardHeader title="Participant" />
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#F5A623] px-4 py-2 font-medium text-white transition-colors hover:bg-[#E69612]"
          >
            <Users size={18} />
            Manage Participant
          </button>
        </div>

        <div className="rounded-xl bg-white">
          <DataTable columns={columns} data={participantData} />
        </div>
      </div>

      <GroupDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedGroup}
      />

      <ManageParticipantsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        participants={participants}
        availableStudents={dummyAvailableStudents}
        onAddParticipant={handleAddParticipant}
        onRemoveParticipant={handleRemoveParticipant}
        showCSVFeatures={true}
      />
    </div>
  );
}
