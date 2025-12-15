import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Tentang Kami - Stuudi",
  description: "Kenali lebih dekat Stuudi, platform pembelajaran dan olimpiade pertama di Indonesia.",
};

const stats = [
  { value: "10K+", label: "Pengguna Aktif" },
  { value: "500+", label: "Sekolah Partner" },
  { value: "1M+", label: "Soal Dikerjakan" },
  { value: "50+", label: "Olimpiade Diselenggarakan" },
];

const team = [
  {
    name: "Ahmad Rizky",
    role: "CEO & Co-Founder",
    image: "https://ui-avatars.com/api/?name=Ahmad+Rizky&background=27A8F3&color=fff&size=200",
  },
  {
    name: "Sarah Dewi",
    role: "CTO & Co-Founder",
    image: "https://ui-avatars.com/api/?name=Sarah+Dewi&background=27A8F3&color=fff&size=200",
  },
  {
    name: "Budi Santoso",
    role: "Head of Product",
    image: "https://ui-avatars.com/api/?name=Budi+Santoso&background=27A8F3&color=fff&size=200",
  },
  {
    name: "Rina Kusuma",
    role: "Head of Education",
    image: "https://ui-avatars.com/api/?name=Rina+Kusuma&background=27A8F3&color=fff&size=200",
  },
];

const values = [
  {
    title: "Inovasi",
    description: "Kami terus berinovasi untuk memberikan pengalaman belajar terbaik.",
    icon: "💡",
  },
  {
    title: "Integritas",
    description: "Kejujuran dan transparansi adalah fondasi dari setiap langkah kami.",
    icon: "🎯",
  },
  {
    title: "Kolaborasi",
    description: "Bersama-sama kita bisa mencapai lebih banyak hal.",
    icon: "🤝",
  },
  {
    title: "Dampak",
    description: "Fokus pada hasil nyata untuk pendidikan Indonesia.",
    icon: "🚀",
  },
];

export default function TentangKamiPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E8F6FE]">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-blue-100 text-[#27A8F3] font-semibold rounded-full text-sm mb-6">
                Tentang Kami
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A2E] mb-6">
                Mengubah Cara Indonesia{" "}
                <span className="text-[#27A8F3]">Belajar dan Berkompetisi</span>
              </h1>
              <p className="text-lg text-[#4A5568] leading-relaxed">
                Stuudi lahir dari keinginan untuk menciptakan platform pembelajaran
                yang tidak hanya efektif, tetapi juga menyenangkan dan dapat diakses
                oleh siapa saja di seluruh Indonesia.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-[#27A8F3] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[#4A5568] font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-6">
                  Cerita Kami
                </h2>
                <div className="space-y-4 text-[#4A5568] leading-relaxed">
                  <p>
                    Berawal dari pengalaman kami sebagai peserta olimpiade dan pengajar,
                    kami melihat gap besar antara potensi siswa Indonesia dengan akses
                    mereka terhadap sumber belajar berkualitas.
                  </p>
                  <p>
                    Pada tahun 2023, kami memulai Stuudi dengan misi sederhana: membuat
                    pembelajaran menjadi lebih mudah, menyenangkan, dan dapat diakses
                    oleh semua orang.
                  </p>
                  <p>
                    Hari ini, Stuudi telah berkembang menjadi platform yang dipercaya
                    oleh ribuan siswa dan ratusan sekolah di seluruh Indonesia untuk
                    persiapan olimpiade dan pembelajaran sehari-hari.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-[#27A8F3] to-[#1E8FD4] rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="font-semibold">Tonton Video Kami</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-24 bg-[#F8FAFC]">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
                Nilai-Nilai Kami
              </h2>
              <p className="text-[#4A5568] max-w-2xl mx-auto">
                Prinsip-prinsip yang menjadi fondasi dalam setiap keputusan dan
                langkah yang kami ambil.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[#4A5568] text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
                Tim Kami
              </h2>
              <p className="text-[#4A5568] max-w-2xl mx-auto">
                Orang-orang berdedikasi di balik platform Stuudi.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A2E]">
                    {member.name}
                  </h3>
                  <p className="text-[#27A8F3] text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-[#1A1A2E]">
          <div className="container-custom text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Bergabunglah Bersama Kami
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
              Jadilah bagian dari revolusi pendidikan Indonesia. Mari bersama-sama
              menciptakan masa depan yang lebih cerah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" href="/join">
                Daftar Sekarang
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/karir"
                className="!border-gray-600 !text-white hover:!bg-gray-800"
              >
                Lihat Karir
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
