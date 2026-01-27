"use client";
import React from "react";
import { useTeam } from "../hooks/useTeam";

import { TeamDetailsSkeleton } from "../components/TeamDetailsSkeleton";

export function TeamContainer() {
  const { data: teamDetails, isLoading, isError } = useTeam();

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden px-4 py-6">
        <div className="max-w-4xl">
          <TeamDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !teamDetails) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Gagal memuat informasi tim.
      </div>
    );
  }

  const leader = {
    name: teamDetails.team_leader,
    nis: teamDetails.nis,
    role: "Ketua Tim",
  };

  const members = teamDetails.team_member.map((m) => ({
    name: m.name,
    nis: m.nis,
    role: "Anggota",
  }));

  const allMembers = [leader, ...members];

  return (
    <div className="min-h-screen overflow-x-hidden px-4 py-6">
      <div className="max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-white">Informasi Tim</h1>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">Nama tim</label>
              <div className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white">
                {teamDetails.team_name}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">Asal sekolah</label>
              <div className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white">
                {teamDetails.school}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="mb-6 text-xl font-bold text-white">Anggota Tim</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {allMembers.map((member, index) => (
                <div key={index}>
                  <h3 className="mb-4 font-semibold text-white">
                    {member.role === "Ketua Tim" ? "Ketua Tim" : `Anggota ${index}`}{" "}
                    <span className="font-normal text-white/50">({member.role})</span>
                  </h3>

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
          </div>
        </div>
      </div>
    </div>
  );
}
