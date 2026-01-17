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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-neutral-600 font-medium mb-2">
              Total Participants
            </p>
            <p className="text-5xl font-bold text-secondary mb-2">216</p>
            <p className="text-emerald-500 text-sm">+50% this week</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-neutral-600 font-medium mb-2">
              Disqualified Participants
            </p>
            <p className="text-5xl font-bold text-secondary mb-2">3</p>
            <p className="text-emerald-500 text-sm">+3 this week</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-neutral-600 font-medium mb-2">
              Cheating Reports
            </p>
            <p className="text-5xl font-bold text-secondary mb-2">5</p>
            <p className="text-neutral-500 text-sm">2 verified this week</p>
          </div>
        </div>

        {/* Leaderboard - Edit sini */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">
            Leaderboard Top 10 Teams
          </h2>
          <p className="text-neutral-500 text-center py-8">
            Edit sini - tambahkan tabel leaderboard
          </p>
        </div>
      </div>
    </div>
  );
}
