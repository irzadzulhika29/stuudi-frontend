import Link from "next/link";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  icon,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#27A8F3] text-white hover:bg-[#1E8FD4] hover:shadow-lg hover:shadow-blue-200",
    outline:
      "border-2 border-[#27A8F3] text-[#27A8F3] hover:bg-[#27A8F3] hover:text-black",
    ghost: "text-[#27A8F3] hover:bg-blue-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {children}
        {icon && <span>{icon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
      {icon && <span>{icon}</span>}
    </button>
  );
}
