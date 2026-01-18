import { TextareaHTMLAttributes } from "react";

interface CourseTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function CourseTextArea({
  label,
  className = "",
  ...props
}: CourseTextAreaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <textarea
        className={`w-full px-4 py-3 bg-transparent border border-white/80 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none ${className}`}
        {...props}
      />
    </div>
  );
}
