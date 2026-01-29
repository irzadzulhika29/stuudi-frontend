import Image from "next/image";
import { Users } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail?: string;
  studentCount?: number;
  progress: number;
  isEnrolled?: boolean;
  onClick?: () => void;
  /** Base path for the link, e.g., "/courses" or "/dashboard-admin/courses" */
  basePath?: string;
  /** Whether to show enrolled badge */
  showEnrolledBadge?: boolean;
}

function CircularProgress({ progress }: { progress: number }) {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90 transform">
      <circle cx="16" cy="16" r={radius} fill="none" className="stroke-white/10" strokeWidth="4" />
      <circle
        cx="16"
        cy="16"
        r={radius}
        fill="none"
        stroke="#EA7D17"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CourseCard({
  id,
  title,
  thumbnail,
  studentCount,
  progress,
  isEnrolled = true,
  onClick,
  basePath = "/courses",
  showEnrolledBadge = false,
}: CourseCardProps) {
  const CardContent = (
    <div
      onClick={onClick}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-xl"
    >
      {showEnrolledBadge && isEnrolled && (
        <div className="bg-secondary-default/90 absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
          Enrolled
        </div>
      )}

      <div className="bg-secondary-light relative h-32 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={thumbnail || "/images/dummycardimage.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col space-y-4 pt-4">
        <h3 className="line-clamp-2 min-h-14 text-xl font-bold text-white">{title}</h3>

        <div className="mt-auto flex items-center justify-between text-sm">
          {studentCount !== undefined && (
            <div className="flex items-center gap-1.5 text-white/50">
              <Users size={16} />
              <span>{studentCount} students</span>
            </div>
          )}

          <div className="text-secondary-default flex items-center gap-2 font-medium">
            <CircularProgress progress={progress} />
            <span>
              <span className="font-bold text-white">{progress}%</span>
              <span className="ml-1 font-normal text-white/50">progress</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Always link if enrolled or if basePath is admin
  if (isEnrolled || basePath.includes("admin")) {
    return <Link href={`${basePath}/${id}`}>{CardContent}</Link>;
  }

  return CardContent;
}
