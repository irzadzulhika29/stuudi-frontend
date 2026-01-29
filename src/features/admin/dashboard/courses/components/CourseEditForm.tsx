import { useRef } from "react";
import Image from "next/image";
import { Folder, X } from "lucide-react";
import { Input } from "@/shared/components/ui";

interface CourseEditFormProps {
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
  existingThumbnailUrl?: string | null;
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onThumbnailRemove: () => void;
}

export function CourseEditForm({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  thumbnailFile,
  thumbnailPreview,
  existingThumbnailUrl,
  onThumbnailChange,
  onThumbnailRemove,
}: CourseEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleLocalRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onThumbnailRemove();
  };

  return (
    <div className="mb-8 space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Nama Courses</label>
        <div className="rounded-xl bg-white p-1">
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="border-none bg-transparent placeholder:text-white/50 focus:ring-0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Deskripsi Courses</label>
        <div className="rounded-xl bg-white p-1">
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="h-32 w-full resize-none rounded-xl border-none bg-transparent px-5 py-3 placeholder:text-white/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Thumbnail Course</label>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onThumbnailChange}
            className="hidden"
          />
          <div onClick={handleThumbnailClick} className="cursor-pointer rounded-xl bg-white p-1">
            <Input
              placeholder={thumbnailFile?.name || "Pilih File"}
              rightIcon={<Folder size={20} />}
              className="cursor-pointer border-none bg-transparent placeholder:text-black focus:ring-0"
              readOnly
            />
          </div>
        </div>

        {/* Thumbnail Preview */}
        {(thumbnailPreview || existingThumbnailUrl) && (
          <div className="relative mt-4 inline-block">
            <div className="relative h-40 w-64 overflow-hidden rounded-xl border-2 border-white/20">
              <Image 
                src={thumbnailPreview || existingThumbnailUrl!} 
                alt="Thumbnail preview" 
                fill 
                className="object-cover" 
              />
            </div>
            {thumbnailPreview && (
              <button
                type="button"
                onClick={handleLocalRemove}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
              >
                <X size={14} />
              </button>
            )}
            {!thumbnailPreview && existingThumbnailUrl && (
              <span className="mt-2 block text-xs text-white/60">Thumbnail saat ini</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
