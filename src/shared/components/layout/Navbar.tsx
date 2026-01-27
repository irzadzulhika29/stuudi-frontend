"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "../ui/Button";
import { ROUTES } from "@/shared/config";

const navLinks = [
  { href: ROUTES.HOME, label: "Beranda" },
  { href: ROUTES.PRODUK, label: "Produk" },
  { href: ROUTES.TENTANG_KAMI, label: "Tentang Kami" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-6 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2">
      <nav className="bg-neutral-white border-neutral-light w-full rounded-2xl border shadow-lg backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href={ROUTES.HOME} className="flex items-center">
            <Image src="/images/logo/ARTERI.webp" alt="Arteri" width={100} height={32} priority />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "nav-link-active" : "nav-link"}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="outline"
              className="!bg-primary !text-neutral-white"
              href={ROUTES.LOGIN}
              size="sm"
            >
              Login
            </Button>
            <Button
              className="!text-primary !border-primary hover:!bg-primary hover:!text-neutral-white"
              variant="outline"
              href={ROUTES.LOGIN}
              size="sm"
            >
              Join us
            </Button>
          </div>

          <button
            className="hover:bg-neutral-light rounded-lg p-2 transition-colors md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="text-neutral-dark h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-neutral-light border-t px-6 pb-4 md:hidden">
            <div className="flex flex-col gap-3 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 ${pathname === link.href ? "nav-link-active" : "nav-link"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-neutral-light flex flex-col gap-2 border-t pt-3">
                <Button
                  variant="outline"
                  className="!bg-primary !text-neutral-white"
                  href={ROUTES.LOGIN}
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="!border-primary !text-primary hover:!bg-primary hover:!text-neutral-white !border !bg-transparent"
                  href={ROUTES.LOGIN}
                  size="sm"
                >
                  Join us
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
