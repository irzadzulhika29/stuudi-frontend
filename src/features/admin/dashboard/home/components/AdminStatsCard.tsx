import Link from "next/link";

type AdminStatsCardProps = {
  title: string;
  value: string;
  footer: string;
  footerClassName?: string;
  href?: string;
};

export function AdminStatsCard({
  title,
  value,
  footer,
  footerClassName = "text-neutral-500",
  href,
}: AdminStatsCardProps) {
  const cardContent = (
    <div
      className={`bg-white rounded-xl p-6 text-center ${href ? "cursor-pointer hover:shadow-lg transition-shadow duration-200" : ""}`}
    >
      <p className="text-neutral-600 font-medium mb-2">{title}</p>
      <p className="text-5xl font-bold text-secondary mb-2">{value}</p>
      <p className={`${footerClassName} text-sm`}>{footer}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
