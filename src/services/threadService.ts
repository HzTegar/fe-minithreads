import type { Thread, CreateThreadInput } from '../types/thread.type';

export const threadService = {
  getAll: async (): Promise<Thread[]> => {
    // return api.get('/threads');
    return [];
  },

  getById: async (_id: string): Promise<Thread> => {
    // return api.get(`/threads/${id}`);
    throw new Error('Not implemented');
  },

  create: async (_data: CreateThreadInput): Promise<Thread> => {
    // return api.post('/threads', data);
    throw new Error('Not implemented');
  },

  update: async (_id: string, _data: Partial<CreateThreadInput>): Promise<Thread> => {
    // return api.put(`/threads/${id}`, data);
    throw new Error('Not implemented');
  },

  delete: async (_id: string): Promise<void> => {
    // return api.delete(`/threads/${id}`);
  },

  like: async (_id: string): Promise<void> => {
    // return api.post(`/threads/${id}/like`, {});
  },
};
