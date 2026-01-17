import { TeamTable } from "@/features/user/dashboard/home/components/TeamTable";
import Image from "next/image";

export default function UserDashboardPage() {
  const userName = "";
  const countdown = { months: 0, weeks: 0, days: 0 };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-start pt-4 overflow-x-hidden">
      <div className="relative z-10 w-full flex flex-col items-center text-center">
        <div className="w-full text-left ml-4 px-2 md:px-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Selamat Datang,{" "}
            <span className="text-secondary">{userName || "User"}!</span>
          </h1>
          <p className="text-white/60 text-lg">Mau belajar apa hari ini?</p>
        </div>

        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 relative w-64 h-32">
            <Image
              src="/images/logo/ARTERI.webp"
              alt="ARTERI"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div
            className="text-white font-bold text-xl md:text-2xl mt-4 tracking-wider"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            <span className="text-secondary-light">
              {countdown.months || "00"}
            </span>{" "}
            Months :{" "}
            <span className="text-secondary-light">
              {countdown.weeks || "00"}
            </span>{" "}
            Week :{" "}
            <span className="text-secondary-light">
              {countdown.days || "00"}
            </span>{" "}
            Days
          </div>
        </div>

        <div className="w-full max-w-lg mb-8">
          <input
            type="text"
            placeholder="Enter Exam Code"
            className="w-full bg-transparent border-2 border-white/50 text-white placeholder-white/60 px-6 py-3 rounded-full text-center focus:outline-none focus:border-white focus:bg-white/10 transition-all text-lg font-medium"
          />
        </div>

        <TeamTable />

        <div className="hidden lg:block absolute bottom-0 -right-10 w-80 h-80 z-20">
          <Image
            src="/images/mascot/chiby.webp"
            alt="Mascot Left"
            fill
            className="object-contain object-bottom"
          />
        </div>

        <div className="hidden lg:block absolute bottom-0 -left-10 w-80 h-80 z-20">
          <Image
            src="/images/mascot/chiby.webp"
            alt="Mascot Right"
            fill
            className="object-contain object-bottom scale-x-[-1]"
          />
        </div>
      </div>
    </div>
  );
}
