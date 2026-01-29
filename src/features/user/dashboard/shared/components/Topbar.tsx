"use client";

import { User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/features/user/dashboard/shared/context/SidebarContext";
import { NotificationDropdown } from "./NotificationDropdown";
import Image from "next/image";
import { useLogout } from "@/features/auth/shared/hooks/useLogout";
import { ConfirmModal } from "@/shared/components/ui/ConfirmModal";

interface TopbarProps {
  user?: {
    name?: string;
    email?: string;
    role?: string;
    image?: string;
    xp?: number;
  };
}

export function Topbar({ user }: TopbarProps) {
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
        className={`fixed top-0 right-0 z-30 flex h-16 items-center justify-end border-b border-white/5 bg-white/5 px-6 backdrop-blur transition-all duration-300 ${isCollapsed ? "left-20" : "left-56"} `}
      >
        <div className="flex items-center gap-4">
          <NotificationDropdown />

          <div
            className="group relative flex cursor-pointer items-center gap-3"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="hidden text-right md:block">
              <p className="text-sm leading-tight font-semibold text-white transition-opacity group-hover:opacity-90">
                {user?.name || "User Name"}
              </p>
              <p className="text-xs text-white/70">{user?.email || ""}</p>
            </div>

            {/* XP/User Circle with Shining Effect */}
            <div className="relative flex h-10 w-10 overflow-hidden rounded-full border border-white/30 bg-white/20 text-xs font-bold text-white ring-2 ring-white/10 transition-transform text-shadow-sm group-hover:ring-white/30 active:scale-95">
              {/* Shine Effect Layer */}
              <div className="absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/90 to-transparent transition-transform duration-1000 group-hover:animate-[shimmer_2s_infinite]" />

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

            {showDropdown && (
              <div className="absolute top-full right-0 z-50 mt-2 w-48 animate-[fadeIn_0.2s_ease-out] rounded-xl border border-neutral-100 bg-white py-2 shadow-xl">
                <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50">
                  <Settings size={16} className="text-neutral-400" />
                  Settings
                </button>
                <hr className="my-1 border-neutral-100" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogoutClick();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
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

      {/* Defined shimmer animation in style tag for this component specifically if not in global css */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
