import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Produk - Stuudi",
  description: "Jelajahi fitur-fitur unggulan platform Stuudi untuk pembelajaran dan olimpiade.",
};

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Pembelajaran Adaptif",
    description: "Sistem pembelajaran yang menyesuaikan dengan kecepatan dan gaya belajar setiap peserta.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Gamifikasi Interaktif",
    description: "Belajar dengan cara yang menyenangkan melalui game, badge, dan leaderboard.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Olimpiade Terintegrasi",
    description: "Penyelenggaraan olimpiade skala besar dengan sistem penilaian otomatis dan anti-kecurangan.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Manajemen Tim",
    description: "Kelola tim dengan mudah, pantau progress, dan kolaborasi secara real-time.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Analitik Mendalam",
    description: "Dashboard analitik komprehensif untuk memahami performa dan progress pembelajaran.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Keamanan Terjamin",
    description: "Sistem keamanan berlapis untuk melindungi data dan mencegah kecurangan.",
  },
];

export default function ProdukPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E8F6FE]">
          <div className="container-custom text-center">
            <span className="inline-block px-4 py-2 bg-blue-100 text-[#27A8F3] font-semibold rounded-full text-sm mb-6">
              Produk Kami
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A2E] mb-6">
              Solusi Lengkap untuk{" "}
              <span className="text-[#27A8F3]">Pembelajaran Modern</span>
            </h1>
            <p className="text-lg text-[#4A5568] max-w-2xl mx-auto">
              Platform all-in-one yang menggabungkan teknologi terkini dengan
              metodologi pembelajaran yang efektif.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-[#27A8F3] mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#4A5568] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-[#27A8F3]">
          <div className="container-custom text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Siap Memulai Perjalanan Anda?
            </h2>
            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
              Bergabunglah dengan ribuan pengguna yang sudah merasakan manfaat platform Stuudi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                href="/demo"
                className="!bg-white !text-[#27A8F3] hover:!bg-gray-100"
              >
                Coba Demo Gratis
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/kontak"
                className="!border-white !text-white hover:!bg-white/10"
              >
                Hubungi Kami
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
