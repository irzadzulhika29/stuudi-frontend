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
    <div className="w-full max-w-3xl mx-auto mt-8 overflow-hidden rounded-xl shadow-lg border border-white/20">
      <table className="w-full text-center border-collapse">
        <thead>
          <tr className="bg-secondary-default text-white">
            <th className="py-3 px-6 font-bold border-r border-white/20">
              Nama Tim
            </th>
            <th className="py-3 px-6 font-bold">Asal Sekolah</th>
          </tr>
        </thead>
        <tbody className="bg-white/10 backdrop-blur-md text-white">
          {teams.map((team, index) => (
            <tr
              key={index}
              className={`border-b border-white/10 hover:bg-white/20 transition-colors ${
                index % 2 === 0 ? "bg-white/5" : ""
              }`}
            >
              <td className="py-3 px-6 border-r border-white/10 font-medium">
                {team.name}
              </td>
              <td className="py-3 px-6 text-neutral-200">{team.school}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-secondary-default/80 p-3 text-center text-white text-sm font-semibold backdrop-blur-sm">
        <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span>
        500 Tim Terdaftar
      </div>
    </div>
  );
}
