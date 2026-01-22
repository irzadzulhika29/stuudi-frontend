"use client";

import { Modal } from "@/shared/components/ui/Modal";

export type TeamMember = {
  name: string;
  role: "Ketua" | "Anggota";
};

export type GroupDetailData = {
  team: string;
  school: string;
  members: TeamMember[];
};

type GroupDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: GroupDetailData | null;
};

export function GroupDetailModal({
  isOpen,
  onClose,
  data,
}: GroupDetailModalProps) {
  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Kelompok" size="md">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-neutral-500">Nama Kelompok</p>
          <p className="font-semibold text-neutral-800">{data.team}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">Asal Sekolah</p>
          <p className="font-semibold text-neutral-800">{data.school}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500 mb-2">Anggota Kelompok</p>
          <div className="space-y-2">
            {data.members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-neutral-50 rounded-lg px-4 py-3"
              >
                <span className="font-medium text-neutral-800">
                  {member.name}
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    member.role === "Ketua"
                      ? "bg-primary/10 text-primary"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
