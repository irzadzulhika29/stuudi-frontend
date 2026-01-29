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
    "inline-flex items-center cursor-pointer justify-center gap-2 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]",
    secondary:
      "bg-secondary text-white shadow-sm hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/20 active:scale-[0.98]",
    outline:
      "bg-transparent border-2 border-primary text-primary hover:border-primary/80 hover:text-primary hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10 active:scale-[0.98]",
    ghost: "text-primary hover:bg-primary/5 hover:text-primary/80 active:scale-[0.98]",
    danger:
      "bg-red-600 text-white shadow-sm hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98]",
    success: "bg-green-500/10 border border-green-500/20 text-green-400 cursor-default",
    glow: "bg-linear-to-r from-secondary to-secondary-light text-white shadow-[0_0_20px_rgba(var(--secondary-rgb),0.4)] hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(var(--secondary-rgb),0.5)] disabled:shadow-none disabled:bg-white/10 disabled:text-white/40 disabled:border disabled:border-white/5 disabled:hover:scale-100",
  };

  const sizes = {
    xs: "px-3 py-2 text-sm", // Removed rounded-lg to consistency use rounded-xl or let base govern (actually rounded-xl might be too big for xs, let me check. If I remove it, it uses base rounded-xl. XS with XL radius is fine, looks like small pill/rect).
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
