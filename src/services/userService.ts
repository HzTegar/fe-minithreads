import { api } from './api';
import type { User } from '../types/user.type';

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me');
    return response.user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.post<{ success: boolean; user: User }>('/profile/update', data);
    return response.user;
  },

  toggleFollow: async (userId: string): Promise<void> => {
    await api.post(`/user/follow/${userId}`, {});
  },
};
