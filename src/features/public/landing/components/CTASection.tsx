import SectionWrapper from "@/shared/components/ui/SectionWrapper";
import Button from "@/shared/components/ui/Button";

interface CTASectionProps {
  id?: string;
}

export default function CTASection({ id }: CTASectionProps) {
  return (
    <SectionWrapper
      id={id}
      background="white"
      size="lg"
      className="relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="w-full md:w-1/2 flex justify-center md:justify-start relative">
          <div className="hidden md:block w-80 h-80" />
        </div>

        <div className="w-full md:w-1/2 text-left md:pl-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Siap Beralih ke Sistem <br />
            yang Lebih Modern?
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
            Mulai bangun sistem pembelajaran dan kompetisi anda dengan{" "}
            <span className="text-secondary-default font-bold">Arteri</span>
          </p>
          <Button href="/join" size="lg" className="!rounded-full px-8 gap-2">
            Mulai Sekarang
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
