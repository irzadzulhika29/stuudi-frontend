"use client";

import { useTeams } from "@/features/user/teams/hooks/useTeams";
import { cn } from "@/shared/utils/cn";

interface TeamTableProps {
  className?: string;
}

export function TeamTable({ className }: TeamTableProps) {
  const { data, isLoading } = useTeams();
  const teams = data?.teams || [];

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-xl border border-white/20 shadow-lg",
        className
      )}
    >
      {/* Header Container - Fixed */}
      <div className="bg-secondary-default z-10 flex w-full text-white shadow-md">
        <div className="flex-1 border-r border-white/20 px-6 py-3 text-center font-bold">
          Nama Tim
        </div>
        <div className="flex-1 px-6 py-3 text-center font-bold">Asal Sekolah</div>
      </div>

      {/* Body Container - Scrollable */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white/10 backdrop-blur-md">
        <div className="max-h-[300px] flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-white/50">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
          ) : teams.length > 0 ? (
            teams.map((team, index) => (
              <div
                key={index}
                className={`flex w-full border-b border-white/10 transition-colors hover:bg-white/20 ${
                  index % 2 === 0 ? "bg-white/5" : ""
                }`}
              >
                <div className="flex-1 border-r border-white/10 px-6 py-3 font-medium text-white">
                  {team.team_name || "-"}
                </div>
                <div className="flex-1 px-6 py-3 text-center text-neutral-200">
                  {team.school_name}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-white/50">Belum ada tim yang terdaftar</div>
          )}
        </div>
      </div>

      <div className="bg-secondary-default/80 p-3 text-center text-sm font-semibold text-white backdrop-blur-sm">
        <span className="mr-2 inline-block h-3 w-3 rounded-full bg-green-400"></span>
        {teams.length} Tim Terdaftar
      </div>
    </div>
  );
}
