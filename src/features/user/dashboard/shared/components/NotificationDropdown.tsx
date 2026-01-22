"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "info" | "success" | "warning";
}

const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "Ujian Baru Tersedia",
    message: "Try Out UTBK Batch 2 sudah bisa diakses",
    time: "5 menit lalu",
    isRead: false,
    type: "info",
  },
  {
    id: "2",
    title: "Selamat!",
    message: "Anda berhasil menyelesaikan Materi Fisika Dasar",
    time: "1 jam lalu",
    isRead: false,
    type: "success",
  },
  {
    id: "3",
    title: "Pengingat",
    message: "Try Out UTBK Batch 1 akan berakhir dalam 2 hari",
    time: "3 jam lalu",
    isRead: true,
    type: "warning",
  },
  {
    id: "4",
    title: "Materi Baru",
    message: "Matematika Dasar: Persamaan Kuadrat telah ditambahkan",
    time: "1 hari lalu",
    isRead: true,
    type: "info",
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsPinned(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  const handleClick = () => {
    setIsPinned(true);
    setIsOpen(true);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleClick}
        className="relative rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="animate-fade-in absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
            <h3 className="font-semibold text-white">Notifikasi</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs transition-colors"
              >
                <Check size={14} />
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/50">
                <Bell size={32} className="mb-2" />
                <p className="text-sm">Tidak ada notifikasi</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/5 ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${getTypeColor(notification.type)}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          notification.isRead ? "text-white/70" : "text-white"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-white/50">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[10px] text-white/40">{notification.time}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="hover:text-primary p-1 text-white/50 transition-colors"
                          title="Tandai dibaca"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 text-white/50 transition-colors hover:text-red-400"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-white/10 bg-white/5 px-4 py-2">
            <button className="text-primary hover:text-primary/80 w-full py-1 text-center text-xs transition-colors">
              Lihat semua notifikasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
