import { AdminLeaderboard } from "@/features/admin/dashboard/home/components/AdminLeaderboard";
import { AdminStatsCards } from "@/features/admin/dashboard/home/components/AdminStatsCards";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen px-3 py-4 md:px-4 md:py-6">
      <div className="max-w-6xl">
        <h1 className="mb-2 text-2xl font-bold text-white md:text-4xl">
          Welcome back, <span className="text-secondary">Admin!</span>
        </h1>
        <p className="mb-8 text-white/60">Lihat performa kegiatan platform pada hari ini.</p>
        <AdminStatsCards />

        <div className="">
          <h2 className="mb-5 text-3xl font-bold text-neutral-800 text-white">
            Leaderboard Top 10 Teams
          </h2>
        </div>
        <AdminLeaderboard />
      </div>
    </div>
  );
}
