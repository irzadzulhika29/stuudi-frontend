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
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full border-collapse text-center">
            <thead className="bg-secondary-default sticky top-0 z-10 text-white shadow-md">
              <tr>
                <th className="border-r border-white/20 px-6 py-3 font-bold">Nama Tim</th>
                <th className="px-6 py-3 font-bold">Asal Sekolah</th>
              </tr>
            </thead>
            <tbody className="bg-white/10 text-white backdrop-blur-md">
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-white/50">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    </div>
                  </td>
                </tr>
              ) : teams.length > 0 ? (
                teams.map((team, index) => (
                  <tr
                    key={index}
                    className={`border-b border-white/10 transition-colors hover:bg-white/20 ${
                      index % 2 === 0 ? "bg-white/5" : ""
                    }`}
                  >
                    <td className="border-r border-white/10 px-6 py-3 font-medium">
                      {team.team_name || "-"}
                    </td>
                    <td className="px-6 py-3 text-neutral-200">{team.school_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-white/50">
                    Belum ada tim yang terdaftar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-secondary-default/80 p-3 text-center text-sm font-semibold text-white backdrop-blur-sm">
        <span className="mr-2 inline-block h-3 w-3 rounded-full bg-green-400"></span>
        {teams.length} Tim Terdaftar
      </div>
    </div>
  );
}
