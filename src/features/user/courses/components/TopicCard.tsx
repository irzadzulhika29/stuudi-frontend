"use client";

import { ChevronUp, Check, Lock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const isLocked = status === "locked";

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [materials]);

  const completedCount = materials.filter((m) => m.isCompleted).length;
  const isAllCompleted = completedCount === materials.length;

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
        <span className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white">
          Selesai
        </span>
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
    <div className={`overflow-hidden rounded-xl shadow-sm ${isLocked ? "opacity-70" : ""}`}>
      <div
        className={`border-l-4 bg-white p-5 transition-colors duration-200 ${
          isLocked
            ? "cursor-not-allowed border-neutral-400"
            : "border-primary-light cursor-pointer hover:bg-neutral-50"
        }`}
        onClick={handleCardClick}
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
          </div>
          <div className="flex flex-shrink-0 items-center gap-2.5">
            {getStatusBadge()}
            {!isLocked && (
              <div
                className={`bg-primary-light flex h-8 w-8 items-center justify-center rounded-full text-white transition-all duration-300 ${
                  isExpanded ? "rotate-0" : "rotate-180"
                }`}
              >
                <ChevronUp size={18} />
              </div>
            )}
          </div>
        </div>
      </div>

      {!isLocked && (
        <div
          className="overflow-hidden transition-all duration-400 ease-out"
          style={{
            maxHeight: isExpanded ? `${contentHeight}px` : "0px",
          }}
        >
          <div ref={contentRef} className="border-t border-white/20 bg-white/10 backdrop-blur-sm">
            {materials.map((material, index) => (
              <Link
                key={material.id}
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
                {material.isCompleted && <Check className="text-white" size={18} />}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
