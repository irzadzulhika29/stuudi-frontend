import { ChevronLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui";

interface ManagementHeaderProps {
  courseId: string;
  onDelete: () => void;
  onSave: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export function ManagementHeader({
  courseId,
  onDelete,
  onSave,
  isSaving,
  isDeleting,
}: ManagementHeaderProps) {
  return (
    <>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href={`/dashboard-admin/courses/${courseId}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9D00] text-white transition-colors hover:bg-[#E68E00]"
        >
          <ChevronLeft size={24} />
        </Link>
        <span className="text-lg text-white">Course/Course Details</span>
      </div>

      <div className="mb-6 flex justify-end gap-3">
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 text-white/80 transition-colors hover:text-red-500 disabled:opacity-50"
        >
          <Trash2 size={24} />
        </button>
        <Button
          variant="outline"
          onClick={onSave}
          disabled={isSaving}
          className="rounded-full border-white bg-transparent px-8 text-white hover:bg-white hover:text-black disabled:opacity-50"
        >
          {isSaving ? "Updating..." : "Apply edit"}
        </Button>
      </div>
    </>
  );
}
