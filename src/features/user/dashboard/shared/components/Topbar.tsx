"use client";

import { User, LogOut } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/features/user/dashboard/shared/context/SidebarContext";
import { NotificationDropdown } from "./NotificationDropdown";
import Image from "next/image";
import { useLogout } from "@/features/auth/shared/hooks/useLogout";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";

interface TopbarProps {
  user?: {
    name?: string;
    roleName?: string;
    image?: string;
    xp?: number;
  };
  title?: string;
}

export function Topbar({ user, title }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { isCollapsed } = useSidebar();
  const { mutate: logout, isPending } = useLogout();

  const handleLogoutClick = () => {
    setShowDropdown(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-white/5 px-6 backdrop-blur transition-all duration-300 ${isCollapsed ? "left-20" : "left-56"} `}
      >
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-neutral-800 dark:text-white/90">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />

          <div
            className="group relative flex cursor-pointer items-center gap-3"
            onClick={() => setShowDropdown(!showDropdown)}
            role="button"
            aria-label="User profile menu"
            aria-expanded={showDropdown}
            aria-haspopup="true"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowDropdown(!showDropdown);
              }
            }}
          >
            <div className="hidden text-right md:block">
              <p className="text-sm leading-tight font-semibold text-white transition-opacity group-hover:opacity-90">
                {user?.name || "User Name"}
              </p>
              <p className="text-xs text-white/70">{user?.roleName || "Student"}</p>
            </div>

            <div className="group/xp relative">
              <div className="relative flex h-10 w-10 overflow-hidden rounded-full border border-white/30 bg-white/20 text-xs font-bold text-white ring-2 ring-white/10 transition-transform text-shadow-sm group-hover:ring-white/30 active:scale-95">
                <div className="absolute inset-0 z-10 -translate-x-full bg-linear-to-r from-transparent via-white/90 to-transparent transition-transform duration-1000 group-hover:animate-[shimmer_2s_infinite]" />
                <div className="relative z-0 flex h-full w-full items-center justify-center">
                  {user?.xp !== undefined ? (
                    `${user.xp}`
                  ) : user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </div>
              </div>

              {user?.xp !== undefined && (
                <div className="pointer-events-none absolute top-full right-0 mt-1 hidden rounded bg-neutral-800/90 px-2 py-1 text-[10px] whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/xp:block group-hover/xp:opacity-100">
                  Total XP
                </div>
              )}
            </div>

            {showDropdown && (
              <div className="absolute top-full right-0 z-50 mt-2 w-64 origin-top-right animate-[fadeIn_0.2s_ease-out] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1 font-medium shadow-xl">
                <div className="border-b border-neutral-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-neutral-200">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-500">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-bold text-neutral-900">
                        {user?.name || "User Name"}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {user?.roleName || "Student"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogoutClick();
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors group-hover:bg-red-100 group-hover:text-red-600">
                      <LogOut size={16} />
                    </div>
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari akun ini?"
        confirmText="Keluar"
        cancelText="Batal"
        variant="danger"
        isLoading={isPending}
      />
    </>
  );
}
