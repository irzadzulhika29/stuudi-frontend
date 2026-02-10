import { Button } from "@/shared/components/ui";
import { Trash2 } from "lucide-react";

interface ExamActionButtonsProps {
  isEditMode: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onSave: () => void;
  onDeleteRequest: () => void;
  examId?: string;
}

export function ExamActionButtons({
  isEditMode,
  isCreating,
  isUpdating,
  isDeleting,
  onSave,
  onDeleteRequest,
  examId,
}: ExamActionButtonsProps) {
  const isDisabled = isCreating || isUpdating || isDeleting;

  return (
    <div className="flex gap-3">
      {isEditMode && examId && (
        <Button
          variant="outline"
          onClick={onDeleteRequest}
          disabled={isDisabled}
          className="border-red-500 text-red-500 hover:bg-red-500! hover:text-white disabled:opacity-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus Exam
        </Button>
      )}
      <Button
        variant="outline"
        onClick={onSave}
        disabled={isDisabled}
        className="hover:bg-primary! flex-1 hover:text-white disabled:opacity-50"
      >
        {isCreating
          ? "Menyimpan..."
          : isUpdating
            ? "Mengupdate..."
            : isEditMode
              ? "Update Exam"
              : "Simpan Exam"}
      </Button>
    </div>
  );
}
