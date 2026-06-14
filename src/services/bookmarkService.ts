import { api } from './api';
import type { Thread } from '../types/thread.type';

export const bookmarkService = {
  getAll: async (): Promise<Thread[]> => {
    const response = await api.get<{
      success: boolean;
      data: {
        data: Array<{ id: string; post: Thread; created_at: string }>;
        current_page: number;
        total: number;
        last_page: number;
      };
    }>('/bookmarks');
    return response.data.data.map((item) => item.post);
  },

  toggle: async (postId: string): Promise<{ is_bookmarked: boolean }> => {
    const response = await api.post<{ is_bookmarked: boolean }>(`/posts/${postId}/bookmark`, {});
    return response;
  },
};
