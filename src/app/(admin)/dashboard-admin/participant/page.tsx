"use client";

import { useState, useMemo } from "react";
import { DataTable, TableColumn } from "@/features/admin/dashboard/shared/components/DataTable";
import { DashboardHeader } from "@/features/admin/dashboard/shared/components/DashboardHeader";
import {
  GroupDetailModal,
  GroupDetailData,
} from "@/features/admin/dashboard/components/GroupDetailModal";
import {
  ManageParticipantsModal,
  TeamParticipant,
} from "@/features/admin/dashboard/courses/components/smallcomponents/ManageParticipantsModal";

import { Users, Loader2 } from "lucide-react";
import {
  useGetParticipants,
  ApiParticipant,
} from "@/features/admin/dashboard/participant/hooks/useGetParticipants";

interface ParticipantData {
  id: string;
  team: string;
  team_leader: string;
  school: string;
  username: string;
  password: string;
  members: { name: string; role: "Ketua" | "Anggota" }[];
}

export default function ParticipantPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupDetailData | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [localParticipants, setLocalParticipants] = useState<ParticipantData[]>([]);

  // Fetch participants using TanStack Query
  const { data: apiParticipants, isLoading, error, refetch } = useGetParticipants();

  // Transform API response to ParticipantData format
  const transformApiData = (apiData: ApiParticipant[]): ParticipantData[] => {
    return apiData.map((participant) => ({
      id: participant.elearning_user_id,
      team: participant.team_name || "-",
      team_leader: participant.leader_name,
      school: participant.school,
      username: participant.username,
      password: participant.password,
      members: [
        { name: participant.leader_name, role: "Ketua" as const },
        ...(participant.team_members?.map((member) => ({
          name: member.name,
          role: "Anggota" as const,
        })) || []),
      ],
    }));
  };

  // Combine API data with locally added participants
  const participantData = useMemo(() => {
    const apiData = apiParticipants ? transformApiData(apiParticipants) : [];
    return [...apiData, ...localParticipants];
  }, [apiParticipants, localParticipants]);

  // Transform participantData to the format expected by ManageParticipantsModal
  const modalParticipants = participantData.map((p) => ({
    id: p.id,
    name: p.team,
  }));

  const handleShowDetail = (row: ParticipantData) => {
    setSelectedGroup({
      team: row.team,
      school: row.school,
      username: row.username,
      password: row.password,
      members: row.members,
    });
    setIsModalOpen(true);
  };

  const handleAddTeam = (team: TeamParticipant) => {
    const newParticipant: ParticipantData = {
      id: team.id,
      team: team.team,
      team_leader: team.team_leader,
      school: team.school,
      username: "-",
      password: "-",
      members: [
        { name: team.team_leader, role: "Ketua" },
        ...(team.member1 ? [{ name: team.member1, role: "Anggota" as const }] : []),
        ...(team.member2 ? [{ name: team.member2, role: "Anggota" as const }] : []),
      ],
    };
    setLocalParticipants((prev) => [...prev, newParticipant]);
  };

  const handleRemoveParticipant = (participantId: string) => {
    setLocalParticipants((prev) => prev.filter((p) => p.id !== participantId));
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
          onClick={() => handleShowDetail(row as unknown as ParticipantData)}
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 size={48} className="mb-4 animate-spin text-[#F5A623]" />
              <p className="text-lg font-medium text-neutral-500">Memuat data participant...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users size={48} className="mb-4 text-red-300" />
              <p className="text-lg font-medium text-red-500">
                {error instanceof Error
                  ? error.message
                  : "Terjadi kesalahan saat mengambil data participant"}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-[#F5A623] px-4 py-2 font-medium text-white transition-colors hover:bg-[#E69612]"
              >
                Coba Lagi
              </button>
            </div>
          ) : participantData.length > 0 ? (
            <DataTable
              columns={columns}
              data={participantData as unknown as Record<string, unknown>[]}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users size={48} className="mb-4 text-neutral-300" />
              <p className="text-lg font-medium text-neutral-500">Belum ada data participant</p>
              <p className="text-sm text-neutral-400">
                Klik &quot;Manage Participant&quot; untuk menambah tim baru atau upload CSV
              </p>
            </div>
          )}
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
        participants={modalParticipants}
        onRemoveParticipant={handleRemoveParticipant}
        onAddTeam={handleAddTeam}
        onUploadSuccess={() => refetch()}
        showCSVFeatures={true}
      />
    </div>
  );
}
