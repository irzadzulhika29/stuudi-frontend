"use client";

import Image from "next/image";
import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";

export default function Navbar() {
  // const pathname = usePathname(); // eslint-disable-line @typescript-eslint/no-unused-vars
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars

  return (
    <header className="absolute top-6 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2">
      <nav className="bg-neutral-white border-neutral-light w-full rounded-2xl border shadow-lg backdrop-blur-xl">
        <div className="flex h-16 items-center justify-start gap-6 px-6">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo/ARTERI.webp" alt="Arteri" width={110} height={32} priority />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <span className="text-xl font-semibold">Masuk atau Daftar</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
