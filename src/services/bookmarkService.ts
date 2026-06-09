import { api } from './api';
import type { Thread } from '../types/thread.type';

export const bookmarkService = {
  getAll: async (): Promise<Thread[]> => {
    const response = await api.get<{ data: Thread[] }>('/bookmarks');
    return response.data;
  },

  toggle: async (postId: string): Promise<{ is_bookmarked: boolean }> => {
    const response = await api.post<any>(`/posts/${postId}/bookmark`, {});
    return response;
  },
};
