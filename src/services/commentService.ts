import { api } from './api';
import { Comment, CreateCommentInput } from '../types/comment.type';

export const commentService = {
  getByThreadId: async (threadId: string): Promise<Comment[]> => {
    // return api.get(`/threads/${threadId}/comments`);
    return [];
  },

  create: async (data: CreateCommentInput): Promise<Comment> => {
    // return api.post('/comments', data);
    throw new Error('Not implemented');
  },

  delete: async (id: string): Promise<void> => {
    // return api.delete(`/comments/${id}`);
  },
};
