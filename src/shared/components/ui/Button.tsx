import Link from "next/link";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "secondary" | "danger" | "success" | "glow";
  size?: "xs" | "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  icon,
  iconPosition = "right",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center cursor-pointer justify-center gap-2 font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/80 hover:shadow-xl hover:shadow-primary/40",
    secondary:
      "bg-secondary text-white hover:bg-secondary/80 hover:shadow-xl hover:shadow-secondary/40",
    outline:
      "bg-transparent border-2 border-primary text-white hover:border-primary hover:text-white hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/30",
    ghost:
      "text-primary hover:bg-secondary/10 shadow-lg hover:shadow-xl shadow-secondary/10 hover:shadow-secondary/20",
    danger:
      "bg-red-600 text-white hover:bg-red-500 hover:shadow-xl hover:shadow-red-500/40 active:scale-[0.98]",
    success: "bg-green-500/10 border border-green-500/20 text-green-400 cursor-default",
    glow: "bg-linear-to-r from-secondary to-secondary-light text-white shadow-[0_0_30px_rgba(var(--secondary-rgb),0.5)] hover:scale-105 hover:shadow-[0_0_50px_rgba(var(--secondary-rgb),0.7)] disabled:shadow-none disabled:bg-white/10 disabled:text-white/40 disabled:border disabled:border-white/5 disabled:hover:scale-100",
  };

  const sizes = {
    xs: "px-3 py-2 text-sm rounded-lg",
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && <span>{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {content}
    </button>
  );
}
