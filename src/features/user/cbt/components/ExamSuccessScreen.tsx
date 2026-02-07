"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "@/shared/components/ui/Button";

interface ExamSuccessScreenProps {
  answeredCount: number;
  totalQuestions: number;
  examTitle?: string;
}

// Pre-generate particle configurations to avoid Math.random during render
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 0.5,
    repeatDelay: Math.random() * 3,
  }));
}

/**
 * Animated success screen shown after exam submission.
 * Features confetti-like particles and a celebratory animation sequence.
 */
export function ExamSuccessScreen({
  answeredCount,
  totalQuestions,
  examTitle,
}: ExamSuccessScreenProps) {
  const completionRate = Math.round((answeredCount / totalQuestions) * 100);

  // Memoize particles to avoid regenerating on each render
  const particles = useMemo(() => generateParticles(20), []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-8">
      {/* Animated Background Particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute h-2 w-2 rounded-full bg-green-500/30"
            initial={{
              x: "50vw",
              y: "50vh",
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              scale: [0, 1, 0.5],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: particle.repeatDelay,
            }}
          />
        ))}
      </div>

      {/* Glowing Background */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute h-[400px] w-[400px] rounded-full bg-green-500/20 blur-[100px]"
      />

      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        className="relative z-10 flex max-w-lg flex-col items-center rounded-3xl border border-green-500/30 bg-green-500/10 p-10 text-center backdrop-blur-xl"
      >
        {/* Success Icon with Ring Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
          className="relative mb-6"
        >
          {/* Pulsing Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-green-500/50"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
            >
              <CheckCircle2 size={48} className="text-green-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Trophy Animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-4"
        >
          <Trophy size={32} className="text-yellow-500" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-2 text-3xl font-bold text-white"
        >
          Ujian Selesai!
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-2 text-lg text-white/70"
        >
          Jawaban Anda telah berhasil dikumpulkan
        </motion.p>

        {/* Exam Title if provided */}
        {examTitle && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.95 }}
            className="mb-4 text-sm text-white/50"
          >
            {examTitle}
          </motion.p>
        )}

        {/* Stats */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-8 flex items-center gap-6 rounded-xl bg-white/5 px-6 py-4"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{answeredCount}</p>
            <p className="text-xs text-white/50">Terjawab</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{totalQuestions}</p>
            <p className="text-xs text-white/50">Total Soal</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{completionRate}%</p>
            <p className="text-xs text-white/50">Terisi</p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Link href="/dashboard">
            <Button variant="glow" size="lg" className="group gap-2">
              <span>Kembali ke Dashboard</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
