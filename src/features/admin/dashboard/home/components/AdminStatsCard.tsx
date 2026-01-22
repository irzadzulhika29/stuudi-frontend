import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  footerClassName = "text-neutral-500",
  href,
  detailText = "Lihat Detail",
}: AdminStatsCardProps) {
  const cardContent = (
    <div
      className={`bg-white rounded-xl p-6 text-center ${href ? "cursor-pointer hover:shadow-lg transition-shadow duration-200" : ""}`}
    >
      <p className="text-neutral-600 font-medium mb-2">{title}</p>
      <p className="text-5xl font-bold text-secondary mb-2">{value}</p>
      <p className={`${footerClassName} text-sm`}>{footer}</p>
      {href && (
        <div className="flex items-center justify-center gap-1 mt-3 text-primary text-sm font-medium hover:underline">
          <span>{detailText}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
