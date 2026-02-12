import { api } from "@/shared/api/api";
import { API_ENDPOINTS } from "@/shared/config/constants";
import { NotificationsResponse, UnreadCountResponse } from "../types/notificationTypes";

export const notificationService = {
  getNotifications: async (page = 1, per_page = 5): Promise<NotificationsResponse> => {
    try {
      const response = await api.get<NotificationsResponse>(
        API_ENDPOINTS.COURSES.NOTIFICATIONS(page, per_page)
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  },
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    try {
      const response = await api.get<UnreadCountResponse>(
        API_ENDPOINTS.COURSES.NOTIFICATIONS_UNREAD
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      throw error;
    }
  },
  markAsRead: async (id: string) => {
    try {
      await api.patch(API_ENDPOINTS.COURSES.NOTIFICATIONS_MARK_READ(id));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  },
  markAllAsRead: async () => {
    try {
      await api.patch(API_ENDPOINTS.COURSES.NOTIFICATIONS_MARK_ALL_READ);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },
  deleteNotification: async (id: string) => {
    try {
      await api.delete(API_ENDPOINTS.COURSES.NOTIFICATIONS_DELETE(id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
      throw error;
    }
  },
  deleteAllNotifications: async () => {
    try {
      await api.delete(API_ENDPOINTS.COURSES.NOTIFICATIONS_DELETE_ALL);
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
      throw error;
    }
  },
};
