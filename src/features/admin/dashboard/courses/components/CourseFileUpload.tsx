import { Folder } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";

interface CourseFileUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const CourseFileUpload = forwardRef<HTMLInputElement, CourseFileUploadProps>(
  function CourseFileUpload({ label, ...props }, ref) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">{label}</label>
        <p className="text-xs text-white/60">Format: JPG, JPEG, PNG, WEBP (Maks. 1MB)</p>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-white">
            <Folder size={20} />
          </div>
          <div className="flex w-full cursor-pointer items-center rounded-lg border border-white/80 bg-transparent px-4 py-3 text-white/60">
            Pilih File
          </div>
          <input
            ref={ref}
            type="file"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            {...props}
          />
        </div>
      </div>
    );
  }
);
