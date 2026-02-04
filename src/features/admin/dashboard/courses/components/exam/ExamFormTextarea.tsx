import { TextareaHTMLAttributes } from "react";

interface ExamFormTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  label: string;
  onChange: (value: string) => void;
}

export function ExamFormTextarea({
  label,
  onChange,
  className = "",
  rows = 3,
  ...props
}: ExamFormTextareaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <textarea
        rows={rows}
        className={`w-full resize-none rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white transition-all placeholder:text-white/60 focus:ring-2 focus:ring-white/30 focus:outline-none ${className}`}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}
