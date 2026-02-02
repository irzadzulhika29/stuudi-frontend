import { AdminStatsCard } from "@/features/admin/dashboard/home/components/AdminStatsCard";

interface AdminStatsCardsProps {
  totalParticipants?: number;
  disqualifiedParticipants?: number;
  cheatingReports?: number;
  isLoading?: boolean;
  examId?: string;
}

export function AdminStatsCards({
  totalParticipants = 0,
  disqualifiedParticipants = 0,
  cheatingReports = 0,
  isLoading = false,
  examId,
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
      footer: examId ? "" : "Pilih exam untuk melihat detail",
      footerClassName: "text-emerald-500",
      href: examId ? `/dashboard-admin/disqualified-participants/${examId}` : undefined,
    },
    {
      title: "Cheating Reports",
      value: isLoading ? "-" : cheatingReports.toString(),
      footer: examId ? "" : "Pilih exam untuk melihat detail",
      footerClassName: "text-neutral-500",
      href: examId ? `/dashboard-admin/cheating-report/${examId}` : undefined,
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
