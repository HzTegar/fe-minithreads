import { api } from './api';

export const authService = {
  login: async (credentials: any) => {
    return api.post<{ user: User; access_token: string }>('/auth/login', credentials);
  },

  register: async (userData: any) => {
    return api.post<{ user: User; access_token: string }>('/auth/register', userData);
  },

  logout: async () => {
    return api.post('/auth/logout', {});
  },

  getCurrentUser: async (): Promise<User> => {
    return api.get('/auth/me');
  },
};
