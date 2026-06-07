import { api } from './api';
import type { Thread, CreateThreadInput } from '../types/thread.type';

export const threadService = {
  getAll: async (): Promise<Thread[]> => {
    const response = await api.get<{ data: { data: Thread[] } }>('/posts');
    return response.data.data;
  },

  getById: async (id: string): Promise<Thread> => {
    const response = await api.get<{ data: Thread }>(`/posts/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<Thread> => {
    const response = await api.post<{ data: Thread }>('/posts', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<Thread> => {
    const response = await api.put<{ data: Thread }>(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  like: async (id: string): Promise<void> => {
    await api.post('/like', {
      likeable_id: id,
      likeable_type: 'post'
    });
  },
};
