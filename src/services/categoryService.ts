import { api } from './api';
import type { Category, CategoryResponse, CategoriesResponse } from '../types/category.type';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<CategoriesResponse | Category[]>('/categories');
    return Array.isArray(response) ? response : response.data;
  },

  create: async (data: { name: string; }): Promise<Category> => {
    const response = await api.post<CategoryResponse | Category>('/categories', data);
    return 'data' in response ? response.data : response;
  },

  update: async (id: string, data: { name: string;  }): Promise<Category> => {
    const response = await api.put<CategoryResponse | Category>(`/categories/${id}`, data);
    return 'data' in response ? response.data : response;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<void>(`/categories/${id}`);
  },
};