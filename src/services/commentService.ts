import { api } from './api';
import type { Comment, CommentEditHistory } from '../types/comment.type';

export const commentService = {
  create: async (postId: string, data: { body: string; parent_id?: string }): Promise<Comment> => {
    const response = await api.post<{ data: Comment }>(`/posts/${postId}/comments`, data as unknown as Record<string, unknown>);
    return response.data;
  },

  update: async (id: string, data: { body: string }): Promise<Comment> => {
    const response = await api.put<{ data: Comment }>(`/comments/${id}`, data as unknown as Record<string, unknown>);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },

  toggleLike: async (id: string): Promise<{ likes_count: number }> => {
    const response = await api.post<{ data?: { likes_count: number } } | { likes_count: number }>(`/comments/${id}/like`, {});
    return (response as { data?: { likes_count: number } }).data || (response as { likes_count: number });
  },

  vote: async (id: string, type: 'up' | 'down'): Promise<{ vote_score: number }> => {
    const response = await api.post<{ data?: { vote_score: number } } | { vote_score: number }>('/vote', {
      target_id: id,
      target_type: 'comment',
      vote_type: type,
    });
    return (response as { data?: { vote_score: number } }).data || (response as { vote_score: number });
  },

  // 👇 TAMBAHKAN FUNGSI INI UNTUK MENGAMBIL HISTORY
  toggleAccept: async (postId: string, commentId: string): Promise<void> => {
    await api.post(`/posts/${postId}/comments/${commentId}/toggle-accepted`, {});
  },

  getHistory: async (id: string): Promise<CommentEditHistory[]> => {
    const response = await api.get<{ data?: { data?: CommentEditHistory[] } } | { data?: CommentEditHistory[] } | CommentEditHistory[]>(`/comments/${id}/history`);
    const r = response as { data?: { data?: CommentEditHistory[] } };
    return r.data?.data || (response as { data?: CommentEditHistory[] }).data || (response as CommentEditHistory[]);
  },
};