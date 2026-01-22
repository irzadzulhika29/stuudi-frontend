"use client";

const teams = [
  { name: "Juara Mama", school: "SMA 69 Jakarta" },
  { name: "Sarjana Risol", school: "SMA Al Bantani Sukarasa" },
  { name: "Rumah Abadi", school: "SMK Telkom Indonesia" },
  { name: "Rumah Abadi", school: "SMK Telkom Indonesia" },
  { name: "Rumah Abadi", school: "SMK Telkom Indonesia" },
];

export function TeamTable() {
  return (
    <div className="mx-auto mt-8 w-full max-w-3xl overflow-visible rounded-xl border border-white/20 shadow-lg">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-secondary-default text-white">
            <th className="border-r border-white/20 px-6 py-3 font-bold">Nama Tim</th>
            <th className="px-6 py-3 font-bold">Asal Sekolah</th>
          </tr>
        </thead>
        <tbody className="bg-white/10 text-white backdrop-blur-md">
          {teams.map((team, index) => (
            <tr
              key={index}
              className={`border-b border-white/10 transition-colors hover:bg-white/20 ${
                index % 2 === 0 ? "bg-white/5" : ""
              }`}
            >
              <td className="border-r border-white/10 px-6 py-3 font-medium">{team.name}</td>
              <td className="px-6 py-3 text-neutral-200">{team.school}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-secondary-default/80 p-3 text-center text-sm font-semibold text-white backdrop-blur-sm">
        <span className="mr-2 inline-block h-3 w-3 rounded-full bg-green-400"></span>
        500 Tim Terdaftar
      </div>
    </div>
  );
}
