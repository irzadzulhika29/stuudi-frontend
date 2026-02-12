"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { notificationService } from "@/features/user/dashboard/services/notificationService";
import { Notification } from "@/features/user/dashboard/types/notificationTypes";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notifResponse, unreadResponse] = await Promise.all([
          notificationService.getNotifications(1, 5), // Always fetch page 1 for polling
          notificationService.getUnreadCount(),
        ]);

        if (notifResponse?.data?.notifications) {
          // Merge new notifications with existing ones, avoiding duplicates
          setNotifications((prev) => {
            const newNotifs = notifResponse.data.notifications;
            const existingIds = new Set(prev.map((n) => n.notification_id));
            const uniqueNewNotifs = newNotifs.filter((n) => !existingIds.has(n.notification_id));

            // If we are on page 1 (initial load or poll), we want to prepend new ones
            // But if we have loaded more pages, we want to keep the old ones too
            // Strategy:
            // 1. Combine unique new ones + existing
            // 2. Sort by created_at desc to assume order
            // 3. Or simply: Prepend new ones that are newer than the newest existing?

            // Simplest for now:
            // If page === 1, replace.
            // If page > 1, prepend new ones to existing list.

            // Actually, for polling, we might miss notifications if we only fetch page 1
            // and user has scrolled down.
            // But let's assume polling just updates the "top" of the list.

            return [...uniqueNewNotifs, ...prev].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
          });
        }
        if (unreadResponse?.data?.unread_count !== undefined) {
          setUnreadCount(unreadResponse.data.unread_count);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();

    // Poll every 60 seconds
    const intervalId = setInterval(fetchNotifications, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await notificationService.getNotifications(nextPage, 5);

      if (response?.data?.notifications && response.data.notifications.length > 0) {
        setNotifications((prev) => {
          const newNotifs = response.data.notifications;
          const existingIds = new Set(prev.map((n) => n.notification_id));
          const uniqueNewNotifs = newNotifs.filter((n) => !existingIds.has(n.notification_id));
          return [...prev, ...uniqueNewNotifs];
        });
        setPage(nextPage);

        // Check if we reached the end
        if (
          response.data.notifications.length < 5 ||
          (response.data.total &&
            notifications.length + response.data.notifications.length >= response.data.total)
        ) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more notifications", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

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

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
      );
      // Optimistically decrease unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      // Check if notification was unread before deleting to update count
      const notification = notifications.find((n) => n.notification_id === id);
      if (notification && !notification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setNotifications((prev) => prev.filter((n) => n.notification_id !== id));
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "new_content":
        return "bg-blue-500";
      case "new_topic":
        return "bg-green-500";
      case "exam_reminder":
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
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 translate-x-1/2 -translate-y-1/2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white/10">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="animate-fade-in absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3">
            <h3 className="font-semibold text-neutral-800">Notifikasi</h3>
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
              <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
                <Bell size={32} className="mb-2" />
                <p className="text-sm">Tidak ada notifikasi</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`group relative border-b border-neutral-100 px-4 py-3 transition-colors hover:bg-neutral-50 ${
                    !notification.is_read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${getTypeColor(notification.type)}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          notification.is_read ? "text-neutral-600" : "text-neutral-900"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-neutral-500">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[10px] text-neutral-400">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.notification_id)}
                          className="hover:text-primary p-1 text-neutral-400 transition-colors"
                          title="Tandai dibaca"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.notification_id)}
                        className="p-1 text-neutral-400 transition-colors hover:text-red-500"
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

          <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-2">
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="text-primary hover:text-primary/80 w-full py-1 text-center text-xs transition-colors disabled:opacity-50"
              >
                {isLoadingMore ? "Memuat..." : "Muat lebih banyak"}
              </button>
            ) : (
              <p className="py-1 text-center text-xs text-neutral-400">
                Semua notifikasi ditampilkan
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
