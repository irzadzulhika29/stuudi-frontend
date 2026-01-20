import { AdminLeaderboard } from "@/features/admin/dashboard/home/components/AdminLeaderboard";
import { AdminStatsCards } from "@/features/admin/dashboard/home/components/AdminStatsCards";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen py-4 md:py-6 px-3 md:px-4">
      <div className="max-w-6xl">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
          Welcome back, <span className="text-secondary">Admin!</span>
        </h1>
        <p className="text-white/60 mb-8">
          Lihat performa kegiatan platform pada hari ini.
        </p>
        <AdminStatsCards />

        <div className="">
          <h2 className="text-white text-3xl mb-5 font-bold text-neutral-800">
            Leaderboard Top 10 Teams
          </h2>
        </div>
        <AdminLeaderboard />
      </div>
    </div>
  );
}
