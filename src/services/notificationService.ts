import { api } from "./api";

export interface NotificationData {
  type: string;
  message: string;
  username?: string;
  user_id?: string;
  post_id?: string;
  post_title?: string;
  comment_id?: string;
  report_id?: string;
  report_type?: string; // 'post' | 'comment' | 'user'
  reported_id?: string; // id konten yang dilaporkan
}

export interface Notification {
  id: string;
  type: string; // full class name e.g. "App\\Notifications\\NewCommentNotification"
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}

export const notificationService = {
  getAll: async (): Promise<{
    notifications: Notification[];
    unread_count: number;
  }> => {
    const response = await api.get<{
      success: boolean;
      unread_count: number;
      data: { data: Notification[] };
    }>("/notifications");
    return {
      notifications: response.data?.data ?? [],
      unread_count: response.unread_count ?? 0,
    };
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/read`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post("/notifications/read-all", {});
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
