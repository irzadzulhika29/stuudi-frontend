interface ExamFormDatetimeProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ExamFormDatetime({ label, value, onChange }: ExamFormDatetimeProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white [color-scheme:dark] transition-all focus:ring-2 focus:ring-white/30 focus:outline-none"
      />
    </div>
  );
}
