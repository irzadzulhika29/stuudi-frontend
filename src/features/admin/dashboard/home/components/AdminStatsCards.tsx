import { AdminStatsCard } from "@/features/admin/dashboard/home/components/AdminStatsCard";

const statsCards = [
  {
    title: "Total Participants",
    value: "216",
    footer: "+50% this week",
    footerClassName: "text-emerald-500",
  },
  {
    title: "Disqualified Participants",
    value: "3",
    footer: "+3 this week",
    footerClassName: "text-emerald-500",
    href:"/dashboard-admin/disqualified-participants",
  },
  {
    title: "Cheating Reports",
    value: "5",
    footer: "2 verified this week",
    footerClassName: "text-neutral-500",
    href: "/dashboard-admin/cheating-report",
  },
];

export function AdminStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
