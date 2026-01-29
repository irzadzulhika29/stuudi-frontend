"use client";

import { TeamTable } from "../components/TeamTable";
import Loading from "@/app/loading";
import { ExamCodeInput } from "../components/ExamCodeInput";
import { DashboardCountdown } from "../components/DashboardCountdown";
import Image from "next/image";
import { useUser } from "@/features/auth/shared/hooks/useUser";

import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import { ExamAttempt } from "../types/dashboardTypes";
import { ActiveAttemptCard } from "../components/ActiveAttemptCard";

export function DashboardContainer() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [isAttemptsLoading, setIsAttemptsLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await dashboardService.getAttempts();
        if (response?.attempts) {
          const activeAttempts = response.attempts.filter(
            (attempt) => attempt.status !== "passed" && attempt.status !== "failed"
          );
          setAttempts(activeAttempts);
        }
      } catch (error) {
        console.error("Failed to fetch attempts", error);
      } finally {
        setIsAttemptsLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  // if (isUserLoading || isAttemptsLoading) {
  //   return <Loading />;
  // }

  const displayName = user?.username || "Arterians";

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-start pt-4">
      {/* Loading Overlay */}
      {(isUserLoading || isAttemptsLoading) && <Loading />}

      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <div className="mb-6 grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 md:grid-cols-3">
          <div className="text-left">
            <h1 className="mb-1 text-xl font-bold text-white md:text-2xl">
              Selamat Datang, <span className="text-secondary">{displayName}!</span>
            </h1>
            <p className="text-sm text-white/50">Mau belajar apa hari ini?</p>
          </div>

          <div className="relative h-16 w-32 md:h-20 md:w-40 md:justify-self-center">
            <Image
              src="/images/logo/ARTERI.webp"
              alt="ARTERI"
              fill
              className="object-contain object-right md:object-center"
              priority
            />
          </div>

          <div className="hidden md:block" />
        </div>

        <div className="mb-8 w-full">
          <DashboardCountdown />
        </div>

        {attempts.length > 0 && (
          <div className="mb-6 flex w-full flex-col items-center px-4">
            {attempts.map((attempt) => (
              <ActiveAttemptCard key={attempt.attempt_id} attempt={attempt} />
            ))}
          </div>
        )}

        <ExamCodeInput />

        <div className="relative z-10 flex w-full max-w-2xl">
          <TeamTable />
        </div>

        <div className="pointer-events-none absolute bottom-16 -left-16 z-0 hidden h-90 w-90 lg:block">
          <Image
            src="/images/mascot/chiby.webp"
            alt="Mascot Left"
            width={320}
            height={320}
            className="object-contain object-bottom"
            priority
          />
        </div>

        <div className="pointer-events-none absolute -right-16 bottom-16 z-0 hidden h-90 w-90 lg:block">
          <Image
            src="/images/mascot/chiby.webp"
            alt="Mascot Right"
            width={320}
            height={320}
            className="scale-x-[-1] object-contain object-bottom"
            priority
          />
        </div>
      </div>
    </div>
  );
}
