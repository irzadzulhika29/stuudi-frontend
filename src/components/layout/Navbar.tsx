"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "../ui/Button";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/tentang-kami", label: "Tentang Kami" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl">
      <nav className="w-full bg-neutral-white backdrop-blur-xl rounded-2xl shadow-lg border border-neutral-light">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/stuudi-logo.svg"
              alt="Stuudi"
              width={110}
              height={32}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname === link.href ? "nav-link-active" : "nav-link"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" href="/login" size="sm">
              Login
            </Button>
            <Button variant="outline" href="/join" size="sm">
              Join us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-neutral-light"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-neutral-dark"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 border-t border-neutral-light">
            <div className="flex flex-col gap-3 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 ${
                    pathname === link.href ? "nav-link-active" : "nav-link"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-neutral-light">
                <Button variant="ghost" href="/login" size="sm">
                  Login
                </Button>
                <Button variant="outline" href="/join" size="sm">
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
