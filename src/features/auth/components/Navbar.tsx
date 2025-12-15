"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl">
      <nav className="w-full bg-neutral-white backdrop-blur-xl rounded-2xl shadow-lg border border-neutral-light">
        <div className="flex items-center justify-start gap-6 h-16 px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/stuudi-logo.svg"
              alt="Stuudi"
              width={110}
              height={32}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
           <span className="font-semibold text-xl">Masuk atau Daftar</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
