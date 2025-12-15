import SectionWrapper from "@/components/ui/SectionWrapper";
import Image from "next/image";

const collaborators = [
  {
    name: "Pertamuda",
    logo: "/images/collaborators/pertamuda.svg",
  },
  {
    name: "BCG",
    logo: "/images/collaborators/bcg.svg",
  },
  {
    name: "Deloitte",
    logo: "/images/collaborators/deloitte.svg",
  },
  {
    name: "GDSC",
    logo: "/images/collaborators/gdsc.svg",
  },
  {
    name: "Paragon",
    logo: "/images/collaborators/paragon.svg",
  },
  {
    name: "Microsoft Education",
    logo: "/images/collaborators/pertamuda.svg",
  },
];

interface CollaboratorsSectionProps {
  id?: string;
}

export default function CollaboratorsSection({
  id,
}: CollaboratorsSectionProps) {
  return (
    <SectionWrapper id={id} background="light" size="md">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-dark">
          Membantu lebih dari 1000 Organisasi untuk <br />
          Menciptakan Masa Depan melalui Stuudi
        </h2>
      </div>

      <div className="p-10 rounded-3xl border-2 border-secondary-light  grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
        {collaborators.map((collaborator) => (
          <div
            key={collaborator.name}
            className="flex items-center justify-center p-4 hover:opacity-100 transition-all duration-300"
          >
            <Image
              src={collaborator.logo}
              alt={collaborator.name}
              width={120}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-neutral-gray/20">
        <div className="text-center bg-gradient-to-r from-primary-dark to-primary text-white p-8 rounded-3xl">
          <h1 className="text-2xl mb-5 sm:text-3xl font-bold ">
            Mengapa Harus Dengan Stuudi?
          </h1>
          <p>
            Karena kami tidak hanya menawarkan kemudahan dan integritas dalam
            pembelajaran,<br /> namun juga mengintegrasikan kenyamanan untuk
            mendapatkan hasil yang maksimal.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
