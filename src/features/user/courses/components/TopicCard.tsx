"use client";

import { ChevronUp, Check, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export interface Material {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface TopicCardProps {
  id: string;
  courseId: string;
  title: string;
  description: string;
  materials: Material[];
  status: "completed" | "in-progress" | "locked";
  isExpanded?: boolean;
  isAdmin?: boolean;
}

export function TopicCard({
  id,
  courseId,
  title,
  description,
  materials,
  status,
  isExpanded: defaultExpanded = false,
  isAdmin = false,
}: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(status === "locked" ? false : defaultExpanded);
  const isLocked = status === "locked";
  const completedCount = materials.filter((m) => m.isCompleted).length;
  const isAllCompleted = completedCount === materials.length;
  const progressPercent =
    materials.length > 0 ? Math.round((completedCount / materials.length) * 100) : 0;

  const getStatusBadge = () => {
    if (isLocked) {
      return (
        <span className="flex items-center gap-1.5 rounded-full bg-neutral-400 px-4 py-1.5 text-xs font-medium text-white">
          <Lock size={12} />
          Terkunci
        </span>
      );
    }
    if (status === "completed" || isAllCompleted) {
      return (
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white"
        >
          Selesai
        </motion.span>
      );
    }
    if (status === "in-progress") {
      return (
        <span className="bg-primary-light rounded-full px-4 py-1.5 text-xs font-medium text-white">
          Lanjutkan
        </span>
      );
    }
    return null;
  };

  const handleCardClick = () => {
    if (isLocked) return;
    setIsExpanded(!isExpanded);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      e.preventDefault();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`overflow-hidden rounded-xl shadow-sm ${isLocked ? "opacity-70" : ""}`}
    >
      <motion.div
        className={`border-l-4 bg-white p-5 transition-colors duration-200 ${
          isLocked
            ? "cursor-not-allowed border-neutral-400"
            : "border-primary-light cursor-pointer hover:bg-neutral-50"
        }`}
        onClick={handleCardClick}
        whileHover={!isLocked ? { x: 4 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {isLocked ? (
              <span className="mb-1.5 block cursor-not-allowed text-lg font-semibold text-neutral-400">
                {title}
              </span>
            ) : (
              <Link
                href={
                  isAdmin
                    ? `/dashboard-admin/courses/${courseId}/topic/${id}`
                    : `/courses/${courseId}/topic/${id}`
                }
                onClick={handleTitleClick}
                className="text-primary-dark hover:text-primary-light mb-1.5 block text-lg font-semibold transition-colors duration-200"
              >
                {title}
              </Link>
            )}
            <p
              className={`line-clamp-2 text-sm leading-relaxed ${
                isLocked ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              {description}
            </p>

            {/* Progress Indicator */}
            {!isLocked && materials.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
                  <motion.div
                    className="h-full rounded-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs font-medium text-neutral-500">
                  {completedCount}/{materials.length}
                </span>
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            {getStatusBadge()}
            {!isLocked && (
              <motion.div
                className="bg-primary-light flex h-8 w-8 items-center justify-center rounded-full text-white"
                animate={{ rotate: isExpanded ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronUp size={18} />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Animated Accordion Content */}
      <AnimatePresence initial={false}>
        {!isLocked && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/20 bg-white/10 backdrop-blur-sm">
              {materials.map((material, index) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={
                      isAdmin
                        ? `/dashboard-admin/courses/${courseId}/manage/${courseId}/material/${material.id}`
                        : `/courses/${courseId}/topic/${id}/materi/${material.id}`
                    }
                    className={`hover:bg-primary-light/20 flex items-center justify-between px-5 py-3.5 transition-all duration-200 ${
                      index !== materials.length - 1 ? "border-b border-white/10" : ""
                    }`}
                  >
                    <span className="text-sm text-white">{material.title}</span>
                    {material.isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Check className="text-emerald-400" size={18} />
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
