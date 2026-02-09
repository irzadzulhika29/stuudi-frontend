"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/shared/hooks/useUser";

export type AllowedRole = "student" | "teacher" | "admin";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
  fallbackPath?: string;
}

export function RoleGuard({ children, allowedRoles, fallbackPath = "/" }: RoleGuardProps) {
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // Get role from user data (roleName or user_type)
    const userRole = (user.roleName || user.user_type || "").toLowerCase();

    // Check if user's role is in allowed roles
    const isAllowed = allowedRoles.some((role) => {
      if (role === "admin") {
        return userRole === "admin" || userRole === "teacher";
      }
      return userRole === role;
    });

    if (!isAllowed) {
      router.replace(fallbackPath);
    }
  }, [user, isLoading, allowedRoles, fallbackPath, router]);

  // Show nothing while checking (middleware handles the redirect anyway)
  if (isLoading) {
    return null;
  }

  // Check role before rendering
  if (!user) {
    return null;
  }

  const userRole = (user.roleName || user.user_type || "").toLowerCase();
  const isAllowed = allowedRoles.some((role) => {
    if (role === "admin") {
      return userRole === "admin" || userRole === "teacher";
    }
    return userRole === role;
  });

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
