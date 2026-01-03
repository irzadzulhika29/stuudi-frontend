import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  background?: "white" | "light" | "primary" | "dark";
  size?: "sm" | "md" | "lg";
}

const bgClasses = {
  white: "bg-neutral-white",
  light: "bg-neutral-light",
  primary: "bg-primary text-neutral-white",
  dark: "bg-neutral-dark text-neutral-white",
};

const sizeClasses = {
  sm: "py-8 lg:py-12",
  md: "py-12 lg:py-16",
  lg: "py-16 lg:py-24",
};

export default function SectionWrapper({
  children,
  id,
  className = "",
  background = "white",
  size = "lg",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`${sizeClasses[size]} ${bgClasses[background]} ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4">{children}</div>
    </section>
  );
}
