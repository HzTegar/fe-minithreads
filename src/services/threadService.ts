import { api } from './api';
import type { Thread, CreateThreadInput } from '../types/thread.type';

interface ApiPaginatedResponse<T> {
  data?: {
    data?: T[];
  };
}

export const threadService = {
  getAll: async (params?: { category?: string; status?: string; liked_by?: string }): Promise<Thread[]> => {
    const queryParts: string[] = [];
    if (params?.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
    if (params?.status) queryParts.push(`status=${encodeURIComponent(params.status)}`);
    if (params?.liked_by) queryParts.push(`liked_by=${encodeURIComponent(params.liked_by)}`);
    const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const response = await api.get<ApiPaginatedResponse<Thread> | Thread[] | { data: Thread[] }>(`/posts${query}`);
    const r = response as ApiPaginatedResponse<Thread> & { data?: Thread[] };
    if (r.data?.data && Array.isArray(r.data.data)) return r.data.data;
    if (r.data && Array.isArray(r.data)) return r.data;
    if (Array.isArray(r)) return r;
    return [];
  },

  getByUser: async (username: string): Promise<Thread[]> => {
    const response = await api.get<ApiPaginatedResponse<Thread> | Thread[] | { data: Thread[] }>(`/posts?user=${encodeURIComponent(username)}`);
    const r = response as ApiPaginatedResponse<Thread> & { data?: Thread[] };
    if (r.data?.data && Array.isArray(r.data.data)) return r.data.data;
    if (r.data && Array.isArray(r.data)) return r.data;
    if (Array.isArray(r)) return r;
    return [];
  },

  getById: async (id: string): Promise<Thread> => {
    const response = await api.get<{ data?: { data?: Thread } } | { data?: Thread } | Thread>(`/posts/${id}`);
    const r = response as { data?: { data?: Thread } };
    return r.data?.data || (response as { data?: Thread }).data || (response as Thread);
  },

  create: async (data: CreateThreadInput): Promise<Thread> => {
    const response = await api.post<{ data?: { data?: Thread } } | { data?: Thread } | Thread>('/posts', data as unknown as Record<string, unknown>);
    const r = response as { data?: { data?: Thread } };
    return r.data?.data || (response as { data?: Thread }).data || (response as Thread);
  },

  update: async (id: string, data: Partial<CreateThreadInput>): Promise<Thread> => {
    const response = await api.post<{ data?: { data?: Thread } } | { data?: Thread } | Thread>(`/posts/${id}`, { ...data, _method: 'PUT' } as unknown as Record<string, unknown>);
    const r = response as { data?: { data?: Thread } };
    return r.data?.data || (response as { data?: Thread }).data || (response as Thread);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  like: async (id: string): Promise<{ likes_count: number; is_liked: boolean }> => {
    const response = await api.post<{ data?: { data?: { likes_count: number; is_liked: boolean } } } | { likes_count: number; is_liked: boolean }>('/like', {
      target_id: id,
      target_type: 'post'
    });
    const r = response as { data?: { data?: { likes_count: number; is_liked: boolean } } };
    return r.data?.data || (response as { likes_count: number; is_liked: boolean });
  },

  vote: async (id: string, type: 'up' | 'down'): Promise<{ vote_score: number }> => {
    const response = await api.post<{ data?: { data?: { vote_score: number } } } | { vote_score: number }>('/vote', {
      target_id: id,
      target_type: 'post',
      vote_type: type
    });
    const r = response as { data?: { data?: { vote_score: number } } };
    return r.data?.data || (response as { vote_score: number });
  },

  toggleArchive: async (id: string): Promise<Thread> => {
    const response = await api.post<{ data?: { data?: Thread } } | { data?: Thread } | Thread>(`/posts/${id}/toggle-archive`, {});
    const r = response as { data?: { data?: Thread } };
    return r.data?.data || (response as { data?: Thread }).data || (response as Thread);
  },
};