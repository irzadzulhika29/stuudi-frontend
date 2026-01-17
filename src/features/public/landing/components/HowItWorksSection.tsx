import SectionWrapper from "@/shared/components/ui/SectionWrapper";

const steps = [
  {
    icon: (
      <svg
        className="w-10 h-10"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="12"
          width="32"
          height="20"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="8"
          y="16"
          width="24"
          height="4"
          rx="1"
          fill="currentColor"
          opacity="0.3"
        />
        <rect
          x="8"
          y="24"
          width="16"
          height="4"
          rx="1"
          fill="currentColor"
          opacity="0.3"
        />
      </svg>
    ),
    title: "Pilih Paket Arteri",
    description:
      "Tentukan jenis layanan sesuai kebutuhan, mulai dari one-time use hingga annual plan, dengan pilihan paket Standard atau Premium.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="16"
          cy="14"
          r="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="28"
          cy="14"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M8 32c0-4.4 3.6-8 8-8h0c4.4 0 8 3.6 8 8"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M22 30c0-3.3 2.7-6 6-6s6 2.7 6 6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
    title: "Atur Profil Instansi",
    description:
      "Lengkapi informasi instansi atau event ujian, termasuk identitas, logo, dan pengaturan dasar pelaksanaan ujian CBT.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="6"
          y="4"
          width="28"
          height="32"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M12 12h16M12 18h16M12 24h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="24"
          y="22"
          width="8"
          height="8"
          rx="1"
          fill="#D77211"
          opacity="0.8"
        />
        <path
          d="M26 26l2 2 4-4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Kelola Materi dan Soal Ujian",
    description:
      "Unggah dan kelola materi atau soal ujian dengan mudah, termasuk pengaturan tipe soal, durasi, dan ketentuan ujian.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="8"
          width="32"
          height="24"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="8"
          y="12"
          width="24"
          height="16"
          rx="1"
          fill="currentColor"
          opacity="0.1"
        />
        <rect x="26" y="4" width="10" height="8" rx="2" fill="#D77211" />
        <circle cx="31" cy="8" r="2" fill="white" />
      </svg>
    ),
    title: "Pantau Ujian Secara Real-Time",
    description:
      "Lakukan pemantauan peserta, progres ujian, serta hasil penilaian melalui dashboard admin yang terintegrasi.",
  },
];

interface HowItWorksSectionProps {
  id?: string;
}

export default function HowItWorksSection({ id }: HowItWorksSectionProps) {
  return (
    <SectionWrapper id={id} background="white" size="lg">
      <div className="mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-dark">
          Bagaimana Cara Arteri Bekerja?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative bg-neutral-white p-6 rounded-2xl border border-neutral-light shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute inset-0 opacity-5 overflow-hidden rounded-2xl">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 border-2 border-secondary rotate-45" />
            </div>

            <div className="relative text-secondary-default mb-4">
              {step.icon}
            </div>

            <h3 className="relative text-lg font-bold text-primary-dark mb-3">
              {step.title}
            </h3>

            <p className="relative text-sm text-neutral-gray leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
