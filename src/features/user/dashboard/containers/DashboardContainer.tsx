"use client";

import { ExamCodeInput } from "../components/ExamCodeInput";
import { DashboardCountdown } from "../components/DashboardCountdown";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { DashboardErrorBoundary } from "../components/DashboardErrorBoundary";
import Image from "next/image";
import { useUser } from "@/features/auth/shared/hooks/useUser";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import { ExamAttempt } from "../types/dashboardTypes";
import { ActiveAttemptCard } from "../components/ActiveAttemptCard";

const TeamTable = dynamic(() => import("../components/TeamTable").then((mod) => mod.TeamTable), {
  loading: () => <div className="h-64 w-full animate-pulse rounded-xl bg-white/5" />,
  ssr: false,
});

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const displayName = user?.username || "Arterians";
  const greeting = getGreeting();

  const isLoading = isUserLoading || isAttemptsLoading;

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-start pt-4">
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="relative z-10 flex w-full scroll-mt-4 flex-col items-center text-center">
          <div className="mb-6 grid w-full grid-cols-[1fr_auto] items-center gap-4 px-4 md:grid-cols-3">
            <div className="text-left">
              <h1 className="mb-1 text-xl font-bold text-white md:text-2xl">
                {greeting}, <span className="text-secondary">{displayName}!</span>
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
            <DashboardErrorBoundary title="Jadwal Ujian">
              <DashboardCountdown />
            </DashboardErrorBoundary>
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
            <DashboardErrorBoundary>
              <TeamTable />
            </DashboardErrorBoundary>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="pointer-events-none absolute bottom-16 -left-16 z-0 hidden h-96 w-96 lg:block">
            <Image
              src="/images/mascot/anti.webp"
              alt="Mascot Left"
              width={384}
              height={384}
              className="rotate-y-180 object-contain object-bottom"
              priority
            />
          </div>

          <div className="pointer-events-none absolute -right-16 bottom-16 z-0 hidden h-96 w-96 lg:block">
            <Image
              src="/images/mascot/chiby.webp"
              alt="Mascot Right"
              width={384}
              height={384}
              className="scale-x-[-1] rotate-y-180 object-contain object-bottom"
              priority
            />
          </div>
        </>
      )}
    </div>
  );
}
