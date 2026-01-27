import Image from "next/image";
import Button from "./Button";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSrc?: string;
  className?: string;
  actionIcon?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  imageSrc = "/images/mascot/chiby.webp",
  className = "",
  actionIcon,
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl p-8 text-center ${className}`}
    >
      <div className="relative mb-6 h-48 w-48">
        <Image src={imageSrc} alt={title} fill className="object-contain opacity-80" />
      </div>

      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="mb-6 max-w-sm opacity-80">{description}</p>

      {actionLabel && onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          {actionIcon}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
