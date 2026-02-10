import { InputHTMLAttributes } from "react";

interface ExamFormNumberProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value"
> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function ExamFormNumber({
  label,
  value,
  onChange,
  min,
  max,
  step,
  className = "",
  ...props
}: ExamFormNumberProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        className={`w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white transition-all focus:ring-2 focus:ring-white/30 focus:outline-none ${className}`}
        onChange={(e) => {
          const val = e.target.value;
          if (step && step < 1) {
            onChange(parseFloat(val) || 0);
          } else {
            onChange(parseInt(val) || 0);
          }
        }}
        {...props}
      />
    </div>
  );
}
