import type { Comment, CreateCommentInput } from '../types/comment.type';

export const commentService = {
  getByThreadId: async (_threadId: string): Promise<Comment[]> => {
    // return api.get(`/threads/${threadId}/comments`);
    return [];
  },

  create: async (_data: CreateCommentInput): Promise<Comment> => {
    // return api.post('/comments', data);
    throw new Error('Not implemented');
  },

  delete: async (_id: string): Promise<void> => {
    // return api.delete(`/comments/${id}`);
  },
};
