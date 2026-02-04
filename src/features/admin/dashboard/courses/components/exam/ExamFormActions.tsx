"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui";

interface ExamFormActionsProps {
  isEditMode: boolean;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  onSave: () => void;
  onDelete?: () => void;
}

export function ExamFormActions({
  isEditMode,
  isLoading,
  isCreating,
  isUpdating,
  onSave,
  onDelete,
}: ExamFormActionsProps) {
  return (
    <div className="flex gap-3">
      {isEditMode && onDelete && (
        <Button
          variant="outline"
          onClick={onDelete}
          disabled={isLoading}
          className="border-white text-white hover:!border-none hover:!bg-red-500 hover:text-white disabled:opacity-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus Exam
        </Button>
      )}
      <Button
        variant="outline"
        onClick={onSave}
        disabled={isLoading}
        className="!bg-primary flex-1 !text-white hover:scale-103 disabled:opacity-50"
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
