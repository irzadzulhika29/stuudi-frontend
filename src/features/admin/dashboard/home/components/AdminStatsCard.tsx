import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminGlassCard } from "./AdminGlassCard";

type AdminStatsCardProps = {
  title: string;
  value: string;
  footer: string;
  footerClassName?: string;
  href?: string;
  detailText?: string;
};

export function AdminStatsCard({
  title,
  value,
  footer,
  footerClassName = "text-white/50",
  href,
  detailText = "Lihat Detail",
}: AdminStatsCardProps) {
  const cardContent = (
    <AdminGlassCard
      className={`flex h-full flex-col items-center justify-center text-center ${href ? "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" : ""}`}
    >
      <p className="mb-2 font-medium text-neutral-500">{title}</p>
      <p className="mb-2 text-5xl font-bold text-neutral-900">{value}</p>
      <p className={`${footerClassName} text-sm`}>{footer}</p>
      {href && (
        <div className="text-secondary mt-4 flex items-center justify-center gap-1 text-sm font-medium hover:underline">
          <span>{detailText}</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      )}
    </AdminGlassCard>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
