import { Folder } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";

interface CourseFileUploadProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const CourseFileUpload = forwardRef<
  HTMLInputElement,
  CourseFileUploadProps
>(function CourseFileUpload({ label, className = "", ...props }, ref) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white">
          <Folder size={20} />
        </div>
        <div className="w-full px-4 py-3 bg-transparent border border-white/80 rounded-lg text-white/60 cursor-pointer flex items-center">
          Pilih File
        </div>
        <input
          ref={ref}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...props}
        />
      </div>
    </div>
  );
});
