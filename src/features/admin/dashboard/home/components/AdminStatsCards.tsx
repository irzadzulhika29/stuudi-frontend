import { AdminStatsCard } from "@/features/admin/dashboard/home/components/AdminStatsCard";

interface AdminStatsCardsProps {
  totalParticipants?: number;
  disqualifiedParticipants?: number;
  cheatingReports?: number;
  isLoading?: boolean;
}

export function AdminStatsCards({
  totalParticipants = 0,
  disqualifiedParticipants = 0,
  cheatingReports = 0,
  isLoading = false,
}: AdminStatsCardsProps) {
  const statsCards = [
    {
      title: "Total Participants",
      value: isLoading ? "-" : totalParticipants.toString(),
      footer: "",
      footerClassName: "text-emerald-500",
      href: "/dashboard-admin/participant",
    },
    {
      title: "Disqualified Participants",
      value: isLoading ? "-" : disqualifiedParticipants.toString(),
      footer: "",
      footerClassName: "text-emerald-500",
      href: "/dashboard-admin/disqualified-participants",
    },
    {
      title: "Cheating Reports",
      value: isLoading ? "-" : cheatingReports.toString(),
      footer: "",
      footerClassName: "text-neutral-500",
      href: "/dashboard-admin/cheating-report",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {statsCards.map((card) => (
        <AdminStatsCard
          key={card.title}
          title={card.title}
          value={card.value}
          footer={card.footer}
          footerClassName={card.footerClassName}
          href={card.href}
        />
      ))}
    </div>
  );
}
