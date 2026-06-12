import { api } from './api';
import type { Thread } from '../types/thread.type';

export const threadService = {
  getAll: async (): Promise<Thread[]> => {
    const response: any = await api.get('/posts');
    // Jika response paginated (seperti data yang kamu kirim), ambil dari response.data.data
    if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  },

  getByUser: async (username: string): Promise<Thread[]> => {
    const response: any = await api.get(`/posts?user=${encodeURIComponent(username)}`);
    if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  },

  getById: async (id: string): Promise<Thread> => {
    const response: any = await api.get(`/posts/${id}`);
    // PENTING: Mengambil .data dari object response agar field edit_count terbaca
    return response.data?.data || response.data || response;
  },

  create: async (data: any): Promise<any> => {
    const response: any = await api.post('/posts', data);
    return response.data?.data || response.data || response;
  },

  update: async (id: string, data: any): Promise<any> => {
    // Tetap menggunakan _method: 'PUT' untuk Laravel
    const response: any = await api.post(`/posts/${id}`, { ...data, _method: 'PUT' });
    return response.data?.data || response.data || response;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  like: async (id: string): Promise<{ likes_count: number; is_liked: boolean }> => {
    const response: any = await api.post('/like', {
      target_id: id,
      target_type: 'post'
    });
    return response.data?.data || response.data || response;
  },

  vote: async (id: string, type: 'up' | 'down'): Promise<{ vote_score: number }> => {
    const response: any = await api.post('/vote', {
      target_id: id,
      target_type: 'post',
      vote_type: type
    });
    return response.data?.data || response.data || response;
  },
};