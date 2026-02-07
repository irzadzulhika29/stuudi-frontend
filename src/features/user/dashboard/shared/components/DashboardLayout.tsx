"use client";

import { ReactNode } from "react";
import Image from "next/image";
import {
  SidebarProvider,
  useSidebar,
} from "@/features/user/dashboard/shared/context/SidebarContext";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  topbar: ReactNode;
}

function DashboardContent({ children, sidebar, topbar }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/bgGlobal.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      <div className="relative z-50">{sidebar}</div>

      <div className="fixed top-0 right-0 left-0 z-40">{topbar}</div>

      <main
        className={`relative z-10 h-full overflow-x-hidden overflow-y-auto pt-20 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-56"} `}
      >
        <div className="min-h-full p-8 pb-32">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children, sidebar, topbar }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent sidebar={sidebar} topbar={topbar}>
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}
