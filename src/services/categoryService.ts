import { api } from './api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  posts_count?: number;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response: any = await api.get('/categories');
    return response.data || response;
  },
};
