import { api } from './api';

export interface Notification {
  id: string;
  type: string;
  data: {
    message: string;
    post_id?: string;
    comment_id?: string;
    sender_name?: string;
  };
  read_at: string | null;
  created_at: string;
}

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<{ data: Notification[] }>('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/read`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/read-all', {});
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
