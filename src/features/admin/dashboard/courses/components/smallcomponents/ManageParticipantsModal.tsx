"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";
import { Participant } from "../../types/cTypes";
import { Search, X, Download, Plus, Loader2 } from "lucide-react";
import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { CSVUploadButton, ParticipantCSVRow } from "./CSVUploadPreview";
import { CSVPreviewModal } from "./CSVPreviewModal";
import { useAddParticipant } from "@/features/admin/dashboard/home/hooks/useAddParticipant";
import { useDeleteParticipant } from "@/features/admin/dashboard/home/hooks/useDeleteParticipant";

export interface TeamParticipant {
  id: string;
  team: string;
  team_leader: string;
  school: string;
  member1: string;
  member2: string;
}

type ManageParticipantsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  availableStudents?: { id: string; name: string }[];
  onAddParticipant?: (student: { id: string; name: string }) => void;
  onRemoveParticipant: (participantId: string) => void;
  showCSVFeatures?: boolean;
  onUploadSuccess?: () => void;
  onAddTeam?: (team: TeamParticipant) => void;
  onCSVSubmit?: (data: ParticipantCSVRow[]) => void;
};

interface FormData {
  school: string;
  team: string;
  leader: string;
  member1: string;
  member2: string;
}

const initialFormData: FormData = {
  school: "",
  team: "",
  leader: "",
  member1: "",
  member2: "",
};

export function ManageParticipantsModal({
  isOpen,
  onClose,
  participants,
  onRemoveParticipant,
  showCSVFeatures = false,
  onUploadSuccess,
  onAddTeam,
  onCSVSubmit,
}: ManageParticipantsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"current" | "add">("current");
  const [isDownloading, setIsDownloading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreviewData, setCsvPreviewData] = useState<ParticipantCSVRow[]>([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);

  const addParticipantMutation = useAddParticipant();
  const deleteParticipantMutation = useDeleteParticipant();

  const filteredParticipants = useMemo(() => {
    if (!searchQuery) return participants;
    return participants.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [participants, searchQuery]);

  const handleClose = () => {
    setSearchQuery("");
    setActiveTab("current");
    setFormData(initialFormData);
    setFormError(null);
    setParticipantToDelete(null);
    onClose();
  };

  const handleDeleteClick = (participant: Participant) => {
    setParticipantToDelete(participant);
  };

  const handleConfirmDelete = async () => {
    if (!participantToDelete) return;

    try {
      await deleteParticipantMutation.mutateAsync(participantToDelete.id);
      onRemoveParticipant(participantToDelete.id);
      setParticipantToDelete(null);
    } catch (error) {
      console.error("Failed to delete participant:", error);
    }
  };

  const handleCancelDelete = () => {
    setParticipantToDelete(null);
  };

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      const response = await api.get(API_ENDPOINTS.TEACHER.PARTICIPANTS_TEMPLATE, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "participants_template.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download template:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileSelected = (file: File, previewData: ParticipantCSVRow[]) => {
    setCsvFile(file);
    setCsvPreviewData(previewData);
    setIsPreviewModalOpen(true);
  };

  const handleSubmitCSV = async () => {
    if (!csvFile) return;

    setIsSubmitting(true);
    try {
      // If onCSVSubmit is provided, use it to handle CSV data locally
      if (onCSVSubmit) {
        onCSVSubmit(csvPreviewData);
        setIsPreviewModalOpen(false);
        setCsvFile(null);
        setCsvPreviewData([]);
        onUploadSuccess?.();
        return;
      }

      // Otherwise, upload to server
      const formData = new FormData();
      formData.append("file", csvFile);

      await api.post(API_ENDPOINTS.TEACHER.ADD_PARTICIPANT_BULK, formData, {
        headers: {
          "Content-Type": undefined,
        },
      });

      setIsPreviewModalOpen(false);
      setCsvFile(null);
      setCsvPreviewData([]);
      onUploadSuccess?.();
    } catch (error) {
      console.error("Failed to upload CSV:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewModalClose = () => {
    setIsPreviewModalOpen(false);
    setCsvFile(null);
    setCsvPreviewData([]);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleAddTeam = async () => {
    if (!formData.school || !formData.team || !formData.leader) {
      return;
    }

    setFormError(null);

    // Build members array
    const members = [];
    if (formData.member1) {
      members.push({ name: formData.member1 });
    }
    if (formData.member2) {
      members.push({ name: formData.member2 });
    }

    try {
      await addParticipantMutation.mutateAsync({
        leader_name: formData.leader,
        team_name: formData.team,
        school: formData.school,
        members: members,
      });

      // Also call onAddTeam callback if provided (for local state update)
      const newTeam: TeamParticipant = {
        id: `team-${Date.now()}`,
        team: formData.team,
        team_leader: formData.leader,
        school: formData.school,
        member1: formData.member1,
        member2: formData.member2,
      };
      onAddTeam?.(newTeam);

      setFormData(initialFormData);
      setActiveTab("current");
    } catch (error) {
      console.error("Failed to add participant:", error);
      setFormError("Gagal menambahkan tim. Silakan coba lagi.");
    }
  };

  const isFormValid = formData.school && formData.team && formData.leader;

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Manage Participants" size="xl">
        <div className="space-y-4">
          {/* CSV Download & Upload Section - Only shown when showCSVFeatures is true */}
          {showCSVFeatures && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
                className="hover:border-primary hover:bg-primary/5 hover:text-primary flex items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors disabled:opacity-50"
              >
                <Download size={16} />
                {isDownloading ? "Downloading..." : "Download Template"}
              </button>
              <CSVUploadButton onFileSelected={handleFileSelected} />
            </div>
          )}

          {/* Search Input - Only for current tab */}
          {activeTab === "current" && (
            <div className="relative">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-neutral-200 py-2.5 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          )}

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
              Add New
            </button>
          </div>

          {/* Content */}
          <div
            className={`space-y-3 overflow-y-auto ${activeTab === "current" ? "max-h-[200px]" : "max-h-80"}`}
          >
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
                      <span className="text-sm font-medium text-neutral-700">
                        {participant.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(participant)}
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
            ) : (
              /* Add New Form */
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Asal Sekolah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => handleInputChange("school", e.target.value)}
                    placeholder="Masukkan nama sekolah"
                    className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Nama Tim <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => handleInputChange("team", e.target.value)}
                    placeholder="Masukkan nama tim"
                    className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Nama Ketua <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.leader}
                    onChange={(e) => handleInputChange("leader", e.target.value)}
                    placeholder="Masukkan nama ketua tim"
                    className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Nama Anggota 1
                  </label>
                  <input
                    type="text"
                    value={formData.member1}
                    onChange={(e) => handleInputChange("member1", e.target.value)}
                    placeholder="Masukkan nama anggota 1"
                    className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Nama Anggota 2
                  </label>
                  <input
                    type="text"
                    value={formData.member2}
                    onChange={(e) => handleInputChange("member2", e.target.value)}
                    placeholder="Masukkan nama anggota 2"
                    className="focus:ring-primary/20 focus:border-primary w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:ring-2 focus:outline-none"
                  />
                </div>

                {formError && (
                  <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                    {formError}
                  </div>
                )}

                <button
                  onClick={handleAddTeam}
                  disabled={!isFormValid || addParticipantMutation.isPending}
                  className="bg-primary hover:bg-primary-dark flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addParticipantMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Menambahkan...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Tambah Tim
                    </>
                  )}
                </button>
              </div>
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

      {/* CSV Preview Modal - Only rendered when showCSVFeatures is true */}
      {showCSVFeatures && (
        <CSVPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={handlePreviewModalClose}
          data={csvPreviewData}
          onSubmit={handleSubmitCSV}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!participantToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Hapus Participant"
        message={`Apakah Anda yakin ingin menghapus "${participantToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        isLoading={deleteParticipantMutation.isPending}
      />
    </>
  );
}
