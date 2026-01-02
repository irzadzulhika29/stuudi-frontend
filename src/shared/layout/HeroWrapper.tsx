import { ReactNode } from "react";

interface HeroWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function HeroWrapper({
  children,
  className = "",
  id,
}: HeroWrapperProps) {
  return (
    <section
      id={id}
      className={`relative min-h-screen overflow-hidden bg-[url('/images/hero-bg.svg')] bg-cover bg-center bg-no-repeat lg:px-4 ${className}`}
    >
      <div className="max-w-6xl mx-auto relative pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 lg:px-0">
        {children}
      </div>
    </section>
  );
}
