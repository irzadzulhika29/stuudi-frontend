"use client";

import { Pencil } from "lucide-react";

const teamData = {
  teamName: "Gorengan Kantin",
  schoolName: "SMA Negeri 1 Jakarta",
  members: [
    { name: "Wahyu Pangestu", nis: "23106789", role: "Ketua" },
    { name: "Udin Petot", nis: "2306788", role: "Anggota" },
    { name: "", nis: "", role: "Opsional" },
  ],
};

export default function TeamIdentityPage() {
  return (
    <div className="min-h-screen py-6 px-4 overflow-x-hidden">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Informasi Tim</h1>

        <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
          <Pencil size={18} />
          <span>Edit</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-neutral-500 text-sm mb-1">
              Nama tim
            </label>
            <p className="text-neutral-800 font-semibold text-lg border-b border-neutral-100 pb-2">
              {teamData.teamName || "-"}
            </p>
          </div>

          <div>
            <label className="block text-neutral-500 text-sm mb-1">
              Asal sekolah
            </label>
            <p className="text-neutral-800 font-semibold text-lg border-b border-neutral-100 pb-2">
              {teamData.schoolName || "-"}
            </p>
          </div>
        </div>

        <hr className="border-neutral-100 my-6" />

        <div>
          <h2 className="text-xl font-bold text-neutral-800 mb-6">
            Anggota Tim
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamData.members.map((member, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-semibold text-neutral-800">
                  Anggota {index + 1} {member.role && `(${member.role})`}
                </h3>

                <div>
                  <label className="block text-neutral-500 text-sm mb-1">
                    Nama Lengkap
                  </label>
                  <p className="text-neutral-800 border-b border-neutral-100 pb-2">
                    {member.name || (
                      <span className="text-neutral-400 italic">
                        Belum diisi
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-neutral-500 text-sm mb-1">
                    NIS
                  </label>
                  <p className="text-neutral-800 border-b border-neutral-100 pb-2">
                    {member.nis || (
                      <span className="text-neutral-400 italic">
                        Belum diisi
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
