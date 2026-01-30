"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Participant } from "../../types/cTypes";
import { Search, UserPlus, X } from "lucide-react";

type AvailableStudent = {
  id: string;
  name: string;
  avatar?: string;
};

type ManageParticipantsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  availableStudents: AvailableStudent[];
  onAddParticipant: (student: AvailableStudent) => void;
  onRemoveParticipant: (participantId: string) => void;
};

export function ManageParticipantsModal({
  isOpen,
  onClose,
  participants,
  availableStudents,
  onAddParticipant,
  onRemoveParticipant,
}: ManageParticipantsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"current" | "add">("current");

  const participantIds = useMemo(() => new Set(participants.map((p) => p.id)), [participants]);

  const filteredParticipants = useMemo(() => {
    if (!searchQuery) return participants;
    return participants.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [participants, searchQuery]);

  const filteredAvailableStudents = useMemo(() => {
    const notEnrolled = availableStudents.filter((s) => !participantIds.has(s.id));
    if (!searchQuery) return notEnrolled;
    return notEnrolled.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [availableStudents, participantIds, searchQuery]);

  const handleClose = () => {
    setSearchQuery("");
    setActiveTab("current");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Manage Participants" size="md">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-neutral-200 py-2.5 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab("current")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "current"
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Current ({participants.length})
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "add"
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Add New ({filteredAvailableStudents.length})
          </button>
        </div>

        {/* Content */}
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {activeTab === "current" ? (
            filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white">
                      {participant.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-neutral-700">{participant.name}</span>
                  </div>
                  <button
                    onClick={() => onRemoveParticipant(participant.id)}
                    className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                    title="Remove participant"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-neutral-500">
                {searchQuery ? "No participants found" : "No participants enrolled yet"}
              </p>
            )
          ) : filteredAvailableStudents.length > 0 ? (
            filteredAvailableStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 transition-colors hover:bg-neutral-100"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary-light flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white">
                    {student.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">{student.name}</span>
                </div>
                <button
                  onClick={() => onAddParticipant(student)}
                  className="rounded-lg p-1.5 text-green-600 transition-colors hover:bg-green-50"
                  title="Add participant"
                >
                  <UserPlus size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-neutral-500">
              {searchQuery ? "No students found" : "All students are already enrolled"}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-neutral-100 pt-2">
          <button
            onClick={handleClose}
            className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}
