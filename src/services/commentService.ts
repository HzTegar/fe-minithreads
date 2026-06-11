import { api } from './api';
import type { Comment } from '../types/comment.type';

export const commentService = {
  create: async (postId: string, data: { body: string; parent_id?: string }): Promise<Comment> => {
    const response = await api.post<{ data: Comment }>(`/posts/${postId}/comments`, data);
    return response.data;
  },

  update: async (id: string, data: { body: string }): Promise<Comment> => {
    const response = await api.put<{ data: Comment }>(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },

  toggleLike: async (id: string): Promise<{ likes_count: number }> => {
    const response = await api.post<any>(`/comments/${id}/like`, {});
    return response.data || response;
  },

  vote: async (id: string, type: 'up' | 'down'): Promise<{ vote_score: number }> => {
    const response = await api.post<any>('/vote', {
      target_id: id,
      target_type: 'comment',
      vote_type: type,
    });
    return response.data || response;
  },
};
