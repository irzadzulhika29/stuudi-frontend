"use client";

import { TeamTable } from "../components/TeamTable";
import { ExamCodeInput } from "../components/ExamCodeInput";
import { DashboardCountdown } from "../components/DashboardCountdown";
import Image from "next/image";
import { useUser } from "@/features/auth/shared/hooks/useUser";

import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import { ExamAttempt } from "../types/dashboardTypes";
import { ActiveAttemptCard } from "../components/ActiveAttemptCard";

export function DashboardContainer() {
  const { data: user, isLoading } = useUser();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);

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
      }
    };
    fetchAttempts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  const displayName = user?.username || "User";

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-start pt-4">
      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <div className="mb-6 ml-4 w-full px-2 text-left md:px-4">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Selamat Datang, <span className="text-secondary">{displayName}!</span>
          </h1>
          <p className="text-lg text-white/60">Mau belajar apa hari ini?</p>
        </div>

        <div className="mb-8 flex w-full flex-col items-center">
          <div className="relative mb-4 h-32 w-64">
            <Image
              src="/images/logo/ARTERI.webp"
              alt="ARTERI"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="mb-4 text-center">
            <DashboardCountdown />
          </div>
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
          />
        </div>

        <div className="pointer-events-none absolute -right-16 bottom-16 z-0 hidden h-90 w-90 lg:block">
          <Image
            src="/images/mascot/chiby.webp"
            alt="Mascot Right"
            width={320}
            height={320}
            className="scale-x-[-1] object-contain object-bottom"
          />
        </div>
      </div>
    </div>
  );
}
