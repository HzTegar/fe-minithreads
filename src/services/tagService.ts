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
    return response.data || response;
  },
};
