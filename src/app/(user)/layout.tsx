"use client";

import { LayoutDashboard, BookOpen, Users } from "lucide-react";
import DashboardLayout from "@/features/user/dashboard/shared/components/DashboardLayout";
import { Sidebar } from "@/features/user/dashboard/shared/components/Sidebar";
import { Topbar } from "@/features/user/dashboard/shared/components/Topbar";
import { CourseNavigationProvider } from "@/features/user/courses/context/CourseNavigationContext";
import { useUser } from "@/features/auth/shared/hooks/useUser";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const userMenuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Courses",
      href: "/courses",
      icon: <BookOpen size={20} />,
      dynamicSubItems: true,
    },
    {
      label: "Team Identity",
      href: "/team",
      icon: <Users size={20} />,
    },
  ];

  const { data: user } = useUser();

  const getDisplayName = () => {
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const topbarUser = {
    name: user?.username || getDisplayName(),
    role: user?.roleName || user?.user_type || "Participant",
    email: user?.email,
    avatar: user?.avatar,
    xp: user?.total_exp,
  };

  return (
    <CourseNavigationProvider>
      <DashboardLayout
        sidebar={<Sidebar menuItems={userMenuItems} />}
        topbar={<Topbar user={topbarUser} />}
      >
        {children}
      </DashboardLayout>
    </CourseNavigationProvider>
  );
}
