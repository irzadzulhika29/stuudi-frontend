import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroWrapper from "@/components/layout/HeroWrapper";
import Image from "next/image";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroWrapper>
          <div className="max-w-6xl flex-col mx-auto flex items-center justify-center">
            <Image
              src="/images/404-notfound.svg"
              alt="Page Not Found"
              width={320}
              height={320}
              className="mb-6"
            />

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-3">
                Halaman yang anda cari tidak ditemukan
              </h1>
              <p className="text-lg text-gray-600">
                Tenang saja, kami sedang memperbaikinya!
              </p>
            </div>
          </div>
        </HeroWrapper>
      </main>
      <Footer />
    </>
  );
}
