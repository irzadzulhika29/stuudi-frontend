"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

interface TeamMember {
  name: string;
  nis: string;
  role: string;
}

interface TeamData {
  teamName: string;
  schoolName: string;
  members: TeamMember[];
}

const initialData: TeamData = {
  teamName: "Gorengan Kantin",
  schoolName: "SMA Negeri 1 Jakarta",
  members: [
    { name: "Wahyu Pangestu", nis: "23106789", role: "Ketua" },
    { name: "Udin Petot", nis: "2306788", role: "Anggota" },
  ],
};

export default function TeamIdentityPage() {
  const [teamData, setTeamData] = useState<TeamData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTeamInfoChange = (
    field: "teamName" | "schoolName",
    value: string
  ) => {
    setTeamData((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleMemberChange = (
    index: number,
    field: "name" | "nis",
    value: string
  ) => {
    setTeamData((prev) => {
      const newMembers = [...prev.members];
      newMembers[index] = { ...newMembers[index], [field]: value };
      return { ...prev, members: newMembers };
    });
    setSaveSuccess(false);
  };

  const addMember = () => {
    if (teamData.members.length >= 5) return;
    setTeamData((prev) => ({
      ...prev,
      members: [...prev.members, { name: "", nis: "", role: "Anggota" }],
    }));
    setSaveSuccess(false);
  };

  const removeMember = (index: number) => {
    if (teamData.members.length <= 1) return;
    setTeamData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
  };

  return (
    <div className="min-h-screen py-4 md:py-6 px-3 md:px-4 overflow-x-hidden">
      <div className="max-w-4xl">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 md:mb-8">
          Informasi Tim
        </h1>

        <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div>
              <label className="block text-neutral-600 text-sm font-medium mb-2">
                Nama tim
              </label>
              <input
                type="text"
                value={teamData.teamName}
                onChange={(e) =>
                  handleTeamInfoChange("teamName", e.target.value)
                }
                placeholder="Masukkan nama tim..."
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-light/50 focus:border-primary-light transition-all"
              />
            </div>

            <div>
              <label className="block text-neutral-600 text-sm font-medium mb-2">
                Asal sekolah
              </label>
              <input
                type="text"
                value={teamData.schoolName}
                onChange={(e) =>
                  handleTeamInfoChange("schoolName", e.target.value)
                }
                placeholder="Masukkan asal sekolah..."
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-light/50 focus:border-primary-light transition-all"
              />
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-6 md:pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold text-neutral-800">
                Anggota Tim
              </h2>
              {teamData.members.length < 5 && (
                <button
                  onClick={addMember}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-light hover:text-primary transition-colors"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Tambah Anggota</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              {teamData.members.map((member, index) => (
                <div
                  key={index}
                  className="p-4 md:p-5 bg-neutral-50 rounded-xl border border-neutral-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-800">
                      Anggota {index + 1}{" "}
                      <span className="text-neutral-500 font-normal">
                        (
                        {index === 0
                          ? "Ketua"
                          : index < 2
                          ? "Wajib"
                          : "Opsional"}
                        )
                      </span>
                    </h3>
                    {index >= 2 && (
                      <button
                        onClick={() => removeMember(index)}
                        className="text-red-500 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-500 text-sm mb-1.5">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          handleMemberChange(index, "name", e.target.value)
                        }
                        placeholder={
                          index < 2
                            ? "Masukkan nama..."
                            : "Tambahkan anggota..."
                        }
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-light/50 focus:border-primary-light transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 text-sm mb-1.5">
                        NIS
                      </label>
                      <input
                        type="text"
                        value={member.nis}
                        onChange={(e) =>
                          handleMemberChange(index, "nis", e.target.value)
                        }
                        placeholder={
                          index < 2 ? "Masukkan NIS..." : "Tambahkan NIS..."
                        }
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-light/50 focus:border-primary-light transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-3.5 bg-primary-light text-white font-semibold rounded-lg hover:bg-primary transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : saveSuccess ? (
                <span>✓ Tersimpan</span>
              ) : (
                <>
                  <Save size={20} />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
