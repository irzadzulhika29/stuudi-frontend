"use client";

import { TeamData } from "@/features/user/teams/types/teamTypes";
import { initialTeamData } from "@/features/user/teams/data/dummyData";

export function TeamContainer() {
  const teamData: TeamData = initialTeamData;

  return (
    <div className="min-h-screen overflow-x-hidden px-4 py-6">
      <div className="max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-white">Informasi Tim</h1>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">Nama tim</label>
              <div className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white">
                {teamData.teamName}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">Asal sekolah</label>
              <div className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white">
                {teamData.schoolName}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="mb-6 text-xl font-bold text-white">Anggota Tim</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {teamData.members.map((member, index) => (
                <div key={index}>
                  <h3 className="mb-4 font-semibold text-white">
                    Anggota {index + 1}{" "}
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
