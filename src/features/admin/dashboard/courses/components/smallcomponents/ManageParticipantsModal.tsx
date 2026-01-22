"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Participant } from "../../types/cTypes";
import { Search, UserPlus, X, Check } from "lucide-react";

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

  const participantIds = useMemo(
    () => new Set(participants.map((p) => p.id)),
    [participants]
  );

  const filteredParticipants = useMemo(() => {
    if (!searchQuery) return participants;
    return participants.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [participants, searchQuery]);

  const filteredAvailableStudents = useMemo(() => {
    const notEnrolled = availableStudents.filter(
      (s) => !participantIds.has(s.id)
    );
    if (!searchQuery) return notEnrolled;
    return notEnrolled.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableStudents, participantIds, searchQuery]);

  const handleClose = () => {
    setSearchQuery("");
    setActiveTab("current");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage Participants"
      size="md"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "current"
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Current ({participants.length})
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "add"
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Add New ({filteredAvailableStudents.length})
          </button>
        </div>

        {/* Content */}
        <div className="max-h-64 overflow-y-auto space-y-2">
          {activeTab === "current" ? (
            filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-medium text-white">
                      {participant.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {participant.name}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveParticipant(participant.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove participant"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-neutral-500 py-8">
                {searchQuery
                  ? "No participants found"
                  : "No participants enrolled yet"}
              </p>
            )
          ) : filteredAvailableStudents.length > 0 ? (
            filteredAvailableStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-xs font-medium text-white">
                    {student.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {student.name}
                  </span>
                </div>
                <button
                  onClick={() => onAddParticipant(student)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Add participant"
                >
                  <UserPlus size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-neutral-500 py-8">
              {searchQuery
                ? "No students found"
                : "All students are already enrolled"}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-neutral-100">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}
