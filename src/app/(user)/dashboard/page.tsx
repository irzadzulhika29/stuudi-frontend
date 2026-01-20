import { TeamTable } from "@/features/user/dashboard/home/components/TeamTable";
import { ExamCodeInput } from "@/features/user/dashboard/home/components/ExamCodeInput";
import Image from "next/image";

export default function UserDashboardPage() {
  const userName = "";
  const countdown = { months: 0, weeks: 0, days: 0 };

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-start overflow-x-hidden pt-4">
      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <div className="mb-6 ml-4 w-full px-2 text-left md:px-4">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Selamat Datang, <span className="text-secondary">{userName || "User"}!</span>
          </h1>
          <p className="text-lg text-white/60">Mau belajar apa hari ini?</p>
        </div>

        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4 h-32 w-64">
            <Image
              src="/images/logo/ARTERI.webp"
              alt="ARTERI"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div
            className="mt-4 text-xl font-bold tracking-wider text-white md:text-2xl"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            <span className="text-secondary-light">{countdown.months || "00"}</span> Months :{" "}
            <span className="text-secondary-light">{countdown.weeks || "00"}</span> Week :{" "}
            <span className="text-secondary-light">{countdown.days || "00"}</span> Days
          </div>
        </div>

        <ExamCodeInput />

        <TeamTable />

        <div className="absolute -right-10 bottom-0 z-20 hidden h-80 w-80 lg:block">
          <Image
            src="/images/mascot/chiby.webp"
            alt="Mascot Left"
            fill
            className="object-contain object-bottom"
          />
        </div>

        <div className="absolute bottom-0 -left-10 z-20 hidden h-80 w-80 lg:block">
          <Image
            src="/images/mascot/chiby.webp"
            alt="Mascot Right"
            fill
            className="scale-x-[-1] object-contain object-bottom"
          />
        </div>
      </div>
    </div>
  );
}
