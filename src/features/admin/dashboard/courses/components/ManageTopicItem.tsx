import { Trash2, ChevronDown, ChevronUp, Plus, Pencil, X, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button, Input } from "@/shared/components/ui";
import Link from "next/link";
import { TopicMaterialItem } from "./smallcomponents/TopicMaterialItem";
import { useDeleteTopic } from "../hooks/useDeleteTopic";
import { useDeleteContent } from "../hooks/useDeleteContent";
import { useUpdateTopic } from "../hooks/useUpdateTopic";
import { ConfirmDeleteModal } from "@/shared/components/ui/ConfirmDeleteModal";
import { useToast } from "@/shared/components/ui/Toast";

export interface Material {
  id: string;
  title: string;
  isCompleted: boolean;
  type?: "material" | "quiz";
}

export interface ManageTopicItemProps {
  id: string;
  courseId: string;
  title: string;
  description: string;
  materials: Material[];
  status?: "completed" | "in-progress" | "locked";
  isExpanded?: boolean;
  onMaterialsReorder?: (materials: Material[]) => void;
}

export function ManageTopicItem({
  id,
  courseId,
  title,
  description,
  materials,
  isExpanded: defaultExpanded = false,
  onMaterialsReorder,
}: ManageTopicItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [orderedMaterials, setOrderedMaterials] = useState<Material[]>(materials);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Material | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);

  const deleteTopic = useDeleteTopic();
  const deleteContent = useDeleteContent();
  const updateTopic = useUpdateTopic(id);
  const { showToast } = useToast();

  useEffect(() => {
    setOrderedMaterials(materials);
  }, [materials]);

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(title);
      setEditDescription(description);
    }
  }, [title, description, isEditing]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [orderedMaterials, isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const moveMaterial = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= orderedMaterials.length) return;

    const newMaterials = [...orderedMaterials];
    [newMaterials[index], newMaterials[newIndex]] = [newMaterials[newIndex], newMaterials[index]];
    setOrderedMaterials(newMaterials);
    onMaterialsReorder?.(newMaterials);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteTopic.mutate(id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        showToast("Topik berhasil dihapus", "success");
      },
      onError: () => {
        showToast("Gagal menghapus topik", "error");
      },
    });
  };

  const handleDeleteContent = (material: Material) => {
    setContentToDelete(material);
  };

  const handleConfirmDeleteContent = () => {
    if (!contentToDelete) return;

    deleteContent.mutate(contentToDelete.id, {
      onSuccess: () => {
        setContentToDelete(null);
        showToast("Konten berhasil dihapus", "success");
      },
      onError: () => {
        showToast("Gagal menghapus konten", "error");
      },
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    if (!isExpanded) setIsExpanded(true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditTitle(title);
    setEditDescription(description);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!editTitle.trim()) {
      showToast("Judul topik tidak boleh kosong", "error");
      return;
    }

    updateTopic.mutate(
      {
        title: editTitle,
        description: editDescription,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          showToast("Topik berhasil diperbarui", "success");
        },
        onError: (error) => {
          console.error("Update failed:", error);
          showToast("Gagal memperbarui topik", "error");
        },
      }
    );
  };

  return (
    <>
      <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-primary-light border-l-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <button
                  onClick={toggleExpand}
                  className="text-neutral-400 transition-colors hover:text-neutral-600"
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isEditing ? (
                  <div className="mr-4 flex-1">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-9 text-lg font-bold"
                      placeholder="Judul Topik"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <h3 className="text-xl font-bold text-neutral-800">{title}</h3>
                )}
              </div>

              <div
                className={`transition-all duration-300 ${isExpanded ? "max-h-60 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
              >
                {isEditing ? (
                  <div className="mt-2 mr-4 ml-8" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="focus:border-primary focus:ring-primary w-full rounded-md border border-neutral-300 p-2 text-sm focus:ring-1 focus:outline-none"
                      rows={3}
                      placeholder="Deskripsi Topik"
                    />
                  </div>
                ) : (
                  <p className="ml-8 max-w-3xl text-sm leading-relaxed text-neutral-500">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    disabled={updateTopic.isPending}
                    className="p-2 text-green-500 transition-colors hover:text-green-600 disabled:opacity-50"
                    title="Simpan"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={updateTopic.isPending}
                    className="p-2 text-neutral-400 transition-colors hover:text-neutral-600 disabled:opacity-50"
                    title="Batal"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditClick}
                    className="hover:text-primary p-2 text-neutral-400 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="p-2 text-neutral-300 transition-colors hover:text-red-500"
                    title="Hapus"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden bg-white transition-all duration-300 ease-out"
          style={{
            maxHeight: isExpanded ? `${contentHeight + 400}px` : "0px",
          }}
        >
          <div ref={contentRef} className="px-5 pt-2 pb-6">
            <div className="my-6 flex justify-end gap-4">
              <Link
                href={`/dashboard-admin/courses/${courseId}/manage/${courseId}/material/new?topicId=${id}`}
              >
                <Button
                  variant="outline"
                  size="md"
                  className="!text-primary !border-primary hover:!bg-primary hover:!text-white"
                >
                  <Plus size={18} /> Tambah materi
                </Button>
              </Link>
              <Link
                href={`/dashboard-admin/courses/${courseId}/manage/${courseId}/quiz/new?topicId=${id}`}
              >
                <Button
                  variant="outline"
                  size="md"
                  className="!text-primary !border-primary hover:!bg-primary hover:!text-white"
                >
                  <Plus size={18} /> Tambah kuis
                </Button>
              </Link>
            </div>

            <div className="space-y-2 rounded-xl bg-neutral-100/50 p-2">
              {orderedMaterials.map((material, index) => (
                <TopicMaterialItem
                  key={material.id}
                  id={material.id}
                  title={material.title}
                  isCompleted={material.isCompleted}
                  type={material.type}
                  index={index}
                  totalItems={orderedMaterials.length}
                  courseId={courseId}
                  onMoveUp={() => moveMaterial(index, "up")}
                  onMoveDown={() => moveMaterial(index, "down")}
                  onDelete={() => handleDeleteContent(material)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Topik"
        itemName={title}
        isLoading={deleteTopic.isPending}
      />

      <ConfirmDeleteModal
        isOpen={!!contentToDelete}
        onClose={() => setContentToDelete(null)}
        onConfirm={handleConfirmDeleteContent}
        title="Hapus Konten"
        itemName={contentToDelete?.title ?? ""}
        isLoading={deleteContent.isPending}
      />
    </>
  );
}
