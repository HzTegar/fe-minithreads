import { api } from './api';
import type { User } from '../types/user.type';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const authService = {
  login: async (credentials: LoginInput) => {
    return api.post<{ user: User; access_token: string }>('/auth/login', credentials as unknown as Record<string, unknown>);
  },

  register: async (userData: RegisterInput) => {
    return api.post<{ user: User; access_token: string }>('/auth/register', userData as unknown as Record<string, unknown>);
  },

  logout: async () => {
    return api.post('/auth/logout', {});
  },

  getCurrentUser: async (): Promise<User> => {
    return api.get('/auth/me');
  },
};
