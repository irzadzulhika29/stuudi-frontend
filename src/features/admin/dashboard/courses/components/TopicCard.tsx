"use client";

import { Check } from "lucide-react";
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
  // status, // eslint-disable-line @typescript-eslint/no-unused-vars
  isExpanded: defaultExpanded = false,
}: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [materials]);

  // const completedCount = materials.filter((m) => m.isCompleted).length;
  // const isAllCompleted = completedCount === materials.length;

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="overflow-hidden rounded-xl shadow-sm">
      <div
        className="border-primary-light cursor-pointer border-l-4 bg-white p-5 transition-colors duration-200 hover:bg-neutral-50"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link
              href={`/dashboard-admin/courses/${courseId}/topic/${id}`}
              onClick={handleTitleClick}
              className="text-primary-dark hover:text-primary-light mb-1.5 block text-lg font-semibold transition-colors duration-200"
            >
              {title}
            </Link>
            <p className="line-clamp-2 text-sm leading-relaxed text-neutral-500">{description}</p>
          </div>
        </div>
      </div>

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
              href={`/dashboard-admin/courses/${courseId}/topic/${id}/materi/${material.id}`}
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
    </div>
  );
}
