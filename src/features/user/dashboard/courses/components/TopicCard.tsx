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
}

export function TopicCard({
  id,
  courseId,
  title,
  description,
  materials,
  status,
  isExpanded: defaultExpanded = false,
}: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(
    status === "locked" ? false : defaultExpanded,
  );
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
        <span className="px-4 py-1.5 bg-neutral-400 text-white text-xs font-medium rounded-full flex items-center gap-1.5">
          <Lock size={12} />
          Terkunci
        </span>
      );
    }
    if (status === "completed" || isAllCompleted) {
      return (
        <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-full">
          Selesai
        </span>
      );
    }
    if (status === "in-progress") {
      return (
        <span className="px-4 py-1.5 bg-primary-light text-white text-xs font-medium rounded-full">
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
    <div
      className={`rounded-xl overflow-hidden shadow-sm ${
        isLocked ? "opacity-70" : ""
      }`}
    >
      <div
        className={`bg-white p-5 border-l-4 transition-colors duration-200 ${
          isLocked
            ? "border-neutral-400 cursor-not-allowed"
            : "border-primary-light cursor-pointer hover:bg-neutral-50"
        }`}
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {isLocked ? (
              <span className="text-lg font-semibold text-neutral-400 mb-1.5 block cursor-not-allowed">
                {title}
              </span>
            ) : (
              <Link
                href={`/dashboard/courses/${courseId}/topic/${id}`}
                onClick={handleTitleClick}
                className="text-lg font-semibold text-primary-dark mb-1.5 hover:text-primary-light transition-colors duration-200 block"
              >
                {title}
              </Link>
            )}
            <p
              className={`text-sm leading-relaxed line-clamp-2 ${
                isLocked ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {getStatusBadge()}
            {!isLocked && (
              <div
                className={`w-8 h-8 rounded-full bg-primary-light text-white flex items-center justify-center transition-all duration-300 ${
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
          <div
            ref={contentRef}
            className="bg-white/10 backdrop-blur-sm border-t border-white/20"
          >
            {materials.map((material, index) => (
              <Link
                key={material.id}
                href={`/dashboard/courses/${courseId}/topic/${id}/materi/${material.id}`}
                className={`flex items-center justify-between px-5 py-3.5 transition-all duration-200 hover:bg-primary-light/20 ${
                  index !== materials.length - 1
                    ? "border-b border-white/10"
                    : ""
                }`}
              >
                <span className="text-white text-sm">{material.title}</span>
                {material.isCompleted && (
                  <Check className="text-white" size={18} />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
