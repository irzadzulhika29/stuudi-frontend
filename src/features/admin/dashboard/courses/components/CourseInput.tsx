import { InputHTMLAttributes } from "react";

interface CourseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function CourseInput({
  label,
  className = "",
  ...props
}: CourseInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <input
        className={`w-full px-4 py-3 bg-transparent border border-white/80 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all ${className}`}
        {...props}
      />
    </div>
  );
}
