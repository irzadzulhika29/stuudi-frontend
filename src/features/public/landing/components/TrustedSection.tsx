import SectionWrapper from "@/shared/components/ui/SectionWrapper";

const testimonials = [
  {
    quote:
      "Arteri sangat membantu kami dalam menyelenggarakan ujian berbasis komputer. Pengelolaan soal hingga penilaian menjadi lebih efisien.",
    name: "Andi Pratama",
    role: "Admin Akademik",
  },
  {
    quote:
      "Monitoring peserta ujian melalui dashboard memudahkan kami memastikan ujian berjalan dengan tertib dan transparan.",
    name: "Siti Rahmawati",
    role: "Koordinator Ujian",
  },
  {
    quote:
      "Antarmuka Arteri mudah dipahami oleh dosen maupun mahasiswa. Sistemnya stabil dan mendukung pelaksanaan CBT dengan baik.",
    name: "Budi Santoso",
    role: "Dosen",
  },
  {
    quote: "Pelaksanaan ujian CBT menjadi lebih rapi dan mudah dikontrol.",
    name: "Rina Kurnia",
    role: "Admin Ujian",
  },
];

interface TrustedSectionProps {
  id?: string;
}

export default function TrustedSection({ id }: TrustedSectionProps) {
  return (
    <SectionWrapper
      id={id}
      background="white"
      size="lg"
      className="relative overflow-hidden"
    >
      <div className="text-right mb-16 relative z-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-dark max-w-2xl ml-auto leading-tight">
          Dipercaya untuk Pelaksanaan Ujian <br />
          dan Kompetisi Digital
        </h2>
      </div>

      <div className="relative z-10">
        <div className="hidden lg:block absolute top-[40px] left-0 w-full h-[2px] " />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-between items-center text-center group"
            >
              <div className="relative mb-6 bg-neutral-light rounded-full p-1 transition-transform duration-300 ">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-neutral-400">
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <p className="text-neutral-gray text-sm leading-relaxed min-h-[80px]">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div>
                  <h4 className="font-bold text-primary-dark">{item.name}</h4>
                  <p className="text-sm text-neutral-gray/80">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
