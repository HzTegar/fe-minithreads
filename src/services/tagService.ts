import { api } from './api';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  posts_count?: number;
}

export const tagService = {
  getAll: async (): Promise<Tag[]> => {
    const response: any = await api.get('/tags');
    return response.data?.data || response.data || response;
  },

  // FUNGSI BARU UNTUK NAMBAH TAG
  create: async (name: string): Promise<Tag> => {
    const response: any = await api.post('/tags', { name });
    return response.data?.data || response.data || response;
  },
};