import { ReactNode } from "react";

interface AdminGlassCardProps {
  children: ReactNode;
  className?: string;
}

export function AdminGlassCard({ children, className = "" }: AdminGlassCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
