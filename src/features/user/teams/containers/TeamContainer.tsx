"use client";

import { useEffect, useState } from "react";
import { TeamDetails } from "@/features/user/teams/types/teamTypes";
import { teamService } from "@/features/user/teams/services/teamService";

export function TeamContainer() {
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        console.log("[TeamContainer] Starting to fetch team details...");
        const data = await teamService.getTeamDetails();
        console.log("[TeamContainer] Data fetched successfully:", data);
        setTeam(data);
      } catch (err) {
        console.error("[TeamContainer] Failed to fetch team details:", err);
        setError("Gagal memuat informasi tim.");
      } finally {
        setLoading(false);
        console.log("[TeamContainer] Fetch process finished");
      }
    };

    fetchTeamDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden px-4 py-6">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="mb-8 h-10 w-48 rounded-lg bg-white/10"></div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            {/* Team Info Grid Skeleton */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="mb-2 h-4 w-24 rounded bg-white/10"></div>
                  <div className="h-12 w-full rounded-lg bg-white/5"></div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="mb-6 h-7 w-32 rounded bg-white/10"></div>

              {/* Members Skeleton */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="mb-4 h-6 w-24 rounded bg-white/10"></div>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-1.5 h-4 w-20 rounded bg-white/10"></div>
                        <div className="h-10 w-full rounded-lg bg-white/5"></div>
                      </div>
                      <div>
                        <div className="mb-1.5 h-4 w-12 rounded bg-white/10"></div>
                        <div className="h-10 w-full rounded-lg bg-white/5"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center text-white/60">
          <p>{error || "Data tim tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden px-4 py-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-white">Informasi Tim</h1>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">Nama tim</label>
              <div className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white">
                {team.team_name}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">Asal sekolah</label>
              <div className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white">
                {team.school}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">Ketua Tim</label>
              <div className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white">
                {team.team_leader}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">NIS Ketua</label>
              <div className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white">
                {team.nis}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="mb-6 text-xl font-bold text-white">Anggota Tim</h2>

            {team.team_member.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {team.team_member.map((member, index) => (
                  <div key={member.team_member_id}>
                    <h3 className="mb-4 font-semibold text-white">Anggota {index + 1}</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm text-white/50">Nama Lengkap</label>
                        <div className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white">
                          {member.name || "-"}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm text-white/50">NIS</label>
                        <div className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white">
                          {member.nis || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50 italic">Belum ada anggota tambahan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
