"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ViolationWarningProps {
  lives: number;
  maxLives: number;
  isVisible: boolean;
  onDismiss?: () => void;
}

/**
 * Animated warning toast shown when user loses a life during exam.
 * Features:
 * - Pulsing animation for urgency
 * - Lives remaining indicator
 * - Auto-dismiss capability
 */
export function ViolationWarning({ lives, maxLives, isVisible, onDismiss }: ViolationWarningProps) {
  if (lives >= maxLives) return null;

  const isCritical = lives <= 1;

  return (
    <AnimatePresence>
      {isVisible && lives > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border px-6 py-3 shadow-2xl ${
            isCritical ? "border-red-500/50 bg-red-500/95" : "border-orange-500/50 bg-orange-500/90"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Pulsing Warning Icon */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <AlertTriangle size={20} className="text-white" />
            </motion.div>

            <div className="flex flex-col">
              <span className="font-semibold text-white">
                {isCritical ? "Peringatan Terakhir!" : "Pelanggaran Terdeteksi"}
              </span>
              <span className="text-sm text-white/80">
                Sisa nyawa: {lives} / {maxLives}
              </span>
            </div>

            {/* Lives Indicator */}
            <div className="ml-4 flex items-center gap-1">
              {Array.from({ length: maxLives }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`h-2.5 w-2.5 rounded-full ${i < lives ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>

            {/* Dismiss Button */}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="ml-2 rounded-full p-1 transition-colors hover:bg-white/20"
              >
                <X size={16} className="text-white/80" />
              </button>
            )}
          </div>

          {/* Progress bar showing severity */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="absolute bottom-0 left-0 h-1 rounded-b-xl bg-white/30"
            onAnimationComplete={onDismiss}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
