import { api } from './api';
import type { Comment, CreateCommentInput } from '../types/comment.type';

export const commentService = {
  getByThreadId: async (postId: string): Promise<Comment[]> => {
    // Backend returns nested comments in the post detail, but we can also fetch if needed.
    // Based on api.php, there isn't a direct standalone GET for all comments of a post,
    // they are usually included in the Post show response.
    const response = await api.get<{ data: any }>(`/posts/${postId}`);
    return response.data.comments || [];
  },

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

  toggleLike: async (id: string): Promise<void> => {
    await api.post(`/comments/${id}/like`, {});
  },
};
