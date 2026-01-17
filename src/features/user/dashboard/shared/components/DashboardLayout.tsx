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
    <div className="min-h-screen relative">
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

      <div className="relative z-10">{sidebar}</div>

      <div className="relative z-40">{topbar}</div>

      <main
        className={`
          relative z-10 pt-16 min-h-screen overflow-x-hidden
          transition-all duration-300
          ${isCollapsed ? "ml-20" : "ml-56"}
        `}
      >
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto w-full h-full">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
  sidebar,
  topbar,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent sidebar={sidebar} topbar={topbar}>
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}
