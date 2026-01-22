"use client";

import { TeamData } from "../types/teamTypes";
import { initialTeamData } from "../data/dummyData";

export function TeamContainer() {
  const teamData: TeamData = initialTeamData;

  return (
    <div className="min-h-screen overflow-x-hidden px-4 py-6">
      <div className="max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-white">Informasi Tim</h1>

        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-600">Nama tim</label>
              <div className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-800">
                {teamData.teamName}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-600">
                Asal sekolah
              </label>
              <div className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-800">
                {teamData.schoolName}
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6">
            <h2 className="mb-6 text-xl font-bold text-neutral-800">Anggota Tim</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {teamData.members.map((member, index) => (
                <div key={index}>
                  <h3 className="mb-4 font-semibold text-neutral-800">
                    Anggota {index + 1}{" "}
                    <span className="font-normal text-neutral-500">({member.role})</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm text-neutral-500">Nama Lengkap</label>
                      <div className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-neutral-800">
                        {member.name || "-"}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-neutral-500">NIS</label>
                      <div className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-neutral-800">
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
