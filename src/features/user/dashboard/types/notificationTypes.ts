export interface Notification {
  notification_id: string;
  type: "new_content" | "new_topic" | "exam_reminder";
  title: string;
  message: string;
  reference_id: string;
  reference_type: "content" | "topic" | "exam";
  course_id: string;
  course_name: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    notifications: Notification[];
    total: number;
    page: number;
    per_page: number;
  };
}

export interface UnreadCountResponse {
  status: {
    code: number;
    isSuccess: boolean;
  };
  message: string;
  data: {
    unread_count: number;
  };
}
