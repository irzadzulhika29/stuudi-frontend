import Image from "next/image";

export default function CBTLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="selection:bg-secondary relative min-h-screen text-white selection:text-white">
      {/* Background Image matching Dashboard */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/bgGlobal.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <main className="relative z-10 h-full w-full">{children}</main>
    </div>
  );
}
